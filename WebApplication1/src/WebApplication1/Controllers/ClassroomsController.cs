using System.Linq;
using Microsoft.AspNet.Http;
using Microsoft.AspNet.Mvc;
using Microsoft.Data.Entity;
using WebApplication1.Exceptions;
using WebApplication1.Models;

namespace WebApplication1.Controllers
{
    [Produces("application/json")]
    [Route("api/[controller]/[action]")]
    public class ClassroomsController : Controller
    {
        private RasporedContext _context;

        public ClassroomsController(RasporedContext context)
        {
            _context = context;
        }

        // GET: api/Classrooms
        [HttpGet]
        public IActionResult GetClassrooms()
        {
            var classrooms = Data.Classroom.GetClassrooms();
            return Ok(classrooms);
        }
        
        //mislim da se ovo ne koristi
        [HttpGet]
        public IActionResult CheckIfAvailable(int classroomID, TimeSpans time)
        {
            try
            {
                Data.Classroom.CheckIfAvailable(classroomID, time);

            }
            catch (InconsistentDivisionException ex)
            {
                return Ok(new {status = "inconsistent division", message = ex.Message});
            }

            return Ok(new {status = "Uspelo", aveable = true});
        }

        // [GET] api/Classrooms/GetClassrooms/{id-classroom}
        [HttpGet("{id}", Name = "GetClassrooms")]
        public IActionResult GetClassrooms([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return HttpBadRequest(ModelState);
            }

            Classrooms classrooms = _context.Classrooms.Single(m => m.classroomID == id);

            if (classrooms == null)
            {
                return HttpNotFound();
            }

            return Ok(classrooms);
        }

        [HttpGet]
        public IActionResult GetSchedule(int classroomID, int weeksFromNow)
        {
            if (!ModelState.IsValid)
            {
                return HttpBadRequest(ModelState);
            }

            var schedule = Data.Classroom.GetSchedule(classroomID, weeksFromNow);

            if (schedule == null)
            {
                return HttpNotFound();
            }

            return Ok(schedule);
        }

       

        // POST: api/Classrooms
        [HttpPost]
        public IActionResult PostClassrooms([FromBody] Classrooms classrooms)
        {
            if (!ModelState.IsValid)
            {
                return HttpBadRequest(ModelState);
            }

            _context.Classrooms.Add(classrooms);
            try
            {
                _context.SaveChanges();
            }
            catch (DbUpdateException)
            {
                if (ClassroomsExists(classrooms.classroomID))
                {
                    return new HttpStatusCodeResult(StatusCodes.Status409Conflict);
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtRoute("GetClassrooms", new { id = classrooms.classroomID }, classrooms);
        }

        // DELETE: api/Classrooms/5
        [HttpDelete("{id}")]
        public IActionResult DeleteClassrooms(int id)
        {
            if (!ModelState.IsValid)
            {
                return HttpBadRequest(ModelState);
            }

            Classrooms classrooms = _context.Classrooms.Single(m => m.classroomID == id);
            if (classrooms == null)
            {
                return HttpNotFound();
            }

            _context.Classrooms.Remove(classrooms);
            _context.SaveChanges();

            return Ok(classrooms);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                _context.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool ClassroomsExists(int id)
        {
            return _context.Classrooms.Count(e => e.classroomID == id) > 0;
        }
    }
}