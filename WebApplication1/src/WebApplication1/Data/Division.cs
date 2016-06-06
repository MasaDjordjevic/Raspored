using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Transactions;
using Microsoft.AspNet.Mvc.ActionConstraints;
using Microsoft.AspNet.Razor.Chunks;
using Microsoft.Data.Entity;
using WebApplication1.Extentions;
using WebApplication1.Models;

namespace WebApplication1.Data
{
    public static class Division
    {
        public static List<Divisions> GetDivisionsOfDepartment(int departmentID)
        {
            using (RasporedContext _context = new RasporedContext())
            {
                return (from div in _context.Divisions
                    .Include(p => p.creator)
                    .Include(p => p.divisionType)
                    .Include(p => p.department)
                    .Include(p => p.course)
                    where div.departmentID == departmentID
                    select div).ToList();
            }
        }

        public static Object GetDivison(int divisionID)
        {
            using (RasporedContext _context = new RasporedContext())
            {
                var pom = (from a in _context.Divisions
                    .Include(p => p.creator)
                    .Include(p => p.divisionType)
                    .Include(p => p.department)
                    .Include(p => p.course)
                    .Include(p => p.Groups)
                    //.ThenInclude(a=>a.GroupsStudents)//.ThenInclude(a=>a.student).ThenInclude(a=>a.UniMembers)
                    .Include(p => p.Groups).ThenInclude(a => a.classroom)
                    where a.divisionID == divisionID
                    select a).First();

                // morala sam iz dva koraka i sa selectom da ne bi izvuko previse informacija, inace ulazi u petlju...
                foreach (var g in pom.Groups)
                {
                    g.GroupsStudents = (from a in _context.GroupsStudents
                        where a.groupID == g.groupID
                        select new GroupsStudents
                        {
                            studentID = a.studentID,
                            student = _context.Students.Where(m => m.studentID == a.studentID).Select(m => new Students
                            {
                                studentID = m.studentID,
                                departmentID = m.departmentID,
                                indexNumber = m.indexNumber,
                                UniMembers =
                                    (from d in _context.UniMembers where d.studentID == m.studentID select d).First()
                            }).First()
                        }).ToList();
                }

                return pom;
            }
        }

        public static IEnumerable GetDivisionsOfDeparmentByType(int departmentID)
        {
            List<Divisions> allDivisions = Data.Division.GetDivisionsOfDepartment(departmentID);

            var divisions = (from div in allDivisions
                        select new
                        {
                            divisionID = div.divisionID,
                            creatorID = div.creatorID,
                            creatorName = div.creator.name,
                            divisionTypeID = div.divisionTypeID,
                            divisionTypeName = div.divisionType.type,
                            beginning = div.beginning,
                            ending = div.ending,
                            departmentID = div.departmentID,
                            departmentName = div.department.departmentName,
                            course = div.course?.name,
                            name = div.name
                        }).ToList();

            return (from div in divisions
                    group div by div.divisionTypeName
                        into newDivs
                    orderby newDivs.Key
                    select new { type = newDivs.Key, divisions = newDivs }).ToList();
        }

        public static List<Models.DTOs.StudentDTO> GetStudentsOfCourse(int courseID, int sortOrder)
        {
            List<Students> students = Data.Student.GetStudentsOfCourse(courseID);
            if (sortOrder == 0) //po indexu
                students = students.OrderBy(a => a.indexNumber).ToList();
            if (sortOrder == 1) //random
                students = students.OrderBy(a => Guid.NewGuid()).ToList();

            return (from s in students
                         select new Models.DTOs.StudentDTO()
                         {
                             studentID = s.studentID,
                             indexNumber = s.indexNumber,
                             name = s.UniMembers.name,
                             surname = s.UniMembers.surname
                         }).ToList();
        } 

        public static IEnumerable DevadeOnX(int courseID, int x, int sortOrder)
        {
            List<Models.DTOs.StudentDTO> studs = GetStudentsOfCourse(courseID, sortOrder);
            int studsInGroup = (int) Math.Round(((double)studs.Count)/x); //kastovanje je neophodno zbog zaokruzivanja
            return studs
                   .Select((a, i) => new { Index = i, Value = a })
                   .GroupBy(a => a.Index / studsInGroup) // ne moze %x jer ih ne redja redom
                   .Select(a => a.Select(v => v.Value).ToList())
                   .ToList();
        }

        //radi isto kao i DevideOnX samo sto on radi po modulu pa ih ima x ova radi deljenje pa ih ima po x
        public static IEnumerable DevideWithX(int courseID, int x, int sortOrder)
        {
            List<Models.DTOs.StudentDTO> studs = GetStudentsOfCourse(courseID, sortOrder);

            return studs
                   .Select((a, i) => new { Index = i, Value = a })
                   .GroupBy(a => a.Index / x)
                   .Select(a => a.Select(v => v.Value).ToList())
                   .ToList();
        }

        public class GroupOfStudents
        {
            public string name;
            public List<Students> students; 
        }

        public static void CreateInitialDivision(string name, int departmentID, int courseID, int divisionTypeID, DateTime beginning, DateTime ending,
            List<GroupOfStudents>  groups)
        {
            using (RasporedContext _context = new RasporedContext())
            {
                Divisions div = new Divisions
                {
                    name = name,
                    creatorID = 1, //TODO vadi iz sesije
                    divisionTypeID = divisionTypeID,
                    beginning = beginning,
                    ending = ending,
                    departmentID = departmentID,
                    courseID = courseID
                };

                _context.Divisions.Add(div);
                _context.SaveChanges();

                foreach (GroupOfStudents group in groups)
                {
                    Groups g = new Groups
                    {
                        classroomID = null,
                        divisionID = div.divisionID,
                        timeSpanID = null,
                        name = group.name,
                    };

                    _context.Groups.Add(g);
                    _context.SaveChanges();

                    foreach (Students stud in group.students)
                    {
                        GroupsStudents gs = new GroupsStudents
                        {
                            groupID = g.groupID,
                            studentID = stud.studentID
                        };
                        _context.GroupsStudents.Add(gs);
                    }

                    _context.SaveChanges();
                }
            }
        }

        public static void CancelClasses(int divisionID, string title, string content, int weekNumber)
        {
            using (RasporedContext _context = new RasporedContext())
            {
                //TODO pogledaj sta si pisla ovde, deluje mi kao glupost
                List<Groups> groups =
                    (from a in _context.Divisions.Include(a => a.Groups)
                        where a.divisionID == divisionID
                        select a.Groups.ToList())
                        .First();
                foreach (Groups group in groups)
                {
                    Group.CancelClass(group.groupID, title, content, weekNumber);
                }
            }
        }

        public static void UpdateDivision(int divisionID, string name, DateTime beginning, DateTime ending, int? divisionTypeID, int? courseID)
        {
            using (RasporedContext _context = new RasporedContext())
            {
                Divisions div = _context.Divisions.First(a => a.divisionID == divisionID);
                if (beginning != null)
                {
                    div.beginning = beginning;
                }
                if (name != null )
                {
                    div.name = name;
                }
                if (ending != null)
                {
                    div.ending = ending;
                }
                if (divisionTypeID != null)
                {
                    div.divisionTypeID = divisionTypeID.Value;
                }
                if (courseID != null)
                {
                    div.courseID = courseID.Value;
                }
                //Console.Out("isus");
                _context.SaveChanges();
            }
        }

        public static Divisions CopyDivision(int divisionID)
        {
             using (RasporedContext _context = new RasporedContext())
             {
                 Divisions division = _context.Divisions.First(a => a.divisionID == divisionID);
                 // ovo radim jer nece da ignorise setovane IDjeve pa ih ovako unsetujem
                 Divisions newDiv = new Divisions
                 {
                    courseID = division.courseID,
                    beginning = division.beginning,
                    ending = division.ending,
                    creatorID = division.creatorID,
                    divisionTypeID = division.divisionTypeID,
                    departmentID = division.departmentID,
                    name = division.name + " (kopija)",
                };

                _context.Divisions.Add(newDiv);

                _context.SaveChanges();
                
                foreach (Groups g in division.Groups)
                {
                    Groups newG = new Groups
                    {
                        classroomID = g.classroomID,
                        divisionID = newDiv.divisionID,
                        timeSpan = g.timeSpan,
                        name = g.name,
                    };

                    _context.Groups.Add(newG);
                    _context.SaveChanges();

                    foreach (GroupsStudents a in g.GroupsStudents)
                    {
                        GroupsStudents newGS = new GroupsStudents
                        {
                            groupID = newG.groupID,
                            studentID = a.studentID
                        };
                        _context.GroupsStudents.Add(newGS);
                    }

                };

                _context.SaveChanges();

                return newDiv;
             }
        }

        public static void DeleteDivision(int divisionID)
        {
            using (RasporedContext _context = new RasporedContext())
            {
                Divisions division = _context.Divisions.Include(a => a.Groups).Where(a => a.divisionID == divisionID).First();

                foreach (Groups g in division.Groups)
                {
                    _context.Groups.Remove(g);
                }
                _context.SaveChanges();

                _context.Divisions.Remove(division); 

                _context.SaveChanges();
            }
        }

        /*public static void AddDivision(string name, DateTime beginning, DateTime ending, int? divisionTypeID, int? courseID)
        {
            using (RasporedContext _context = new RasporedContext())
            {
                Divisions newDiv = new Divisions
                {
                    courseID = courseID,
                    beginning = beginning,
                    ending = ending,
                    creatorID = 1, // TODO: Vadi iz sesije
                    divisionTypeID = divisionTypeID,
                    departmentID = departmentID,
                    name = name,
                };
                _context.Divisions.Add(newDiv);
                _context.SaveChanges();
            }
        }*/

    }
}





