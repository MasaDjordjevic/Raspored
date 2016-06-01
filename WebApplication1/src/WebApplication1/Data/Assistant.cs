using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebApplication1.Models;

namespace WebApplication1.Data
{
    public static class Assistant
    {
        public static IEnumerable GetAllAssistants()
        {
            using (RasporedContext _context = new RasporedContext())
            {
                return _context.UniMembers.Where(a => a.studentID == null).ToList();
            }
        }

        public static Object GetAssistant(int assistantID)
        {
            using(RasporedContext _context = new RasporedContext())
            {
                return _context.UniMembers.First(a => a.uniMemberID == assistantID);
            }
        }


        //vraca asistente na osnovu grupe, ako grupa pripada raspodeli koja odgovara kursu onda vraca sve asistente zaduzene za taj kurs, inace vraca sve asistente
        public static IEnumerable GetAssistantsByGroupID(int groupID)
        {
            using (RasporedContext _context = new RasporedContext())
            {
                int? courseID = _context.Groups.Where(a => a.groupID == groupID).Select(a => a.division.courseID).First();
                if (courseID == null)
                {
                    return _context.UniMembers.Where(a => a.studentID == null).ToList();
                }
                else
                {
                    return _context.AssistantsCourses.Where(a => a.courseID == courseID.Value)
                                            .Select(a => a.assistant)
                                            .ToList();
                }
            }
        }

    }
}
