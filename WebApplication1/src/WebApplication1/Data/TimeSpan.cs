using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebApplication1.Extentions;
using WebApplication1.Models;

namespace WebApplication1.Data
{
    public static class TimeSpan
    {
        public static TimeSpans Copy(TimeSpans a)
        {
            return new TimeSpans
            {
                startDate = a.startDate,
                endDate = a.endDate,
                period = a.period
            };
        }

        public static bool Overlap(TimeSpans paramA, TimeSpans paramB)
        {
            //moram da kopiram jer se prenosi po referenci
            TimeSpans a = Copy(paramA);
            TimeSpans b = Copy(paramB);

            if (a.period == null && b.period == null)
                return DatesOverlap(a.startDate, a.endDate, b.startDate, b.endDate);

            if (a.period != null && a.period > 0)
            {
                a.startDate = a.startDate.DayOfReferencedWeek(b.startDate, a.period.Value);
                a.endDate = a.endDate.DayOfReferencedWeek(b.endDate, a.period.Value);
            }

            if (b.period != null && b.period > 0)
            {
                b.startDate = b.startDate.DayOfReferencedWeek(a.startDate, b.period.Value);
                b.endDate = b.endDate.DayOfReferencedWeek(a.endDate, b.period.Value);
            }

            return TimeSpanOverlap(a,b);
        }

        public static bool DatesOverlap(DateTime aStart, DateTime aEnd, DateTime bStart, DateTime bEnd)
        {
            return ((aStart <= bStart && bStart <= aEnd) || (bStart <= aStart && aStart <= bEnd));
        }

        public static bool TimeSpanOverlap(TimeSpans a, TimeSpans b)
        {
            return DatesOverlap(a.startDate, a.endDate, b.startDate, b.endDate);
        }

        public static bool Equal(TimeSpans a, TimeSpans b)
        {
            return a.startDate == b.startDate && a.endDate == b.endDate;
        }
    }
}
