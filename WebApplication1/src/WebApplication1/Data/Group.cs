using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using Microsoft.Data.Entity;
using WebApplication1.Exceptions;
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
                return _context.Groups
                    .Include(a => a.classroom)
                    .Include(a => a.timeSpan)
                    .ToList();
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
                    .Include(a => a.assistant)
                    .First(a => a.groupID == groupID);

                pom.division = _context.Divisions.First(a => a.divisionID == pom.divisionID);
                return pom;
            }
        }

        public static void RemoveGroup(int groupID)
        {
            using (RasporedContext _context = new RasporedContext())
            {
                // brisanje timeSpana
                Groups group = _context.Groups.Include(a => a.timeSpan).First(a => a.groupID == groupID);
                TimeSpans ts = group.timeSpan;
                // brisanje same grupe
                _context.Groups.Remove(@group);
                _context.SaveChanges();
                if (ts != null)
                {
                    _context.TimeSpans.Remove(ts);
                }
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

        public static void CancelClass(int groupID, string title, string content, TimeSpans timespan)
        {
            using (RasporedContext _context = new RasporedContext())
            {
                _context.TimeSpans.Add(timespan);
                Activities act = new Activities
                {
                    title = title,
                    activityContent = content,
                    groupID = groupID,
                    cancelling = true,
                    timeSpanID = timespan.timeSpanID
                };
                _context.Activities.Add(act);
                _context.SaveChanges();
            }
        }

        // prebacuje studente u grupu
        // brise studente iz ostalih grupa raspodele i ubacuje u tu
        public static void MoveStudents(int groupID, List<int> students)
        {
            using (RasporedContext _context = new RasporedContext())
            {
                foreach (int stud in students)
                {
                    Student.MoveToGroup(stud, groupID, _context);
                }
                _context.SaveChanges();
            }
        }

        public static bool AddStudnets(int groupID, List<int> students)
        {
            using (RasporedContext _context = new RasporedContext())
            {

                //proverava da li su neki vec clanovi te grupe
                CheckIfMembers(groupID, students);

                //provera konzistentnost sa ostalim grupama
                CheckConsistencyWithOtherGroups(groupID, students);

                //proverava da li su studenti slobodni u vreme kada grupa ima cas
                CheckIfStudentsAreAveilable(groupID, students);


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

        //proverava da li su studenti slobodni u vreme kada grupa ima cas
        public static bool CheckIfStudentsAreAveilable(int groupID, List<int> students)
        {
            using (RasporedContext _context = new RasporedContext())
            {
                var groupTs = _context.Groups.First(a => a.groupID == groupID).timeSpan;
                if (groupTs == null)
                    return true;

                return Student.CheckIfAvailable(groupTs, students, groupID);
            }
        }

        //proverava da li je neko od studenata iz students vec clan grupe groupID
        public static bool CheckIfMembers(int groupID, List<int> students)
        {
            using (RasporedContext _context = new RasporedContext())
            {
                var alreadyInGroup = _context.GroupsStudents
                    .Where(a => a.groupID == groupID && students.Contains(a.studentID))
                    .Select(a => a.student.UniMembers.name + " " + a.student.UniMembers.surname).ToList();
                if (alreadyInGroup.Any())
                {
                    string exp = alreadyInGroup.Count > 1
                        ? "Studenti su vec clanovi grupe.\n"
                        : "Student je vec clan grupe.\n";
                    exp += alreadyInGroup.Concat("\n");
                    throw new InconsistentDivisionException(exp);
                }

                return true;
            }
        }

        //proverava da li svi studenti te grupe nisu clanovi neke druge grupe te raspodele
        //groupID moze da bude null u slucaju provere prilikom kreiranja nove grupe
        public static bool CheckConsistencyWithOtherGroups(int? groupID, List<int> students, RasporedContext _context = null)
        {
            _context = _context ?? new RasporedContext();
            
            //proverava studente u ostalim grupama raspodele

            var groups =
                _context.Groups.Where(
                    a => (groupID == null || a.groupID != groupID) && //bez te konkrentne grupe
                    a.divisionID == _context.Groups.First(g => g.groupID == groupID).divisionID) //sve grupe raspodele kojo ta grupa pripada
                    .Select(a => a.groupID).ToList();

            //studenti koji pripadaju tim grupama, kao i grupe
            var studentsGroups = _context.GroupsStudents.Where(a => groups.Contains(a.groupID)).Select(a => new {student = a.studentID, grupa = a.group.name}).ToList(); 
            var studs = studentsGroups.Select(a => a.student);
            //proverava da li za svakog studenta vazi da nije u studs odnosno ne pripada ni jednoj drugoj grupi
            if (students.Any(stud => studs.Contains(stud)))
            {
                var inconsistants = _context.Students
                    .Where(stud => students.Contains(stud.studentID) && studs.Contains(stud.studentID))
                    .Select(a=> a.UniMembers.name + " " + a.UniMembers.surname + " pripada grupi " + studentsGroups.First(sg=> sg.student == a.studentID).grupa)
                    .ToList();
                string exp = inconsistants.Count > 1 ? "Studenti pripadaju drugim grupama raspodele. " : "Student pripada drugoj grupi raspodele. ";
                exp += inconsistants.Concat("\n");
                throw new InconsistentDivisionException(exp);
            }
            else
            {
                return true;
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

        // groupa groupID ima novu listu studenata newStudents
        public static void ChangeStudents(int groupID, List<int> newStudents)
        {
            // izbaci sve studente iz grupe
            RemoveAllStudents(groupID);
            // ubaci studente iz liste, njih prethodno izbaci iz svih ostalih grupa raspodele
            MoveStudents(groupID, newStudents);
        }

        public static void Update(int groupID, string name, int? classroomID, TimeSpans timespan)
        {
            using (RasporedContext _context = new RasporedContext())
            {
                //provera da li je ucionica slobodna u to vreme, bacice exeption ako nije
                if (classroomID != null && timespan != null)
                {
                    Classroom.CheckIfAvailable(classroomID.Value, timespan, groupID);
                }

                //provera da li su svi studenti slobodni u to vreme, bacice exeption ako nisu
                var studs = _context.GroupsStudents.Where(a => a.groupID == groupID).Select(a => a.studentID).ToList();
                Student.CheckIfAvailable(timespan, studs, groupID);

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

                //provera da li je ucionica slobodna u to vreme
                if (classroomID != null)
                {
                    Classroom.CheckIfAvailable(classroomID.Value, timespan);
                }

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

        public static void AddActivity(int assistantID, int groupID, int? classroomID, TimeSpans timeSpan, string place,
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
                    assistantID = assistantID,
                };
                _context.Activities.Add(act);
                _context.SaveChanges();
            }
        }

        // vraca vreme kada grupa ima cas u naredne 4 nedelje
        public static IEnumerable GetActivityTimes(int groupID)
        {
            using (RasporedContext _context = new RasporedContext())
            {
                TimeSpans groupTs = _context.Groups.Where(a => a.groupID == groupID).Select(a=> a.timeSpan).First();
                if (groupTs == null)
                    return null;
                int period = groupTs.period ?? 1;
                List<TimeSpans> returnValue = new List<TimeSpans>();
                for (int i = 0; i < 4; i++)
                {
                    TimeSpans ts = new TimeSpans
                    {
                        startDate = groupTs.startDate.DayOfReferencedWeek(DateTime.Now.AddDays(7*i), period),
                        endDate = groupTs.endDate.DayOfReferencedWeek(DateTime.Now.AddDays(7 * i), period)
                    };
                    returnValue.Add(ts);
                }

                return returnValue;
            }
        }

        public static void SetAsstant(int groupID, int assistantID)
        {
            using (RasporedContext _context = new RasporedContext())
            {
                var group = _context.Groups.First(a => a.groupID == groupID);
                group.assistantID = assistantID;

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
                var query = _context.Groups.Where(a => a.groupID == groupID)
                        .Select(a => a.assistant.name + " " + a.assistant.surname);
                if (query.Any())
                    return query.First();
                else
                    return "";

            }
        }

        // vraca termine ostalih grupa raspodele
        public static List<BulletinBoardChoice> GetAllBulletinBoardChoices(int groupID)
        {
            using (RasporedContext _context = new RasporedContext())
            {

                return _context.Groups.Where(a => a.groupID != groupID &&
                                                a.divisionID == _context.Groups.First(g => g.groupID == groupID).divisionID)
                                                .Select(a => new BulletinBoardChoice
                                                {
                                                    groupID = a.groupID,
                                                    time = TimeSpan.ToString(a.timeSpan),
                                                    classroom = a.classroom.number
                                                }).ToList();
            }
        }

        // vraca oglase koji odgovaraju studentu iz grupe groupID (sa kojima bi mogo da se menja)
        public static List<BulletinBoardChoice> GetPossibleBulletinBoardChoices(int groupID)
        {
            using (RasporedContext _context = new RasporedContext())
            {
                return _context.Periods.Where(a => a.groupID == groupID).Select(a=> new BulletinBoardChoice
                {
                    adID  = a.adID,
                    time = TimeSpan.ToString(a.ad.group.timeSpan),
                    classroom = a.ad.group.classroom.number,
                    studentName = Student.GetStudentName(a.ad.studentID)
                }).ToList();
            }
        }

        // menja studenta sa onim koji je postavio oglas koji mu odgovara
        public static void ExchangeStudents(int studentID, int groupID, int adID)
        {
            using (RasporedContext _context = new RasporedContext())
            {

                var transaction = _context.Database.BeginTransaction();
                try
                {
                    Ads ad = _context.Ads.First(a => a.adID == adID);
                    Student.MoveToGroup(studentID, ad.groupID, _context);
                    Student.MoveToGroup(ad.studentID, groupID, _context);
                    RemoveAd(ad.adID, _context);
                    _context.SaveChanges();
                    transaction.Commit();
                }
                catch (InconsistentDivisionException ex)
                {
                    transaction.Rollback();
                    throw ex;
                }
              
            }
        }

        public static void RemoveAd(int adID, RasporedContext _context = null)
        {
            _context = _context ?? new RasporedContext();
            var ad = _context.Ads.Include(a => a.Periods).First(a => a.adID == adID);
            foreach (var period in ad.Periods)
            {
                _context.Remove(period);
            }
            _context.SaveChanges();
            _context.Ads.Remove(ad);
            _context.SaveChanges();
        }

        // student iz grupe groupID dodaje oglas i odgovaraju mu termini grupa iz liste
        public static void AddAd(int studentID, int groupID, List<int> groupIDs)
        {
            using (RasporedContext _context = new RasporedContext())
            {
                Ads ad = new Ads
                {
                    studentID = studentID,
                    groupID = groupID
                };
                _context.Ads.Add(ad);

                foreach (int g in groupIDs)
                {
                    Periods p = new Periods
                    {
                        adID = ad.adID,
                        groupID = g
                    };
                    _context.Periods.Add(p);
                }
                _context.SaveChanges();
            }
        }


        // zbog linq izraza koji mi ne daje da pozvem funkciju koja ima optional parameter
        public static bool IsActive(int groupID, TimeSpans tsNow)
        {
            return IsActive(groupID, tsNow, null);
        }

        public static bool IsActive(int groupID, TimeSpans tsNow, int? studentID = null)
        {
            using (RasporedContext _context = new RasporedContext())
            {
                bool canceled =  _context.Activities.Any(ac =>
                    !IsStudentActivity(ac.activityID) && // nece ako se ovde direktno ispita
                    ac.groupID == groupID && ac.cancelling != null && ac.cancelling.Value &&
                    TimeSpan.TimeSpanOverlap(ac.timeSpan, tsNow));
                return !canceled;

            }
        }

        // nece ako se stavi u linq izraz
        public static bool IsStudentActivity(int activityID)
        {
            using (RasporedContext _context = new RasporedContext())
            {
                return _context.StudentsActivities.Any(sa => sa.activityID == activityID);
            }
        }

        public static List<NotificationDTO> GetNotifications(int groupID, TimeSpans ts)
        {
            using (RasporedContext _context = new RasporedContext())
            {
               List<NotificationDTO> groupsNotifications = _context.Activities.Where(ac =>
                    !IsStudentActivity(ac.activityID) && // nece ako se ovde direktno ispita
                    ac.groupID == groupID &&
                    TimeSpan.TimeSpanOverlap(ac.timeSpan, ts))
                    .Select(ac => new NotificationDTO
                    {
                        activityID = ac.activityID,
                        activityContent = ac.activityContent,
                        title = ac.title,
                        classroomID = ac.classroomID,
                        place = ac.place
                    }).ToList();

                return groupsNotifications;
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
                
                List<ScheduleDTO> groupsSchedule = _context.Groups.Where(a => groups.Contains(a.groupID) && TimeSpan.Overlap(a.timeSpan, tsNow))
                    .Select(a => new ScheduleDTO
                        {
                            day = a.timeSpan.startDate.DayOfWeek,
                            startMinutes = (int)a.timeSpan.startDate.TimeOfDay.TotalMinutes,
                            durationMinutes = (int)(a.timeSpan.endDate.Subtract(a.timeSpan.startDate)).TotalMinutes,
                            className = a.division.course.name,
                            abbr = a.division.course.alias,
                            classroom = a.classroom.number,
                            assistant = GetAssistant(a.groupID),
                            type = a.division.divisionType.type,
                            active = IsActive(a.groupID, tsNow),
                            color = Schedule.GetNextColor(),
                            isClass = true,
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
                        activityContent = a.activityContent,
                        isClass = false,
                    }).ToList();

                List<ScheduleDTO> returnValue = groupsSchedule.Concat(activitiesSchedule).ToList();


                return Schedule.Convert(returnValue);

            }
        }
    }
}
