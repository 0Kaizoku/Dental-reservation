using Microsoft.EntityFrameworkCore;
using Dental_reservation.api.Models;


namespace Dental_reservation.api.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }
        
        public DbSet<User> Users { get; set; }
      
    }
} 