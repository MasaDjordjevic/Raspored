using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.CodeAnalysis.CSharp.Syntax;
using WebApplication1.Controllers;
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

        public static TimeSpans getTimeSpan(GroupsController.TimeSpanBinding bind)
        {
            if (bind == null)
                return null;

            TimeSpans ts = new TimeSpans();
            if (bind.period == 0)
            {
                ts.period = bind.period;
                ts.startDate = bind.startDate;
                ts.endDate = bind.endDate;
                return ts;
            }
            else
            {
                //nedelja je 0
                if (bind.period == 0)
                    bind.period = 7;

                DateTime mon =  DateTime.Now.StartOfWeek();
                ts.startDate = mon.AddDays(bind.dayOfWeek.Value - 1);
                ts.endDate = ts.startDate;
                ts.startDate = ts.startDate.Add(convertHM(bind.timeStart));
                ts.endDate = ts.endDate.Add(convertHM(bind.timeEnd));
                ts.period = bind.period;
            }
            return ts;
        }

        // konvertuje HH:MM u TimeSpan
        public static System.TimeSpan convertHM(string s)
        { 
            // za svaki slucaj, iako je format fixan
            int parsePoint = s.IndexOf(":");
            int hour = Int32.Parse(s.Substring(0, parsePoint));
            int min = Int32.Parse(s.Substring(parsePoint+1));

            System.TimeSpan ts = new System.TimeSpan(hour, min, 0);
            return ts;
        }

        public static string ToString(TimeSpans ts)
        {
            var ret = ts.startDate.ToStr();
            if (ts.startDate.Date != ts.endDate.Date)
            {
                ret += " - " + ts.endDate.ToStr();
            }
            else
            {
                ret += " - " + ts.endDate.ToString("HH:mm");
            }
            return ret;
        }
    }
}
