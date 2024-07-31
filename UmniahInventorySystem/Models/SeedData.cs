using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Linq;
using System.Threading.Tasks;
using UmniahInventorySystem.Data;
using UmniahInventorySystem.Models;

public static class SeedData
{
    private const string AdminRole = "Admin";
    private const string ShopRole = "Shop";
    private const string AdminEmail = "admin@domain.com";
    private const string AdminPassword = "AdminPassword123!";

    public static async Task Initialize(MyDbContext context, UserManager<ApplicationUser> userManager, RoleManager<IdentityRole> roleManager)
    {
        context.Database.EnsureCreated();

        if (!roleManager.Roles.Any())
        {
            await roleManager.CreateAsync(new IdentityRole(AdminRole));
            await roleManager.CreateAsync(new IdentityRole(ShopRole));
        }

        if (!context.Shops.Any(s => s.ShopCode == 0))
        {
            context.Shops.Add(new Shop
            {
                ShopCode = 0,
                ShopName = "Default Admin Shop"
            });
            await context.SaveChangesAsync();
        }

        if (!userManager.Users.Any(u => u.Email == AdminEmail))
        {
            try
            {
                var adminUser = new ApplicationUser { UserName = AdminEmail, Email = AdminEmail, ShopId = 0 };
                var result = await userManager.CreateAsync(adminUser, AdminPassword);
                if (result.Succeeded)
                {
                    await userManager.AddToRoleAsync(adminUser, AdminRole);
                }
                else
                {
                    throw new Exception(string.Join("\n", result.Errors.Select(e => e.Description)));
                }
            }
            catch (Exception ex)
            {
                throw new Exception("An error occurred while seeding the database.", ex);
            }
        }
    }
}
