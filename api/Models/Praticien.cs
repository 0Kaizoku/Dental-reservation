using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Dental_reservation.api.Models
{
    [Table("Praticien_D")]
    public class Praticien
    {
        [Key]
        [Column("cod_pra")]
        public double? CodPra { get; set; }

        [Column("nom_pra")]
        public string? NomPra { get; set; }

        [Column("code_ps")]
        public double? CodePs { get; set; }
    }
}