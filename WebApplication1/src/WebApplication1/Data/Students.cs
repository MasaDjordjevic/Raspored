using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography.X509Certificates;
using System.Threading.Tasks;
using Microsoft.CodeAnalysis;
using Microsoft.Data.Entity;
using Remotion.Linq.Clauses;
using WebApplication1.Models;
using Newtonsoft.Json;
using WebApplication1.Extentions;

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

        private static int colorCounter = -1;

        public static string GetNextColor()
        {
            string[] boje = new string[] { "#f44336", "#673AB7", "#2196F3", "#8BC34A", "#FFC107" };

            colorCounter++;
            if (colorCounter == boje.Length)
                colorCounter = 0;

            return boje[colorCounter];

        }
      

        public static IEnumerable GetSchedule(int studentID)
        {
            using (RasporedContext _context = new RasporedContext())
            {
                List<int> groups = _context.GroupsStudents.Where(a => a.studentID == studentID).Select(a => a.groupID).ToList();

                var returnValue = _context.Groups.Where(a => groups.Contains(a.groupID))
               // var returnValue = 
                //    _context.Activities.Where(a => groups.Contains(a.groupID.Value) || a.studentID == studentID)
                        .Select(a => new
                        {
                            day = a.timeSpan.startDate.DayOfWeek,
                            startMinutes = (int)a.timeSpan.startDate.TimeOfDay.TotalMinutes,
                            durationMinutes = (int)(a.timeSpan.endDate.Subtract(a.timeSpan.startDate)).TotalMinutes,
                            className = a.division.course.name,
                            abbr = a.division.course.alias,
                            classroom = a.classroom.number, 
                            assistant = GetAssistant(a.groupID),
                            type = a.division.divisionType.type,
                            active = GetCanceling(a.groupID, a.timeSpan),
                            //active = CancellingToActive(a.cancelling),
                            color = GetNextColor(),
                        }).ToList();
                

                var ret = new ArrayList();

                var daysOfWeek = Enum.GetValues(typeof(DayOfWeek))
                                .OfType<DayOfWeek>()
                                .OrderBy(day => day < DayOfWeek.Monday);

                // svaki dan mora da postoji bez obzira da li ima casova u njemu
                foreach (DayOfWeek day in daysOfWeek)
                {
                    ret.Add(
                        (from a in returnValue where a.day == day select a).ToArray()
                        );
                }

                return ret;
            }
        }

        public static string GetAssistant(int groupID)
        {
            using (RasporedContext _context = new RasporedContext())
            {
                var q = _context.GroupsAssistants.Where(a => a.groupID == groupID);
                if (q.Any())
                {
                    var asst = q.Select(a=> a.assistant).First();
                    return asst.name + " " + asst.surname;
                }
                else
                {
                    return "";
                }
            }
        }

        public static bool GetCanceling(int groupID, TimeSpans ts)
        {
            using (RasporedContext _context = new RasporedContext())
            {
                TimeSpans tsThisWeek = new TimeSpans
                {
                    startDate = ts.startDate.DayOfCurrentWeek(),
                    endDate = ts.endDate.DayOfCurrentWeek()
                };
                return !_context.Activities.Any( ac =>
                    ac.groupID == groupID && ac.cancelling != null && ac.cancelling.Value &&
                    TimeSpan.Equal(ac.timeSpan, tsThisWeek));
                
            }
        }

        public static bool CancellingToActive(bool? cancelling)
        {
            return !cancelling ?? true;
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
                //provera da li student vec postoji u toj grupi
                if (groupID != null)
                {
                    var otherStuds =
                        _context.GroupsStudents.Where(a => a.groupID == groupID).Select(a => a.studentID).ToList();
                    if (otherStuds.Contains(studentID))
                    {
                        return;
                    }
                }
                //proverva konzistentnost sa ostalim grupama
                if (Data.Group.CheckConsistencyOfGroup(groupID, new List<int>() { studentID }))
                {
                    return;
                }

                GroupsStudents gs = new GroupsStudents
                {
                    groupID = groupID,
                    studentID = studentID
                };
                _context.GroupsStudents.Add(gs);
                _context.SaveChanges();
            }
        }

        public static bool RemoveFromGroup(int studentID, int groupID)
        {
            using (RasporedContext _context = new RasporedContext())
            {
                var query = _context.GroupsStudents.Where(a => a.studentID == studentID && a.groupID == groupID);
                if (query.Any())
                {
                    _context.GroupsStudents.Remove(query.First());
                    _context.SaveChanges();
                    return true;
                }
                else 
                    return false;
            }
        }
    }
}
