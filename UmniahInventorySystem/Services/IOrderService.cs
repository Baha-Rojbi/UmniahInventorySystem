using System.Collections.Generic;
using System.Threading.Tasks;
using UmniahInventorySystem.Models;

namespace UmniahInventorySystem.Services
{
    public interface IOrderService
    {
        Task<IEnumerable<Order>> GetOrders();
        Task<Order> GetOrderById(int id);
        Task<Order> CreateOrder(Order order);
        Task<Order> UpdateOrder(int id, Order order);
        Task<bool> DeleteOrder(int id);
        Task<bool> ApproveOrder(int id);
        Task<bool> TransferOrder(int id);
        Task<IEnumerable<Order>> GetShopOrders(string userId);
    }
}
