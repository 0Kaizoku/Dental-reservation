namespace Dental_reservation.api.Models
{
    public class BeneficiaireDto
    {
        public double? IdFamille { get; set; }
        public string? Nom { get; set; }
        public DateTime? DateNaissance { get; set; }
        public string? Adresse { get; set; }
        public string? Matricule { get; set; }
        public string? NCIN { get; set; } // Note: NCIN is not in the DB schema, placeholder
        public string? EtatBnf { get; set; }
        public string? Qualite { get; set; }
        public string? Ville { get; set; } // Note: Ville is not in the DB schema, placeholder
    }
} 