using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNet.Http;
using Microsoft.AspNet.Mvc;
using Microsoft.Data.Entity;
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
            var classrooms = (from a in _context.Classrooms select a).OrderBy(a => a.number).ToList();
            return Ok(classrooms);
        }

        //TODO
        [HttpGet]
        public IActionResult CheckIfAveable(int classroomID, TimeSpans time)
        {
            return null;
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

        // PUT: api/Classrooms/5
        [HttpPut("{id}")]
        public IActionResult PutClassrooms(int id, [FromBody] Classrooms classrooms)
        {
            if (!ModelState.IsValid)
            {
                return HttpBadRequest(ModelState);
            }

            if (id != classrooms.classroomID)
            {
                return HttpBadRequest();
            }

            _context.Entry(classrooms).State = EntityState.Modified;

            try
            {
                _context.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ClassroomsExists(id))
                {
                    return HttpNotFound();
                }
                else
                {
                    throw;
                }
            }

            return new HttpStatusCodeResult(StatusCodes.Status204NoContent);
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