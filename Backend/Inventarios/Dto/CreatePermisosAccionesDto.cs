using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Dto
{
    public class CreatePermisosAccionesDto
    {
        public int Id_Rol { get; set; }
        public int Descargar { get; set; }
        public int Soporte { get; set; }
        public int Historial { get; set; }
        public int Asignar { get; set; }
        public int Desasignar { get; set; }
        public int DevProveedor { get; set; }
        public int HomeOffice { get; set; }
        public int AgregarMasivo { get; set; }
        public int ModificarMasivo { get; set; }
        public int AsignarMasivo { get; set; }
        public int DesasignarMasivo { get; set; }
        public int DevProveedorMasivo { get; set; }
        public int HomeOfficeMasivo { get; set; }
    }
}
