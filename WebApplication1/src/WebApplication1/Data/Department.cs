using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using WebApplication1.Extentions;
using WebApplication1.Models;

namespace WebApplication1.Data
{
    public static class Department
    {
        public static IEnumerable GetDepartmentsByYear()
        {
            using (RasporedContext _context = new RasporedContext())
            {
                return (from dep in _context.Departments
                        group dep by dep.year
                   into newdeps
                        orderby newdeps.Key
                        select new { year = newdeps.Key, departments = newdeps }).ToList();
            }
        }

        public static string GetdepartmentName(int? deparmentID)
        {
            if (deparmentID == null)
                return null;
            using (RasporedContext _context = new RasporedContext())
            {
                return _context.Departments.Single(a => a.departmentID == deparmentID).departmentName;
            }
                
        }

        public static IEnumerable GetSchedule(int departmentID, int weeksFromNow = 0)
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
                    .Where(a => a.division.departmentID == departmentID &&
                                TimeSpan.DatesOverlap(a.division.beginning, a.division.ending, tsNow.startDate, tsNow.endDate)) //provera da li raspodela kojoj grupa pripada i dalje vazi
                                .Select(a => a.groupID).ToList();

                List<ScheduleDTO> returnValue = _context.Groups.Where(a => groups.Contains(a.groupID) && TimeSpan.Overlap(a.timeSpan, tsNow))
                        .Select(a => new ScheduleDTO
                        {
                            day = a.timeSpan.startDate.DayOfWeek,
                            startMinutes = (int)a.timeSpan.startDate.TimeOfDay.TotalMinutes,
                            durationMinutes = (int)(a.timeSpan.endDate.Subtract(a.timeSpan.startDate)).TotalMinutes,
                            className = a.division.course.name + " " + a.name,
                            abbr = a.name + " " + a.division.course.alias,
                            classroom = a.classroom.number,
                            assistant = Group.GetAssistant(a.groupID),
                            type = a.division.divisionType.type,
                            active = Group.IsActive(a.groupID, tsNow),
                            color = Schedule.GetNextColor(a.division.course.name + " " + a.name),
                            isClass = true,
                            groupID = a.groupID
                        }).ToList();

                return Schedule.Convert(returnValue);
            }
        }

    }
}
