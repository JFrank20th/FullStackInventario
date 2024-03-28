using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Dto
{
    public class GetDescuentosDto
    {
        public int Id { get; set; }
        public string Descripcion_Descuento { get; set; }
        public int Valor_Descuento { get; set; }
        public string Id_Estado { get; set; }
    }
}
