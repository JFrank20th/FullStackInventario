using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Dto
{
    public class InsertTemplateMailDto
    {
        public int Id { get; set; }
        public string Nombre { get; set; }
        public string Asunto { get; set; }
        public string CC { get; set; }
        public string CCO { get; set; }
        public string Body { get; set; }
    }
}
