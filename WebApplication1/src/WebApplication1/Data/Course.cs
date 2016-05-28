using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Data.Entity;
using WebApplication1.Models;

namespace WebApplication1.Data
{
    public static class Course
    {
        public static void AddAssistantToCourse(int assistantID, int courseID, string classType)
        {
            using (RasporedContext _context = new RasporedContext())
            {
                AssistantsCourses ass = new AssistantsCourses
                {
                    assistantID = assistantID,
                    courseID = courseID,
                    classType = classType
                };

                _context.AssistantsCourses.Add(ass);
                _context.SaveChanges();
            }
        }

        public static IEnumerable GetAllCourses()
        {
            using (RasporedContext _context = new RasporedContext())
            {
                return _context.Courses.Include(a => a.department).ToList();
            }
        }

        public static IEnumerable GetCoursesOfDepartment(int departmentID)
        {
            using (RasporedContext _context = new RasporedContext())
            {
                return _context.Courses.Include(a => a.department).Where(a => a.departmentID == departmentID).ToList();
            }
        }

        public static IEnumerable GetCoursesOfDepartmentOfSemester(int departmentID, int semester)
        {
            using (RasporedContext _context = new RasporedContext())
            {
                return
                    _context.Courses.Include(a => a.department)
                        .Where(a => a.departmentID == departmentID && a.semester == semester)
                        .ToList();
            }
        }


    }
}
