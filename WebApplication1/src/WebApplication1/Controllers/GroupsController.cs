using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNet.Http;
using Microsoft.AspNet.Mvc;
using Microsoft.Data.Entity;
using WebApplication1.Models;
using Newtonsoft.Json;
using WebApplication1.Exceptions;
using TimeSpan = WebApplication1.Data.TimeSpan;

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

        // vraca termine ostalih grupa raspodele
        [HttpGet("{id}", Name = "GetAllBulletinBoardChoices")]
        public IActionResult GetAllBulletinBoardChoices([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return HttpBadRequest(ModelState);
            }

            try
            {
                var BulletinBoardChoices = Data.Group.GetAllBulletinBoardChoices(id);
                return Ok(BulletinBoardChoices);
            }
            catch (Exception ex)
            {
                return Ok(new { status = "greska", message = ex.Message });
            }
        }

        // vraca oglase koji odgovaraju studentu iz grupe groupID (sa kojima bi mogo da se menja)
        [HttpGet("{id}", Name = "GetPossibleBulletinBoardChoices")]
        public IActionResult GetPossibleBulletinBoardChoices([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return HttpBadRequest(ModelState);
            }

            try
            {
                var BulletinBoardChoices = Data.Group.GetPossibleBulletinBoardChoices(id);
                return Ok(BulletinBoardChoices);
            }
            catch (Exception ex)
            {
                return Ok(new { status = "greska", message = ex.Message });
            }
        }

        // menja studenta sa onim koji je postavio oglas koji mu odgovara
        //[HttpGet("{id}", Name = "ExchangeStudents")]
        public IActionResult ExchangeStudents(int groupID, int adID)
        {
            if (!ModelState.IsValid)
            {
                return HttpBadRequest(ModelState);
            }

            try
            {
                // TODO vadi iz sesije
                Data.Group.ExchangeStudents(4, groupID, adID);
                return Ok(new { status = "uspelo" });
            }
            catch (Exception ex)
            {
                return Ok(new { status = "greska", message = ex.Message });
            }
        }

        public class AddAdBinding
        {
            public int? groupID;
            public List<int> groupIDs;
        }

        [HttpPost]
        public IActionResult AddAd([FromBody] AddAdBinding obj)
        {
            if ( obj?.groupID == null || obj?.groupIDs == null)
            {
                return Ok(new { status = "parameter error" });
            }
            try
            {
                // TODO vadi iz sesije
                Data.Group.AddAd(3, obj.groupID.Value, obj.groupIDs);
                return Ok(new { status = "uspelo" });
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

        public class TimeSpanBinding
        {
            public DateTime startDate;
            public DateTime endDate;
            public int? period;
            public int? dayOfWeek;
            public string timeStart;
            public string timeEnd;
        }

        public class GroupEditBinding
        {
            public int? groupID;
            public int? classroomID;
            public TimeSpanBinding timespan;
        }

        public class MassGroupEditBinding
        {
            public GroupEditBinding[] groups;
        }

        [HttpPost]
        public IActionResult MassGroupEdit([FromBody] MassGroupEditBinding obj)
        {
            if (obj?.groups == null)
            {
                return Ok(new { status = "parameter error" });
            }

            try
            {
                foreach (GroupEditBinding group in obj.groups)
                {
                    if (group.timespan != null)
                    {
                        if (group.timespan.period == null)
                            return Ok(new { status = "parameter error" });

                        // nzm zasto ovo nece
                        if (group.timespan.startDate == null)
                            return Ok(new { status = "parameter error" });
                        if (group.timespan.endDate == null)
                            return Ok(new { status = "parameter error" });

                        if (group.timespan.period.Value != 0 && (group.timespan.timeStart == null || group.timespan.timeEnd == null || group.timespan.dayOfWeek == null))
                            return Ok(new { status = "parameter error" });

                    }

                    //konvertovanje u timeSpan
                    TimeSpans ts = TimeSpan.getTimeSpan(group.timespan);

                    Data.Group.Update(group.groupID.Value, null, group.classroomID, ts);
                }
                return Ok(new { status = "uspelo" });
            }
            catch (InconsistentDivisionException ex)
            {
                return Ok(new { status = "inconsistent division", message = ex.Message });
            }
            catch (Exception ex)
            {
                return Ok(new { status = "neuspelo", message = ex.Message });
            }
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
            public TimeSpanBinding timespan;
        }

        // POST: api/Groups/Update
        [HttpPost]
        public IActionResult Update([FromBody] GroupsController.UpdateGroupBinding obj)
        {
            
            if (obj == null)
            {
                return Ok(new {status="parameter error"});
            }

            if (obj.timespan != null)
            {
                if (obj.timespan.period == null)
                    return Ok(new { status = "parameter error" });

                // nzm zasto ovo nece
                if (obj.timespan.startDate == null) 
                    return Ok(new { status = "parameter error" });
                if (obj.timespan.endDate == null)
                    return Ok(new { status = "parameter error" });

                if (obj.timespan.period.Value != 0 && (obj.timespan.timeStart == null || obj.timespan.timeEnd == null || obj.timespan.dayOfWeek == null))
                    return Ok(new { status = "parameter error" });

            }

            try
            {
                if (obj.assistantID != null)
                {
                    Data.Group.SetAsstant(obj.groupID.Value, obj.assistantID.Value);
                }

                //konvertovanje u timeSpan
                TimeSpans ts = TimeSpan.getTimeSpan(obj.timespan);

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
                        ts);
                    Data.Group.ChangeStudents(newGroup.groupID, obj.students.ToList());
                }
                else //update grupe
                {

                    //provera konzistentnosti raspodele
                    //Data.Group.CheckConsistencyWithOtherGroups(obj.groupID.Value, obj.students.ToList());
                       

                    Data.Group.Update(obj.groupID.Value, obj.name, obj.classroomID, ts);
                    Data.Group.ChangeStudents(obj.groupID.Value, obj.students.ToList());

                }
                return Ok(new { status = "uspelo" });
            }
            catch (InconsistentDivisionException ex)
            {
                return Ok(new { status = "inconsistent division", message = ex.Message });
            }
            catch (Exception ex)
            {
                return Ok(new { status = "neuspelo", message = ex.Message });
            }

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
            if (obj?.groupID == null)
            {
                return Ok(new { status = "parameter error" });
            }

            try
            {
                //TODO vadi iz sesije
                Data.Group.AddActivity(1, obj.groupID.Value, obj.classroomID, obj.timespan, obj.place, obj.title, obj.content);
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
            public TimeSpans timespan;
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
                Data.Group.CancelClass(obj.groupID, obj.title, obj.content, obj.timespan);
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