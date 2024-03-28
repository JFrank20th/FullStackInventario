using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Dto
{
    public class UpdateTokenDto
    {
        public string IdToken { get; set; }
        public string Id_Template { get; set; }
        public string Nombre { get; set; }
        public string Descripcion { get; set; }
        public string Token { get; set; }
        public string Tipo_Campo { get; set; }
        public string Id_Tipo_Fecha { get; set; }
        public string Dato_Empleado { get; set; }
        public string Opciones_Seleccion { get; set; }
        public string Caracter_Maximo { get; set; }
        public string Numeros_A_Letras { get; set; }
    }
}
