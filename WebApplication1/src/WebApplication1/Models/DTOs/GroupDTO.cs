using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebApplication1.Models.DTOs
{
    public class GroupDTO
    {
        public int groupID;
        public int? classroomID;
        public int? timeSpanID;
        public string classroomNumber;
        public TimeSpans timeSpan;
    }
}
