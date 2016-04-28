using System;
using System.Collections.Generic;

namespace WebApplication1.Models
{
    public partial class Departments
    {
        public Departments()
        {
            Courses = new HashSet<Courses>();
            Divisions = new HashSet<Divisions>();
            Students = new HashSet<Students>();
        }

        public int departmentID { get; set; }
        public string departmentName { get; set; }
        public int year { get; set; }

        public virtual ICollection<Courses> Courses { get; set; }
        public virtual ICollection<Divisions> Divisions { get; set; }
        public virtual ICollection<Students> Students { get; set; }
    }
}
