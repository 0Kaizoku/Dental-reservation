using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Dental_reservation.api.Models
{
    [Table("collectivite")]
    public class Collectivite
    {
        [Key]
        [Column("CodeCollectivite")]
        public string CodeCollectivite { get; set; }

        [Column("RaisonSociale")]
        public string? RaisonSociale { get; set; }

        [Column("Adresse")]
        public string? Adresse { get; set; }

        [Column("Ville")]
        public string? Ville { get; set; }
    }
} 