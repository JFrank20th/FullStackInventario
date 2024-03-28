using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Dto
{
    public class GetInventarioDto
    {
        public string Id_Inventario { get; set; }
        public string Serial { get; set; }
        public string Placa { get; set; }
        public string Foto { get; set; }
        public string Descripcion { get; set; }
        public string Identificacion_Usuario { get; set; }
        public string Id_Proveedor { get; set; }
        public string Proveedor { get; set; }
        public string Id_Tipo_Activo { get; set; }
        public string Nombre_Activo { get; set; }

        public string Id_Procesador { get; set; }
        public string Procesador { get; set; }
        public string Id_RAM { get; set; }
        public string RAM { get; set; }
        public string Id_Disco { get; set; }
        public string Disco { get; set; }


        public string Id_Marca { get; set; }
        public string Marca { get; set; }
        public string Soporte { get; set; }
        public string Id_Estado_Inventario { get; set; }
        public string Nombre_Estado { get; set; }

        public string Id_Ciudad { get; set; }
        public string Ciudad { get; set; }
        public string Id_Sede { get; set; }
        public string Id_Piso { get; set; }
        public string Id_Puesto { get; set; }
        public string Id_Centro_Costo { get; set; }
        public string Centro_Costo { get; set; }
        public string Dev_Proveedor { get; set; }
        public string Home_Office { get; set; }
        

    }
}
