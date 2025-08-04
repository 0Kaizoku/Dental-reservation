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
    public class PatientsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        public PatientsController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] string? name)
        {
            var query = _context.PopPersonnes.AsQueryable();
            if (!string.IsNullOrEmpty(name))
                query = query.Where(p => p.NomPer.Contains(name) || p.PrenomPer.Contains(name));
            var patients = await query.ToListAsync();
            return Ok(patients);
        }
    }
} 