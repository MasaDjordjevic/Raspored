using System;
using System.Collections.Generic;

namespace WebApplication1.Models
{
    public partial class Divisions
    {
        public Divisions()
        {
            Ads = new HashSet<Ads>();
            Groups = new HashSet<Groups>();
        }

        public int divisionID { get; set; }
        public DateTime beginning { get; set; }
        public int creatorID { get; set; }
        public int divisionTypeID { get; set; }
        public DateTime ending { get; set; }

        public virtual ICollection<Ads> Ads { get; set; }
        public virtual ICollection<Groups> Groups { get; set; }
        public virtual DivisionTypes divisionType { get; set; }
    }
}
