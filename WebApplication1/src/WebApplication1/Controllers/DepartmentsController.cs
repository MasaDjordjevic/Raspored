using System.Linq;
using Microsoft.AspNet.Http;
using Microsoft.AspNet.Mvc;
using Microsoft.Data.Entity;
using WebApplication1.Models;

namespace WebApplication1.Controllers
{
    [Produces("application/json")]
    [Route("api/[controller]/[action]")]
    public class DepartmentsController : Controller
    {
        private RasporedContext _context;

        public DepartmentsController(RasporedContext context)
        {
            _context = context;
        }
       

        // GET: api/Departments
        [HttpGet]
       public IActionResult GetDepartments()
        {
            var departments = _context.Departments.OrderBy(a => a.departmentName).ThenBy(a => a.year).ToList();
            return Ok(departments);
        }
        
        [HttpGet(Name = "GetDepartmentsByYear")]
        public IActionResult GetDepartmentsByYear()
        {
            var departments = Data.Department.GetDepartmentsByYear();
                
            return Ok(departments);
        }

        // GET: api/Departments/GetDepartments/5
        [HttpGet("{id}", Name = "GetDepartments")]
        [Route("{id:int}")]
        public IActionResult GetDepartments([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return HttpBadRequest(ModelState);
            }

            Departments departments = _context.Departments.Single(m => m.departmentID == id);

            if (departments == null)
            {
                return HttpNotFound();
            }

            return Ok(departments);
        }

        [HttpGet]
        public IActionResult GetSchedule(int departmentID, int weeksFromNow)
        {
            if (!ModelState.IsValid)
            {
                return HttpBadRequest(ModelState);
            }

            var schedule = Data.Department.GetSchedule(departmentID, weeksFromNow);

            if (schedule == null)
            {
                return HttpNotFound();
            }

            return Ok(schedule);
        }

        // PUT: api/Departments/5
        [HttpPut("{id}")]
        [Route("{id:int}")]
        public IActionResult PutDepartments(int id, [FromBody] Departments departments)
        {
            if (!ModelState.IsValid)
            {
                return HttpBadRequest(ModelState);
            }

            if (id != departments.departmentID)
            {
                return HttpBadRequest();
            }

            _context.Entry(departments).State = EntityState.Modified;

            try
            {
                _context.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!DepartmentsExists(id))
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

        // POST: api/Departments
        [HttpPost]
        public IActionResult PostDepartments([FromBody] Departments departments)
        {
            if (!ModelState.IsValid)
            {
                return HttpBadRequest(ModelState);
            }

            _context.Departments.Add(departments);
            try
            {
                _context.SaveChanges();
            }
            catch (DbUpdateException)
            {
                if (DepartmentsExists(departments.departmentID))
                {
                    return new HttpStatusCodeResult(StatusCodes.Status409Conflict);
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtRoute("GetDepartments", new { id = departments.departmentID }, departments);
        }

        // DELETE: api/Departments/5
        [HttpDelete("{id}")]
        [Route("{id:int}")]
        public IActionResult DeleteDepartments(int id)
        {
            if (!ModelState.IsValid)
            {
                return HttpBadRequest(ModelState);
            }

            Departments departments = _context.Departments.Single(m => m.departmentID == id);
            if (departments == null)
            {
                return HttpNotFound();
            }

            _context.Departments.Remove(departments);
            _context.SaveChanges();

            return Ok(departments);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                _context.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool DepartmentsExists(int id)
        {
            return _context.Departments.Count(e => e.departmentID == id) > 0;
        }
    }
}