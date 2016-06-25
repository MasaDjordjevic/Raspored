using System.Collections.Generic;

namespace WebApplication1.Models
{
    public partial class Activities
    {
        public Activities()
        {
            StudentsActivities = new HashSet<StudentsActivities>();
        }

        public int activityID { get; set; }
        public string activityContent { get; set; }
        public int? activityScheduleID { get; set; }
        public int? assistantID { get; set; }
        public bool? cancelling { get; set; }
        public int? classroomID { get; set; }
        public int? courseID { get; set; }
        public int? groupID { get; set; }
        public string place { get; set; }
        public int timeSpanID { get; set; }
        public string title { get; set; }

        public virtual ICollection<StudentsActivities> StudentsActivities { get; set; }
        public virtual ActivitySchedules activitySchedule { get; set; }
        public virtual UniMembers assistant { get; set; }
        public virtual Classrooms classroom { get; set; }
        public virtual Courses course { get; set; }
        public virtual Groups group { get; set; }
        public virtual TimeSpans timeSpan { get; set; }
    }
}
