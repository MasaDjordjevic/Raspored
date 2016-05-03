using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebApplication1.Extentions
{
    public static class DateTimeExtensions
    {
        public static DateTime DayOfCurrentWeek(this DateTime date)
        {
            int diff = DateTime.Now.DayOfWeek - date.DayOfWeek;
            if (diff < 0)
            {
                diff += 7;
            }
            return DateTime.Now.AddDays(-1 * diff).Date;
        }

        //public static DateTime DayOfReferencedWeek(this DateTime date, DateTime refernce, int period)
        //{
        //    int diff = refernce.DayOfWeek - date.DayOfWeek;
        //    if (diff < 0)
        //    {
        //        diff += 7;
        //    }
        //    return refernce.AddDays(-1 * diff).Date;
        //}

        public static DateTime DayOfReferencedWeek(this DateTime date, DateTime refernce, int period)
        {
            while (date.Date < refernce.Date)
            {
                date = date.AddDays(7*period);
            }
            return date;
        }
    }
}
