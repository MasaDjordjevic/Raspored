using System.Linq;
using Microsoft.AspNet.Http;
using Microsoft.AspNet.Mvc;
using Microsoft.Data.Entity;
using WebApplication1.Exceptions;
using WebApplication1.Models;

namespace WebApplication1.Controllers
{
    [Produces("application/json")]
    [Route("api/Roles")]
    public class RolesController : Controller
    {
        private RasporedContext _context;

        public RolesController(RasporedContext context)
        {
            _context = context;
        }

        // GET: api/Roles
        [HttpGet]
        public IActionResult GetRoles()
        {
            if (!HttpContext.Session.IsAssistant()) return HttpUnauthorized();

            var roles = (from a in _context.Roles select new { id = a.roleID, name = a.name}).ToList();
            return Ok(roles);
        }

        // GET: api/Roles/5
        [HttpGet("{id}", Name = "GetRoles")]
        public IActionResult GetRoles([FromRoute] int id)
        {
            if (!HttpContext.Session.IsAssistant()) return HttpUnauthorized();

            if (!ModelState.IsValid)
            {
                return HttpBadRequest(ModelState);
            }

            Roles roles = _context.Roles.Single(m => m.roleID == id);

            if (roles == null)
            {
                return HttpNotFound();
            }

            return Ok(roles);
        }

        // PUT: api/Roles/5
        [HttpPut("{id}")]
        public IActionResult PutRoles(int id, [FromBody] Roles roles)
        {
            if (!HttpContext.Session.IsAssistant()) return HttpUnauthorized();

            if (!ModelState.IsValid)
            {
                return HttpBadRequest(ModelState);
            }

            if (id != roles.roleID)
            {
                return HttpBadRequest();
            }

            _context.Entry(roles).State = EntityState.Modified;

            try
            {
                _context.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!RolesExists(id))
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

        // POST: api/Roles
        [HttpPost]
        public IActionResult PostRoles([FromBody] Roles roles)
        {
            if (!HttpContext.Session.IsAssistant()) return HttpUnauthorized();

            if (!ModelState.IsValid)
            {
                return HttpBadRequest(ModelState);
            }

            _context.Roles.Add(roles);
            try
            {
                _context.SaveChanges();
            }
            catch (DbUpdateException)
            {
                if (RolesExists(roles.roleID))
                {
                    return new HttpStatusCodeResult(StatusCodes.Status409Conflict);
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtRoute("GetRoles", new { id = roles.roleID }, roles);
        }

        // DELETE: api/Roles/5
        [HttpDelete("{id}")]
        public IActionResult DeleteRoles(int id)
        {
            if (!HttpContext.Session.IsAssistant()) return HttpUnauthorized();

            if (!ModelState.IsValid)
            {
                return HttpBadRequest(ModelState);
            }

            Roles roles = _context.Roles.Single(m => m.roleID == id);
            if (roles == null)
            {
                return HttpNotFound();
            }

            _context.Roles.Remove(roles);
            _context.SaveChanges();

            return Ok(roles);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                _context.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool RolesExists(int id)
        {
            return _context.Roles.Count(e => e.roleID == id) > 0;
        }
    }
}