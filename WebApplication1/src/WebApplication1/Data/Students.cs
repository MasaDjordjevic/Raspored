using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using Microsoft.Data.Entity;
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

        public static string GetStudentName(int studentID)
        {
            using (RasporedContext _context = new RasporedContext())
            {
                return _context.Students.Where(a => a.studentID == studentID)
                    .Select(a=> a.UniMembers.name + " " + a.UniMembers.surname).First();
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

        
      

        public static IEnumerable GetSchedule(int studentID, int weeksFromNow = 0, bool official = false)
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
                                (!official || a.falseMember != true) &&
                                (official || a.ignore != true) &&
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
                            active = Group.IsActive(a.groupID, tsNow, studentID),
                            color = Schedule.GetNextColor(),
                            isClass = true,
                            groupID = a.groupID,
                            notifications = GetClassNotification(studentID, a.groupID, tsNow)
                        }).ToList();

                List<int> activities = official ? new List<int>() : 
                    _context.StudentsActivities.Where(a => a.studentID == studentID && a.ignore != true).Select(a => a.activityID).ToList();
                List<ScheduleDTO> activitiesSchedule =
                    _context.Activities.Where(a => activities.Contains(a.activityID) || (a.cancelling == false && groups.Contains(a.groupID.Value))
                                                    && TimeSpan.Overlap(a.timeSpan, tsNow)
                                                    && a.groupID == null) //nisu obavestenja vezana za casove
                                                    .Select(a => new ScheduleDTO
                                                    {
                                                        day = a.timeSpan.startDate.DayOfWeek,
                                                        startMinutes = (int)a.timeSpan.startDate.TimeOfDay.TotalMinutes,
                                                        durationMinutes = (int)(a.timeSpan.endDate.Subtract(a.timeSpan.startDate)).TotalMinutes,
                                                        active = true,
                                                        color = Schedule.GetNextColor(),
                                                        activityTitle = a.title,
                                                        activityContent = a.activityContent,
                                                        isClass = false,
                                                        activityID = a.activityID
                                                    }).ToList();

                List<ScheduleDTO> returnValue = groupsSchedule.Concat(activitiesSchedule).ToList();


                return Schedule.Convert(returnValue);
            }
        }

        public static IEnumerable GetPersonalSchedule(int studentID, int weeksFromNow = 0)
        {
            return GetSchedule(studentID, weeksFromNow, false);
        }

        public static IEnumerable GetOfficialSchedule(int studentID, int weeksFromNow = 0)
        {
            return GetSchedule(studentID, weeksFromNow, true);
        }

        public static List<NotificationDTO> GetClassNotification(int studentID, int groupID, TimeSpans ts)
        {
            using (RasporedContext _context = new RasporedContext())
            {
                List<NotificationDTO> studentsNotifications = _context.StudentsActivities.Where(ac =>
                    ac.studentID == studentID && 
                    ac.activity.groupID == groupID &&
                    ac.activity.cancelling != true &&
                    TimeSpan.TimeSpanOverlap(ac.activity.timeSpan, ts))
                    .Select(ac => new NotificationDTO
                    {
                        activityID = ac.activityID,
                        activityContent = ac.activity.activityContent,
                        title = ac.activity.title,
                        classroomID = ac.activity.classroomID,
                        place = ac.activity.place
                    }).ToList();

                List<NotificationDTO> groupsNotifications = Group.GetNotifications(groupID, ts);

                return studentsNotifications.Concat(groupsNotifications).ToList();
            }
        }


        /// <summary>
        /// Proverava da li je student slobodan u to vreme.
        /// </summary>
        /// <param name="studentID"></param>
        /// <param name="ts"></param>
        /// <param name="groupID">Groupa ciji ce se cas izuzeti pri proveri</param>
        /// <returns></returns>
        public static bool CheckIfAvailable(int studentID, TimeSpans ts, int? groupID = null)
        {
            using (RasporedContext _context = new RasporedContext())
            {
                List<int> groups = _context.GroupsStudents
                    .Where(a => a.studentID == studentID &&
                                (groupID == null || a.groupID != groupID.Value) &&
                                TimeSpan.DatesOverlap(a.group.division.beginning, a.group.division.ending, ts.startDate, ts.endDate)) //provera da li raspodela kojoj grupa pripada i dalje vazi
                                .Select(a => a.groupID).ToList();

                List<TimeSpans> groupsSchedule =
                    _context.Groups.Where(a => groups.Contains(a.groupID) && Group.IsActive(a.groupID, ts)).Select(a => a.timeSpan).ToList();


                List<int> activities =
                    _context.StudentsActivities.Where(a => a.studentID == studentID && a.ignore != true).Select(a => a.activityID).ToList();
                List<TimeSpans> activitiesSchedule =
                    _context.Activities.Where(
                        a => activities.Contains(a.activityID) || (a.cancelling == false && groups.Contains(a.groupID.Value)))
                        .Select(a => a.timeSpan)
                        .ToList();

                List<TimeSpans> schedule = groupsSchedule.Concat(activitiesSchedule).ToList();

                return schedule.All(timespan => !TimeSpan.Overlap(timespan, ts));
            }
        }


        public static bool CheckIfAvailable(TimeSpans ts, List<int> students, int? groupID = null)
        {
            using (RasporedContext _context = new RasporedContext())
            {
                if (ts == null)
                    return true;

                var unaveliable = _context.Students
                    .Where(a => students.Contains(a.studentID) && !Student.CheckIfAvailable(a.studentID, ts, groupID))
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
        
        // provera da li studend moze biti dodan u grupu
        public static void TryAddToGroup(int studentID, int groupID, RasporedContext _context = null)
        {
            _context = _context ?? new RasporedContext();
            
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

        public static void AddToGroup(int studentID, int groupID, RasporedContext _context = null)
        {
            _context = _context ?? new RasporedContext();
            
            // provera da li dolazi do nekonzistentnosti
            TryAddToGroup(studentID, groupID, _context);

            GroupsStudents gs = new GroupsStudents
            {
                groupID = groupID,
                studentID = studentID
            };
            _context.GroupsStudents.Add(gs);
            
        }

        // brise studenta iz svih grupa raspodele divisionID
        public static void RemoveFromAllGroups(int studentID, int divisionID, RasporedContext _context = null)
        {
            _context = _context ?? new RasporedContext();

            var groupStudents =
                    _context.GroupsStudents.Where(a => a.studentID == studentID && a.group.divisionID == divisionID)
                        .ToList();

                foreach (GroupsStudents gs in groupStudents)
                {
                    _context.Remove(gs);
                }
        }

        // prebacuje studenta u grupu
        // birse ga iz svih ostalih grupa te raspodele i ubacuje u groupID
        public static void MoveToGroup(int studentID, int groupID, RasporedContext _context = null)
        {
            _context = _context ?? new RasporedContext();
            
            RemoveFromAllGroups(studentID,
                _context.Groups.Where(a => a.groupID == groupID).Select(a => a.divisionID).First(),
                _context);
            
            AddToGroup(studentID, groupID, _context);
            
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


        public static void HideClass(int studentID, int groupID)
        {
            using (RasporedContext _context = new RasporedContext())
            {
                GroupsStudents gs = _context.GroupsStudents.First(a => a.studentID == studentID && a.groupID == groupID);
                if (gs.ignore == true)
                    throw new Exception("vec je u sakriven");
                gs.ignore = true;
                _context.SaveChanges();
            }
        }

        // dodaje u licni raspored
        public static void AddClassToPersonalSchedule(int studentID, int groupID)
        {
            using (RasporedContext _context = new RasporedContext())
            {
                var query = _context.GroupsStudents.Where(a => a.studentID == studentID && a.groupID == groupID);


                // unhide
                if (query.Any())
                {
                    GroupsStudents gs = _context.GroupsStudents.First(a => a.studentID == studentID && a.groupID == groupID);
                    if (gs.ignore == false)
                        throw new Exception("vec je u licnom");
                    gs.ignore = false;
                }
                else // dodaj u licni
                {
                    GroupsStudents gs = new GroupsStudents
                    {
                        studentID = studentID,
                        groupID = groupID,
                        ignore = false,
                        alert = false,
                        falseMember = true
                    };
                    _context.GroupsStudents.Add(gs);
                }
               
                _context.SaveChanges();
            }
        }

        public static void AlertClass(int studentID, int groupID)
        {
            using (RasporedContext _context = new RasporedContext())
            {
                GroupsStudents gs = _context.GroupsStudents.First(a => a.studentID == studentID && a.groupID == groupID);
                if(gs.alert == true)
                    throw new Exception("vec je alertovan");
                gs.alert = true;
                _context.SaveChanges();
            }
        }

        public static void AddActivity(int studentID, int? groupID, int? classroomID, TimeSpans timeSpan, string place,
             string title, string content)
        {
            using (RasporedContext _context = new RasporedContext())
            {
                _context.TimeSpans.Add(timeSpan);

                Activities act = new Activities
                {
                    groupID = groupID,
                    timeSpanID = timeSpan.timeSpanID,
                    classroomID = classroomID,
                    place = place,
                    title = title,
                    activityContent = content,
                    cancelling = false,
                };
                _context.Activities.Add(act);

                StudentsActivities sa = new StudentsActivities
                {
                    studentID = studentID,
                    activityID = act.activityID,
                    ignore = false,
                    alert = false
                };
                _context.StudentsActivities.Add(sa);

                _context.SaveChanges();
            }
        }

        public static void DeleteActivity(int studentID, int activityID)
        {
            using (RasporedContext _context = new RasporedContext())
            {
                StudentsActivities sa = _context.StudentsActivities.First(a => a.studentID == studentID && a.activityID == activityID);
                _context.Remove(sa);
                _context.SaveChanges();
            }
        }
        

        public static void AlertActivity(int studentID, int activityID)
        {
            using (RasporedContext _context = new RasporedContext())
            {
                StudentsActivities sa = _context.StudentsActivities.First(a => a.studentID == studentID && a.activityID == activityID);
                if(sa.alert == true)
                    throw new Exception("vec je alertovan");
                sa.alert = true;
                _context.SaveChanges();
            }
        }
    }
}
