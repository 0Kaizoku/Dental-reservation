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
        public DbSet<PopPersonne> PopPersonnes { get; set; }
        public DbSet<PopContratPersonne> PopContratPersonnes { get; set; }
        public DbSet<PopAdresseP> PopAdressePs { get; set; }
        public DbSet<Collectivite> collectivites { get; set; }
        public DbSet<RdvPatient> RdvPatients { get; set; }
        public DbSet<RdvPra> RdvPras { get; set; }
        public DbSet<Praticien> Praticiens { get; set; }
    }
} 