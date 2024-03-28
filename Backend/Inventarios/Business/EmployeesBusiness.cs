using Dal;
using Dto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Globalization;
using System.Data;
using System.Text.RegularExpressions;
using System.Net;
//using RestSharp;

namespace Business
{
    public class EmployeesBusiness
    {
        public EmployeesDal Dal;

        public EmployeesBusiness(string ConexionEmpleados)
        {
            Dal = new EmployeesDal(ConexionEmpleados);
        }

        public List<EmployeesDto> GetEmployees()
        {
            return Dal.GetEmployees();
        }

        public List<EmployeesDto> FindEmployees(string Id)
        {
            return Dal.FindEmployees(Id);
        }

        public List<IdEmployeesDto> GetIdEmployees()
        {
            return Dal.GetIdEmployees();
        }

        public List<GetCeCoDto> GetCeCo()
        {
            return Dal.GetCeCo();
        }
    }
}
