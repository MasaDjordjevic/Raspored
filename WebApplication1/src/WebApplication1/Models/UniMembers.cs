using System;
using System.Collections.Generic;

namespace WebApplication1.Models
{
    public partial class UniMembers
    {
        public UniMembers()
        {
            Activities = new HashSet<Activities>();
            AssistantsCourses = new HashSet<AssistantsCourses>();
            Divisions = new HashSet<Divisions>();
            GroupsAssistants = new HashSet<GroupsAssistants>();
            UniMembersRoles = new HashSet<UniMembersRoles>();
        }

        public int uniMemberID { get; set; }
        public string address { get; set; }
        public byte[] avatar { get; set; }
        public string email { get; set; }
        public string name { get; set; }
        public string password { get; set; }
        public int? studentID { get; set; }
        public string surname { get; set; }
        public string username { get; set; }

        public virtual ICollection<Activities> Activities { get; set; }
        public virtual ICollection<AssistantsCourses> AssistantsCourses { get; set; }
        public virtual ICollection<Divisions> Divisions { get; set; }
        public virtual ICollection<GroupsAssistants> GroupsAssistants { get; set; }
        public virtual ICollection<UniMembersRoles> UniMembersRoles { get; set; }
        public virtual Students student { get; set; }
    }
}
