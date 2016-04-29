using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data.Entity;

namespace ResumeApp.Models
{
    public class ResumeAppContext : DbContext
    {
        public DbSet<Person> People { get; set; }

        public DbSet<Job> Jobs { get; set; }
    }
}