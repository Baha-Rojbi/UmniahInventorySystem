using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace UmniahInventorySystem.Models
{
    public class Shop
    {
        [Key]
        public int ShopCode { get; set; }
        public string ShopName { get; set; } = string.Empty;
        public virtual ICollection<Item> Items { get; set; } = new List<Item>();
    }
}
