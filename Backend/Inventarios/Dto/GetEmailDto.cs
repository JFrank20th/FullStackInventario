using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Dto
{
    public class GetEmailDto
    {
        public int Id { get; set; }
        public string Correo { get; set; }
        public string Password { get; set; }
        public string Descripcion { get; set; }
        public bool Id_estado { get; set; }
    }
}
