using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNet.Mvc;
using WebApplication1.Models;


namespace WebApplication1.Controllers
{
    [Route("api/[controller]")]
    public class RandomController : Controller
    {
        private RasporedContext _context;

        [HttpGet]
        public async Task<JsonResult> Get()
        {
            var rand = new Random();
            await Task.Delay(rand.Next(0, 50)); // Emulate tiny latency...
            return new JsonResult(new { numbers = Enumerable.Range(1, 10).Select(i => i * rand.NextDouble()).ToArray() });
        }

        //[HttpGet]
        //public async Task<JsonResult> GetRoles()
        //{
        //    var roles = (from a in _context.Roles select a).ToArray();
        //    return new JsonResult(new { roles = roles});
        //}
     }
}