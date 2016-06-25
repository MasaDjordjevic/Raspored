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
        public int divisionID { get; set; }
        public int studentID { get; set; }

        public virtual ICollection<Periods> Periods { get; set; }
        public virtual Divisions division { get; set; }
        public virtual Students student { get; set; }
    }
}
