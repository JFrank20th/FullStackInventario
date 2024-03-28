using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Dto
{
    public class InactivarUsuariosDto
    {
        public int Id { get; set; }
        public string Identificacion_Usuario { get; set; }
        public int Id_Estado { get; set; }
    }
}
