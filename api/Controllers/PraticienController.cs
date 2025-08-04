using Dental_reservation.api.Data;
using Dental_reservation.api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;

namespace Dental_reservation.api.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class PraticienController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        public PraticienController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var praticiens = await _context.Praticiens.ToListAsync();
            return Ok(praticiens);
        }
    }
} 