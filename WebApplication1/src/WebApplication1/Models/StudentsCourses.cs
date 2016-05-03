using System;
using System.Collections.Generic;

namespace WebApplication1.Models
{
    public partial class StudentsCourses
    {
        public int studentsCourseID { get; set; }
        public int courseID { get; set; }
        public int studentID { get; set; }

        public virtual Courses course { get; set; }
        public virtual Students student { get; set; }
    }
}
