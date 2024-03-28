using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Dto
{
    public class GetAsignacionDto
    {
        public string Id { get; set; }
        public string Identificacion_Usuario { get; set; }
        public string Id_Tipo_Identificacion { get; set; }
        public string Nombres { get; set; }
        public string Apellidos { get; set; }
        public string Direccion_Domicilio { get; set; }
        public string Id_Centro_Costos { get; set; }
        public string Id_Cargo { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string Id_Rol { get; set; }
        public string Id_Estado { get; set; }
        public string Fecha_Creacion { get; set; }
    }
}
