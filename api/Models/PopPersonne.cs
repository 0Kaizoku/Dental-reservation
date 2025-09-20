using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Dental_reservation.api.Models
{
    [Table("pop_personne")]
    public class PopPersonne
    {
        [Key]
        [Column("Id Num Personne")]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int IdNumPersonne { get; set; }

        [Column("Nom Per")]
        public string? NomPer { get; set; }

        [Column("Prenom Per")]
        public string? PrenomPer { get; set; }

        [Column("Date Naissance Per")]
        public DateTime? DateNaissancePer { get; set; }

        [Column("Date Deces Per")]
        public DateTime? DateDecesPer { get; set; }

        [Column("Code Sexe Per")]
        public string? CodeSexePer { get; set; }

        [Column("Code Civilite Per")]
        public string? CodeCivilitePer { get; set; }

        [Column("Id Num Famille Per")]
        public double? IdNumFamillePer { get; set; }

        [Column("Code Qualite Personne Per")]
        public string? CodeQualitePersonnePer { get; set; }

        [Column("Code Statut Per")]
        public string? CodeStatutPer { get; set; }

        [Column("Code Situation Familiale Per")]
        public string? CodeSituationFamilialePer { get; set; }

        [Column("Id Num Adresse Per")]
        public double? IdNumAdressePer { get; set; }

        [Column("Num Secu Od Per")]
        public string? NumSecuOdPer { get; set; }

        [Column("Code Collectivite Per")]
        public string? CodeCollectivitePer { get; set; }

        [Column("autorisation")]
        public string? Autorisation { get; set; }

        [Column("CIN")]
        public string? CIN { get; set; }

        [Column("Email Per")]
        public string? Email { get; set; }

        [Column("Phone Per")]
        public string? Phone { get; set; }
    }
} 