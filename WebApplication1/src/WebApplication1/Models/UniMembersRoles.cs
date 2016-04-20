using System;
using System.Collections.Generic;

namespace WebApplication1.Models
{
    public partial class UniMembersRoles
    {
        public int uniMembersRoleID { get; set; }
        public int roleID { get; set; }
        public int uniMemberID { get; set; }

        public virtual UniMembers UniMembers { get; set; }
        public virtual Roles role { get; set; }
    }
}
