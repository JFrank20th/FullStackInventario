using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Dto
{
    public class GetApiDocumentDto
    {
        public string Id_Plantilla { get; set; }
        public string Nombre { get; set; }
        public string Descripcion { get; set; }
        public string Id_Acta_Drive { get; set; }
        public string Id_Estado { get; set; }
        public string Token { get; set; }
        public string Tipo_Plantilla { get; set; }
    }
}
