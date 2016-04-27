using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNet.Http;
using Microsoft.AspNet.Mvc;
using Microsoft.Data.Entity;
using WebApplication1.Models;

namespace WebApplication1.Controllers
{
    [Produces("application/json")]
    [Route("api/UniMembers")]
    public class UniMembersController : Controller
    {
        private RasporedContext _context;

        public UniMembersController(RasporedContext context)
        {
            _context = context;
        }

        // GET: api/UniMembers
        [HttpGet]
        public IEnumerable<UniMembers> GetUniMembers()
        {
            return _context.UniMembers;
        }

        // GET: api/UniMembers/5
        [HttpGet("{id}", Name = "GetUniMembers")]
        public IActionResult GetUniMembers([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return HttpBadRequest(ModelState);
            }

            UniMembers uniMembers = _context.UniMembers.Single(m => m.uniMemberID == id);

            if (uniMembers == null)
            {
                return HttpNotFound();
            }

            return Ok(uniMembers);
        }

        // PUT: api/UniMembers/5
        [HttpPut("{id}")]
        public IActionResult PutUniMembers(int id, [FromBody] UniMembers uniMembers)
        {
            if (!ModelState.IsValid)
            {
                return HttpBadRequest(ModelState);
            }

            if (id != uniMembers.uniMemberID)
            {
                return HttpBadRequest();
            }

            _context.Entry(uniMembers).State = EntityState.Modified;

            try
            {
                _context.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UniMembersExists(id))
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

        // POST: api/UniMembers
        [HttpPost]
        public IActionResult PostUniMembers([FromBody] UniMembers uniMembers)
        {
            if (!ModelState.IsValid)
            {
                return HttpBadRequest(ModelState);
            }

            _context.UniMembers.Add(uniMembers);
            try
            {
                _context.SaveChanges();
            }
            catch (DbUpdateException)
            {
                if (UniMembersExists(uniMembers.uniMemberID))
                {
                    return new HttpStatusCodeResult(StatusCodes.Status409Conflict);
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtRoute("GetUniMembers", new { id = uniMembers.uniMemberID }, uniMembers);
        }

        // DELETE: api/UniMembers/5
        [HttpDelete("{id}")]
        public IActionResult DeleteUniMembers(int id)
        {
            if (!ModelState.IsValid)
            {
                return HttpBadRequest(ModelState);
            }

            UniMembers uniMembers = _context.UniMembers.Single(m => m.uniMemberID == id);
            if (uniMembers == null)
            {
                return HttpNotFound();
            }

            _context.UniMembers.Remove(uniMembers);
            _context.SaveChanges();

            return Ok(uniMembers);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                _context.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool UniMembersExists(int id)
        {
            return _context.UniMembers.Count(e => e.uniMemberID == id) > 0;
        }
    }
}