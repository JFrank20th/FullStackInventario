﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Dto
{
    public class GetActasDto
    {
        public string Id { get; set; }
        public string Nombre { get; set; }
        public string Id_Acta_Drive { get; set; }
        public DateTime Date_Create { get; set; }
        public string Pendiente_Firmas { get; set; }
        
    }
}
