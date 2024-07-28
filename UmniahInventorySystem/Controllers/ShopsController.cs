using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using UmniahInventorySystem.Data;
using UmniahInventorySystem.Models;


[Authorize]
[Route("api/[controller]")]
[ApiController]
public class ShopsController : ControllerBase
{
    private readonly MyDbContext _context;

    public ShopsController(MyDbContext context)
    {
        _context = context;
    }

    [HttpGet("{shopId}")]
    public async Task<ActionResult<ShopDto>> GetShop(int shopId)
    {
        var shop = await _context.Shops
            .Where(s => s.ShopCode == shopId)
            .Select(s => new ShopDto
            {
                ShopCode = s.ShopCode,
                ShopName = s.ShopName
            })
            .FirstOrDefaultAsync();

        if (shop == null)
        {
            return NotFound();
        }

        return Ok(shop);
    }
}
