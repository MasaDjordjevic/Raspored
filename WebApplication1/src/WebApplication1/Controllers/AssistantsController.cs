using System.Collections;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNet.Http;
using Microsoft.AspNet.Mvc;
using Microsoft.Data.Entity;
using Newtonsoft.Json;
using WebApplication1.Models;

namespace WebApplication1.Controllers
{
    [Produces("application/json")]
    [Route("api/[controller]/[action]")]
    public class AssistantsController : Controller
    {
        private RasporedContext _context;

        public AssistantsController(RasporedContext context)
        {
            _context = context;
        }

       
        [HttpGet]
        public IEnumerable GetAssistants()
        {
            return Data.Assistant.GetAllAssistants();
        }

      
        [HttpGet("{id}", Name = "GetAssistant")]
        public IActionResult GetAssistant(int id)
        {
            if (!ModelState.IsValid)
            {
                return HttpBadRequest(ModelState);
            }

            var assistant = Data.Assistant.GetAssistant(id);

            if (assistant == null)
            {
                return HttpNotFound();
            }

            return Ok(JsonConvert.SerializeObject(assistant, Formatting.Indented,
                                    new JsonSerializerSettings
                                    {
                                        ReferenceLoopHandling = ReferenceLoopHandling.Ignore
                                    }));
        }

        [HttpGet("{id}", Name = "getAssistantsByGroupID")]
        public IActionResult GetAssistantsByGroupID(int id)
        {
            if (!ModelState.IsValid)
            {
                return HttpBadRequest(ModelState);
            }

            var assistants = Data.Assistant.GetAssistantsByGroupID(id);

            if (assistants == null)
            {
                return HttpNotFound();
            }

            return Ok(assistants);
        }

        [HttpGet]
        public IActionResult GetSchedule(int assistantID, int weeksFromNow)
        {
            if (!ModelState.IsValid)
            {
                return HttpBadRequest(ModelState);
            }

            var schedule = Data.Assistant.GetSchedule(assistantID, weeksFromNow);

            if (schedule == null)
            {
                return HttpNotFound();
            }

            return Ok(schedule);
        }


    }
}