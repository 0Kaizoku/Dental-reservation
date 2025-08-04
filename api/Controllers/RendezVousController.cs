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
            // Check for doctor conflict
            bool doctorConflict = await _context.RdvPatients.AnyAsync(r =>
                r.NomPs == newRdv.NomPs &&
                r.DateRdv == newRdv.DateRdv &&
                r.Heure == newRdv.Heure);

            // Check for cabinet conflict
            bool cabinetConflict = await _context.RdvPatients.AnyAsync(r =>
                r.NumCabinet == newRdv.NumCabinet &&
                r.DateRdv == newRdv.DateRdv &&
                r.Heure == newRdv.Heure);

            if (doctorConflict)
                return Conflict("Doctor already has an appointment at this time.");

            if (cabinetConflict)
                return Conflict("Cabinet is already booked at this time.");

            _context.RdvPatients.Add(newRdv);
            await _context.SaveChangesAsync();

            return Ok(newRdv);
        }

        [HttpPut("{num_rdv}")]
        public async Task<IActionResult> UpdateAppointment(double num_rdv, [FromBody] RdvPatient updatedRdv)
        {
            var rdv = await _context.RdvPatients.FirstOrDefaultAsync(r => r.NumRdv == num_rdv);
            if (rdv == null)
                return NotFound("Appointment not found");

            // Check for doctor conflict (excluding this appointment)
            bool doctorConflict = await _context.RdvPatients.AnyAsync(r =>
                r.NumRdv != num_rdv &&
                r.NomPs == updatedRdv.NomPs &&
                r.DateRdv == updatedRdv.DateRdv &&
                r.Heure == updatedRdv.Heure);

            // Check for cabinet conflict (excluding this appointment)
            bool cabinetConflict = await _context.RdvPatients.AnyAsync(r =>
                r.NumRdv != num_rdv &&
                r.NumCabinet == updatedRdv.NumCabinet &&
                r.DateRdv == updatedRdv.DateRdv &&
                r.Heure == updatedRdv.Heure);

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
        public async Task<IActionResult> DeleteAppointment(double num_rdv)
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
    }
} 