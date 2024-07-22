using Microsoft.AspNetCore.Mvc;
using UmniahInventorySystem.Models;
using UmniahInventorySystem.Services;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using System.Security.Claims;

namespace UmniahInventorySystem.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class OrdersController : ControllerBase
    {
        private readonly IOrderService _orderService;
        private readonly UserManager<ApplicationUser> _userManager;

        public OrdersController(IOrderService orderService, UserManager<ApplicationUser> userManager)
        {
            _orderService = orderService;
            _userManager = userManager;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Order>>> GetOrders()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var orders = await _orderService.GetShopOrders(userId);
            return Ok(orders);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Order>> GetOrder(int id)
        {
            var order = await _orderService.GetOrderById(id);
            if (order == null)
            {
                return NotFound();
            }
            return Ok(order);
        }

        [HttpPost]
        public async Task<ActionResult<Order>> CreateOrder([FromBody] Order order)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var createdOrder = await _orderService.CreateOrder(order);
            return CreatedAtAction(nameof(GetOrder), new { id = createdOrder.OrderID }, createdOrder);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateOrder(int id, [FromBody] Order order)
        {
            if (id != order.OrderID)
            {
                return BadRequest();
            }

            var updatedOrder = await _orderService.UpdateOrder(id, order);
            if (updatedOrder == null)
            {
                return NotFound();
            }

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteOrder(int id)
        {
            var success = await _orderService.DeleteOrder(id);
            if (!success)
            {
                return NotFound();
            }
            return NoContent();
        }

        [HttpPost("{id}/approve")]
        public async Task<IActionResult> ApproveOrder(int id)
        {
            var success = await _orderService.ApproveOrder(id);
            if (!success)
            {
                return BadRequest("Order could not be approved.");
            }
            return NoContent();
        }

        [HttpPost("{id}/transfer")]
        public async Task<IActionResult> TransferOrder(int id)
        {
            var success = await _orderService.TransferOrder(id);
            if (!success)
            {
                return BadRequest("Order could not be transferred.");
            }
            return NoContent();
        }
    }
}
