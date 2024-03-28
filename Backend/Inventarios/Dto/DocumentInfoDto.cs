using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Dto
{
    public class DocumentInfoDto
    {
        public string NameFile { get; set; }
        public string MimeType { get; set; }
        public string FileBase64 { get; set; }
    }
}
