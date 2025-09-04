using Dental_reservation.api.Data;
using Dental_reservation.api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace Dental_reservation.api.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class ProfileController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        public ProfileController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet("me")]
        public async Task<IActionResult> GetMe()
        {
            var username = User.FindFirstValue("username");
            if (string.IsNullOrEmpty(username)) return Unauthorized();

            var user = await _context.Users.FirstOrDefaultAsync(u => u.Username == username);
            if (user == null) return NotFound();

            return Ok(new
            {
                username = user.Username,
                lastName = user.LastName,
                userType = user.UserType
            });
        }

        public class ChangePasswordDto
        {
            public string CurrentPassword { get; set; }
            public string NewPassword { get; set; }
        }

        [HttpPut("password")]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordDto dto)
        {
            var username = User.FindFirstValue("username");
            if (string.IsNullOrEmpty(username)) return Unauthorized();
            if (string.IsNullOrWhiteSpace(dto.CurrentPassword) || string.IsNullOrWhiteSpace(dto.NewPassword))
                return BadRequest("Both current and new password are required.");

            var user = await _context.Users.FirstOrDefaultAsync(u => u.Username == username);
            if (user == null) return NotFound();

            if (user.Password != dto.CurrentPassword)
                return Unauthorized();

            user.Password = dto.NewPassword; // In production, hash the password!
            await _context.SaveChangesAsync();
            return NoContent();
        }

        public class UpdateProfileDto
        {
            public string? LastName { get; set; }
        }

        [HttpPut("me")]
        public async Task<IActionResult> UpdateMe([FromBody] UpdateProfileDto dto)
        {
            var username = User.FindFirstValue("username");
            if (string.IsNullOrEmpty(username)) return Unauthorized();

            var user = await _context.Users.FirstOrDefaultAsync(u => u.Username == username);
            if (user == null) return NotFound();

            user.LastName = dto.LastName;
            await _context.SaveChangesAsync();
            return Ok(new { username = user.Username, lastName = user.LastName, userType = user.UserType });
        }
    }
}

