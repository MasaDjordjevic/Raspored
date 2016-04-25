using System;
using System.Collections.Generic;

namespace WebApplication1.Models
{
    public partial class Courses
    {
        public Courses()
        {
            AssistantsCourses = new HashSet<AssistantsCourses>();
        }

        public int courseID { get; set; }
        public string alias { get; set; }
        public string code { get; set; }
        public int? departmentID { get; set; }
        public string name { get; set; }

        public virtual ICollection<AssistantsCourses> AssistantsCourses { get; set; }
        public virtual Departments department { get; set; }
    }
}
