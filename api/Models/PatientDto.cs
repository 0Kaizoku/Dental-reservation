using System;

namespace Dental_reservation.api.Models
{
    public class PatientDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string DateOfBirth { get; set; } = string.Empty;
        public string Gender { get; set; } = string.Empty;
        public string LastVisit { get; set; } = string.Empty;
        public string NextAppointment { get; set; } = string.Empty;
        public string Status { get; set; } = "active";
        public string[] MedicalHistory { get; set; } = Array.Empty<string>();
        public string Insurance { get; set; } = string.Empty;
        public EmergencyContactDto EmergencyContact { get; set; } = new EmergencyContactDto();
    }

    public class EmergencyContactDto
    {
        public string Name { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string Relationship { get; set; } = string.Empty;
    }
} 