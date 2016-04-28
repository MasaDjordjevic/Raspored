using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNet.Http;
using Microsoft.AspNet.Mvc;
using Microsoft.Data.Entity;
using WebApplication1.Models;

namespace WebApplication1.Controllers
{
    [Produces("application/json")]
    [Route("api/Students")]
    public class StudentsController : Controller
    {
        private RasporedContext _context;

        public StudentsController(RasporedContext context)
        {
            _context = context;
        }

        // GET: api/Students
        [HttpGet]
        public IEnumerable<Students> GetStudents()
        {
            return _context.Students;
        }

        // GET: api/Students/5
        [HttpGet("{id}", Name = "GetStudents")]
        public IActionResult GetStudents([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return HttpBadRequest(ModelState);
            }

            var students = (from s in _context.Students
                            from u in _context.UniMembers
                            from g in _context.GroupsStudents
                            where s.studentID == u.studentID.Value && s.studentID == g.studentID && g.groupID == id
                            select new
                            {
                                studentID = s.studentID,
                                name = u.name,
                                surname = u.surname,
                                indexNumber = s.indexNumber
                            }).ToList();

            if (students == null)
            {
                return HttpNotFound();
            }

            return Ok(students);
        }

        // PUT: api/Students/5
        [HttpPut("{id}")]
        public IActionResult PutStudents(int id, [FromBody] Students students)
        {
            if (!ModelState.IsValid)
            {
                return HttpBadRequest(ModelState);
            }

            if (id != students.studentID)
            {
                return HttpBadRequest();
            }

            _context.Entry(students).State = EntityState.Modified;

            try
            {
                _context.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!StudentsExists(id))
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

        // POST: api/Students
        [HttpPost]
        public IActionResult PostStudents([FromBody] Students students)
        {
            if (!ModelState.IsValid)
            {
                return HttpBadRequest(ModelState);
            }

            _context.Students.Add(students);
            try
            {
                _context.SaveChanges();
            }
            catch (DbUpdateException)
            {
                if (StudentsExists(students.studentID))
                {
                    return new HttpStatusCodeResult(StatusCodes.Status409Conflict);
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtRoute("GetStudents", new { id = students.studentID }, students);
        }

        // DELETE: api/Students/5
        [HttpDelete("{id}")]
        public IActionResult DeleteStudents(int id)
        {
            if (!ModelState.IsValid)
            {
                return HttpBadRequest(ModelState);
            }

            Students students = _context.Students.Single(m => m.studentID == id);
            if (students == null)
            {
                return HttpNotFound();
            }

            _context.Students.Remove(students);
            _context.SaveChanges();

            return Ok(students);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                _context.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool StudentsExists(int id)
        {
            return _context.Students.Count(e => e.studentID == id) > 0;
        }
    }
}