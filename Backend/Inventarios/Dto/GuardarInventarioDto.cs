using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Dto
{
    public class GuardarInventarioDto
    {
        public string Serial { get; set; }
        public string Placa { get; set; }
        public string Id_Proveedor { get; set; }
        public string Id_Tipo_Activo { get; set; }
        public string Id_Marca { get; set; }
        public string Id_Bodega { get; set; }
    }
}
