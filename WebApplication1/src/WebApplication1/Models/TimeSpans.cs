using System;
using System.Collections.Generic;

namespace WebApplication1.Models
{
    public partial class TimeSpans
    {
        public TimeSpans()
        {
            Activities = new HashSet<Activities>();
            Groups = new HashSet<Groups>();
        }

        public int timeSpanID { get; set; }
        public DateTime endDate { get; set; }
        public int? period { get; set; }
        public DateTime startDate { get; set; }

        public virtual ICollection<Activities> Activities { get; set; }
        public virtual ICollection<Groups> Groups { get; set; }
    }
}
