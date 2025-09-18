using Dental_reservation.api.Data;
using Dental_reservation.api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;

namespace Dental_reservation.api.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class RendezVousController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        public RendezVousController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet("by-matricule/{matricule}")]
        public async Task<IActionResult> GetRdvByMatricule(string matricule)
        {
            var personne = await _context.PopPersonnes.FirstOrDefaultAsync(p => p.NumSecuOdPer == matricule);
            if (personne == null)
                return NotFound("Person not found");

            var rdvs = await _context.RdvPatients
                .Where(r => r.IdPersonne == personne.IdNumPersonne)
                .ToListAsync();

            return Ok(rdvs);
        }

        [HttpPost]
        public async Task<IActionResult> CreateAppointment([FromBody] RdvPatient newRdv)
        {
            try
            {
                Console.WriteLine($"=== Creating Appointment ===");
                Console.WriteLine($"Received data: Date={newRdv.DateRdv}, Time={newRdv.Heure}, Doctor={newRdv.NomPs}");
                
                if (newRdv.DateRdv == null || string.IsNullOrWhiteSpace(newRdv.Heure))
                    return BadRequest("Date and time are required.");

                // Test database connection first
                var canConnect = await _context.Database.CanConnectAsync();
                Console.WriteLine($"Database connection status: {canConnect}");
                
                if (!canConnect)
                {
                    return StatusCode(500, "Cannot connect to database");
                }

                bool doctorConflict = false;
                bool cabinetConflict = false;

                if (!string.IsNullOrWhiteSpace(newRdv.NomPs))
                {
                    doctorConflict = await _context.RdvPatients.AnyAsync(r =>
                        r.NomPs == newRdv.NomPs &&
                        r.DateRdv == newRdv.DateRdv &&
                        r.Heure == newRdv.Heure);
                }

                if (!string.IsNullOrWhiteSpace(newRdv.NumCabinet))
                {
                    cabinetConflict = await _context.RdvPatients.AnyAsync(r =>
                        r.NumCabinet == newRdv.NumCabinet &&
                        r.DateRdv == newRdv.DateRdv &&
                        r.Heure == newRdv.Heure);
                }

                if (doctorConflict)
                    return Conflict("Doctor already has an appointment at this time.");

                if (cabinetConflict)
                    return Conflict("Cabinet is already booked at this time.");

                Console.WriteLine($"Adding appointment to context...");
                _context.RdvPatients.Add(newRdv);
                
                Console.WriteLine($"Saving changes to database...");
                var result = await _context.SaveChangesAsync();

                // Log the result for debugging
                Console.WriteLine($"SaveChanges result: {result} rows affected");
                Console.WriteLine($"New appointment ID: {newRdv.NumRdv}");
                
                // Verify the appointment was actually saved
                var savedAppointment = await _context.RdvPatients.FirstOrDefaultAsync(r => r.NumRdv == newRdv.NumRdv);
                Console.WriteLine($"Verification - Found saved appointment: {savedAppointment != null}");

                return Ok(newRdv);  
            }
            catch (Exception ex)
            {
                // Log the exception for debugging
                Console.WriteLine($"Error creating appointment: {ex.Message}");
                Console.WriteLine($"Stack trace: {ex.StackTrace}");
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpPut("{num_rdv}")]
        public async Task<IActionResult> UpdateAppointment(int num_rdv, [FromBody] RdvPatient updatedRdv)
        {
            var rdv = await _context.RdvPatients.FirstOrDefaultAsync(r => r.NumRdv == num_rdv);
            if (rdv == null)
                return NotFound("Appointment not found");

            if (updatedRdv.DateRdv == null || string.IsNullOrWhiteSpace(updatedRdv.Heure))
                return BadRequest("Date and time are required.");

            // Check for conflicts only when respective fields provided (excluding this appointment)
            bool doctorConflict = false;
            bool cabinetConflict = false;

            if (!string.IsNullOrWhiteSpace(updatedRdv.NomPs))
            {
                doctorConflict = await _context.RdvPatients.AnyAsync(r =>
                    r.NumRdv != num_rdv &&
                    r.NomPs == updatedRdv.NomPs &&
                    r.DateRdv == updatedRdv.DateRdv &&
                    r.Heure == updatedRdv.Heure);
            }

            if (!string.IsNullOrWhiteSpace(updatedRdv.NumCabinet))
            {
                cabinetConflict = await _context.RdvPatients.AnyAsync(r =>
                    r.NumRdv != num_rdv &&
                    r.NumCabinet == updatedRdv.NumCabinet &&
                    r.DateRdv == updatedRdv.DateRdv &&
                    r.Heure == updatedRdv.Heure);
            }

            if (doctorConflict)
                return Conflict("Doctor already has an appointment at this time.");
            if (cabinetConflict)
                return Conflict("Cabinet is already booked at this time.");

            // Update fields
            rdv.IdPersonne = updatedRdv.IdPersonne;
            rdv.NumCabinet = updatedRdv.NumCabinet;
            rdv.DateRdv = updatedRdv.DateRdv;
            rdv.Heure = updatedRdv.Heure;
            rdv.Duree = updatedRdv.Duree;
            rdv.Observation = updatedRdv.Observation;
            rdv.NomPs = updatedRdv.NomPs;
            rdv.DateSuppression = updatedRdv.DateSuppression;
            rdv.NatureSoin = updatedRdv.NatureSoin;
            rdv.NomPer = updatedRdv.NomPer;
            rdv.QualitePer = updatedRdv.QualitePer;
            rdv.CollectivitePe = updatedRdv.CollectivitePe;
            rdv.Agent = updatedRdv.Agent;
            rdv.NomAssure = updatedRdv.NomAssure;

            await _context.SaveChangesAsync();
            return Ok(rdv);
        }

        [HttpDelete("{num_rdv}")]
        public async Task<IActionResult> DeleteAppointment(int num_rdv)
        {
            var rdv = await _context.RdvPatients.FirstOrDefaultAsync(r => r.NumRdv == num_rdv);
            if (rdv == null)
                return NotFound("Appointment not found");
            _context.RdvPatients.Remove(rdv);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] string? patient, [FromQuery] string? doctor, [FromQuery] DateTime? date)
        {
            var query = _context.RdvPatients.AsQueryable();
            if (!string.IsNullOrEmpty(patient))
                query = query.Where(r => r.NomPer.Contains(patient));
            if (!string.IsNullOrEmpty(doctor))
                query = query.Where(r => r.NomPs.Contains(doctor));
            if (date.HasValue)
                query = query.Where(r => r.DateRdv.HasValue && r.DateRdv.Value.Date == date.Value.Date);
            var rdvs = await query.ToListAsync();
            return Ok(rdvs);
        }

        [HttpGet("doctor")]
        public async Task<IActionResult> GetByDoctorAndDateRange([FromQuery] string doctor, [FromQuery] DateTime startDate, [FromQuery] DateTime endDate)
        {
            var rdvs = await _context.RdvPatients
                .Where(r => r.NomPs == doctor && r.DateRdv.HasValue && r.DateRdv.Value.Date >= startDate.Date && r.DateRdv.Value.Date <= endDate.Date)
                .ToListAsync();
            return Ok(rdvs);
        }

        [HttpGet("available-slots")]
        public async Task<IActionResult> GetAvailableSlots([FromQuery] string doctor, [FromQuery] string cabinet, [FromQuery] DateTime date)
        {
            // Define your working hours and slot duration
            var startHour = 9;
            var endHour = 17;
            var slotMinutes = 30;
            var slots = new List<string>();

            for (var hour = startHour; hour < endHour; hour++)
            {
                slots.Add($"{hour:D2}:00");
                slots.Add($"{hour:D2}:30");
            }

            // Get all booked slots for this doctor or cabinet on this date
            var bookedSlots = await _context.RdvPatients
                .Where(r =>
                    r.DateRdv.HasValue &&
                    r.DateRdv.Value.Date == date.Date &&
                    (r.NomPs == doctor || r.NumCabinet == cabinet))
                .Select(r => r.Heure)
                .ToListAsync();

            // Remove booked slots
            var availableSlots = slots.Except(bookedSlots).ToList();

            return Ok(availableSlots);
        }

        [HttpGet("debug/all-appointments")]
        public async Task<IActionResult> GetAllAppointmentsDebug()
        {
            try
            {
                var allAppointments = await _context.RdvPatients.ToListAsync();
                Console.WriteLine($"Total appointments in database: {allAppointments.Count}");
                
                foreach (var appointment in allAppointments)
                {
                    Console.WriteLine($"Appointment ID: {appointment.NumRdv}, Date: {appointment.DateRdv}, Time: {appointment.Heure}, Doctor: {appointment.NomPs}");
                }
                
                return Ok(new { 
                    count = allAppointments.Count, 
                    appointments = allAppointments 
                });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error retrieving appointments: {ex.Message}");
                return StatusCode(500, $"Error: {ex.Message}");
            }
        }

        [HttpGet("debug/database-info")]
        public async Task<IActionResult> GetDatabaseInfo()
        {
            try
            {
                var canConnect = await _context.Database.CanConnectAsync();
                var connectionString = _context.Database.GetConnectionString();
                var databaseName = _context.Database.GetDbConnection().Database;
                
                // Get table info
                var tableExists = await _context.Database.ExecuteSqlRawAsync("SELECT 1 FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'tab_RDV_patient'") >= 0;
                
                return Ok(new {
                    canConnect,
                    databaseName,
                    connectionString = connectionString?.Substring(0, Math.Min(50, connectionString.Length)) + "...", // Truncate for security
                    tableExists,
                    tableName = "tab_RDV_patient"
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error: {ex.Message}");
            }
        }

        [HttpPost("debug/create-test-appointment")]
        public async Task<IActionResult> CreateTestAppointment()
        {
            try
            {
                var testAppointment = new RdvPatient
                {
                    DateRdv = DateTime.Today.AddDays(1),
                    Heure = "10:00",
                    NomPs = "Dr. Test",
                    NumCabinet = "1",
                    NomPer = "Test Patient",
                    NatureSoin = "Test Appointment",
                    Duree = "30 min",
                    Observation = "This is a test appointment"
                };

                _context.RdvPatients.Add(testAppointment);
                var result = await _context.SaveChangesAsync();

                Console.WriteLine($"Test appointment created with ID: {testAppointment.NumRdv}");

                return Ok(new { 
                    message = "Test appointment created successfully",
                    appointmentId = testAppointment.NumRdv,
                    rowsAffected = result
                });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error creating test appointment: {ex.Message}");
                return StatusCode(500, $"Error: {ex.Message}");
            }
        }
    }
} 