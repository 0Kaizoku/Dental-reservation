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
    }
} 