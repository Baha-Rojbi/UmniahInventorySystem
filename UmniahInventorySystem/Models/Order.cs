using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace UmniahInventorySystem.Models
{
    public enum OrderStatus
    {
        Requested,
        Approved,
        Transferred
    }

    public class Order
    {
        [Key]
        public int OrderID { get; set; }
        public int ItemID { get; set; }
        public int FromShopId { get; set; }
        public int ToShopId { get; set; }
        public int Quantity { get; set; }
        [DataType(DataType.DateTime)]
        public DateTime RequestDate { get; set; }
        [DataType(DataType.DateTime)]
        public DateTime? ApprovedDate { get; set; }
        public OrderStatus Status { get; set; }

        public virtual Item? Item { get; set; }
        [ForeignKey("FromShopId")]
        public virtual Shop? FromShop { get; set; }
        [ForeignKey("ToShopId")]
        public virtual Shop? ToShop { get; set; }
    }
}
