namespace UmniahInventorySystem.Models
{
    public class ItemDto
    {
        public int SerialNumber { get; set; }
        public string ItemCode { get; set; }
        public string ItemType { get; set; }
        public double SubInventoryStatus { get; set; }
        public int ShopId { get; set; }
    }
}
