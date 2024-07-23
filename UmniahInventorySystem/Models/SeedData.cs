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

        if (!userManager.Users.Any(u => u.Email == AdminEmail))
        {
            var adminUser = new ApplicationUser { UserName = AdminEmail, Email = AdminEmail, ShopId = 0 };
            var result = await userManager.CreateAsync(adminUser, AdminPassword);
            if (result.Succeeded)
            {
                await userManager.AddToRoleAsync(adminUser, AdminRole);
            }
        }
    }
}
