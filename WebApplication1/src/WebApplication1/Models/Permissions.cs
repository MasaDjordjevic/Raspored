using System;
using System.Collections.Generic;

namespace WebApplication1.Models
{
    public partial class Permissions
    {
        public Permissions()
        {
            RolesPermissions = new HashSet<RolesPermissions>();
        }

        public int permissionID { get; set; }
        public string name { get; set; }

        public virtual ICollection<RolesPermissions> RolesPermissions { get; set; }
    }
}
