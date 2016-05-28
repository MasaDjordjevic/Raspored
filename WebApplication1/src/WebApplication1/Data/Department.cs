using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebApplication1.Models;

namespace WebApplication1.Data
{
    public static class Department
    {
        public static IEnumerable GetDepartmentsByYear()
        {
            using (RasporedContext _context = new RasporedContext())
            {
                return (from dep in _context.Departments
                        group dep by dep.year
                   into newdeps
                        orderby newdeps.Key
                        select new { year = newdeps.Key, departments = newdeps }).ToList();
            }
        }

        public static string GetdepartmentName(int? deparmentID)
        {
            if (deparmentID == null)
                return null;
            using (RasporedContext _context = new RasporedContext())
            {
                return _context.Departments.Single(a => a.departmentID == deparmentID).departmentName;
            }
                
        }
        
    }
}
