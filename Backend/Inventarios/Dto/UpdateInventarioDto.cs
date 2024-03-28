using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Dto
{
    public class UpdateInventarioDto
    {
        public string Id_Inventario { get; set; }
        public string Serial { get; set; }
        public string Placa { get; set; }
        public string Descripcion { get; set; }
        public string Foto { get; set; }
        public string Id_Proveedor { get; set; }
        public string Id_Tipo_Activo { get; set; }
        public string Id_Marca { get; set; }
        public string Id_Ciudad { get; set; }
        public string Id_Sede { get; set; }
        public string Id_Piso { get; set; }
        public string Id_Puesto { get; set; }
        public string Id_Procesador { get; set; }
        public string Id_RAM { get; set; }
        public string Id_Disco { get; set; }
        public string UserGeneral { get; set; }
    }
}
