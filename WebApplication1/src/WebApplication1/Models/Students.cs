using System;
using System.Collections.Generic;

namespace WebApplication1.Models
{
    public partial class Students
    {
        public Students()
        {
            Activities = new HashSet<Activities>();
            Ads = new HashSet<Ads>();
            GroupsStudents = new HashSet<GroupsStudents>();
            StudentsActivities = new HashSet<StudentsActivities>();
            StudentsCourses = new HashSet<StudentsCourses>();
        }

        public int studentID { get; set; }
        public int departmentID { get; set; }
        public int indexNumber { get; set; }

        public virtual ICollection<Activities> Activities { get; set; }
        public virtual ICollection<Ads> Ads { get; set; }
        public virtual ICollection<GroupsStudents> GroupsStudents { get; set; }
        public virtual ICollection<StudentsActivities> StudentsActivities { get; set; }
        public virtual ICollection<StudentsCourses> StudentsCourses { get; set; }
        public virtual UniMembers UniMembers { get; set; }
        public virtual Departments department { get; set; }
    }
}
