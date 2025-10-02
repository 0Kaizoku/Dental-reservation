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

                if (!string.IsNullOrEmpty(name))
                {
                    query = query.Where(p =>
                        (p.NomPer != null && p.NomPer.Contains(name)) ||
                        (p.PrenomPer != null && p.PrenomPer.Contains(name)));
                }

                var patients = await query.ToListAsync();

                var patientDtos = patients.Select(p => new PatientDto
                {
                    Id = p.IdNumPersonne,
                    Name = $"{p.PrenomPer ?? ""} {p.NomPer ?? ""}".Trim(),
                    Email = p.Email ?? "",
                    Phone = p.Phone ?? "",
                    DateOfBirth = p.DateNaissancePer?.ToString("yyyy-MM-dd") ?? "",
                    Gender = p.CodeSexePer == "1" ? "Male" : p.CodeSexePer == "2" ? "Female" : "Unknown",
                    LastVisit = "",
                    NextAppointment = "",
                    Status = "active",
                    MedicalHistory = new string[] { },
                    Insurance = "",
                    EmergencyContact = new EmergencyContactDto
                    {
                        Name = "",
                        Phone = "",
                        Relationship = ""
                    }
                }).ToList();

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
                    Email = patient.Email ?? "",
                    Phone = patient.Phone ?? "",
                    DateOfBirth = patient.DateNaissancePer?.ToString("yyyy-MM-dd") ?? "",
                    Gender = patient.CodeSexePer == "1" ? "Male" : patient.CodeSexePer == "2" ? "Female" : "Unknown",
                    LastVisit = "",
                    NextAppointment = "",
                    Status = "active",
                    MedicalHistory = new string[] { },
                    Insurance = "",
                    EmergencyContact = new EmergencyContactDto
                    {
                        Name = "",
                        Phone = "",
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
                    active = totalPatients,
                    newPatients = 0,
                    inactive = 0
                };

                return Ok(stats);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error retrieving stats", error = ex.Message });
            }
        }

        [HttpGet("{id}/dossier")]
        public async Task<IActionResult> GetDossier(int id)
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
                    Email = patient.Email ?? "",
                    Phone = patient.Phone ?? "",
                    DateOfBirth = patient.DateNaissancePer?.ToString("yyyy-MM-dd") ?? "",
                    Gender = patient.CodeSexePer == "1" ? "Male" : patient.CodeSexePer == "2" ? "Female" : "Unknown",
                    LastVisit = "",
                    NextAppointment = "",
                    Status = "active",
                    MedicalHistory = new string[] { },
                    Insurance = "",
                    EmergencyContact = new EmergencyContactDto { Name = "", Phone = "", Relationship = "" }
                };

                var appointments = await _context.RdvPatients
                    .Where(r => r.IdPersonne == id)
                    .OrderByDescending(r => r.DateRdv)
                    .ToListAsync();

                return Ok(new { patient = patientDto, appointments });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error retrieving dossier", error = ex.Message });
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
            public string? Email { get; set; }
            public string? Phone { get; set; }
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
                    Autorisation = dto.Autorisation,
                    Email = dto.Email,
                    Phone = dto.Phone
                };

                _context.PopPersonnes.Add(entity);
                await _context.SaveChangesAsync();

                var result = new PatientDto
                {
                    Id = entity.IdNumPersonne,
                    Name = $"{entity.PrenomPer ?? ""} {entity.NomPer ?? ""}".Trim(),
                    Email = entity.Email ?? "",
                    Phone = entity.Phone ?? "",
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
            public string? Email { get; set; }
            public string? Phone { get; set; }
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
                entity.Email = dto.Email ?? entity.Email;
                entity.Phone = dto.Phone ?? entity.Phone;

                await _context.SaveChangesAsync();

                var result = new PatientDto
                {
                    Id = entity.IdNumPersonne,
                    Name = $"{entity.PrenomPer ?? ""} {entity.NomPer ?? ""}".Trim(),
                    Email = entity.Email ?? "",
                    Phone = entity.Phone ?? "",
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

        [HttpGet("debug/test-database")]
        public async Task<IActionResult> TestDatabase()
        {
            try
            {
                // Test database connection
                var canConnect = await _context.Database.CanConnectAsync();
                if (!canConnect)
                {
                    return StatusCode(500, new { message = "Cannot connect to database" });
                }

                // Test table structure
                var tableExists = await _context.Database.ExecuteSqlRawAsync("SELECT 1 FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'pop_personne'") >= 0;
                if (!tableExists)
                {
                    return StatusCode(500, new { message = "pop_personne table does not exist" });
                }

                // Check if Email and Phone columns exist
                var emailColumnExists = await _context.Database.ExecuteSqlRawAsync("SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'pop_personne' AND COLUMN_NAME = 'Email Per'") >= 0;
                var phoneColumnExists = await _context.Database.ExecuteSqlRawAsync("SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'pop_personne' AND COLUMN_NAME = 'Phone Per'") >= 0;

                // Get table structure
                var columns = await _context.Database.ExecuteSqlRawAsync("SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'pop_personne' ORDER BY ORDINAL_POSITION");

                // Count existing records
                var recordCount = await _context.PopPersonnes.CountAsync();

                return Ok(new
                {
                    message = "Database connection successful",
                    canConnect,
                    tableExists,
                    emailColumnExists,
                    phoneColumnExists,
                    recordCount,
                    connectionString = _context.Database.GetConnectionString()?.Substring(0, Math.Min(50, _context.Database.GetConnectionString()?.Length ?? 0)) + "..."
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Database test failed", error = ex.Message, stackTrace = ex.StackTrace });
            }
        }

        [HttpPost("debug/test-create")]
        public async Task<IActionResult> TestCreatePatient()
        {
            try
            {
                var testPatient = new PopPersonne
                {
                    PrenomPer = "Test",
                    NomPer = "Patient",
                    Email = "test@example.com",
                    Phone = "+33 1 23 45 67 89",
                    DateNaissancePer = DateTime.Now.AddYears(-30),
                    CodeSexePer = "1",
                    CIN = "TEST123456",
                    NumSecuOdPer = "123456789"
                };

                _context.PopPersonnes.Add(testPatient);
                var result = await _context.SaveChangesAsync();

                return Ok(new
                {
                    message = "Test patient created successfully",
                    patientId = testPatient.IdNumPersonne,
                    rowsAffected = result,
                    patient = new
                    {
                        id = testPatient.IdNumPersonne,
                        name = $"{testPatient.PrenomPer} {testPatient.NomPer}",
                        email = testPatient.Email,
                        phone = testPatient.Phone
                    }
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Test patient creation failed", error = ex.Message, stackTrace = ex.StackTrace });
            }
        }
    }
}