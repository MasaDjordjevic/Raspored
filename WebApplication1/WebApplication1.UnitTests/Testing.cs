﻿using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using Microsoft.Data.Entity;
using Microsoft.Data.Entity.Infrastructure;
using WebApplication1.Controllers;
using WebApplication1.Exceptions;
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
            var groups = WebApplication1.Data.Division.DivideOnX(10, 2, 0);

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
        
        [Fact]
        public void trenutnoNeRadi()
        {
            RasporedContext _context = new RasporedContext();
            var divisionID = 1005;
            var pom =  _context.Groups
              .Include(a => a.classroom)
              .Include(a => a.timeSpan)
              .Where(a => a.divisionID == divisionID)
              .OrderBy(a => a.name)//.ThenBy(a=>a.classroom.number)
              .ToList();
        }

        [Fact]
        public void GetAssistant()
        {
            string a = WebApplication1.Data.Group.GetAssistant(3);
        }

        [Fact]
        public void ClassroomSchedule()
        {
            int classroomID = 12;
            TimeSpans ts = new TimeSpans
            {
                startDate = new DateTime(2016, 6, 1, 8, 30, 0),
                endDate = new DateTime(2016, 6, 1, 8, 30, 0),
                period = 0
            };
            Assert.Equal(false, WebApplication1.Data.Classroom.CheckIfAvailable(classroomID, ts));

            ts.startDate = new DateTime(2016,6,1,10,0,0);
            ts.endDate = new DateTime(2016, 6, 1, 10, 0, 0);

            Assert.Equal(true, WebApplication1.Data.Classroom.CheckIfAvailable(classroomID, ts));

            ts.startDate = new DateTime(2016, 6, 3, 9, 30, 0);
            ts.endDate = new DateTime(2016, 6, 3, 10, 0, 0);

            Assert.Equal(true, WebApplication1.Data.Classroom.CheckIfAvailable(classroomID, ts));
            

        }

        [Fact]
        public void StudentAvailable()
        {
            int studentID = 2951;
            TimeSpans ts = new TimeSpans
            {
                startDate = new DateTime(2016, 6, 1, 8, 30, 0),
                endDate = new DateTime(2016, 6, 1, 8, 30, 0),
                period = 0
            };
            Assert.Equal(false, WebApplication1.Data.Student.CheckIfAvailable(studentID, ts));

            ts.startDate = new DateTime(2016, 6, 1, 10, 0, 0);
            ts.endDate = new DateTime(2016, 6, 1, 10, 0, 0);

            Assert.Equal(true, WebApplication1.Data.Student.CheckIfAvailable(studentID, ts));

            ts.startDate = new DateTime(2016, 6, 3, 9, 30, 0);
            ts.endDate = new DateTime(2016, 6, 3, 10, 0, 0);

            Assert.Equal(true, WebApplication1.Data.Student.CheckIfAvailable(studentID, ts));

            ts.startDate = new DateTime(2016, 6, 4, 11, 30, 0);
            ts.endDate = new DateTime(2016, 6, 4, 11, 0, 0);

            Assert.Equal(false, WebApplication1.Data.Student.CheckIfAvailable(studentID, ts));

            ts.startDate = new DateTime(2016, 6, 11, 11, 30, 0);
            ts.endDate = new DateTime(2016, 6, 11, 11, 0, 0);

            Assert.Equal(true, WebApplication1.Data.Student.CheckIfAvailable(studentID, ts));
        }

        [Fact]
        public void StartEndOfWeek()
        {
            DateTime now = new DateTime(2016, 5, 30, 8, 30, 0);
            
            TimeSpans solution = new TimeSpans
            {
                startDate = new DateTime(2016, 5, 30),
                endDate = new DateTime(2016, 6, 5),
            };

            for (int i = 0; i < 6; i++)
            {
                now = now.AddDays(1);
                TimeSpans tsNow = new TimeSpans
                {
                    startDate = now.StartOfWeek(),
                    endDate = now.EndOfWeek()
                };
                Assert.Equal(tsNow.startDate, solution.startDate);
                Assert.Equal(tsNow.endDate, solution.endDate);
            }
        }

        [Fact]
        public void AddStudentToGroup()
        {
            int studentID = 2951;
            //int groupID = 1031; // vec je u grupi
            //int groupID = 1032; // druga grupa te raspodele
            int groupID = 1021; // grupa neke druge raspodele
            try
            {
                WebApplication1.Data.Student.AddToGroup(studentID, groupID);

            }
            catch (InconsistentDivisionException ex)
            {
                string s = ex.Message;
            }
        }

        [Fact]
        public void GetHM()
        {
            string test = "09:15";
            TimeSpan ts = WebApplication1.Data.TimeSpan.convertHM(test);
            TimeSpan res = new TimeSpan(09,15,0);
            Assert.Equal(ts, res);
        }

        [Fact]
        public void ConvertToTimeSpan()
        {
            GroupsController.TimeSpanBinding bind = new GroupsController.TimeSpanBinding
            {
                startDate = new DateTime(2016, 2, 17, 08, 15, 00),
                endDate = new DateTime(2016, 2, 17, 09, 15, 00),
                period = 1,
                dayOfWeek = 2,
                timeStart = "08:45",
                timeEnd = "09:20"
            };
            TimeSpans ts = WebApplication1.Data.TimeSpan.getTimeSpan(bind);
            TimeSpans res = new TimeSpans
            {
                startDate = new DateTime(2016, 2, 16, 8, 45, 0),
                endDate = new DateTime(2016, 2, 16, 9, 20, 0),
                period = 1
            };
            Assert.Equal(ts.startDate,res.startDate);
            Assert.Equal(ts.endDate, res.endDate);
            Assert.Equal(ts.period, res.period);
        }

        [Fact]
        public void DateToString()
        {
            DateTime date = new DateTime(2016, 2, 16, 16, 15, 0);
            string ret = date.ToStr();
        }

        [Fact]
        public void Colors()
        {
            string c1 = WebApplication1.Data.Schedule.GetNextColor("Laza");
            string c2 = WebApplication1.Data.Schedule.GetNextColor("Masa    ");
            string c3 = WebApplication1.Data.Schedule.GetNextColor("Pera");
            string c4 = WebApplication1.Data.Schedule.GetNextColor("Mika");
            string c5 = WebApplication1.Data.Schedule.GetNextColor("Programski jezici");
            string c6 = WebApplication1.Data.Schedule.GetNextColor("nesto sdafjsjdf sajdkf askj");
        }
    }
}
