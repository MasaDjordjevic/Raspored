using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNet.Http;
using Microsoft.AspNet.Mvc;
using Microsoft.Data.Entity;
using WebApplication1.Exceptions;
using WebApplication1.Models;

namespace WebApplication1.Controllers
{
    [Produces("application/json")]
    [Route("api/[controller]/[action]")]
    public class ActivitySchedulesController : Controller
    {
       [HttpGet]
        public IActionResult GetCurrentSemesterTimeSpan()
        {
            return Ok(Data.Schedule.GetCurrentSemesterTimeSpan());
        }


        // asistent
        [HttpGet("{id}", Name = "DeleteGlobalActivity")]
        public IActionResult DeleteGlobalActivity([FromRoute] int id)
        {
            if (!HttpContext.Session.IsAssistant()) return HttpUnauthorized();

            try
            {
                Data.Group.DeleteActivity(id);
                return Ok(new { status = "uspelo" });
            }
            catch (Exception ex)
            {
                return Ok(new { status = "nije uspelo", message = ex.Message });
            }
        }
    }
}