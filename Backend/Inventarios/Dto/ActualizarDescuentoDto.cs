using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Dto
{
    public class ActualizarDescuentoDto
    {
        public int Id { get; set; }
        public string Descripcion_Descuento { get; set; }
        public int Valor_Descuento { get; set; }
        public int Id_Estado { get; set; }
    }
}
