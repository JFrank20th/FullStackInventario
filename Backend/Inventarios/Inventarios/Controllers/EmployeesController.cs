using Business;
using Dto;
using Inventarios.Class;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.IO;
using System.Text;
using Microsoft.Ajax.Utilities;
using Newtonsoft.Json;
using Xceed.Words.NET;
using System.Text.RegularExpressions;
using NPOI.XSSF.UserModel;
using NPOI.SS.UserModel;
using Newtonsoft.Json.Linq;
using NPOI.SS.Util;
using OfficeOpenXml;

namespace Inventarios.Controllers
{
    public class EmplyeesController : ApiController
    {
        //public EmployeesBusiness Bussines = new EmployeesBusiness(Properties.Settings.Default.Conexion);
        public EmployeesBusiness Bussines2 = new EmployeesBusiness(Properties.Settings.Default.ConexionEmpleados);

        [Authorize]
        [HttpGet, Route("GetEmployees")]
        public List<EmployeesDto> GetEmployees()
        {
            return Bussines2.GetEmployees();
        }

        [Authorize]
        [HttpGet, Route("FindEmployees")]
        public List<EmployeesDto> FindEmployees(string Id)
        {
            return Bussines2.FindEmployees(Id);
        }

        [Authorize]
        [HttpGet, Route("GetIdEmployees")]
        public List<IdEmployeesDto> GetIdEmployees()
        {
            return Bussines2.GetIdEmployees();
        }

        [Authorize]
        [HttpGet, Route("GetCeCo")]
        public List<GetCeCoDto> GetCeCo()
        {
            return Bussines2.GetCeCo();
        }
    }
}