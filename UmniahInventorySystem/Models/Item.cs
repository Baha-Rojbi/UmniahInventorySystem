using System.ComponentModel.DataAnnotations;

namespace UmniahInventorySystem.Models
{
    public class Item
    {
        [Key]
        public int SerialNumber { get; set; }
        public string ItemCode { get; set; } = string.Empty;
        public string ItemType { get; set; } = string.Empty;
        public double SubInventoryStatus { get; set; }
        public int ShopId { get; set; }
        public virtual Shop Shop { get; set; }
    }
}
