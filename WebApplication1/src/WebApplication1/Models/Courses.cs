using System;
using System.Collections.Generic;

namespace WebApplication1.Models
{
    public partial class Courses
    {
        public Courses()
        {
            AssistantsCourses = new HashSet<AssistantsCourses>();
            Divisions = new HashSet<Divisions>();
            StudentsCourses = new HashSet<StudentsCourses>();
        }

        public int courseID { get; set; }
        public string alias { get; set; }
        public string code { get; set; }
        public int? departmentID { get; set; }
        public string name { get; set; }
        public bool? obavezni { get; set; }
        public int? semester { get; set; }

        public virtual ICollection<AssistantsCourses> AssistantsCourses { get; set; }
        public virtual ICollection<Divisions> Divisions { get; set; }
        public virtual ICollection<StudentsCourses> StudentsCourses { get; set; }
        public virtual Departments department { get; set; }
    }
}
