using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using Microsoft.AspNet.Http;
using Microsoft.AspNet.Mvc;
using Microsoft.Data.Entity;
using WebApplication1.Extentions;
using WebApplication1.Models;

namespace WebApplication1.Controllers
{
    [Produces("application/json")]
    [Route("api/[controller]/[action]")]
    public class TimeSpansController : Controller
    {
        private RasporedContext _context;

        public TimeSpansController(RasporedContext context)
        {
            _context = context;
        }

        // GET: api/TimeSpans
        [HttpGet]
        public IEnumerable<TimeSpans> GetTimeSpans()
        {
            return _context.TimeSpans;
        }

       

        // GET: api/TimeSpans/5
        [HttpGet("{id}", Name = "GetTimeSpans")]
        public IActionResult GetTimeSpans([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return HttpBadRequest(ModelState);
            }

            TimeSpans timeSpans = _context.TimeSpans.Single(m => m.timeSpanID == id);

            if (timeSpans == null)
            {
                return HttpNotFound();
            }

            return Ok(timeSpans);
        }

        // PUT: api/TimeSpans/5
        [HttpPut("{id}")]
        public IActionResult PutTimeSpans(int id, [FromBody] TimeSpans timeSpans)
        {
            if (!ModelState.IsValid)
            {
                return HttpBadRequest(ModelState);
            }

            if (id != timeSpans.timeSpanID)
            {
                return HttpBadRequest();
            }

            _context.Entry(timeSpans).State = EntityState.Modified;

            try
            {
                _context.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TimeSpansExists(id))
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

        // POST: api/TimeSpans
        [HttpPost]
        public IActionResult PostTimeSpans([FromBody] TimeSpans timeSpans)
        {
            if (!ModelState.IsValid)
            {
                return HttpBadRequest(ModelState);
            }

            _context.TimeSpans.Add(timeSpans);
            try
            {
                _context.SaveChanges();
            }
            catch (DbUpdateException)
            {
                if (TimeSpansExists(timeSpans.timeSpanID))
                {
                    return new HttpStatusCodeResult(StatusCodes.Status409Conflict);
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtRoute("GetTimeSpans", new { id = timeSpans.timeSpanID }, timeSpans);
        }

        // DELETE: api/TimeSpans/5
        [HttpDelete("{id}")]
        public IActionResult DeleteTimeSpans(int id)
        {
            if (!ModelState.IsValid)
            {
                return HttpBadRequest(ModelState);
            }

            TimeSpans timeSpans = _context.TimeSpans.Single(m => m.timeSpanID == id);
            if (timeSpans == null)
            {
                return HttpNotFound();
            }

            _context.TimeSpans.Remove(timeSpans);
            _context.SaveChanges();

            return Ok(timeSpans);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                _context.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool TimeSpansExists(int id)
        {
            return _context.TimeSpans.Count(e => e.timeSpanID == id) > 0;
        }
    }
}