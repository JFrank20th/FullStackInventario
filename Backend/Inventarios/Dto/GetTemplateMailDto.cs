﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Dto
{
    public class GetTemplateMailDto
    {
        public int Id { get; set; }
        public string Nombre { get; set; }
        public string Asunto { get; set; }
        public string CC { get; set; }
        public string CCO { get; set; }
        public string Body { get; set; }
        public bool Id_Estado { get; set; }
    }
}
