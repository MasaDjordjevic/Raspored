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
using WebApplication1.Exceptions;
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
                    select stud).OrderBy(a=> a.indexNumber).ToList();

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
                return (from a in pom select a.student).OrderBy(a => a.indexNumber).ToList();
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

        
      

        public static IEnumerable GetSchedule(int studentID, int weeksFromNow = 0)
        {
            using (RasporedContext _context = new RasporedContext())
            {
                DateTime now = DateTime.Now.AddDays(7 * weeksFromNow);
                TimeSpans tsNow = new TimeSpans
                {
                    startDate = now.StartOfWeek(),
                    endDate = now.EndOfWeek()
                };
                List<int> groups = _context.GroupsStudents
                    .Where(a => a.studentID == studentID &&  
                                TimeSpan.DatesOverlap(a.group.division.beginning, a.group.division.ending, tsNow.startDate, tsNow.endDate)) //provera da li raspodela kojoj grupa pripada i dalje vazi
                                .Select(a => a.groupID).ToList();

                List<ScheduleDTO> groupsSchedule = _context.Groups.Where(a => groups.Contains(a.groupID) && TimeSpan.Overlap(a.timeSpan, tsNow))
                        .Select(a => new ScheduleDTO
                        {
                            day = a.timeSpan.startDate.DayOfWeek,
                            startMinutes = (int)a.timeSpan.startDate.TimeOfDay.TotalMinutes,
                            durationMinutes = (int)(a.timeSpan.endDate.Subtract(a.timeSpan.startDate)).TotalMinutes,
                            className = a.division.course.name,
                            abbr = a.division.course.alias,
                            classroom = a.classroom.number, 
                            assistant = Group.GetAssistant(a.groupID),
                            type = a.division.divisionType.type,
                            active = Group.GetActive(a.groupID, tsNow),
                            color = Schedule.GetNextColor(),
                        }).ToList();

                List<ScheduleDTO> activitiesSchedule =
                    _context.Activities.Where(a => (a.studentID == studentID || (a.cancelling == false && groups.Contains(a.groupID.Value))
                                                    && TimeSpan.Overlap(a.timeSpan, tsNow)))
                                                    .Select(a => new ScheduleDTO
                                                    {
                                                        day = a.timeSpan.startDate.DayOfWeek,
                                                        startMinutes = (int)a.timeSpan.startDate.TimeOfDay.TotalMinutes,
                                                        durationMinutes = (int)(a.timeSpan.endDate.Subtract(a.timeSpan.startDate)).TotalMinutes,
                                                        active = true,
                                                        color = Schedule.GetNextColor(),
                                                        activityTitle = a.title,
                                                        activityContent = a.activityContent
                                                    }).ToList();

                List<ScheduleDTO> returnValue = groupsSchedule.Concat(activitiesSchedule).ToList();


                return Schedule.Convert(returnValue);
            }
        }

        public static bool CheckIfAvailable(int studentID, TimeSpans ts)
        {
            using (RasporedContext _context = new RasporedContext())
            {
                List<int> groups = _context.GroupsStudents
                    .Where(a => a.studentID == studentID &&
                                TimeSpan.DatesOverlap(a.group.division.beginning, a.group.division.ending, ts.startDate, ts.endDate)) //provera da li raspodela kojoj grupa pripada i dalje vazi
                                .Select(a => a.groupID).ToList();

                List<TimeSpans> groupsSchedule =
                    _context.Groups.Where(a => groups.Contains(a.groupID) && Group.GetActive(a.groupID, ts)).Select(a => a.timeSpan).ToList();

                List<TimeSpans> activitiesSchedule =
                    _context.Activities.Where(
                        a => a.studentID == studentID || (a.cancelling == false && groups.Contains(a.groupID.Value)))
                        .Select(a => a.timeSpan)
                        .ToList();

                List<TimeSpans> schedule = groupsSchedule.Concat(activitiesSchedule).ToList();

                return schedule.All(timespan => !TimeSpan.Overlap(timespan, ts));
            }
        }


        public static bool CheckIfAvailable(TimeSpans ts, List<int> students)
        {
            using (RasporedContext _context = new RasporedContext())
            {
                if (ts == null)
                    return true;

                var unaveliable = _context.Students
                    .Where(a => students.Contains(a.studentID) && !Student.CheckIfAvailable(a.studentID, ts))
                     .Select(a => a.UniMembers.name + " " + a.UniMembers.surname).ToList();

                if (unaveliable.Any())
                {
                    string exp = unaveliable.Count > 1
                        ? "Studenti nisu slobodni u vreme kada grupa ima cas"
                        : "Student nije slobodan u vreme kada grupa ima cas";
                    exp += " (" + Data.TimeSpan.ToString(ts) + ").\n";
                    exp += unaveliable.Concat("\n");
                    throw new InconsistentDivisionException(exp);
                }

                return true;

            }
        }




        public static bool CancellingToActive(bool? cancelling)
        {
            return !cancelling ?? true;
        }

        public static void TryAddToGroup(int studentID, int groupID)
        {
            using (RasporedContext _context = new RasporedContext())
            {
                //proveri da li dolazi do nekonzistentnosti raspodele
                //provera da li student vec postoji u toj grupi
                var otherStuds =
                    _context.GroupsStudents.Where(a => a.groupID == groupID).Select(a => a.studentID).ToList();
                if (otherStuds.Contains(studentID))
                {
                    throw new InconsistentDivisionException("Student već pripada toj grupi.");
                }

                //proverva konzistentnost sa ostalim grupama, bacice exeption ako nije
                Data.Group.CheckConsistencyWithOtherGroups(groupID, new List<int>() {studentID});

                //provera da li je student slobodan u vreme kada ta grupa ima cas
                TimeSpans groupTs = _context.Groups.First(a => a.groupID == groupID).timeSpan;
                if (groupTs != null && Student.CheckIfAvailable(studentID, groupTs))
                {
                    string message = "Student nije slobodan u vreme kada grupa ima cas";
                    message += " (" + TimeSpan.ToString(groupTs) + " )."; 
                    throw new InconsistentDivisionException(message);
                }
            }
        }

        public static void AddToGroup(int studentID, int groupID)
        {
            using (RasporedContext _context = new RasporedContext())
            {
                // provera da li dolazi do nekonzistentnosti
                TryAddToGroup(studentID, groupID);

                GroupsStudents gs = new GroupsStudents
                {
                    groupID = groupID,
                    studentID = studentID
                };
                _context.GroupsStudents.Add(gs);
                _context.SaveChanges();
            }
        }

        // brise studenta iz svih grupa raspodele divisionID
        // vraca id grupe iz koje je izbrisan (trebalo bi da bude samo jedna ukoliko je raspodela bila konzistentna)
        // vraca id da bih mogla da odglumim transakciju
        public static int RemoveFromAllGroups(int studentID, int divisionID)
        {
            using (RasporedContext _context = new RasporedContext())
            {
                int groupID = -1;
                var groupStudents =
                    _context.GroupsStudents.Where(a => a.studentID == studentID && a.group.divisionID == divisionID)
                        .ToList();

                foreach (GroupsStudents gs in groupStudents)
                {
                    groupID = gs.groupID;
                    _context.Remove(gs);
                }
                _context.SaveChanges();
                return groupID;
            }
        }

        public static void MoveToGroup(int studentID, int groupID)
        {
            using (RasporedContext _context = new RasporedContext())
            {
                int removedId = RemoveFromAllGroups(studentID,
                    _context.Groups.Where(a => a.groupID == groupID).Select(a => a.divisionID).First());
                try
                {
                    AddToGroup(studentID, groupID);
                }
                catch (InconsistentDivisionException ex)
                {
                    //rollback
                    AddToGroup(studentID, removedId);
                    //prosledi exception
                    throw ex;
                }
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
