using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Remotion.Linq.Utilities;
using WebApplication1.Extentions;
using WebApplication1.Models;

namespace WebApplication1.Data
{
    public static class Classroom
    {
        public static IEnumerable GetSchedule(int classroomID, int weeksFromNow = 0)
        {
            using (RasporedContext _context = new RasporedContext())
            {
                DateTime now = DateTime.Now.AddDays(7*weeksFromNow);
                TimeSpans tsNow = new TimeSpans
                {
                    startDate = now.StartOfWeek(),
                    endDate = now.EndOfWeek()
                };

                List<int> groups = _context.Groups
                    .Where(a => a.classroomID == classroomID &&
                                TimeSpan.DatesOverlap(a.division.beginning, a.division.ending, tsNow.startDate,
                                    tsNow.endDate)) //provera da li raspodela kojoj grupa pripada i dalje vazi
                    .Select(a => a.groupID).ToList();

                List<ScheduleDTO> groupsSchedule =
                    _context.Groups.Where(a => groups.Contains(a.groupID) && TimeSpan.Overlap(a.timeSpan, tsNow))
                        .Select(a => new ScheduleDTO
                        {
                            day = a.timeSpan.startDate.DayOfWeek,
                            startMinutes = (int) a.timeSpan.startDate.TimeOfDay.TotalMinutes,
                            durationMinutes = (int) (a.timeSpan.endDate.Subtract(a.timeSpan.startDate)).TotalMinutes,
                            className = a.division.course.name + " " + a.name,
                            abbr = a.name + " " + a.division.course.alias,
                            classroom = a.classroom.number,
                            assistant = Group.GetAssistant(a.groupID),
                            type = a.division.divisionType.type,
                            active = Group.GetActive(a.groupID, tsNow),
                            color = Schedule.GetNextColor(),
                        }).ToList();

                List<ScheduleDTO> activitiesSchedule =
                    _context.Activities.Where(a => a.classroomID == classroomID).Select(a => new ScheduleDTO
                    {
                        day = a.timeSpan.startDate.DayOfWeek,
                        startMinutes = (int) a.timeSpan.startDate.TimeOfDay.TotalMinutes,
                        durationMinutes = (int) (a.timeSpan.endDate.Subtract(a.timeSpan.startDate)).TotalMinutes,
                        active = true,
                        color = Schedule.GetNextColor(),
                        activityTitle = a.title,
                        activityContent = a.activityContent
                    }).ToList();

                List<ScheduleDTO> returnValue = groupsSchedule.Concat(activitiesSchedule).ToList();


                return Schedule.Convert(returnValue);
            }
        }

        public static bool CheckIfAveable(int classroomID, TimeSpans ts)
        {
            using (RasporedContext _context = new RasporedContext())
            {
                List<TimeSpans> groupsSchedule = _context.Groups
                    .Where(a => a.classroomID == classroomID &&
                                TimeSpan.DatesOverlap(a.division.beginning, a.division.ending, ts.startDate,ts.endDate)
                                     && Group.GetActive(a.groupID, ts)) //provera da li raspodela kojoj grupa pripada i dalje vazi_
                        .Select(a => a.timeSpan).ToList();

                List<TimeSpans> activitiesSchedule =
                    _context.Activities.Where(a => a.classroomID == classroomID).Select(a => a.timeSpan).ToList();

                List<TimeSpans> schedule = groupsSchedule.Concat(activitiesSchedule).ToList();

                return schedule.All(timespan => !TimeSpan.Overlap(timespan, ts));
            }
        }
        
    }
}
