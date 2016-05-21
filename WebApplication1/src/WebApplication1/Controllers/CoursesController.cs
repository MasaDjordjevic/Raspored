using System.Collections;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNet.Http;
using Microsoft.AspNet.Mvc;
using Microsoft.Data.Entity;
using Newtonsoft.Json;
using WebApplication1.Models;

namespace WebApplication1.Controllers
{
    [Produces("application/json")]
    [Route("api/[controller]/[action]")]
    public class CoursesController : Controller
    {
        private RasporedContext _context;

        public CoursesController(RasporedContext context)
        {
            _context = context;
        }

        // GET: api/Courses
        [HttpGet]
        public IEnumerable GetCourses()
        {
            return Data.Course.GetAllCourses();
        }

        [HttpGet]
        [Route("{id:int}")]
        public IActionResult GetCoursesOfDepartment([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return HttpBadRequest(ModelState);
            }
           
            var courses = Data.Course.GetCoursesOfDepartment(id);

            return Ok(JsonConvert.SerializeObject(courses, Formatting.Indented,
                                    new JsonSerializerSettings
                                    {
                                        ReferenceLoopHandling = ReferenceLoopHandling.Ignore
                                    }));
        }

        // [GET] api/Courses/GetCourses/{course-id}
        [HttpGet("{id}", Name = "GetCourses")]
        public IActionResult GetCourses([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return HttpBadRequest(ModelState);
            }

            Courses courses = _context.Courses.Single(m => m.courseID == id);

            if (courses == null)
            {
                return HttpNotFound();
            }

            return Ok(courses);
        }

        // PUT: api/Courses/5
        [HttpPut("{id}")]
        [Route("{id:int}")]
        public IActionResult PutCourses(int id, [FromBody] Courses courses)
        {
            if (!ModelState.IsValid)
            {
                return HttpBadRequest(ModelState);
            }

            if (id != courses.courseID)
            {
                return HttpBadRequest();
            }

            _context.Entry(courses).State = EntityState.Modified;

            try
            {
                _context.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CoursesExists(id))
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

        // POST: api/Courses
        [HttpPost]
        public IActionResult PostCourses([FromBody] Courses courses)
        {
            if (!ModelState.IsValid)
            {
                return HttpBadRequest(ModelState);
            }

            _context.Courses.Add(courses);
            try
            {
                _context.SaveChanges();
            }
            catch (DbUpdateException)
            {
                if (CoursesExists(courses.courseID))
                {
                    return new HttpStatusCodeResult(StatusCodes.Status409Conflict);
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtRoute("GetCourses", new { id = courses.courseID }, courses);
        }

        // DELETE: api/Courses/5
        [HttpDelete("{id}")]
        [Route("{id:int}")]
        public IActionResult DeleteCourses(int id)
        {
            if (!ModelState.IsValid)
            {
                return HttpBadRequest(ModelState);
            }

            Courses courses = _context.Courses.Single(m => m.courseID == id);
            if (courses == null)
            {
                return HttpNotFound();
            }

            _context.Courses.Remove(courses);
            _context.SaveChanges();

            return Ok(courses);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                _context.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool CoursesExists(int id)
        {
            return _context.Courses.Count(e => e.courseID == id) > 0;
        }
    }
}