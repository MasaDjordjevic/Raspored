using System;
using System.Collections;
using System.Linq;
using Microsoft.AspNet.Authorization;
using Microsoft.AspNet.Http;
using Microsoft.AspNet.Mvc;
using Microsoft.Data.Entity;
using Newtonsoft.Json;
using WebApplication1.Exceptions;
using WebApplication1.Models;
using TimeSpan = WebApplication1.Data.TimeSpan;

namespace WebApplication1.Controllers
{
    [Produces("application/json")]
    [Route("api/[controller]/[action]")]
    public class StudentsController : Controller
    {
        // 2827 - Isidora Nikolic (3. grupa)
        // 2723 - Milena Arsic (2. grupa)
        // 2597 - Aleksandar milanov (1. grupa)
        //public static int STUDENT_ID = 2723;


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
            if (!HttpContext.Session.IsStudent()) return HttpUnauthorized();


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
        }
    
        [HttpGet]
        public IActionResult GetOfficialSchedule(int studentID, int weeksFromNow)
        {
            if(!HttpContext.Session.IsStudent()) return HttpUnauthorized();

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
            if (!HttpContext.Session.IsAssistant()) return HttpUnauthorized();

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

            if (!HttpContext.Session.IsAssistant()) return HttpUnauthorized();

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
                Data.Student.HideClass(HttpContext.Session.GetStudentID(), groupID);
                return Ok(new { status = "uspelo" });
            }
            catch (Exception ex)
            {
                return Ok(new { status = "nije uspelo", message = ex.Message });
            }

        }

        [HttpGet]
        public IActionResult AddClassToPersonalSchedule(int groupID)
        {
            try
            {
                Data.Student.AddClassToPersonalSchedule(HttpContext.Session.GetStudentID(), groupID);
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
                Data.Student.AlertClass(HttpContext.Session.GetStudentID(), groupID);
                return Ok(new { status = "uspelo" });
            }
            catch (Exception ex)
            {
                return Ok(new { status = "nije uspelo", message = ex.Message });
            }
        }

        public class AddActivityBinding
        {
            public int? groupID;
            public int? classroomID;
            public GroupsController.TimeSpanBinding timeSpan;
            public string place;
            public string title;
            public string content;
        }

        [HttpPost]
        public IActionResult AddActivity([FromBody] AddActivityBinding obj)
        {
            if (!HttpContext.Session.IsStudent()) return HttpUnauthorized();


            if (obj.timeSpan == null)
                return Ok(new { status = "parameter error" });

            try
            {
                //konvertovanje u timeSpan
                TimeSpans ts = TimeSpan.getTimeSpan(obj.timeSpan);

                Data.Student.AddActivity(HttpContext.Session.GetStudentID(), obj.groupID, obj.classroomID, ts, obj.place, obj.title, obj.content);
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
            if (!HttpContext.Session.IsStudent()) return HttpUnauthorized();


            try
            {
                Data.Student.DeleteActivity(HttpContext.Session.GetStudentID(), activityID);
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

            if (!HttpContext.Session.IsStudent()) return HttpUnauthorized();

            try
            {
                Data.Student.AlertActivity(HttpContext.Session.GetStudentID(), activityID);
                return Ok(new { status = "uspelo" });
            }
            catch (Exception ex)
            {
                return Ok(new { status = "nije uspelo", message = ex.Message });
            }
        }


        

      
    }
}