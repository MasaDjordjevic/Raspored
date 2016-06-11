using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebApplication1.Extentions
{
    public static class StringExtensions
    {
        public static string Concat(this IEnumerable<string> source, string separator)
        {
            StringBuilder sb = new StringBuilder();
            foreach (string s in source)
            {
                sb.Append(s);
                sb.Append(separator);
            }
            return sb.ToString();
        }
    }
}
