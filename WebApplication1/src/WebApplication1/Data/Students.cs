using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.CodeAnalysis;
using Microsoft.Data.Entity;
using Remotion.Linq.Clauses;
using WebApplication1.Models;
using Newtonsoft.Json;

namespace WebApplication1.Data
{
    public static class Student
    {
        public static IEnumerable GetAllStudents()
        {
            using (RasporedContext _context = new RasporedContext())
            {
                return _context.Students.Include(a => a.UniMembers).ToList();
            }
        }
        
        public static IEnumerable GetStudentsOfDepartment(int departmentID)
        {
            using (RasporedContext _context = new RasporedContext())
            {

                var r = (from stud in _context.Students.Include(a => a.UniMembers)
                    where stud.departmentID == departmentID
                    select stud).ToList();

                return JsonConvert.SerializeObject(r, Formatting.Indented, new JsonSerializerSettings
                {
                    ReferenceLoopHandling = ReferenceLoopHandling.Ignore
                });
            }
        }

        public static Object GetStudent(int studentID)
        {
            using (RasporedContext _context = new RasporedContext())
            {
                return _context.Students.Include(a => a.UniMembers).First(a => a.studentID == studentID);
            }
        }

        public static IEnumerable GetStudentsOfGroup(int groupID)
        {
            using (RasporedContext _context = new RasporedContext())
            {
                //ne znam zasto nece kad se select ubaci u prvi upit  a hoce kad se odvojji
                var pom =
                    _context.GroupsStudents.Include(a => a.student)
                        .ThenInclude(a => a.UniMembers)
                        .Where(a => a.groupID == groupID)
                        .ToList();
                return (from a in pom select a.student).ToList();
            }

        }

        public static List<Students> GetStudentsOfCourse(int courseID)
        {
            using (RasporedContext _context = new RasporedContext())
            {
                return (from s in _context.Students
                    .Include(a => a.UniMembers)
                    from sc in _context.StudentsCourses
                    where s.studentID == sc.studentID && sc.courseID == courseID
                    select s).ToList();
            }
        }
      

        public static IEnumerable GetSchedule(int studentID)
        {
            using (RasporedContext _context = new RasporedContext())
            {
                List<int> groups = _context.GroupsStudents.Where(a => a.studentID == studentID).Select(a => a.groupID).ToList();

                

                var returnValue =
                    _context.Activities.Where(a => groups.Contains(a.groupID.Value) || a.studentID == studentID)
                        .Select(a => new
                        {
                            day = a.timeSpan.startDate.DayOfWeek,
                            startMinutes = (int)a.timeSpan.startDate.TimeOfDay.TotalMinutes,
                            durationMinutes = (int)(a.timeSpan.endDate.Subtract(a.timeSpan.startDate)).TotalMinutes,
                            className = a.course.name,
                            abbr = a.course.alias,
                            classroom = a.classroom.number, 
                            assistant = GetAssistant(a.activityID),
                            type = a.group.division.divisionType.type,
                            active = true,
                            //active = !a.cancelling ?? true,
                            color = "#f44336",
                        }).ToList();

                return (from a in returnValue
                    group a by a.day
                    into newGroup
                    orderby newGroup.Key
                    select newGroup).ToList();
            }
        }

        public static string GetAssistant(int activityID)
        {
            using (RasporedContext _context = new RasporedContext())
            {
                string res;
                Activities act = _context.Activities.Include(a=>a.group).First(a => a.activityID == activityID);
                var assi = _context.GroupsAssistants.Where(a => a.groupID == act.groupID).Select(a => a.assistant);
                if (assi.Any())
                {
                    UniMembers assistant = assi.First();
                    res = assistant.name + " " +
                          assistant.surname;
                }
                else
                {
                    UniMembers creator =
                        _context.Divisions.Where(a => a.divisionID == act.group.divisionID).Select(a => a.creator).First();
                    res = creator.name + " " + creator.surname;
                }

                return res;

            }
        }


        public static
            List<TimeSpans> GetScheduleTimes(int studentID)
        {
            using (RasporedContext _context = new RasporedContext())
            {
                List<int> groups = _context.GroupsStudents.Where(a => a.studentID == studentID).Select(a => a.groupID).ToList();

                return 
                    _context.Activities.Where(a => groups.Contains(a.groupID.Value) || a.studentID == studentID)
                        .Select(a => a.timeSpan).ToList();

              
            }
        }

        public static bool CheckIfAveable(int studentID, TimeSpans time)
        {
            List<TimeSpans> schedule = GetScheduleTimes(studentID);
            foreach (TimeSpans ts in schedule)
            {
                if (TimeSpan.Overlap(ts, time))
                    return false;
            }
            return true;
        }

        public static void AddToGroup(int studentID, int groupID)
        {
            using (RasporedContext _context = new RasporedContext())
            {

                //proveri da li dolazi do nekonzistentnosti raspodele

                GroupsStudents gs = new GroupsStudents
                {
                    groupID = groupID,
                    studentID = studentID
                };
                _context.GroupsStudents.Add(gs);
                _context.SaveChanges();
            }
        }
    }
}
