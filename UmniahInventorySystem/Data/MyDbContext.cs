﻿using Microsoft.EntityFrameworkCore;
using UmniahInventorySystem.Models;

namespace UmniahInventorySystem.Data
{
    public class MyDbContext : DbContext
    {
        public MyDbContext(DbContextOptions<MyDbContext> options) : base(options) { }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseLazyLoadingProxies();
            optionsBuilder.UseSqlServer(@"Data Source=(localdb)\mssqllocaldb;Initial Catalog=InventorySystem;Integrated Security=true;MultipleActiveResultSets=true");
            base.OnConfiguring(optionsBuilder);
        }

        public DbSet<Item> Items { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<Shop> Shops { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Order>()
                .HasOne(o => o.Item)
                .WithMany()
                .HasForeignKey(o => o.ItemID);

            modelBuilder.Entity<Order>()
                .HasOne(o => o.FromShop)
                .WithMany()
                .HasForeignKey(o => o.FromShopId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Order>()
                .HasOne(o => o.ToShop)
                .WithMany()
                .HasForeignKey(o => o.ToShopId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Item>()
                .HasOne(i => i.Shop)
                .WithMany(s => s.Items)
                .HasForeignKey(i => i.ShopId);

            modelBuilder.Entity<Item>()
                .Property(i => i.SerialNumber)
                .ValueGeneratedNever();

            modelBuilder.Entity<Shop>()
                .Property(s => s.ShopCode)
                .ValueGeneratedNever();
        }
    }
}
