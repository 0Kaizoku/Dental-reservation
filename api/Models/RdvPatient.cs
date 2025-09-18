using System;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;

namespace Dental_reservation.api.Models
{
    [Table("tab_RDV_patient")]
    public class RdvPatient
    {
        [Key]
        [Column("num_rdv")]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int NumRdv { get; set; }
        [Column("id_personne")]
        public int? IdPersonne { get; set; }
        [Column("num_cabinet")]
        public string? NumCabinet { get; set; }
        [Column("date_rdv")]
        public DateTime? DateRdv { get; set; }
        [Column("heure")]
        public string? Heure { get; set; }
        [Column("duree")]
        public string? Duree { get; set; }
        [Column("Observation")]
        public string? Observation { get; set; }
        [Column("nom_ps")]
        public string? NomPs { get; set; }
        [Column("Date_Suppression")]
        public string? DateSuppression { get; set; }
        [Column("Nature_soin")]
        public string? NatureSoin { get; set; }
        [Column("nom_per")]
        public string? NomPer { get; set; }
        [Column("qualite_per")]
        public string? QualitePer { get; set; }
        [Column("collectivite_pe")]
        public string? CollectivitePe { get; set; }
        [Column("agent")]
        public string? Agent { get; set; }
        [Column("nom_assure")]
        public string? NomAssure { get; set; }
    }
} 