using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Dto
{
    public class InsertActaDto
    {
        public string Id { get; set; }
        public int Pendiente_Firmas { get; set; }
        public string Nombre { get; set; }
        public string Id_Acta_Drive { get; set; }
    }
}
