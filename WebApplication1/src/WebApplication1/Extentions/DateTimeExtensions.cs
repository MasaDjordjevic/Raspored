﻿using System;
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
            //if (diff < 0)
            //{
            //    diff += 7;
            //}
            var returnValue =  DateTime.Today.AddDays(-1 * diff).Date;
            TimeSpan timeDiff = date.TimeOfDay - returnValue.TimeOfDay;
            returnValue = returnValue.Add(timeDiff);
            return returnValue;

        }

        public static DateTime StartOfWeek(this DateTime date)
        {
            int offset = date.DayOfWeek - DayOfWeek.Monday;
            var day = date.AddDays(-offset);
            return day.Add(-day.TimeOfDay);
        }

        public static DateTime EndOfWeek(this DateTime date)
        {
            int offset = date.DayOfWeek - DayOfWeek.Sunday;
            var day = date.AddDays(offset-1);
            return day.Add(-day.TimeOfDay);
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
