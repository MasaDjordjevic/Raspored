using System;
using System.Collections.Generic;
using System.Linq;
using System.Transactions;
using Microsoft.AspNet.Http;
using Microsoft.AspNet.Mvc;
using Microsoft.Data.Entity;
using Microsoft.Data.Entity.Query.Expressions;
using WebApplication1.Models;
using Newtonsoft.Json;
using WebApplication1.Exceptions;

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

        // vraca vreme kada grupa ima cas u naredne 4 nedelje
        [HttpGet("{id}", Name = "GetActivityTimes")]
        public IActionResult GetActivityTimes([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return HttpBadRequest(ModelState);
            }

            try
            {
                var activityTimes = Data.Group.GetActivityTimes(id);
                return Ok(activityTimes);
            }
            catch (Exception ex)
            {
                return Ok(new { status = "greska", message = ex.Message });
            }
            

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
            public TimeSpans timespan;
        }

        // POST: api/Groups/Update
        [HttpPost]
        public IActionResult Update([FromBody] GroupsController.UpdateGroupBinding obj)
        {
            
            if (obj == null)
            {
                return Ok(new {status="parameter error"});
            }

            
            try
            {
                if (obj.assistantID != null)
                {
                    Data.Group.SetAsstant(obj.groupID.Value, obj.assistantID.Value);
                }


                //dodavanje groupe
                if (obj.groupID == null)
                {
                    if (obj.divisionID == null)
                    {
                        return Ok(new {status = "parameter error"});
                    }
                    //provera konzistentnosti raspodele
                    //Data.Group.CheckConsistencyWithOtherGroups(null, obj.students.ToList());

                    Groups newGroup = Data.Group.Create(obj.divisionID.Value, obj.name, obj.classroomID,
                        obj.timespan);
                    Data.Group.ChangeStudents(newGroup.groupID, obj.students.ToList());
                }
                else //update grupe
                {

                    //provera konzistentnosti raspodele
                    //Data.Group.CheckConsistencyWithOtherGroups(obj.groupID.Value, obj.students.ToList());
                       

                    Data.Group.Update(obj.groupID.Value, obj.name, obj.classroomID, obj.timespan);
                    Data.Group.ChangeStudents(obj.groupID.Value, obj.students.ToList());

                }
            }
            catch (InconsistentDivisionException ex)
            {
                return Ok(new { status = "inconsistent division", message = ex.Message });
            }
            catch (Exception ex)
            {
                return Ok(new { status = "neuspelo", message = ex.Message });
            }

            return Ok(new { status = "uspelo" });
            
        }

        public class AddActivityBinding
        {
            public int? groupID;
            public int? classroomID;
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

            try
            {
                Data.Group.AddActivity(obj.groupID.Value, obj.classroomID, obj.timespan, obj.place, obj.title, obj.content);
            }
            catch (Exception ex)
            {
                return Ok(new { status = "neuspelo", message = ex.Message });
            }

            return Ok(new { status = "uspelo" });
        }

        public class CancelClassBinding
        {
            public int groupID;
            public string title;
            public string content;
            public int weekNumber;
        }

        [HttpPost]
        public IActionResult CancelClass([FromBody] CancelClassBinding obj)
        {
            if (obj == null)
            {
                return Ok(new { status = "parameter error" });
            }

            try
            {
                Data.Group.CancelClass(obj.groupID, obj.title, obj.content, obj.weekNumber);
            }
            catch (Exception ex)
            {
                return Ok(new { status = "neuspelo", message = ex.Message });
            }

            return Ok(new {status = "uspelo"});
        }

        [HttpGet]
        public IActionResult GetSchedule(int groupID, int weeksFromNow)
        {
            if (!ModelState.IsValid)
            {
                return HttpBadRequest(ModelState);
            }

            try
            {
                var schedule = Data.Group.GetCombinedSchedule(groupID, weeksFromNow);

                if (schedule == null)
                {
                    return HttpNotFound();
                }

                return Ok(schedule);
            }
            catch (Exception ex)
            {
                return Ok(new { status = "neuspelo", message = ex.Message });
            }

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

            Groups group = _context.Groups.Single(m => m.groupID == id);
            if (group == null)
            {
                return HttpNotFound();
            }

            Data.Group.RemoveGroup(group);

            return Ok(group);
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