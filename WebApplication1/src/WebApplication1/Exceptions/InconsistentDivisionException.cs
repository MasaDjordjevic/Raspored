using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebApplication1.Exceptions
{
    public class InconsistentDivisionException : Exception
    {
        public InconsistentDivisionException(string message): base(message)
        {
        }
    }
}
