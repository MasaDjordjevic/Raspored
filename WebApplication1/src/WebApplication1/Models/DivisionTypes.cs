using System;
using System.Collections.Generic;

namespace WebApplication1.Models
{
    public partial class DivisionTypes
    {
        public DivisionTypes()
        {
            Divisions = new HashSet<Divisions>();
        }

        public int divisionTypeID { get; set; }
        public string type { get; set; }

        public virtual ICollection<Divisions> Divisions { get; set; }
    }
}
