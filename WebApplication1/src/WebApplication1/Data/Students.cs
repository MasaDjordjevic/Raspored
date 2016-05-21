using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.CodeAnalysis;
using Microsoft.Data.Entity;
using Remotion.Linq.Clauses;
using Microsoft.Data.Entity;
using WebApplication1.Models;

namespace WebApplication1.Data
{
    public static class Student
    {
        public static IEnumerable GetAllStudents()
        {
            RasporedContext _context = new RasporedContext();
            return _context.Students.Include(a => a.UniMembers).ToList();
        }

        public static Object GetStudent(int studentID)
        {
            RasporedContext _context = new RasporedContext();
            return _context.Students.Include(a => a.UniMembers).First(a => a.studentID == studentID);
        }

        public static IEnumerable GetStudentsOfGroup(int groupID)
        {
            RasporedContext _context = new RasporedContext();
            //ne znam zasto nece kad se select ubaci u prvi upit  a hoce kad se odvojji
            var pom =
                _context.GroupsStudents.Include(a => a.student).ThenInclude(a=>a.UniMembers).Where(a => a.groupID == groupID).ToList();
            return (from a in pom select a.student).ToList();
            
        }

        public static List<Students> GetStudentsOfCourse(int courseID)
        {
            RasporedContext _context = new RasporedContext();
            return (from s in _context.Students
                    .Include(a=>a.UniMembers)
                from sc in _context.StudentsCourses
                where s.studentID == sc.studentID && sc.courseID == courseID
                select s).ToList();
        }
      

        public static List<TimeSpans> GetSchedule(int studentID)
        {
            RasporedContext _context = new RasporedContext();
            List<TimeSpans> groups = (from gs in _context.GroupsStudents
                                from g in _context.Groups
                                where gs.studentID == studentID && gs.groupID == g.groupID
                                select g.timeSpan).ToList();

            //ovako neakko bi trebalo ali nedaj boze da to radi zapravo
            //List<TimeSpans> groups2 = (from s in _context.GroupsStudents
            //                           .Include(a=>a.group)
            //                           where s.studentID == studentID
            //                           select s.group.timeSpan).ToList();

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
