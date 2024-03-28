using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Dto
{
    public class GetAccionesDto
    {
        public string Origen { get; set; }
        public int Id_Rol { get; set; }
        public string Accion { get; set; }
        public int Id_Estado { get; set; }
    }
}
