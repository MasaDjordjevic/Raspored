using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using WebApplication1.Models;

namespace WebApplication1.Data
{
    public class NotificationDTO
    {
        public int activityID { get; set; }
        public string title { get; set; }
        public string activityContent { get; set; }
        public string place { get; set; }   
        public int? classroomID { get; set; }
    }

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
        public List<NotificationDTO> notifications { get; set; }

        //activity
        public int activityID { get; set; }
        public string activityTitle { get; set; }
        public string activityContent { get; set; }

        //global activity
        public string place { get; set; }
        

    }

    public static class Schedule
    {
        private static int colorCounter = -1;

        public static string GetNextColor(string name)
        {
            string[] boje = new string[] {
                "MaterialRed",
                "MaterialPurple",
                "MaterialPink",
                "MaterialDeep-purple",
                "MaterialLight-green",
                "MaterialOrange",
                "MaterialBlue",
                "MaterialLight-blue",
                "MaterialLime",
                "MaterialGreen",
                "MaterialTeal",
                "MaterialBrown"
            };

            colorCounter++;
            if (colorCounter == boje.Length)
                colorCounter = 0;
            int num = 7;
            foreach (char c in name)
            {
                /*num = num*11 + Math.Abs(
                    (c+1) * (c-1) +
                    (int)Math.Round( (double) ( (double)c / 17.00) )
                );*/
                num = (num * 33) + c * 12;
            }
            num *= num;
            num = Math.Abs(num);
            num = (num % 101) % boje.Length;

            if (name.StartsWith("Mik")) {
                num = 0;
            }

            return boje[num];

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
