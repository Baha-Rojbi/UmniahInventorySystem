using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using UmniahInventorySystem.Data;
using UmniahInventorySystem.Models;

namespace UmniahInventorySystem.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class ItemsController : ControllerBase
    {
        private readonly MyDbContext _context;

        public ItemsController(MyDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ItemDto>>> GetItems()
        {
            var items = await _context.Items
                .Select(item => new ItemDto
                {
                    SerialNumber = item.SerialNumber,
                    ItemCode = item.ItemCode,
                    ItemType = item.ItemType,
                    SubInventoryStatus = item.SubInventoryStatus,
                    ShopId = item.ShopId
                })
                .ToListAsync();

            return Ok(items);
        }

        [HttpGet("shop/{shopId}")]
        public async Task<ActionResult<IEnumerable<ItemDto>>> GetItemsByShop(int shopId)
        {
            var items = await _context.Items
                .Where(item => item.ShopId == shopId)
                .Select(item => new ItemDto
                {
                    SerialNumber = item.SerialNumber,
                    ItemCode = item.ItemCode,
                    ItemType = item.ItemType,
                    SubInventoryStatus = item.SubInventoryStatus,
                    ShopId = item.ShopId
                })
                .ToListAsync();

            return Ok(items);
        }

        [HttpGet("{itemCode}/shops")]
        public async Task<IActionResult> GetShopsForItem(string itemCode)
        {
            try
            {
                var shops = await _context.Items
                    .Where(i => i.ItemCode == itemCode)
                    .Select(i => i.Shop)
                    .Distinct()
                    .ToListAsync();

                return Ok(shops);
            }
            catch (Exception ex)
            {
                // Log the error if necessary
                return StatusCode(500, new { message = "An error occurred while fetching shops.", details = ex.Message });
            }
        }
    }
}
