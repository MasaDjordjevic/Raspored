using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNet.Http;
using Microsoft.AspNet.Mvc;
using Microsoft.Data.Entity;
using Microsoft.Data.Entity.Query.Expressions;
using WebApplication1.Models;
using Newtonsoft.Json;

namespace WebApplication1.Controllers
{
    [Produces("application/json")]
    [Route("api/[controller]/[action]")]
    public class GroupsController : Controller
    {
        private RasporedContext _context;

        public GroupsController(RasporedContext context)
        {
            _context = context;
        }

         // [GET] api/Groups
         // Vrati sve grupe.
        [HttpGet]
        public IActionResult GetAllGroups()
        {
            return Ok(Data.Group.GetAllGroups());
        }

        // [GET] api/Groups/GetGroup/{group-id}
        // Vrati studente ciji je ID prosledjen.
        [HttpGet("{id}", Name = "GetGroup")]
        public IActionResult GetGroup(int id)
        {
            if (!ModelState.IsValid)
            {
                return HttpBadRequest(ModelState);
            }

            Groups group = Data.Group.GetGroup(id);

            if (group == null)
            {
                return HttpNotFound();
            }

            return Ok(JsonConvert.SerializeObject(group, Formatting.Indented,
                                    new JsonSerializerSettings
                                    {
                                        ReferenceLoopHandling = ReferenceLoopHandling.Ignore
                                    }));
        }

        // GET: api/Groups/GetGroups/{division-id}
        // Vrati sve grupe koje pripadaju prosledjenoj raspodeli (division).
        [HttpGet("{id}", Name = "GetGroups")]
        public IActionResult GetGroups([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return HttpBadRequest(ModelState);
            }

            var groups = Data.Group.GetGroupsOfDivision(id);

            if (groups == null)
            {
                return HttpNotFound();
            }

            return Ok(JsonConvert.SerializeObject(groups, Formatting.Indented,
                                    new JsonSerializerSettings
                                    {
                                        ReferenceLoopHandling = ReferenceLoopHandling.Ignore
                                    }));
        }

        // PUT: api/Groups/5
        [HttpPut("{id}")]
        public IActionResult PutGroups(int id, [FromBody] Groups groups)
        {
            if (!ModelState.IsValid)
            {
                return HttpBadRequest(ModelState);
            }

            if (id != groups.groupID)
            {
                return HttpBadRequest();
            }

            _context.Entry(groups).State = EntityState.Modified;

            try
            {
                _context.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!GroupsExists(id))
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


        //svi parametri moraju da budu nullable da ceo objekat ne bi bio null ukoliko se jedan od paremetara ne posalje
        public class UpdateGroupBinding
        {
            public int? groupID;
            public string name;
            public int? classroomID;
            public IEnumerable<int> students;
            public int? divisionID;
            public int? assistantID;
        }

        // POST: api/Groups/Update
        [HttpPost]
        public IActionResult Update([FromBody] GroupsController.UpdateGroupBinding obj)
        {
            if (obj == null)
            {
                return Ok(new {status="parameter error"});
            }

            if (obj.assistantID != null)
            {
                Data.Group.AddAsstant(obj.groupID.Value, obj.assistantID.Value);
            }

            //dodavanje groupe
            if (obj.groupID == null)
            {
                if (obj.divisionID == null)
                {
                    return Ok(new { status = "parameter error" });
                }

                //provera konzistentnosti raspodele
                if (!Data.Group.CheckConsistencyOfGroup(null, obj.students.ToList()))
                {
                    return Ok(new {status = "inconsistent division"});
                }

                Groups newGroup = Data.Group.Create(obj.divisionID.Value, obj.name, obj.classroomID);
                Data.Group.ChangeSudents(newGroup.groupID, obj.students.ToList());
                return Ok(new { status = "uspelo" });
            }
            else //update grupe
            {
                //provera konzistentnosti raspodele
                if (!Data.Group.CheckConsistencyOfGroup(obj.groupID.Value, obj.students.ToList()))
                {
                    return Ok(new { status = "inconsistent division" });
                }

                if (obj.assistantID != null)
                {
                    Data.Group.AddAsstant(obj.groupID.Value, obj.assistantID.Value);
                }

                Data.Group.Update(obj.groupID.Value, obj.name, obj.classroomID);
                Data.Group.ChangeSudents(obj.groupID.Value, obj.students.ToList());
                return Ok(new { status = "uspelo" });
            }

         
        }

        public class AddActivityBinding
        {
            public int? groupID;
            public int? classroomID;
            public int? courseID;
            public string place;
            public string title;
            public string content;
            public TimeSpans timespan;
        }

        // POST: api/Groups/AddActivity
        [HttpPost]
        public IActionResult AddActivity([FromBody] AddActivityBinding obj)
        {
            if (obj == null || obj.groupID == null)
            {
                return Ok(new { status = "parameter error" });
            }

            Data.Group.AddActivity(obj.groupID.Value, obj.classroomID, obj.courseID, obj.timespan, obj.place, obj.title, obj.content);

            return Ok(new { status = "uspelo" });
        }



        // POST: api/Groups
        [HttpPost]
        public IActionResult PostGroups([FromBody] Groups groups)
        {
            if (!ModelState.IsValid)
            {
                return HttpBadRequest(ModelState);
            }

            _context.Groups.Add(groups);
            try
            {
                _context.SaveChanges();
            }
            catch (DbUpdateException)
            {
                if (GroupsExists(groups.groupID))
                {
                    return new HttpStatusCodeResult(StatusCodes.Status409Conflict);
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtRoute("GetGroups", new { id = groups.groupID }, groups);
        }

        // DELETE: api/Groups/5
        [HttpDelete("{id}")]
        public IActionResult DeleteGroups(int id)
        {
            if (!ModelState.IsValid)
            {
                return HttpBadRequest(ModelState);
            }

            Groups groups = _context.Groups.Single(m => m.groupID == id);
            if (groups == null)
            {
                return HttpNotFound();
            }

            _context.Groups.Remove(groups);
            _context.SaveChanges();

            return Ok(groups);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                _context.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool GroupsExists(int id)
        {
            return _context.Groups.Count(e => e.groupID == id) > 0;
        }
    }
}