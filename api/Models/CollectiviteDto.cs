namespace Dental_reservation.api.Models
{
    public class CollectiviteDto
    {
        public string? CodeCollectivite { get; set; }
        public string? RaisonSociale { get; set; } // Note: RaisonSociale is not in the DB schema, placeholder
        public string? Adresse { get; set; } // Note: Adresse is not in the DB schema, placeholder
        public string? Ville { get; set; } // Note: Ville is not in the DB schema, placeholder
    }
} 