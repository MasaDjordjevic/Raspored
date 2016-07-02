using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNet.Http;
using Microsoft.Data.Entity;
using WebApplication1.Models;

namespace WebApplication1.Data
{

    public class Login
    {

        public static UniMembers UserLogin(string username, string password)
        {
            using (RasporedContext _context = new RasporedContext())
            {
                var query = _context.UniMembers
                    .Include(a=> a.student)
                    .Include(a=> a.UniMembersRoles)
                    .Where(a => a.username == username && a.password == password);
                if (query.Any())
                {
                    return query.First();
                }
                else
                {
                     throw new Exception("Wrong credentials");
                }
            }
        }

    }
   
}
