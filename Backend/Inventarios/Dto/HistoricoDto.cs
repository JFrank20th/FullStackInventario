using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Dto
{
    public class HistoricoDto
    {
        public string Serial { get; set; }
        public string Motivo { get; set; }
        public string Usuario { get; set; }
        public DateTime Fecha { get; set; }
        public string Id_Acta_Drive { get; set; }
    }
}
