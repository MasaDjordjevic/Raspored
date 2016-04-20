using System;
using System.Collections.Generic;

namespace WebApplication1.Models
{
    public partial class GroupsAssistants
    {
        public int groupsAssistantID { get; set; }
        public int assistantID { get; set; }
        public int groupID { get; set; }

        public virtual UniMembers assistant { get; set; }
        public virtual Groups group { get; set; }
    }
}
