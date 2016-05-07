using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Transactions;
using Microsoft.AspNet.Razor.Chunks;
using Microsoft.Data.Entity;
using WebApplication1.Models;

namespace WebApplication1.Data
{
    public static class Division
    {
        public static List<Divisions> GetDivisionsOfDepartment(int departmentID)
        {
            RasporedContext _context = new RasporedContext();
            return (from div in _context.Divisions
                where div.departmentID == departmentID
                select div).ToList();
        }

        public static Object GetDivison(int divisionID)
        {
            RasporedContext _context = new RasporedContext();
            var pom = (from a in _context.Divisions
                       .Include(p => p.creator)
                       .Include(p => p.divisionType)
                       .Include(p => p.department)
                       .Include(p => p.course)
                       .Include(p => p.Groups)
                       where a.divisionID == divisionID
                       select a).ToList();

            return pom;
            
        }

        public static string GetDivisionTypeName(int divisionTypeID)
        {
            RasporedContext _context = new RasporedContext();
            return _context.DivisionTypes.Single(a => a.divisionTypeID == divisionTypeID).type;
        }

        public static IEnumerable GetDivisionsOfDeparmentByType(int departmentID)
        {
            List<Divisions> allDivisions = Data.Division.GetDivisionsOfDepartment(departmentID);

            var divisions = (from div in allDivisions
                        select new
                        {
                            divisionID = div.divisionID,
                            creatorID = div.creatorID,
                            creatorName = Data.UniMember.GetUniMemberName(div.creatorID),
                            divisionTypeID = div.divisionTypeID,
                            divisionTypeName = Data.Division.GetDivisionTypeName(div.divisionTypeID),
                            beginning = div.beginning,
                            ending = div.ending,
                            departmentID = div.departmentID,
                            departmentName = Data.Department.GetdepartmentName(div.departmentID),
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
                             name = Data.Student.GetStudentName(s.studentID),
                             surname = Data.Student.GetStudentSurname(s.studentID)
                         }).ToList();
        } 

        public static IEnumerable DevadeOnX(int courseID, int x, int sortOrder)
        {
            List<Models.DTOs.StudentDTO> studs = GetStudentsOfCourse(courseID, sortOrder);
            return studs
                   .Select((a, i) => new { Index = i, Value = a })
                   .GroupBy(a => a.Index % x)
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

        public static void CreateInitialDivision(string name, int departmentID, int courseID, DateTime beginning, DateTime ending,
            List<GroupOfStudents>  groups)
        {
            RasporedContext _context = new RasporedContext();
            Divisions div = new Divisions
            {
                creatorID = 1, //TODO vadi iz sesije
                divisionTypeID = 2,
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
}





