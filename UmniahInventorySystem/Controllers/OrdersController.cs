using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;
using UmniahInventorySystem.Models;
using UmniahInventorySystem.Services;
using Microsoft.Extensions.Logging;

namespace UmniahInventorySystem.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class OrdersController : ControllerBase
    {
        private readonly IOrderService _orderService;
        private readonly ILogger<OrdersController> _logger;

        public OrdersController(IOrderService orderService, ILogger<OrdersController> logger)
        {
            _orderService = orderService;
            _logger = logger;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Order>>> GetOrders()
        {
            _logger.LogInformation("Fetching all orders");

            var orders = await _orderService.GetOrders();
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
        public async Task<IActionResult> CreateOrder([FromBody] Order order)
        {
            if (!ModelState.IsValid)
            {
                _logger.LogWarning("Invalid order data");
                return BadRequest(new { message = "Invalid order data" });
            }

            _logger.LogInformation("Attempting to create an order.");

            try
            {
                var createdOrder = await _orderService.CreateOrder(order);
                if (createdOrder == null)
                {
                    _logger.LogError("Failed to create order");
                    return StatusCode(StatusCodes.Status500InternalServerError, new { message = "Failed to create order" });
                }

                return CreatedAtAction(nameof(GetOrder), new { id = createdOrder.OrderID }, createdOrder);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while creating the order");
                return StatusCode(StatusCodes.Status500InternalServerError, new { message = "An error occurred while creating the order.", details = ex.Message });
            }
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
