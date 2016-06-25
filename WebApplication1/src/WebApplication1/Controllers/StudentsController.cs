using System;
using System.Collections;
using System.Linq;
using Microsoft.AspNet.Http;
using Microsoft.AspNet.Mvc;
using Microsoft.Data.Entity;
using Newtonsoft.Json;
using WebApplication1.Exceptions;
using WebApplication1.Models;

namespace WebApplication1.Controllers
{
    [Produces("application/json")]
    [Route("api/[controller]/[action]")]
    public class StudentsController : Controller
    {
        private RasporedContext _context;

        public StudentsController(RasporedContext context)
        {
            _context = context;
        }

        // GET: api/Students
        [HttpGet]
        public IEnumerable GetStudents()
        {
            return Data.Student.GetAllStudents();
        }

        // GET: api/Students/GetStudent/{student-id}
        /**
         * Vrati studente ciji je ID prosledjen.
         */
        [HttpGet("{id}", Name = "GetStudent")]
        public IActionResult GetStudent(int id)
        {
            if (!ModelState.IsValid)
            {
                return HttpBadRequest(ModelState);
            }

            var student = Data.Student.GetStudent(id);

            if (student == null)
            {
                return HttpNotFound();
            }

            return Ok(JsonConvert.SerializeObject(student, Formatting.Indented,
                                    new JsonSerializerSettings
                                    {
                                        ReferenceLoopHandling = ReferenceLoopHandling.Ignore
                                    }));
        }

        // GET: api/Students/GetStudents/{group-id}
        /**
         * Vrati studente koji pripadaju grupi ciji je ID prosledjen.
         */
        [HttpGet("{id}", Name = "GetStudents")]
        public IActionResult GetStudents([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return HttpBadRequest(ModelState);
            }

            var students = Data.Student.GetStudentsOfGroup(id);

            if (students == null)
            {
                return HttpNotFound();
            }
            return Ok(JsonConvert.SerializeObject(students, Formatting.Indented,
                                    new JsonSerializerSettings
                                    {
                                        ReferenceLoopHandling = ReferenceLoopHandling.Ignore
                                    }));
        }

        // GET: api/Students/GetStudentsOfDepartment/{department-id}
        // Vrati sve sudente koji pripadaju smeru (department) ciji je ID prosledjen.
        [HttpGet("{id}", Name = "GetStudentsOfDepartment")]
        public IActionResult GetStudentsOfDepartment([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return HttpBadRequest(ModelState);
            }

            var students = Data.Student.GetStudentsOfDepartment(id);

            if (students == null)
            {
                return HttpNotFound();
            }

            return Ok(students);
        }

        // GET: api/Students/GetStudentsOfCourse/{course-id}
        // Vrati sve sudente koji pripadaju kursu ciji je ID prosledjen.
        [HttpGet("{id}", Name = "GetStudentsOfCourse")]
        public IActionResult GetStudentsOfCourse([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return HttpBadRequest(ModelState);
            }

            var students = Data.Student.GetStudentsOfCourse(id);

            if (students == null)
            {
                return HttpNotFound();
            }

            return Ok(JsonConvert.SerializeObject(students, Formatting.Indented,
                                    new JsonSerializerSettings
                                    {
                                        ReferenceLoopHandling = ReferenceLoopHandling.Ignore
                                    }));
        }

        [HttpGet]
        public IActionResult GetSchedule(int studentID, int weeksFromNow)
        {
            if (!ModelState.IsValid)
            {
                return HttpBadRequest(ModelState);
            }

            var schedule = Data.Student.GetSchedule(studentID, weeksFromNow);

            if (schedule == null)
            {
                return HttpNotFound();
            }

            return Ok(schedule);
        }

        [HttpGet]
        public IActionResult GetPersonalSchedule(int studentID, int weeksFromNow)
        {
            if (!ModelState.IsValid)
            {
                return HttpBadRequest(ModelState);
            }

            var schedule = Data.Student.GetPersonalSchedule(studentID, weeksFromNow);

            if (schedule == null)
            {
                return HttpNotFound();
            }

            return Ok(schedule);
        }[HttpGet]
        public IActionResult GetOfficialSchedule(int studentID, int weeksFromNow)
        {
            if (!ModelState.IsValid)
            {
                return HttpBadRequest(ModelState);
            }

            var schedule = Data.Student.GetOfficialSchedule(studentID, weeksFromNow);

            if (schedule == null)
            {
                return HttpNotFound();
            }

            return Ok(schedule);
        }

        [HttpGet]
        public IActionResult AddToGroup(int studentID, int groupID)
        {
            if (!ModelState.IsValid)
            {
                return HttpBadRequest(ModelState);
            }

            try
            {
                Data.Student.AddToGroup(studentID, groupID);
            }
            catch (InconsistentDivisionException ex)
            {
                return Ok(new {status = "inconsistent division", message = ex.Message});
            }
            catch (Exception ex)
            {
                return Ok(new { status = "nije uspelo", message = ex.Message });
            }

            return Ok(new { status = "uspelo" });
        }

        [HttpGet]
        public IActionResult MoveToGroup(int studentID, int groupID)
        {
            if (!ModelState.IsValid)
            {
                return HttpBadRequest(ModelState);
            }

            try
            {
                Data.Student.MoveToGroup(studentID, groupID);
            }
            catch (InconsistentDivisionException ex)
            {
                return Ok(new { status = "inconsistent division", message = ex.Message });
            }
            catch (DbUpdateConcurrencyException)
            {
                throw;
            }

            return Ok(new { status = "uspelo" });
        }

        [HttpGet]
        public IActionResult RemoveFromGroup(int studentID, int groupID)
        {
            try
            {
                if (!Data.Student.RemoveFromGroup(studentID, groupID))
                {
                    return Ok(new { status = "student not in the group" });
                }
            }
            catch (Exception ex)
            {
                return Ok(new { status = "nije uspelo", message = ex.Message });
            }

            return Ok(new { status = "uspelo" });
        }

        [HttpGet]
        public IActionResult HideClass(int groupID)
        {
            try
            {
                //TODO vadi iz sesije
                Data.Student.HideClass(3, groupID);
                return Ok(new { status = "uspelo" });
            }
            catch (Exception ex)
            {
                return Ok(new { status = "nije uspelo", message = ex.Message });
            }

        }

        [HttpGet]
        public IActionResult UnHideClass(int groupID)
        {
            try
            {
                //TODO vadi iz sesije
                Data.Student.UnHideClass(3, groupID);
                return Ok(new { status = "uspelo" });
            }
            catch (Exception ex)
            {
                return Ok(new { status = "nije uspelo", message = ex.Message });
            }
        }

        [HttpGet]
        public IActionResult AlertClass(int groupID)
        {
            try
            {
                //TODO vadi iz sesije
                Data.Student.AlertClass(3, groupID);
                return Ok(new { status = "uspelo" });
            }
            catch (Exception ex)
            {
                return Ok(new { status = "nije uspelo", message = ex.Message });
            }
        }

        public class AddActivityBinding
        {
            public int? classroomID;
            public TimeSpans timeSpan;
            public string place;
            public string title;
            public string content;
        }

        [HttpPost]
        public IActionResult AddActivity([FromBody] AddActivityBinding obj)
        {
            if(obj.timeSpan == null)
                return Ok(new { status = "parameter error" });

            try
            {
                //TODO vadi iz sesije
                Data.Student.AddActivity(3, obj.classroomID, obj.timeSpan, obj.place, obj.title, obj.content);
                return Ok(new { status = "uspelo" });
            }
            catch (Exception ex)
            {
                return Ok(new { status = "nije uspelo", message = ex.Message });
            }
        }

        [HttpGet]
        public IActionResult DeleteActivity(int activityID)
        {
            try
            {
                //TODO vadi iz sesije
                Data.Student.DeleteActivity(3, activityID);
                return Ok(new { status = "uspelo" });
            }
            catch (Exception ex)
            {
                return Ok(new { status = "nije uspelo", message = ex.Message });
            }
        }

        [HttpGet]
        public IActionResult AlertActivity(int activityID)
        {
            try
            {
                //TODO vadi iz sesije
                Data.Student.AlertActivity(3, activityID);
                return Ok(new { status = "uspelo" });
            }
            catch (Exception ex)
            {
                return Ok(new { status = "nije uspelo", message = ex.Message });
            }
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