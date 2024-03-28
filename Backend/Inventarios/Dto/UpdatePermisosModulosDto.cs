using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Dto
{
    public class UpdatePermisosModulosDto
    {
        public int Id_Rol { get; set; }
        public int Id_Modulo { get; set; }
        public int Ver { get; set; }
        public int Agregar { get; set; }
        public int Modificar { get; set; }
        public int Desactivar { get; set; }
        public int Modulo_Padre { get; set; }
        public int Padre_Estado { get; set; }
    }
}
