using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
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
                ;
                var returnValue = _context.Groups.Where(a => groups.Contains(a.groupID) && Student.CheckPeriod(a.timeSpan, tsNow))
                        .Select(a => new
                        {
                            day = a.timeSpan.startDate.DayOfWeek,
                            startMinutes = (int)a.timeSpan.startDate.TimeOfDay.TotalMinutes,
                            durationMinutes = (int)(a.timeSpan.endDate.Subtract(a.timeSpan.startDate)).TotalMinutes,
                            className = a.division.course.name + " " + a.name,
                            abbr = a.name + " " + a.division.course.alias,
                            classroom = a.classroom.number,
                            assistant = Student.GetAssistant(a.groupID),
                            type = a.division.divisionType.type,
                            active = Student.GetCanceling(a.groupID, tsNow),
                            color = Student.GetNextColor(),
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

    }
}
