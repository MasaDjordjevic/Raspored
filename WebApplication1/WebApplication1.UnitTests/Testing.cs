using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Data.Entity;
using Microsoft.Data.Entity.Infrastructure;
using WebApplication1.Controllers;
using Xunit;
using WebApplication1.Extentions;
using WebApplication1.Models;

namespace MyFirstDnxUnitTests
{
    public class Testing
    {
        [Fact]
        public void PassingTest()
        {
            Assert.Equal(4, Add(2, 2));
        }

        //[Fact]
        //public void FailingTest()
        //{
        //    Assert.Equal(5, Add(2, 2));
        //}

        int Add(int x, int y)
        {
            return x + y;
        }

        [Fact]
        public void DayOfCurrentWeekExtention()
        {
            DateTime d = new DateTime(2016, 4, 12);
            DateTime newD = d.DayOfCurrentWeek();

        }

        [Fact]
        public void TimeSpanOverlapBasic1()
        {
            TimeSpans a = new TimeSpans();
            a.startDate = new DateTime(2016,3,5, 18,30,0);
            a.endDate = new DateTime(2016,3,5 ,20,0,0);
            a.period = null;

            TimeSpans b = new TimeSpans();
            b.startDate = new DateTime(2016, 3, 5, 19, 0, 0);
            b.endDate = new DateTime(2016, 3, 5, 20, 30, 0);
            b.period = null;

            
            Assert.Equal(true, WebApplication1.Data.TimeSpan.Overlap(a, b));
        }

        [Fact]
        public void TimeSpanOverlapBasic2()
        {
            TimeSpans a = new TimeSpans();
            a.startDate = new DateTime(2016, 3, 5, 12, 30, 0);
            a.endDate = new DateTime(2016, 3, 5, 13, 0, 0);
            a.period = null;

            TimeSpans b = new TimeSpans();
            b.startDate = new DateTime(2016, 3, 5, 19, 0, 0);
            b.endDate = new DateTime(2016, 3, 5, 20, 30, 0);
            b.period = null;

            Assert.Equal(false, WebApplication1.Data.TimeSpan.Overlap(a, b));
        }

        [Fact]
        public void TimeSpanOverlapA1()
        {
            TimeSpans a = new TimeSpans();
            a.startDate = new DateTime(2016, 3, 5, 12, 30, 0);
            a.endDate = new DateTime(2016, 3, 5, 13, 0, 0);
            a.period = 1;

            TimeSpans b = new TimeSpans();
            b.startDate = new DateTime(2016, 3, 5, 19, 0, 0);
            b.endDate = new DateTime(2016, 3, 5, 20, 30, 0);
            b.period = null;

            Assert.Equal(false, WebApplication1.Data.TimeSpan.Overlap(a, b));
        }

        [Fact]
        public void TimeSpanOverlapA2()
        {
            TimeSpans a = new TimeSpans();
            a.startDate = new DateTime(2016, 3, 5, 12, 30, 0);
            a.endDate = new DateTime(2016, 3, 5, 13, 0, 0);
            a.period = 1;

            TimeSpans b = new TimeSpans();
            b.startDate = new DateTime(2016, 3, 5, 19, 0, 0);
            b.endDate = new DateTime(2016, 3, 5, 20, 30, 0);
            b.period = 1;

            Assert.Equal(false, WebApplication1.Data.TimeSpan.Overlap(a, b));
        }

        [Fact]
        public void TimeSpanOverlapA3()
        {
            TimeSpans a = new TimeSpans();
            a.startDate = new DateTime(2016, 3, 5, 12, 30, 0);
            a.endDate = new DateTime(2016, 3, 5, 13, 0, 0);
            a.period = 1;

            TimeSpans b = new TimeSpans();
            b.startDate = new DateTime(2016, 3, 8, 19, 0, 0);
            b.endDate = new DateTime(2016, 3, 8, 20, 30, 0);
            b.period = 1;

            Assert.Equal(false, WebApplication1.Data.TimeSpan.Overlap(a, b));
        }

        [Fact]
        public void TimeSpanOverlapAdvanced1()
        {
            TimeSpans a = new TimeSpans();
            a.startDate = new DateTime(2016, 3, 5, 18, 30, 0);
            a.endDate = new DateTime(2016, 3, 5, 20, 0, 0);
            a.period = 1;

            TimeSpans b = new TimeSpans();
            b.startDate = new DateTime(2016, 3, 5, 19, 0, 0);
            b.endDate = new DateTime(2016, 3, 5, 20, 30, 0);
            b.period = 1;

            Assert.Equal(true, WebApplication1.Data.TimeSpan.Overlap(a, b));
        }


        [Fact]
        public void TimeSpanOverlapAdvanced2()
        {
            TimeSpans a = new TimeSpans();
            a.startDate = new DateTime(2016, 5, 2, 18, 30, 0);
            a.endDate = new DateTime(2016, 5, 2, 20, 0, 0);
            a.period = 1;
            
            TimeSpans b = new TimeSpans();
            b.startDate = new DateTime(2016, 5, 9, 19, 0, 0);
            b.endDate = new DateTime(2016, 5, 9, 20, 30, 0);
            b.period = 2;

            Assert.Equal(true, WebApplication1.Data.TimeSpan.Overlap(a, b));
        }


        [Fact]
        public void TimeSpanOverlapAdvanced3()
        {
            TimeSpans a = new TimeSpans();
            a.startDate = new DateTime(2016, 5, 12, 18, 30, 0);
            a.endDate = new DateTime(2016, 5, 12, 20, 0, 0);
            a.period = null;

            TimeSpans b = new TimeSpans();
            b.startDate = new DateTime(2016, 4, 28, 19, 0, 0);
            b.endDate = new DateTime(2016, 5, 2, 20, 30, 0);
            b.period = 2;

            Assert.Equal(true, WebApplication1.Data.TimeSpan.Overlap(a, b));
        }

        [Fact]
        public void GetDivsionsOfDepartentByType()
        {
            var divisions = WebApplication1.Data.Division.GetDivisionsOfDeparmentByType(3);

        }

        [Fact]
        public void DevideOnX()
        {
            var groups = WebApplication1.Data.Division.DevadeOnX(10, 2, 0);

        }

        [Fact]
        public void student()
        {
            RasporedContext _context = new RasporedContext();
            Students s = _context.Students.Include(a=> a.UniMembers).Single(a => a.studentID == 2);
            var uni = s.UniMembers;

        }

        [Fact]
        public void studentsOfGroup()
        {
            var s = WebApplication1.Data.Student.GetStudentsOfGroup(8);
        }
    }
}
