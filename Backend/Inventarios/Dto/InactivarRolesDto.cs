using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Dto
{
    public class InactivarRolesDto
    {
        public int Id_Rol { get; set; }
        public string Nombre_Rol { get; set; }
        public string Descripcion { get; set; }
        public int Nombre_Estado { get; set; }
    }
}
