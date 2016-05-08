using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebApplication1.Models;
using WebApplication1.Models.DTOs;

namespace WebApplication1.Data
{
    public static class Group
    {
        public static IEnumerable GetGroupsOfDivision(int divisionID)
        {
            RasporedContext _context = new RasporedContext();
            var groups = (from g in _context.Groups
                          where g.divisionID == divisionID
                          select new GroupDTO
                          {
                              groupID = g.groupID,
                              classroomID = g.classroomID,
                              timeSpanID = g.timeSpanID,
                              timeSpan = (TimeSpans)null,
                              classroomNumber = "nepoznato"
                          }).ToList();
            foreach (var g in groups)
            {
                if (g.classroomID != null)
                    g.classroomNumber =
                        (from a in _context.Classrooms where a.classroomID == g.classroomID select a.number).First();

                if (g.timeSpanID != null)
                {
                    g.timeSpan = (from a in _context.TimeSpans where a.timeSpanID == g.timeSpanID select a).First();
                }

            }

            return groups;
        }

    }
}
