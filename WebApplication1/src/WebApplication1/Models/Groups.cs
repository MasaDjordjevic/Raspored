using System;
using System.Collections.Generic;

namespace WebApplication1.Models
{
    public partial class Groups
    {
        public Groups()
        {
            Activities = new HashSet<Activities>();
            GroupsAssistants = new HashSet<GroupsAssistants>();
            GroupsStudents = new HashSet<GroupsStudents>();
            Periods = new HashSet<Periods>();
        }

        public int groupID { get; set; }
        public int? classroomID { get; set; }
        public int divisionID { get; set; }
        public string name { get; set; }
        public int? timeSpanID { get; set; }

        public virtual ICollection<Activities> Activities { get; set; }
        public virtual ICollection<GroupsAssistants> GroupsAssistants { get; set; }
        public virtual ICollection<GroupsStudents> GroupsStudents { get; set; }
        public virtual ICollection<Periods> Periods { get; set; }
        public virtual Classrooms classroom { get; set; }
        public virtual Divisions division { get; set; }
        public virtual TimeSpans timeSpan { get; set; }
    }
}
