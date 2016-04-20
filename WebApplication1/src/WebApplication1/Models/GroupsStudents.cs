using System;
using System.Collections.Generic;

namespace WebApplication1.Models
{
    public partial class GroupsStudents
    {
        public int groupsStudentID { get; set; }
        public int groupID { get; set; }
        public int studentID { get; set; }

        public virtual Groups group { get; set; }
        public virtual Students student { get; set; }
    }
}
