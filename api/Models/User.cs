using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Dental_reservation.api.Models
{
    [Table("Usercmim")]
    public class User
    {
        [Key]
        [Column("username")]
        public string Username { get; set; }

        [Column("lastname")]
        public string? LastName { get; set; }

        [Column("password")]
        public string Password { get; set; }
        
        [Column("type_de_compte")]
        public string? UserType { get; set; }
    }
} 