namespace Dental_reservation.api.Models
{
    public class AssureDto
    {
        public double? IdFamille { get; set; }
        public string? Nom { get; set; }
        public DateTime? DateNaissance { get; set; }
        public string? CodeProduit { get; set; }
        public string? Matricule { get; set; }
        public string? NCIN { get; set; } // Note: NCIN is not in the DB schema, placeholder
        public string? LibProduit { get; set; } // Note: LibProduit is not in the DB schema, placeholder
    }
} 