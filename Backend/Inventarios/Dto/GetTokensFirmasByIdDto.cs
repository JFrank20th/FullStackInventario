using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Dto
{
    public class GetTokensFirmasByIdDto
    {
        public string Id { get; set; }
        public string Id_Template { get; set; }
        public string Nombre { get; set; }
        public string Descripcion { get; set; }
        public string Token { get; set; }
        public string Estado { get; set; }
    }
}
