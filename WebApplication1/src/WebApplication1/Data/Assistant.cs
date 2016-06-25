using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebApplication1.Extentions;
using WebApplication1.Models;

namespace WebApplication1.Data
{
    public static class Assistant
    {
        public static IEnumerable GetAllAssistants()
        {
            using (RasporedContext _context = new RasporedContext())
            {
                return _context.UniMembers.Where(a => a.studentID == null).ToList();
            }
        }

        public static Object GetAssistant(int assistantID)
        {
            using(RasporedContext _context = new RasporedContext())
            {
                return _context.UniMembers.First(a => a.uniMemberID == assistantID);
            }
        }


        //vraca asistente na osnovu grupe, ako grupa pripada raspodeli koja odgovara kursu onda vraca sve asistente zaduzene za taj kurs, inace vraca sve asistente
        public static IEnumerable GetAssistantsByGroupID(int groupID)
        {
            using (RasporedContext _context = new RasporedContext())
            {
                int? courseID = _context.Groups.Where(a => a.groupID == groupID).Select(a => a.division.courseID).First();
                if (courseID == null)
                {
                    return _context.UniMembers.Where(a => a.studentID == null).ToList();
                }
                else
                {
                    return _context.AssistantsCourses.Where(a => a.courseID == courseID.Value)
                                            .Select(a => a.assistant)
                                            .ToList();
                }
            }
        }

        public static IEnumerable GetSchedule(int assistantID, int weeksFromNow = 0)
        {
            using (RasporedContext _context = new RasporedContext())
            {
                DateTime now = DateTime.Now.AddDays(7 * weeksFromNow);
                TimeSpans tsNow = new TimeSpans
                {
                    startDate = now.StartOfWeek(),
                    endDate = now.EndOfWeek()
                };
                List<int> groups = _context.Groups
                    .Where(a => a.assistantID == assistantID &&
                                TimeSpan.DatesOverlap(a.division.beginning, a.division.ending, tsNow.startDate, tsNow.endDate)) //provera da li raspodela kojoj grupa pripada i dalje vazi
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
                            active = Group.IsActive(a.groupID, tsNow),
                            color = Schedule.GetNextColor(),
                            isClass = true,
                            groupID = a.groupID
                        }).ToList();

                List<ScheduleDTO> activitiesSchedule =
                    _context.Activities.Where(a => (a.assistantID == assistantID || (a.cancelling == false && groups.Contains(a.groupID.Value))
                                                    && TimeSpan.Overlap(a.timeSpan, tsNow)))
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

    }
}
