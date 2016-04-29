using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace ResumeApp.Models
{
    public class Job
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string Title { get; set; }

        [Required(ErrorMessage = "The date is required")]
        public DateTime Date { get; set; }

        [Required]
        public string Description { get; set; }

        [Required]
        public int PersonId { get; set; }

        [ForeignKey("PersonId")]
        public virtual Person Person { get; set; }


    }
}