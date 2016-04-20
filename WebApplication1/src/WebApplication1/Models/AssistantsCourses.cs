using System;
using System.Collections.Generic;

namespace WebApplication1.Models
{
    public partial class AssistantsCourses
    {
        public int assistantCourseID { get; set; }
        public int assistantID { get; set; }
        public string classType { get; set; }
        public int courseID { get; set; }

        public virtual UniMembers assistant { get; set; }
        public virtual Courses course { get; set; }
    }
}
