using System;
using System.Collections.Generic;

namespace WebApplication1.Models
{
    public partial class ActivitySchedules
    {
        public ActivitySchedules()
        {
            Activities = new HashSet<Activities>();
        }

        public int activityScheduleID { get; set; }
        public DateTime beginning { get; set; }
        public DateTime ending { get; set; }
        public string link { get; set; }
        public string semester { get; set; }

        public virtual ICollection<Activities> Activities { get; set; }
    }
}
