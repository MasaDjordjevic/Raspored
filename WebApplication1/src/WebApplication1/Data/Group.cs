﻿using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Data.Entity;
using WebApplication1.Models;
using WebApplication1.Models.DTOs;

namespace WebApplication1.Data
{
    public static class Group
    {

        public static IEnumerable GetAllGroups()
        {
            using (RasporedContext _context = new RasporedContext())
            {

                return _context.Groups.Include(a => a.classroom).Include(a => a.timeSpan).ToList();
            }
        }

        public static Groups GetGroup(int groupID)
        {
            using (RasporedContext _context = new RasporedContext())
            {

                Groups pom = _context.Groups
                    //.Include(a => a.division).ThenInclude(aa => aa.department)
                    .Include(a => a.classroom)
                    .Include(a => a.timeSpan)
                    .Include(a => a.GroupsStudents).ThenInclude(aa => aa.student).ThenInclude(aa => aa.UniMembers)
                    .Include(a => a.GroupsAssistants).ThenInclude(aa => aa.assistant)
                    .First(a => a.groupID == groupID);

                pom.division = _context.Divisions.First(a => a.divisionID == pom.divisionID);
                return pom;
            }
        }

        public static void RemoveGroup(Groups group)
        {
            using (RasporedContext _context = new RasporedContext())
            {
                //brisanje oglasa (nekim cudom se ne obrise)

                var ads = _context.Periods.Where(a => a.groupID == group.groupID).Select(a => a.ad).ToList();
                foreach (Ads ad in ads)
                {
                    _context.Ads.Remove(ad);
                }
                

                //brisanje same grupe
                _context.Groups.Remove(group);
                _context.SaveChanges();
            }
        }

        public static IEnumerable GetGroupsOfDivision(int divisionID)
        {
            using (RasporedContext _context = new RasporedContext())
            {

                return _context.Groups
                    .Include(a => a.classroom)
                    .Include(a => a.timeSpan)
                    .Where(a => a.divisionID == divisionID)
                    //.OrderBy(a => a.classroom.number)
                    .ToList();
            }
        }

        public static void CancelClass(int groupID, string title, string content)
        {
            using (RasporedContext _context = new RasporedContext())
            {

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
        }

        
        public static bool AddStudnets(int groupID, List<Students> students)
        {
            using (RasporedContext _context = new RasporedContext())
            {


                //provera konzistentnosti raspodele
                var groups =
                    _context.Groups.Where(
                        a => a.divisionID == _context.Groups.First(g => g.groupID == groupID).divisionID).Select(a => a.groupID).ToList();
                var studs = _context.GroupsStudents.Where(a => groups.Contains(a.groupID)).Select(a => a.studentID).ToList();

                foreach (Students stud in students)
                {
                    if (studs.Contains(stud.studentID))
                    {
                        return false;
                    }
                }


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
                return true;
            }
        }

        // TODO mozda neka poruka ukoliko se ne dodaju studenti
        public static bool AddStudnets(int groupID, List<int> students)
        {
            using (RasporedContext _context = new RasporedContext())
            {

                //provera konzistentnosti raspodele
                var groups =
                    _context.Groups.Where(
                        a => a.divisionID == _context.Groups.First(g => g.groupID == groupID).divisionID).Select(a => a.groupID).ToList();
                var studs = _context.GroupsStudents.Where(a => groups.Contains(a.groupID)).Select(a => a.studentID).ToList();

                foreach (int stud in students)
                {
                    if (studs.Contains(stud))
                    {
                        return false;
                    }
                }

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
                return true;
            }
        }

        //proverava da li svi studenti te grupe nisu clanovi neke druge grupe te raspodele
        //groupID moze da bude null u slucaju provere prilikom kreiranja nove grupe
        public static bool CheckConsistencyOfGroup(int? groupID, List<int> students)
        {
            using (RasporedContext _context = new RasporedContext())
            {
                //proverava studente u ostalim grupama raspodele

                var groups =
                    _context.Groups.Where(
                        a => (groupID == null || a.groupID != groupID) && //bez te konkrentne grupe
                        a.divisionID == _context.Groups.First(g => g.groupID == groupID).divisionID) //sve grupe raspodele kojo ta grupa pripada
                        .Select(a => a.groupID).ToList();
                var studs = _context.GroupsStudents.Where(a => groups.Contains(a.groupID)).Select(a => a.studentID).ToList(); //studenti koji pripadaju tim grupama

                //proverava da li za svakog studenta vazi da nije u studs odnosno ne pripada ni jednoj drugoj grupi
                return students.All(stud => !studs.Contains(stud));
            }
        }

        public static void RemoveStudents(int groupID, List<Students> students)
        {
            using (RasporedContext _context = new RasporedContext())
            {

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
        }

        public static void RemoveStudents(int groupID, List<int> students)
        {
            using (RasporedContext _context = new RasporedContext())
            {

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
        }

        public static void RemoveAllStudents(int groupID)
        {
            using (RasporedContext _context = new RasporedContext())
            {
                var gs = _context.GroupsStudents.Where(a => a.groupID == groupID);
                foreach (GroupsStudents g in gs)
                {
                    _context.GroupsStudents.Remove(g);
                }
                _context.SaveChanges();
            }
        }

        public static void ChangeSudents(int groupID, List<int> newStudents)
        {
            RemoveAllStudents(groupID);
            AddStudnets(groupID, newStudents);
        }

        public static void Update(int groupID, string name, int? classroomID)
        {
            using (RasporedContext _context = new RasporedContext())
            {
                Groups g = _context.Groups.First(a => a.groupID == groupID);
                if (name != null)
                    g.name = name;
                if (classroomID != null)
                    g.classroomID = classroomID;
                _context.SaveChanges();
            }

        }

        public static Groups Create(int divisionID, string name, int? classroomID)
        {
            using (RasporedContext _context = new RasporedContext())
            {
                Groups g = new Groups
                {
                    divisionID = divisionID,
                    name = name,
                    classroomID = classroomID
                };
                _context.Groups.Add(g);
                _context.SaveChanges();

                return g;
            }
        }

        public static void AddActivity(int groupID, int? classroomID, int? courseID, TimeSpans timeSpan, string place,
            string title, string content)
        {
            using (RasporedContext _context = new RasporedContext())
            {
                //proveri da li svi studenti iz grupe slusaju izabrani kurs
                if (courseID != null)
                {
                    var studs = _context.GroupsStudents.Where(a => a.groupID == groupID).Select(a => a.studentID).ToList();
                    foreach (var stud in studs)
                    {
                        if (!_context.StudentsCourses.Any(a => a.studentID == stud && a.courseID == courseID.Value))
                            return;
                    }
                }

                _context.TimeSpans.Add(timeSpan);

                Activities act = new Activities
                {
                    timeSpanID = timeSpan.timeSpanID,
                    classroomID = classroomID,
                    courseID = courseID,
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

        public static void AddAsstant(int groupID, int assistantID)
        {
            using (RasporedContext _context = new RasporedContext())
            {
                GroupsAssistants gs = new GroupsAssistants
                {
                    assistantID = assistantID,
                    groupID = groupID
                };
                _context.GroupsAssistants.Add(gs);


                // ako asistent nije bio zaduzen za kurs dodati ga

                int? courseID = _context.Groups.Where(a => a.groupID == groupID).Select(a => a.division.courseID).First();
                if (courseID != null && !_context.AssistantsCourses.Any(a => a.assistantID == assistantID && a.courseID == courseID.Value))
                {
                    AssistantsCourses asscour = new AssistantsCourses
                    {
                        assistantID = assistantID,
                        courseID = courseID.Value
                    };
                    _context.AssistantsCourses.Add(asscour);
                }

                _context.SaveChanges();
            }
        }

    }
}
