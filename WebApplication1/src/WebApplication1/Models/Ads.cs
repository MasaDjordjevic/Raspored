using System;
using System.Collections.Generic;

namespace WebApplication1.Models
{
    public partial class Ads
    {
        public Ads()
        {
            Periods = new HashSet<Periods>();
        }

        public int adID { get; set; }
        public int groupID { get; set; }
        public int studentID { get; set; }

        public virtual ICollection<Periods> Periods { get; set; }
        public virtual Groups group { get; set; }
        public virtual Students student { get; set; }
    }
}
