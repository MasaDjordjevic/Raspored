using System;
using System.Collections.Generic;

namespace WebApplication1.Models
{
    public partial class Classrooms
    {
        public Classrooms()
        {
            Activities = new HashSet<Activities>();
            Groups = new HashSet<Groups>();
        }

        public int classroomID { get; set; }
        public string number { get; set; }
        public bool projector { get; set; }
        public bool sunnySide { get; set; }

        public virtual ICollection<Activities> Activities { get; set; }
        public virtual ICollection<Groups> Groups { get; set; }
    }
}
