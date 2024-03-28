using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Dto
{
    public class GetTipoActivoDto
    {
        public string Id_Tipo_Activo { get; set; }
        public string Nombre_Activo { get; set; }
        public string Id_Estado { get; set; }
        public string ProcesadorRamDisco { get; set; }
    }
}
