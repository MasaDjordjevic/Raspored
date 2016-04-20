using System;
using System.Collections.Generic;

namespace WebApplication1.Models
{
    public partial class Departments
    {
        public Departments()
        {
            Students = new HashSet<Students>();
        }

        public int departmentID { get; set; }
        public string departmentName { get; set; }
        public int year { get; set; }

        public virtual ICollection<Students> Students { get; set; }
    }
}
