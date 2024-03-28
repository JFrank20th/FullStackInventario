using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Dto
{
    public class GetDatosTokensUsuarioDto
    {
        public string Identificacion_Usuario { get; set; }
        public string Id_Tipo_Identificacion { get; set; }
        public string Nombres { get; set; }
        public string Apellidos { get; set; }
        public string Cargo { get; set; }
        public string Email { get; set; }
        public string Firma_Imagen { get; set; }
    }
}
