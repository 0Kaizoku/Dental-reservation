using Dental_reservation.api.Data;
using Dental_reservation.api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace Dental_reservation.api.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class ListeAttenteController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        public ListeAttenteController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet("by-doctor-date")]
        public async Task<IActionResult> GetByDoctorAndDate([FromQuery] string doctor, [FromQuery] DateTime date)
        {
            var rdvs = await _context.RdvPras
                .Where(r => r.NomPra == doctor && r.DateRdv.HasValue && r.DateRdv.Value.Date == date.Date)
                .ToListAsync();

            return Ok(rdvs);
        }
    }
} 