using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Data.Entity;
using WebApplication1.Extentions;
using WebApplication1.Models;
using WebApplication1.Models.DTOs;

namespace WebApplication1.Data
{
    public static class Group
    {

        public static IEnumerable GetAllGroups()
        {
            using (RasporedContext _context = new RasporedContext())
            {

                return _context.Groups.Include(a => a.classroom).Include(a => a.timeSpan).ToList();
            }
        }

        public static Groups GetGroup(int groupID)
        {
            using (RasporedContext _context = new RasporedContext())
            {

                Groups pom = _context.Groups
                    //.Include(a => a.division).ThenInclude(aa => aa.department)
                    .Include(a => a.classroom)
                    .Include(a => a.timeSpan)
                    .Include(a => a.GroupsStudents).ThenInclude(aa => aa.student).ThenInclude(aa => aa.UniMembers)
                    .Include(a => a.GroupsAssistants).ThenInclude(aa => aa.assistant)
                    .First(a => a.groupID == groupID);

                pom.division = _context.Divisions.First(a => a.divisionID == pom.divisionID);
                return pom;
            }
        }

        public static void RemoveGroup(Groups group)
        {
            using (RasporedContext _context = new RasporedContext())
            {
                //brisanje oglasa (nekim cudom se ne obrise)

                var ads = _context.Periods.Where(a => a.groupID == @group.groupID).Select(a => a.ad).ToList();
                foreach (Ads ad in ads)
                {
                    _context.Ads.Remove(ad);
                }
                

                //brisanje same grupe
                _context.Groups.Remove(@group);
                _context.SaveChanges();
            }
        }

        public static IEnumerable GetGroupsOfDivision(int divisionID)
        {
            using (RasporedContext _context = new RasporedContext())
            {

                return _context.Groups
                    .Include(a => a.classroom)
                    .Include(a => a.timeSpan)
                    .Where(a => a.divisionID == divisionID)
                    //.OrderBy(a => a.classroom.number)
                    .ToList();
            }
        }

        public static void CancelClass(int groupID, string title, string content, int weekNumber)
        {
            using (RasporedContext _context = new RasporedContext())
            {
                TimeSpans gts = _context.Groups.Where(a => a.groupID == groupID).Select(a=> a.timeSpan).First();
                TimeSpans ts = new TimeSpans
                {
                    startDate = gts.startDate.DayOfReferencedWeek(DateTime.Now, gts.period.Value).AddDays(7*weekNumber),
                    endDate = gts.endDate.DayOfReferencedWeek(DateTime.Now, gts.period.Value).AddDays(7*weekNumber),
                    period = gts.period
                };

                _context.TimeSpans.Add(ts);
                Activities act = new Activities
                {
                    title = title,
                    activityContent = content,
                    groupID = groupID,
                    cancelling = true,
                    timeSpanID = ts.timeSpanID
                };
                _context.Activities.Add(act);
                _context.SaveChanges();
            }
        }

        // TODO mozda neka poruka ukoliko se ne dodaju studenti
        public static bool AddStudnets(int groupID, List<int> students)
        {
            using (RasporedContext _context = new RasporedContext())
            {

                //provera konzistentnosti raspodele
                var groups =
                    _context.Groups.Where(
                        a => a.divisionID == _context.Groups.First(g => g.groupID == groupID).divisionID).Select(a => a.groupID).ToList();
                var studs = _context.GroupsStudents.Where(a => groups.Contains(a.groupID)).Select(a => a.studentID).ToList();

                foreach (int stud in students)
                {
                    if (studs.Contains(stud))
                    {
                        return false;
                    }
                }

                foreach (int studID in students)
                {
                    GroupsStudents gs = new GroupsStudents
                    {
                        groupID = groupID,
                        studentID = studID
                    };
                    _context.GroupsStudents.Add(gs);
                }
                _context.SaveChanges();
                return true;
            }
        }

        //proverava da li svi studenti te grupe nisu clanovi neke druge grupe te raspodele
        //groupID moze da bude null u slucaju provere prilikom kreiranja nove grupe
        public static bool CheckConsistencyOfGroup(int? groupID, List<int> students)
        {
            using (RasporedContext _context = new RasporedContext())
            {
                //proverava studente u ostalim grupama raspodele

                var groups =
                    _context.Groups.Where(
                        a => (groupID == null || a.groupID != groupID) && //bez te konkrentne grupe
                        a.divisionID == _context.Groups.First(g => g.groupID == groupID).divisionID) //sve grupe raspodele kojo ta grupa pripada
                        .Select(a => a.groupID).ToList();
                var studs = _context.GroupsStudents.Where(a => groups.Contains(a.groupID)).Select(a => a.studentID).ToList(); //studenti koji pripadaju tim grupama

                //proverava da li za svakog studenta vazi da nije u studs odnosno ne pripada ni jednoj drugoj grupi
                return students.All(stud => !studs.Contains(stud));
            }
        }
       
        public static void RemoveStudents(int groupID, List<int> students)
        {
            using (RasporedContext _context = new RasporedContext())
            {

                foreach (int studID in students)
                {
                    var gs =
                        (from a in _context.GroupsStudents
                            where a.studentID == studID && a.groupID == groupID
                            select a).First();
                    _context.GroupsStudents.Remove(gs);
                }
                _context.SaveChanges();
            }
        }

        public static void RemoveAllStudents(int groupID)
        {
            using (RasporedContext _context = new RasporedContext())
            {
                var gs = _context.GroupsStudents.Where(a => a.groupID == groupID);
                foreach (GroupsStudents g in gs)
                {
                    _context.GroupsStudents.Remove(g);
                }
                _context.SaveChanges();
            }
        }

        public static void ChangeSudents(int groupID, List<int> newStudents)
        {
            RemoveAllStudents(groupID);
            AddStudnets(groupID, newStudents);
        }

        public static void Update(int groupID, string name, int? classroomID, TimeSpans timespan)
        {
            using (RasporedContext _context = new RasporedContext())
            {
                Groups g = _context.Groups.First(a => a.groupID == groupID);
                if (name != null)
                    g.name = name;
                if (classroomID != null)
                    g.classroomID = classroomID;
                if (timespan != null)
                {
                    g.timeSpan = timespan;
                }
                   
                _context.SaveChanges();
            }

        }

        public static Groups Create(int divisionID, string name, int? classroomID, TimeSpans timespan)
        {
            using (RasporedContext _context = new RasporedContext())
            {
                _context.TimeSpans.Add(timespan);
                _context.SaveChanges();
                Groups g = new Groups
                {
                    divisionID = divisionID,
                    name = name,
                    classroomID = classroomID,
                    timeSpanID = timespan.timeSpanID
                };
                _context.Groups.Add(g);
                _context.SaveChanges();

                return g;
            }
        }

        public static void AddActivity(int groupID, int? classroomID, TimeSpans timeSpan, string place,
            string title, string content)
        {
            using (RasporedContext _context = new RasporedContext())
            {
                _context.TimeSpans.Add(timeSpan);

                Activities act = new Activities
                {
                    timeSpanID = timeSpan.timeSpanID,
                    classroomID = classroomID,
                    place = place,
                    title = title,
                    activityContent = content,
                    groupID = groupID,
                    cancelling = false,
                };
                _context.Activities.Add(act);
                _context.SaveChanges();
            }
        }

        public static void AddAsstant(int groupID, int assistantID)
        {
            using (RasporedContext _context = new RasporedContext())
            {
                GroupsAssistants gs = new GroupsAssistants
                {
                    assistantID = assistantID,
                    groupID = groupID
                };
                _context.GroupsAssistants.Add(gs);


                // ako asistent nije bio zaduzen za kurs dodati ga

                int? courseID = _context.Groups.Where(a => a.groupID == groupID).Select(a => a.division.courseID).First();
                if (courseID != null && !_context.AssistantsCourses.Any(a => a.assistantID == assistantID && a.courseID == courseID.Value))
                {
                    AssistantsCourses asscour = new AssistantsCourses
                    {
                        assistantID = assistantID,
                        courseID = courseID.Value
                    };
                    _context.AssistantsCourses.Add(asscour);
                }

                _context.SaveChanges();
            }
        }

        public static string GetAssistant(int groupID)
        {
            using (RasporedContext _context = new RasporedContext())
            {
                var q = _context.GroupsAssistants.Where(a => a.groupID == groupID);
                if (q.Any())
                {
                    var asst = q.Select(a => a.assistant).First();
                    return asst.name + " " + asst.surname;
                }
                else
                {
                    return "";
                }
            }
        }

        public static bool GetActive(int groupID, TimeSpans tsNow)
        {
            using (RasporedContext _context = new RasporedContext())
            {
                return !_context.Activities.Any(ac =>
                    ac.groupID == groupID && ac.cancelling != null && ac.cancelling.Value &&
                    TimeSpan.TimeSpanOverlap(ac.timeSpan, tsNow));

            }
        }

        public static IEnumerable GetCombinedSchedule(int groupID, int weeksFromNow = 0)
        {
            using (RasporedContext _context = new RasporedContext())
            {
                DateTime now = DateTime.Now.AddDays(7 * weeksFromNow);
                TimeSpans tsNow = new TimeSpans
                {
                    startDate = now.StartOfWeek(),
                    endDate = now.EndOfWeek()
                };
                List<int> students = _context.GroupsStudents.Where(a => a.groupID == groupID).Select(a => a.studentID).ToList();
                List<int> groups = _context.GroupsStudents
                    .Where(a => students.Contains(a.studentID) &&
                                TimeSpan.DatesOverlap(a.group.division.beginning, a.group.division.ending, tsNow.startDate, tsNow.endDate)) //provera da li raspodela kojoj grupa pripada i dalje vazi
                                .Select(a => a.groupID).ToList();
                ;
                List<ScheduleDTO> groupsSchedule = Queryable.Select(_context.Groups.Where(a => groups.Contains(a.groupID) && TimeSpan.Overlap(a.timeSpan, tsNow)), a => new ScheduleDTO
                        {
                            day = a.timeSpan.startDate.DayOfWeek,
                            startMinutes = (int)a.timeSpan.startDate.TimeOfDay.TotalMinutes,
                            durationMinutes = (int)(a.timeSpan.endDate.Subtract(a.timeSpan.startDate)).TotalMinutes,
                            className = a.division.course.name,
                            abbr = a.division.course.alias,
                            classroom = a.classroom.number,
                            assistant = GetAssistant(a.groupID),
                            type = a.division.divisionType.type,
                            active = GetActive(a.groupID, tsNow),
                            color = Schedule.GetNextColor(),
                        }).ToList();
                
                List<ScheduleDTO> activitiesSchedule =
                    _context.Activities.Where(a => !a.cancelling.Value && groups.Contains(a.groupID.Value) 
                                                    && TimeSpan.Overlap(a.timeSpan, tsNow))
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
    }
}
