using System;
using System.Collections.Generic;

namespace WebApplication1.Models
{
    public partial class StudentsActivities
    {
        public int studentActivityID { get; set; }
        public int activityID { get; set; }
        public bool? alert { get; set; }
        public bool? ignore { get; set; }
        public int studentID { get; set; }

        public virtual Activities activity { get; set; }
        public virtual Students student { get; set; }
    }
}
