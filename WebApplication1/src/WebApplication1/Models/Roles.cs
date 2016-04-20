using System;
using System.Collections.Generic;

namespace WebApplication1.Models
{
    public partial class Roles
    {
        public Roles()
        {
            RolesPermissions = new HashSet<RolesPermissions>();
            UniMembersRoles = new HashSet<UniMembersRoles>();
        }

        public int roleID { get; set; }
        public string name { get; set; }

        public virtual ICollection<RolesPermissions> RolesPermissions { get; set; }
        public virtual ICollection<UniMembersRoles> UniMembersRoles { get; set; }
    }
}
