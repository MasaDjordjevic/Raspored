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
    public class DivisionsController : Controller
    {
        private RasporedContext _context;

        public DivisionsController(RasporedContext context)
        {
            _context = context;
        }
        

        // GET: api/Divisions
        [HttpGet]
        public IEnumerable<Divisions> GetDivisions()
        {
            return _context.Divisions;
        }

        // GET: api/Divisions/GetDivision/{id}
        // Vrati raspodelu ciji ID odgovara prosledjenom.
        [HttpGet("{id}", Name = "GetDivision")]
        public IActionResult GetDivision(int id)
        {
            if (!ModelState.IsValid)
            {
                return HttpBadRequest(ModelState);
            }

            Divisions divisions = _context.Divisions.Single(m => m.divisionID == id);

            if (divisions == null)
            {
                return HttpNotFound();
            }

            //TODO vrati gresku ako ne postoji raspodela (division) sa tim ID-jem.
            //TODO ne samo ovde nego svuda
            return Ok(divisions);
        }

        // GET: api/Divisions/GetDivisions/5
        // Vrati sve raspodele (divisions) koje pripadaju smeru (department) ciji je ID prosledjen.
        [HttpGet("{id}", Name = "GetDivisions")]
        [Route("{id:int}")]
        public IActionResult GetDivisions([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return HttpBadRequest(ModelState);
            }

            var allDivisions = (from div in _context.Divisions
                                where div.departmentID == id
                select
                    new
                    {
                        divisionID = div.divisionID,
                        creatorID = div.creatorID,
                        creatorName = (from a in _context.UniMembers where a.uniMemberID == div.creatorID select a.name).First(),
                        divisionTypeID = div.divisionTypeID,
                        divisionTypeName =
                            (from a in _context.DivisionTypes where a.divisionTypeID == div.divisionTypeID select a.type).First(),
                        beginning = div.beginning,
                        ending = div.ending,
                        departmentID = div.departmentID,
                        departmentName = (from a in _context.Departments where a.departmentID == div.departmentID select a.departmentName).First(),
                        }).ToList();

            var divisions = (from div in allDivisions
                             group div by div.divisionTypeName
                                into newDivs
                                orderby newDivs.Key
                                select new {type = newDivs.Key, divisions = newDivs}).ToList();

            if (divisions == null)
            {
                return HttpNotFound();
            }

            return Ok(divisions);
        }

        // PUT: api/Divisions/5
        [HttpPut("{id}")]
        public IActionResult PutDivisions(int id, [FromBody] Divisions divisions)
        {
            if (!ModelState.IsValid)
            {
                return HttpBadRequest(ModelState);
            }

            if (id != divisions.divisionID)
            {
                return HttpBadRequest();
            }

            _context.Entry(divisions).State = EntityState.Modified;

            try
            {
                _context.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!DivisionsExists(id))
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

        // POST: api/Divisions
        [HttpPost]
        public IActionResult PostDivisions([FromBody] Divisions divisions)
        {
            if (!ModelState.IsValid)
            {
                return HttpBadRequest(ModelState);
            }

            _context.Divisions.Add(divisions);
            try
            {
                _context.SaveChanges();
            }
            catch (DbUpdateException)
            {
                if (DivisionsExists(divisions.divisionID))
                {
                    return new HttpStatusCodeResult(StatusCodes.Status409Conflict);
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtRoute("GetDivisions", new { id = divisions.divisionID }, divisions);
        }

        // DELETE: api/Divisions/5
        [HttpDelete("{id}")]
        public IActionResult DeleteDivisions(int id)
        {
            if (!ModelState.IsValid)
            {
                return HttpBadRequest(ModelState);
            }

            Divisions divisions = _context.Divisions.Single(m => m.divisionID == id);
            if (divisions == null)
            {
                return HttpNotFound();
            }

            _context.Divisions.Remove(divisions);
            _context.SaveChanges();

            return Ok(divisions);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                _context.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool DivisionsExists(int id)
        {
            return _context.Divisions.Count(e => e.divisionID == id) > 0;
        }
    }
}