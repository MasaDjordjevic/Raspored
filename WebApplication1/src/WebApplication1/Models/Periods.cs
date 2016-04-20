using System;
using System.Collections.Generic;

namespace WebApplication1.Models
{
    public partial class Periods
    {
        public int periodID { get; set; }
        public int adID { get; set; }
        public int groupID { get; set; }

        public virtual Ads ad { get; set; }
        public virtual Groups group { get; set; }
    }
}
