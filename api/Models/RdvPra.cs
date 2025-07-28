using System;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Dental_reservation.api.Models
{
    [Table("tab_RDV_Pra")]
    [Keyless]
    public class RdvPra
    {
        [Column("num_enregistrement")]
        public int? NumEnregistrement { get; set; }
        [Column("nom_pra")]
        public string? NomPra { get; set; }
        [Column("cabinet")]
        public string? Cabinet { get; set; }
        [Column("date_rdv")]
        public DateTime? DateRdv { get; set; }
        [Column("nature_soin")]
        public string? NatureSoin { get; set; }
    }
} 