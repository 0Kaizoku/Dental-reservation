using Dental_reservation.api.Data;
using Dental_reservation.api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;

namespace Dental_reservation.api.Controllers
{
    // [Authorize] // Temporarily disabled for testing
    [ApiController]
    [Route("api/[controller]")]
    public class PatientsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        public PatientsController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] string? name, [FromQuery] string? status)
        {
            try
            {
                var query = _context.PopPersonnes.AsQueryable();
                
                // Filter by name if provided
                if (!string.IsNullOrEmpty(name))
                {
                    query = query.Where(p => 
                        (p.NomPer != null && p.NomPer.Contains(name)) || 
                        (p.PrenomPer != null && p.PrenomPer.Contains(name)));
                }

                var patients = await query.ToListAsync();
                
                // Map to DTOs
                var patientDtos = patients.Select(p => new PatientDto
                {
                    Id = p.IdNumPersonne,
                    Name = $"{p.PrenomPer ?? ""} {p.NomPer ?? ""}".Trim(),
                    // Email = $"patient.{p.IdNumPersonne}@example.com", // TODO: Add email field to database
                    Email = "", // Placeholder for future development
                    // Phone = $"+33 1 {p.IdNumPersonne.ToString().PadLeft(8, '0')}", // TODO: Add phone field to database
                    Phone = "", // Placeholder for future development
                    DateOfBirth = p.DateNaissancePer?.ToString("yyyy-MM-dd") ?? "",
                    Gender = p.CodeSexePer == "1" ? "Male" : p.CodeSexePer == "2" ? "Female" : "Unknown",
                    // LastVisit = "", // TODO: Populate from appointments table
                    LastVisit = "",
                    // NextAppointment = "", // TODO: Populate from appointments table
                    NextAppointment = "",
                    Status = "active", // Default status - TODO: Calculate based on last visit
                    // MedicalHistory = new string[] { "Initial consultation" }, // TODO: Add medical history table
                    MedicalHistory = new string[] { }, // Placeholder for future development
                    // Insurance = "Standard Insurance", // TODO: Add insurance information
                    Insurance = "", // Placeholder for future development
                    EmergencyContact = new EmergencyContactDto
                    {
                        // Name = "Emergency Contact", // TODO: Add emergency contact fields
                        Name = "",
                        // Phone = "+33 1 23456789", // TODO: Add emergency contact phone
                        Phone = "",
                        // Relationship = "Family" // TODO: Add relationship field
                        Relationship = ""
                    }
                }).ToList();

                // Filter by status if provided
                if (!string.IsNullOrEmpty(status) && status != "all")
                {
                    patientDtos = patientDtos.Where(p => p.Status == status).ToList();
                }

                return Ok(patientDtos);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error retrieving patients", error = ex.Message });
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            try
            {
                var patient = await _context.PopPersonnes
                    .FirstOrDefaultAsync(p => p.IdNumPersonne == id);

                if (patient == null)
                {
                    return NotFound(new { message = "Patient not found" });
                }

                var patientDto = new PatientDto
                {
                    Id = patient.IdNumPersonne,
                    Name = $"{patient.PrenomPer ?? ""} {patient.NomPer ?? ""}".Trim(),
                    // Email = $"patient.{patient.IdNumPersonne}@example.com", // TODO: Add email field to database
                    Email = "", // Placeholder for future development
                    // Phone = $"+33 1 {patient.IdNumPersonne.ToString().PadLeft(8, '0')}", // TODO: Add phone field to database
                    Phone = "", // Placeholder for future development
                    DateOfBirth = patient.DateNaissancePer?.ToString("yyyy-MM-dd") ?? "",
                    Gender = patient.CodeSexePer == "1" ? "Male" : patient.CodeSexePer == "2" ? "Female" : "Unknown",
                    // LastVisit = "", // TODO: Populate from appointments table
                    LastVisit = "",
                    // NextAppointment = "", // TODO: Populate from appointments table
                    NextAppointment = "",
                    Status = "active", // Default status - TODO: Calculate based on last visit
                    // MedicalHistory = new string[] { "Initial consultation" }, // TODO: Add medical history table
                    MedicalHistory = new string[] { }, // Placeholder for future development
                    // Insurance = "Standard Insurance", // TODO: Add insurance information
                    Insurance = "", // Placeholder for future development
                    EmergencyContact = new EmergencyContactDto
                    {
                        // Name = "Emergency Contact", // TODO: Add emergency contact fields
                        Name = "",
                        // Phone = "+33 1 23456789", // TODO: Add emergency contact phone
                        Phone = "",
                        // Relationship = "Family" // TODO: Add relationship field
                        Relationship = ""
                    }
                };

                return Ok(patientDto);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error retrieving patient", error = ex.Message });
            }
        }

        [HttpGet("stats")]
        public async Task<IActionResult> GetStats()
        {
            try
            {
                var totalPatients = await _context.PopPersonnes.CountAsync();
                
                var stats = new
                {
                    total = totalPatients,
                    active = totalPatients, // All patients are considered active for now
                    newPatients = 0, // TODO: Calculate based on creation date
                    inactive = 0 // TODO: Calculate based on last visit
                };

                return Ok(stats);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error retrieving stats", error = ex.Message });
            }
        }

        public class CreatePatientDto
        {
            public string? FirstName { get; set; }
            public string? LastName { get; set; }
            public string? DateOfBirth { get; set; } // yyyy-MM-dd
            public string? Gender { get; set; } // "1" male, "2" female
            public string? Cin { get; set; }
            public string? Matricule { get; set; } // maps to NumSecuOdPer
            public string? CodeCivilitePer { get; set; }
            public int? IdNumFamillePer { get; set; } // Changed from double? to int?
            public string? CodeQualitePersonnePer { get; set; }
            public string? CodeStatutPer { get; set; }
            public string? CodeSituationFamilialePer { get; set; }
            public int? IdNumAdressePer { get; set; } // Changed from double? to int?
            public string? CodeCollectivitePer { get; set; }
            public string? Autorisation { get; set; }
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreatePatientDto dto)
        {
            try
            {
                var entity = new PopPersonne
                {
                    PrenomPer = dto.FirstName,
                    NomPer = dto.LastName,
                    DateNaissancePer = string.IsNullOrWhiteSpace(dto.DateOfBirth) ? null : DateTime.Parse(dto.DateOfBirth),
                    CodeSexePer = dto.Gender,
                    CIN = dto.Cin,
                    NumSecuOdPer = dto.Matricule,
                    CodeCivilitePer = dto.CodeCivilitePer,
                    IdNumFamillePer = dto.IdNumFamillePer.HasValue ? (int)dto.IdNumFamillePer.Value : (int?)null, // Explicit cast to int
                    CodeQualitePersonnePer = dto.CodeQualitePersonnePer,
                    CodeStatutPer = dto.CodeStatutPer,
                    CodeSituationFamilialePer = dto.CodeSituationFamilialePer,
                    IdNumAdressePer = dto.IdNumAdressePer.HasValue ? (int)dto.IdNumAdressePer.Value : (int?)null, // Explicit cast to int
                    CodeCollectivitePer = dto.CodeCollectivitePer,
                    Autorisation = dto.Autorisation
                };

                _context.PopPersonnes.Add(entity);
                await _context.SaveChangesAsync();

                var result = new PatientDto
                {
                    Id = entity.IdNumPersonne,
                    Name = $"{entity.PrenomPer ?? ""} {entity.NomPer ?? ""}".Trim(),
                    Email = "",
                    Phone = "",
                    DateOfBirth = entity.DateNaissancePer?.ToString("yyyy-MM-dd") ?? "",
                    Gender = entity.CodeSexePer == "1" ? "Male" : entity.CodeSexePer == "2" ? "Female" : "Unknown",
                    LastVisit = "",
                    NextAppointment = "",
                    Status = "active",
                    MedicalHistory = new string[] { },
                    Insurance = "",
                    EmergencyContact = new EmergencyContactDto { Name = "", Phone = "", Relationship = "" }
                };

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error creating patient", error = ex.Message });
            }
        }

        public class UpdatePatientDto
        {
            public string? FirstName { get; set; }
            public string? LastName { get; set; }
            public string? DateOfBirth { get; set; }
            public string? Gender { get; set; }
            public string? Cin { get; set; }
            public string? Matricule { get; set; }
            public string? CodeCivilitePer { get; set; }
            public int? IdNumFamillePer { get; set; } // Changed from double? to int?
            public string? CodeQualitePersonnePer { get; set; }
            public string? CodeStatutPer { get; set; }
            public string? CodeSituationFamilialePer { get; set; }
            public int? IdNumAdressePer { get; set; } // Changed from double? to int?
            public string? CodeCollectivitePer { get; set; }
            public string? Autorisation { get; set; }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdatePatientDto dto)
        {
            try
            {
                var entity = await _context.PopPersonnes.FirstOrDefaultAsync(p => p.IdNumPersonne == id);
                if (entity == null) return NotFound(new { message = "Patient not found" });

                entity.PrenomPer = dto.FirstName ?? entity.PrenomPer;
                entity.NomPer = dto.LastName ?? entity.NomPer;
                if (!string.IsNullOrWhiteSpace(dto.DateOfBirth))
                {
                    entity.DateNaissancePer = DateTime.Parse(dto.DateOfBirth);
                }
                entity.CodeSexePer = string.IsNullOrWhiteSpace(dto.Gender) ? entity.CodeSexePer : dto.Gender;
                entity.CIN = dto.Cin ?? entity.CIN;
                entity.NumSecuOdPer = dto.Matricule ?? entity.NumSecuOdPer;
                entity.CodeCivilitePer = dto.CodeCivilitePer ?? entity.CodeCivilitePer;
                entity.IdNumFamillePer = dto.IdNumFamillePer.HasValue ? (int)dto.IdNumFamillePer.Value : (int?)null; // Explicit cast to int
                entity.CodeQualitePersonnePer = dto.CodeQualitePersonnePer ?? entity.CodeQualitePersonnePer;
                entity.CodeStatutPer = dto.CodeStatutPer ?? entity.CodeStatutPer;
                entity.CodeSituationFamilialePer = dto.CodeSituationFamilialePer ?? entity.CodeSituationFamilialePer;
                entity.IdNumAdressePer = dto.IdNumAdressePer.HasValue ? (int)dto.IdNumAdressePer.Value : (int?)null; // Explicit cast to int
                entity.CodeCollectivitePer = dto.CodeCollectivitePer ?? entity.CodeCollectivitePer;
                entity.Autorisation = dto.Autorisation ?? entity.Autorisation;

                await _context.SaveChangesAsync();

                var result = new PatientDto
                {
                    Id = entity.IdNumPersonne,
                    Name = $"{entity.PrenomPer ?? ""} {entity.NomPer ?? ""}".Trim(),
                    Email = "",
                    Phone = "",
                    DateOfBirth = entity.DateNaissancePer?.ToString("yyyy-MM-dd") ?? "",
                    Gender = entity.CodeSexePer == "1" ? "Male" : entity.CodeSexePer == "2" ? "Female" : "Unknown",
                    LastVisit = "",
                    NextAppointment = "",
                    Status = "active",
                    MedicalHistory = new string[] { },
                    Insurance = "",
                    EmergencyContact = new EmergencyContactDto { Name = "", Phone = "", Relationship = "" }
                };

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error updating patient", error = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                var entity = await _context.PopPersonnes.FirstOrDefaultAsync(p => p.IdNumPersonne == id);
                if (entity == null) return NotFound(new { message = "Patient not found" });

                _context.PopPersonnes.Remove(entity);
                await _context.SaveChangesAsync();
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error deleting patient", error = ex.Message });
            }
        }
    }
}