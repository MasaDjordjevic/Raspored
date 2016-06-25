using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNet.Http;
using Microsoft.AspNet.Mvc;
using Microsoft.Data.Entity;
using Newtonsoft.Json;
using WebApplication1.Data;
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


        [HttpGet]
        public IActionResult DivideWithX(int courseID, int x, int sortOrder)
        {
            var groups =  Data.Division.DivideWithX(courseID, x, sortOrder);

            if (groups == null)
            {
                return HttpNotFound();
            }

            return Ok(groups);
        }

        [HttpGet]
        public IActionResult DivideOnX(int courseID, int x, int sortOrder)
        {
            var groups = Data.Division.DivideOnX(courseID, x, sortOrder);

            if (groups == null)
            {
                return HttpNotFound();
            }

            return Ok(groups);
        }

        [HttpGet("{id}", Name = "GetDivisionsOfDepartment")]
        public IActionResult GetDivisionsOfDepartment(int id)
        {
            if (!ModelState.IsValid)
            {
                return HttpBadRequest(ModelState);
            }

            var divisions = Data.Division.GetDivisionsOfDepartment(id);

            if (divisions == null)
            {
                return HttpNotFound();
            }
            return Ok(JsonConvert.SerializeObject(divisions, Formatting.Indented,
                                    new JsonSerializerSettings
                                    {
                                        ReferenceLoopHandling = ReferenceLoopHandling.Ignore
                                    }));
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

            var division = Data.Division.GetDivison(id);

            if (division == null)
            {
                return HttpNotFound();
            }
            return Ok(JsonConvert.SerializeObject(division, Formatting.Indented,
                                    new JsonSerializerSettings
                                    {
                                        ReferenceLoopHandling = ReferenceLoopHandling.Ignore
                                    }));
        }

        [HttpGet("{id}", Name = "ExportDivisionToPdf")]
        public ActionResult ExportDivisionToPdf(int id)
        {
            var division = Data.Division.GetDivison(id);

            if (division == null)
            {
               // return HttpNotFound();
            }

            return View(division);
        }

       


        [HttpGet]
        public IActionResult GetAllDivisionTypes()
        {
            var divisionTypes = (from a in _context.DivisionTypes select a).ToList();
            return Ok(divisionTypes);
        }

        public class CreateInitialDivisionParameterBinding
        {
            public string name;
            public int departmentID;
            public int courseID;
            public int divisionTypeID;
            public DateTime beginning;
            public DateTime ending;
            public IEnumerable<Division.GroupOfStudents> groups;
        }

        [HttpPost]
        public IActionResult CreateInitialDivision([FromBody] DivisionsController.CreateInitialDivisionParameterBinding obj)
        {
            
            try
            {
                Data.Division.CreateInitialDivision(obj.name, obj.departmentID, obj.courseID, obj.divisionTypeID, obj.beginning, obj.ending, obj.groups.ToList());
            }
            catch (Exception ex)
            {
                return Ok(new { status = "neuspelo", message = ex.Message });
            }



            return Ok(new {status = "uspelo"});


            //return CreatedAtRoute("GetDivisions", new { id = divisions.divisionID }, divisions);
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

            var divisions = Data.Division.GetDivisionsOfDeparmentByType(id);

            if (divisions == null)
            {
                return HttpNotFound();
            }

            return Ok(divisions);
        }


       

        // PUT: api/Divisions/5
        [HttpPut("{id}")]
        public IActionResult PutDivisions(int id, [FromBody] Divisions division)
        {
            //Divisions d = ((JObject) divisions).ToObject<Divisions>();
            if (!ModelState.IsValid)
            {
                return HttpBadRequest(ModelState);
            }

            //if (id != divisions.divisionID)
            //{
            //    return HttpBadRequest();
            //}

            //_context.Entry(divisions).State = EntityState.Modified;

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

        //nicemu ne sluzi, inace se ne konvertuju lepo podaci, nzm zasto
        public class DivisionUpdateBinding
        {
            public int? divisionID;
            public string name;
            public DateTime beginning;
            public DateTime ending;
            public int? divisionTypeID;
            public int? courseID;
        }

        // POST: api/Divisions
        [HttpPost]
        public IActionResult UpdateDivision([FromBody] DivisionsController.DivisionUpdateBinding obj)
        {
            if (obj?.divisionID == null)
                return Ok(new {status = "parameter error"});

            try
            {
                Data.Division.UpdateDivision(obj.divisionID.Value, obj.name, obj.beginning, obj.ending, obj.divisionTypeID, obj.courseID);
                return Ok(new { status = "uspelo" });
            }
            catch (Exception ex)
            {
                return Ok(new { status = "inconsistent division", message = ex.Message });
            }
            
        }

        [HttpGet]
        public IActionResult CopyDivision(int divisionID)
        {
            if (!ModelState.IsValid)
            {
                return HttpBadRequest(ModelState);
            }

            try
            {
                Divisions newDivision = Data.Division.CopyDivision(divisionID);
                return Ok(new { status = "uspelo", division = newDivision });
            }
            catch (Exception ex)
            {
                return Ok(new { status = "inconsistent division", message = ex.Message });
            }
           
        }

        [HttpGet]
        public IActionResult DeleteDivision(int divisionID)
        {
            if (!ModelState.IsValid)
            {
                return HttpBadRequest(ModelState);
            }

            try
            {
                Data.Division.DeleteDivision(divisionID);
                return Ok(new {status = "uspelo"});
            }
            catch (Exception ex)
            {
                return Ok(new {status = "inconsistent division", message = ex.Message});
            }
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