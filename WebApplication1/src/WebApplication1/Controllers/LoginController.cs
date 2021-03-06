using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Security.Claims;
using Microsoft.AspNet.Http;
using Microsoft.AspNet.Mvc;
using Microsoft.Data.Entity;
using Microsoft.Data.Entity.Query.Expressions;
using Newtonsoft.Json;
using WebApplication1.Exceptions;
using WebApplication1.Models;

namespace WebApplication1.Controllers
{
    [Produces("application/json")]
    [Route("api/[controller]/[action]")]
    public class LoginController : Controller
    {
        public class LoginBinding
        {
            public string username;
            public string password;
        }

        [HttpGet]
        public IActionResult LoginRedirect()
        {
            UniMembers usr = HttpContext.Session.GetUser();
            if (usr == null)
                return Ok(new {status = "nista"});
            
            return Redirect(usr);
        }

        public IActionResult Redirect(UniMembers usr)
        {
            //asistent
            if (usr.studentID == null)
            {
                HttpContext.Session.SetString("role", "assistant");
                return Ok(new { status = "uspelo", url = "/assistant-panel" });
            }
            else //student
            {
                HttpContext.Session.SetString("role", "student");
                return Ok(new { status = "uspelo", url = "/student-panel" });
            }
        }

        [HttpPost]
        public IActionResult Login([FromBody] LoginBinding obj)
        {
            if (String.IsNullOrEmpty(obj.username) || String.IsNullOrEmpty(obj.password))
            {
                return Ok(new { status = "parameter error" });
            }

            try
            {
                UniMembers usr = Data.Login.UserLogin(obj.username, obj.password);
                HttpContext.Session.SetUser(JsonConvert.DeserializeObject<UniMembers>(
                    (JsonConvert.SerializeObject(usr, Formatting.Indented,
                                    new JsonSerializerSettings
                                    {
                                        ReferenceLoopHandling = ReferenceLoopHandling.Ignore
                                    }))));

                return Redirect(usr);


            }
            catch (Exception ex)
            {
                return Ok(new {status = "nije uspelo", message = ex.Message});
            }
          
        }

        [HttpGet]
        public IActionResult GetUser()
        {
            //mora ovako ruzno jer se tako ocekuje na frontu
            if (HttpContext.Session.IsStudent())
            {
                var student = Data.Student.GetStudent(HttpContext.Session.GetStudentID());
                return Ok(JsonConvert.SerializeObject(student, Formatting.Indented,
                    new JsonSerializerSettings
                    {
                        ReferenceLoopHandling = ReferenceLoopHandling.Ignore
                    }));
            }

            if (HttpContext.Session.IsAssistant())
            {
                var assistnat = Data.Assistant.GetAssistant(HttpContext.Session.GetAssistantID());

                return Ok(JsonConvert.SerializeObject(assistnat, Formatting.Indented,
                    new JsonSerializerSettings
                    {
                        ReferenceLoopHandling = ReferenceLoopHandling.Ignore
                    }));
            }

            return HttpUnauthorized();
        }

        [HttpGet]
        public IActionResult Logout()
        {
            try
            {
                HttpContext.Session.SetUser(null);
                return Ok(new {status="uspelo"});
            }
            catch (Exception ex)
            {
                return Ok(new { status = "nije uspelo", message = ex.Message });
            }
        }

        [HttpGet]
        public IActionResult IsAllowedStudent()
        {
            if (HttpContext.Session.IsStudent())
            {
                return Ok(new {status="uspelo"});
            }
            else
            {
                return HttpUnauthorized();
            }
        }

        [HttpGet]
        public IActionResult IsAllowedAssistant()
        {
            if (HttpContext.Session.IsAssistant())
            {
                return Ok(new { status = "uspelo" });
            }
            else
            {
                return HttpUnauthorized();
            }
        }
    }
}