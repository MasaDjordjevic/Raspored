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
        public int? courseID { get; set; }
        public int creatorID { get; set; }
        public int? departmentID { get; set; }
        public int divisionTypeID { get; set; }
        public DateTime ending { get; set; }
        public string name { get; set; }

        public virtual ICollection<Ads> Ads { get; set; }
        public virtual ICollection<Groups> Groups { get; set; }
        public virtual Courses course { get; set; }
        public virtual UniMembers creator { get; set; }
        public virtual Departments department { get; set; }
        public virtual DivisionTypes divisionType { get; set; }
    }
}
