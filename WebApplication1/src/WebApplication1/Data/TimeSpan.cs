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
        public static bool Overlap(TimeSpans a, TimeSpans b)
        {
            if (a.period == null && b.period == null)
                return DatesOverlap(a.startDate, a.endDate, b.startDate, b.endDate);

            if (a.period != null)
            {
                a.startDate = a.startDate.DayOfReferencedWeek(b.startDate, a.period.Value);
                a.endDate = a.endDate.DayOfReferencedWeek(b.endDate, a.period.Value);
            }

            if (b.period != null)
            {
                b.startDate = b.startDate.DayOfReferencedWeek(a.startDate, b.period.Value);
                b.endDate = b.endDate.DayOfReferencedWeek(a.endDate, b.period.Value);
            }

            return DatesOverlap(a.startDate, a.endDate, b.startDate, b.endDate);
        }

        public static bool DatesOverlap(DateTime aStart, DateTime aEnd, DateTime bStart, DateTime bEnd)
        {
            return ((aStart <= bStart && bStart <= aEnd) || (bStart <= aStart && aStart <= bEnd));
        }

        public static bool Equal(TimeSpans a, TimeSpans b)
        {
            return a.startDate == b.startDate && a.endDate == b.endDate;
        }
    }
}
