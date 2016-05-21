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

        public static void CancelClass(int groupID, string title, string content)
        {
            RasporedContext _context = new RasporedContext();

            Activities act = new Activities
            {
                title = title,
                activityContent = content,
                groupID = groupID,
                cancelling = true
            };
            _context.Activities.Add(act);
            _context.SaveChanges();
        }

        public static void AddStudnets(int groupID, List<Students> students)
        {
            RasporedContext _context = new RasporedContext();

            foreach (Students stud in students)
            {
                GroupsStudents gs = new GroupsStudents
                {
                    groupID = groupID,
                    studentID = stud.studentID
                };
                _context.GroupsStudents.Add(gs);
            }
            _context.SaveChanges();
        }

        public static void AddStudnets(int groupID, List<int> students)
        {
            RasporedContext _context = new RasporedContext();

            foreach (int studID in students)
            {
                GroupsStudents gs = new GroupsStudents
                {
                    groupID = groupID,
                    studentID = studID
                };
                _context.GroupsStudents.Add(gs);
            }
            _context.SaveChanges();
        }

        public static void RemoveStudents(int groupID, List<Students> students)
        {
            RasporedContext _context = new RasporedContext();

            foreach (Students stud in students)
            {
                var gs =
                    (from a in _context.GroupsStudents
                        where a.studentID == stud.studentID && a.groupID == groupID
                        select a).First();
                _context.GroupsStudents.Remove(gs);
            }
            _context.SaveChanges();
        }

        public static void RemoveStudents(int groupID, List<int> students)
        {
            RasporedContext _context = new RasporedContext();

            foreach (int studID in students)
            {
                var gs =
                    (from a in _context.GroupsStudents
                     where a.studentID == studID && a.groupID == groupID
                     select a).First();
                _context.GroupsStudents.Remove(gs);
            }
            _context.SaveChanges();
        }

        public static void RemoveAllStudents(int groupID)
        {
            RasporedContext _context = new RasporedContext();
            var gs = _context.GroupsStudents.Where(a => a.groupID == groupID);
            foreach (GroupsStudents g in gs)
            {
                _context.GroupsStudents.Remove(g);
            }
            _context.SaveChanges();
        }

        public static void ChangeSudents(int groupID, List<int> newStudents)
        {
            RemoveAllStudents(groupID);
            AddStudnets(groupID, newStudents);
        }

        public static void Update(int groupID, string name, int? classroomID)
        {
            RasporedContext _context = new RasporedContext();
            Groups g = _context.Groups.First(a => a.groupID == groupID);
            g.name = name;
            if(classroomID != null)
                g.classroomID = classroomID;
            _context.SaveChanges();

        }

        public static void AddActivity(int groupID, TimeSpans timeSpan, string place, string title, string content)
        {
            RasporedContext _context = new RasporedContext();
            //TODO moguce je da ovo ne radi
            _context.TimeSpans.Add(timeSpan);

            Activities act = new Activities
            {
                timeSpanID = timeSpan.timeSpanID,
                place = place,
                title = title,
                activityContent = content,
                groupID = groupID,
                cancelling = false,
            };
            _context.Activities.Add(act);
            _context.SaveChanges();
        }

    }
}
