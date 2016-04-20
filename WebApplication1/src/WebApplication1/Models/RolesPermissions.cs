using System;
using System.Collections.Generic;

namespace WebApplication1.Models
{
    public partial class RolesPermissions
    {
        public int rolesPermissionID { get; set; }
        public int permissionID { get; set; }
        public int roleID { get; set; }

        public virtual Permissions permission { get; set; }
        public virtual Roles role { get; set; }
    }
}
