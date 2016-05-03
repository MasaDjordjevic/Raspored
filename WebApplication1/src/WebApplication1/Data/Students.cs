using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebApplication1.Models;

namespace WebApplication1.Data
{
    public static class Student
    {
        public static IEnumerable GetStudentsOfGroup(int groupID)
        {
            RasporedContext _context = new RasporedContext();
            return (from s in _context.Students
                    from u in _context.UniMembers
                    from g in _context.GroupsStudents
                    where s.studentID == u.studentID.Value && s.studentID == g.studentID && g.groupID == groupID
                    select new
                    {
                        studentID = s.studentID,
                        name = u.name,
                        surname = u.surname,
                        indexNumber = s.indexNumber
                    }).ToList();
        }

        public static List<Students> GetStudentsOfCourse(int courseID)
        {
            RasporedContext _context = new RasporedContext();
            return (from s in _context.Students
                from sc in _context.StudentsCourses
                where s.studentID == sc.studentID && sc.courseID == courseID
                select s).ToList();
        }

        public static string GetStudentName(int studentID)
        {
            RasporedContext _context = new RasporedContext();
            return (from u in _context.UniMembers
                    from s in _context.Students
                    where  u.studentID == studentID && u.studentID == s.studentID 
                    select u.name).First();
        }

        public static string GetStudentSurname(int studentID)
        {
            RasporedContext _context = new RasporedContext();
            return (from u in _context.UniMembers
                    from s in _context.Students
                    where u.studentID == studentID && u.studentID == s.studentID
                    select u.surname).First();
        }

        public static string GetStudentFullName(int studentID)
        {
            RasporedContext _context = new RasporedContext();
            return (from u in _context.UniMembers
                    from s in _context.Students
                    where u.studentID == studentID &&  u.studentID == s.studentID
                    select u.name + u.surname).First();
        }

        public static List<TimeSpans> GetSchedule(int studentID)
        {
            RasporedContext _context = new RasporedContext();
            List<TimeSpans> groups = (from gs in _context.GroupsStudents
                                from g in _context.Groups
                                where gs.studentID == studentID && gs.groupID == g.groupID
                                select g.timeSpan).ToList();
            List<TimeSpans> activities = (from a in _context.Activities
                                            where a.studentID == studentID
                                            select a.timeSpan).ToList();
            return groups.Concat(activities).ToList();
        }

        public static bool CheckIfAveable(int studentID, TimeSpans time)
        {
            List<TimeSpans> schedule = GetSchedule(studentID);
            foreach (TimeSpans ts in schedule)
            {
                if (TimeSpan.Overlap(ts, time))
                    return false;
            }
            return true;
        }
    }
}
