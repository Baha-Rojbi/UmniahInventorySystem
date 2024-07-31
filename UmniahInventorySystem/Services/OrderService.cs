using Microsoft.EntityFrameworkCore;
using UmniahInventorySystem.Data;
using UmniahInventorySystem.Models;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;

namespace UmniahInventorySystem.Services
{
    public class OrderService : IOrderService
    {
        private readonly MyDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;

        public OrderService(MyDbContext context, UserManager<ApplicationUser> userManager)
        {
            _context = context;
            _userManager = userManager;
        }

        public async Task<IEnumerable<Order>> GetOrders()
        {
            return await _context.Orders
                .Include(o => o.Item)
                .Include(o => o.FromShop)
                .Include(o => o.ToShop)
                .ToListAsync();
        }

        public async Task<Order> GetOrderById(int id)
        {
            return await _context.Orders
                .Include(o => o.Item)
                .Include(o => o.FromShop)
                .Include(o => o.ToShop)
                .FirstOrDefaultAsync(o => o.OrderID == id);
        }

        public async Task<Order> CreateOrder(Order order)
        {
            _context.Orders.Add(order);
            await _context.SaveChangesAsync();
            return order;
        }

        public async Task<Order> UpdateOrder(int id, Order order)
        {
            _context.Entry(order).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return order;
        }

        public async Task<bool> DeleteOrder(int id)
        {
            var order = await _context.Orders.FindAsync(id);
            if (order == null) return false;

            _context.Orders.Remove(order);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> ApproveOrder(int id)
        {
            var order = await _context.Orders.FindAsync(id);
            if (order == null || order.Status != OrderStatus.Requested) return false;

            order.Status = OrderStatus.Approved;
            order.ApprovedDate = DateTime.UtcNow;
            _context.Entry(order).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return true;
        }


        public async Task<bool> TransferOrder(int id)
        {
            var order = await _context.Orders
                .Include(o => o.Item)
                .FirstOrDefaultAsync(o => o.OrderID == id);

            if (order == null || order.Status != OrderStatus.Approved) return false;

            var fromShopItem = await _context.Items
                .FirstOrDefaultAsync(i => i.ItemCode == order.Item.ItemCode && i.ShopId == order.FromShopId);

            if (fromShopItem == null || fromShopItem.SubInventoryStatus < order.Quantity)
            {
                return false;
            }

            fromShopItem.SubInventoryStatus -= order.Quantity;

            var toShopItem = await _context.Items
                .FirstOrDefaultAsync(i => i.ItemCode == order.Item.ItemCode && i.ShopId == order.ToShopId);

            if (toShopItem == null)
            {
                toShopItem = new Item
                {
                    ItemCode = order.Item.ItemCode,
                    ItemType = order.Item.ItemType,
                    SubInventoryStatus = order.Quantity,
                    ShopId = order.ToShopId
                };
                _context.Items.Add(toShopItem);
            }
            else
            {
                toShopItem.SubInventoryStatus += order.Quantity;
            }

            order.Status = OrderStatus.Transferred;
            _context.Entry(order).State = EntityState.Modified;

            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<IEnumerable<Order>> GetShopOrders(string userId)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null) return null;

            return await _context.Orders
                .Include(o => o.Item)
                .Include(o => o.FromShop)
                .Include(o => o.ToShop)
                .Where(o => o.FromShopId == user.ShopId || o.ToShopId == user.ShopId)
                .ToListAsync();
        }
    }
}
