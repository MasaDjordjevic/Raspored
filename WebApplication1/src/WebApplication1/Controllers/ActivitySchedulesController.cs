using System;
using System.Collections;
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
    public class ActivitySchedulesController : Controller
    {
        private RasporedContext _context;

        public ActivitySchedulesController(RasporedContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult GetCurrentSemesterTimeSpan()
        {
            return Ok(Data.Schedule.GetCurrentSemesterTimeSpan());
        }

        // GET: api/ActivitySchedules
        [HttpGet]
        public IEnumerable<ActivitySchedules> GetActivitySchedules()
        {
            return _context.ActivitySchedules;
        }

        [HttpGet]
        public IActionResult GetCurrentSemester()
        {
            var curr = (from a in _context.ActivitySchedules
                where a.beginning <= DateTime.Now && DateTime.Now <= a.ending
                select new
                {
                    semester = a.semester,
                    beginning = a.beginning,
                    ending = a.ending
                }).ToList();
            return Ok(curr);
        }

        // GET: api/ActivitySchedules/5
        [HttpGet("{id}", Name = "GetActivitySchedules")]
        public IActionResult GetActivitySchedules([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return HttpBadRequest(ModelState);
            }

            ActivitySchedules activitySchedules = _context.ActivitySchedules.Single(m => m.activityScheduleID == id);

            if (activitySchedules == null)
            {
                return HttpNotFound();
            }

            return Ok(activitySchedules);
        }

        // PUT: api/ActivitySchedules/5
        [HttpPut("{id}")]
        public IActionResult PutActivitySchedules(int id, [FromBody] ActivitySchedules activitySchedules)
        {
            if (!ModelState.IsValid)
            {
                return HttpBadRequest(ModelState);
            }

            if (id != activitySchedules.activityScheduleID)
            {
                return HttpBadRequest();
            }

            _context.Entry(activitySchedules).State = EntityState.Modified;

            try
            {
                _context.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ActivitySchedulesExists(id))
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

        // POST: api/ActivitySchedules
        [HttpPost]
        public IActionResult PostActivitySchedules([FromBody] ActivitySchedules activitySchedules)
        {
            if (!ModelState.IsValid)
            {
                return HttpBadRequest(ModelState);
            }

            _context.ActivitySchedules.Add(activitySchedules);
            try
            {
                _context.SaveChanges();
            }
            catch (DbUpdateException)
            {
                if (ActivitySchedulesExists(activitySchedules.activityScheduleID))
                {
                    return new HttpStatusCodeResult(StatusCodes.Status409Conflict);
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtRoute("GetActivitySchedules", new { id = activitySchedules.activityScheduleID }, activitySchedules);
        }

        // DELETE: api/ActivitySchedules/5
        [HttpDelete("{id}")]
        public IActionResult DeleteActivitySchedules(int id)
        {
            if (!ModelState.IsValid)
            {
                return HttpBadRequest(ModelState);
            }

            ActivitySchedules activitySchedules = _context.ActivitySchedules.Single(m => m.activityScheduleID == id);
            if (activitySchedules == null)
            {
                return HttpNotFound();
            }

            _context.ActivitySchedules.Remove(activitySchedules);
            _context.SaveChanges();

            return Ok(activitySchedules);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                _context.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool ActivitySchedulesExists(int id)
        {
            return _context.ActivitySchedules.Count(e => e.activityScheduleID == id) > 0;
        }
    }
}