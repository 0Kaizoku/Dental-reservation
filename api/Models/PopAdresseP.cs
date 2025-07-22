using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Dental_reservation.api.Models
{
    [Table("pop_adresse_p")]
    public class PopAdresseP
    {
        [Key]
        [Column("Id Num Adresse Per")]
        public double IdNumAdressePer { get; set; }

        [Column("Auxiliaire Adresse 1 Per")]
        public string? AuxiliaireAdresse1Per { get; set; }

        [Column("Auxiliaire Adresse 2 Per")]
        public string? AuxiliaireAdresse2Per { get; set; }

        [Column("Nom Lieu Dit Per")]
        public string? NomLieuDitPer { get; set; }
    }
} 