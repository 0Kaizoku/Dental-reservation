using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Dental_reservation.api.Models
{
    [Table("pop_contrat_personne")]
    public class PopContratPersonne
    {
        [Key]
        [Column("Id_Num_Personne_Ctt")]
        public double IdNumPersonneCtt { get; set; }

        [Column("Date_Debut_Contrat")]
        public DateTime? DateDebutContrat { get; set; }

        [Column("Date_Fin_Contrat")]
        public DateTime? DateFinContrat { get; set; }

        [Column("Code_Produit")]
        public string? CodeProduit { get; set; }
    }
} 