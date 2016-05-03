using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebApplication1.Models;

namespace WebApplication1.Data
{
    public static class UniMember
    {
        public static string GetUniMemberName(int uniMmeberID)
        {
            RasporedContext _context = new RasporedContext();
            return (from a in _context.UniMembers where a.uniMemberID == uniMmeberID select a.name).First();
        }

        public static string GetUniMemberFullName(int uniMmeberID)
        {
            RasporedContext _context = new RasporedContext();
            return (from a in _context.UniMembers where a.uniMemberID == uniMmeberID select a.name + a.surname).First();
        }

        
    }
}
