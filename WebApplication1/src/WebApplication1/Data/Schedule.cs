using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using WebApplication1.Models;

namespace WebApplication1.Data
{
    public class ScheduleDTO
    {
        public DayOfWeek day { get; set; }
        public int startMinutes { get; set; }
        public int durationMinutes { get; set; }
        public bool active { get; set; }
        public string color { get; set; }
        public bool isClass { get; set; }

        //class
        public int groupID { get; set; }
        public string className { get; set; }
        public string abbr { get; set; }
        public string classroom { get; set; }
        public string assistant { get; set; }
        public string type { get; set; }

        //activity
        public int activityID { get; set; }
        public string activityTitle { get; set; }
        public string activityContent { get; set; }

    }

    public static class Schedule
    {
        private static int colorCounter = -1;

        public static string GetNextColor()
        {
            string[] boje = new string[] { "#f44336", "#673AB7", "#2196F3", "#8BC34A", "#FFC107" };

            colorCounter++;
            if (colorCounter == boje.Length)
                colorCounter = 0;

            return boje[colorCounter];

        }

        // prebacuje raspod kao skup casova u raspored po danima u nedelji
        public static IEnumerable Convert(List<ScheduleDTO> schedule)
        {
            var ret = new ArrayList();

            var daysOfWeek = Enum.GetValues(typeof(DayOfWeek))
                            .OfType<DayOfWeek>()
                            .OrderBy(day => day < DayOfWeek.Monday);

            // svaki dan mora da postoji bez obzira da li ima casova u njemu
            foreach (DayOfWeek day in daysOfWeek)
            {
                ret.Add(
                    (from a in schedule where a.day == day select a).ToArray()
                    );
            }

            return ret;
        }

        public static Object GetCurrentSemesterTimeSpan()
        {
            using (RasporedContext _context = new RasporedContext())
            {
                return
                    _context.ActivitySchedules.Where(a => a.beginning <= DateTime.Now && DateTime.Now <= a.ending)
                        .Select(a => new 
                        {
                            beginning = a.beginning,
                            ending = a.ending,
                        }).First();

            }
        }
    }
}
