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

        //[Fact]
        //public void popuniBazu()
        //{
        //    RasporedContext _context = new RasporedContext();

        //    int indeks = 11012;

        //    for (int i = 0; i < 170; i++)
        //    {
        //        Students stud = new Students
        //        {
        //            indexNumber = indeks++,
        //            departmentID = 9
        //        };
        //        _context.Students.Add(stud);
        //    }

        //    //druga

        //    indeks = 12000;

        //    for (int i = 0; i < 54; i++)
        //    {
        //        Students stud = new Students
        //        {
        //            indexNumber = indeks++,
        //            departmentID = 20
        //        };
        //        _context.Students.Add(stud);
        //    }

         

        //    for (int i = 0; i < 130; i++)
        //    {
        //        Students stud = new Students
        //        {
        //            indexNumber = indeks++,
        //            departmentID = 3
        //        };
        //        _context.Students.Add(stud);
        //    }

            


        //    //treca

        //    indeks = 13520;

        //    for (int i = 0; i < 103; i++)
        //    {
        //        Students stud = new Students
        //        {
        //            indexNumber = indeks++,
        //            departmentID = 1
        //        };
        //        _context.Students.Add(stud);
        //    }

        //    for (int i = 0; i < 32; i++)
        //    {
        //        Students stud = new Students
        //        {
        //            indexNumber = indeks++,
        //            departmentID = 18
        //        };
        //        _context.Students.Add(stud);
        //    }

        //    //cetvrta 

        //    indeks = 15007;

        //    for (int i = 0; i < 20; i++)
        //    {
        //        Students stud = new Students
        //        {
        //            indexNumber = indeks++,
        //            departmentID = 10
        //        };
        //        _context.Students.Add(stud);
        //    }

            

           
        //    for (int i = 0; i < 20; i++)
        //    {
        //        Students stud = new Students
        //        {
        //            indexNumber = indeks++,
        //            departmentID = 19
        //        };
        //        _context.Students.Add(stud);
        //    }

        //    _context.SaveChanges();
        //}

        //[Fact]
        //public void srediBazu()
        //{
        //    RasporedContext _context = new RasporedContext();

        //    var pom = _context.UniMembers.Select(a => a.studentID).ToList();
        //    var studs =  _context.Students.Where(a => !pom.Contains(a.studentID)).ToList();

        //    foreach (var stud in studs)
        //    {
        //        _context.Students.Remove(stud);
        //    }
        //    _context.SaveChanges();
        //}

        //[Fact]
        //public void srediBazu2()
        //{
        //    RasporedContext _context = new RasporedContext();
        //    Random rnd = new Random();
        //    List<Courses> cours = _context.Courses.ToList();
        //    foreach (Courses cour in cours)
        //    {
        //        List<Students> studs = _context.Students.Where(a => a.departmentID == cour.departmentID).ToList();
        //        foreach (Students stud in studs)
        //        {
                    
        //            StudentsCourses sc = new StudentsCourses
        //            {
        //                studentID = stud.studentID,
        //                courseID = cour.courseID,
        //            };
        //            _context.StudentsCourses.Add(sc);
                    
                 
        //        }
        //    }
        //    _context.SaveChanges();

        //}

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

        //[Fact]
        //public void srediBazu3()
        //{
        //    RasporedContext _context = new RasporedContext();
        //    var studs = _context.Students.ToList();
        //    int indeks = 16000;
        //    foreach (var stud in studs)
        //    {
        //        var q = _context.Students.Where(a => a.studentID != stud.studentID && a.indexNumber == stud.indexNumber);
        //        if (q.Any())
        //        {
        //            foreach (Students s in q)
        //            {
                        
        //                s.indexNumber = indeks++;
        //            }
        //        }
        //    }
        //    _context.SaveChanges();

        //}

        //[Fact]
        //public void srediBazu4()
        //{
        //    RasporedContext _context = new RasporedContext();
        //    var unis = _context.UniMembers.ToList();
          
        //    foreach (var uni in unis)
        //    {
        //        var q = _context.UniMembers.Where(a => a.uniMemberID != uni.uniMemberID && a.username == uni.username);
        //        if (q.Any())
        //        {
        //            int indeks = 1;
        //            foreach (UniMembers u in q)
        //            {
        //                u.username = u.username + (indeks++).ToString();
        //            }
        //        }
        //    }
        //    _context.SaveChanges();

        //}

        [Fact]
        public void GetAssistant()
        {
            string a = WebApplication1.Data.Student.GetAssistant(3);
        }
    }
}
