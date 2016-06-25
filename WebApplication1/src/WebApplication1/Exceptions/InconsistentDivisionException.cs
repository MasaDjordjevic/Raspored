using System;

namespace WebApplication1.Exceptions
{
    public class InconsistentDivisionException : Exception
    {
        public InconsistentDivisionException(string message): base(message)
        {
        }
    }
}
