using Microsoft.AspNetCore.Identity;

namespace UmniahInventorySystem.Models
{
    public class ApplicationUser : IdentityUser
    {
        public int ShopId { get; set; }
        public virtual Shop Shop { get; set; }
    }
}
