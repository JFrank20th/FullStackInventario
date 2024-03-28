using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dto;
using System.Collections.Specialized;
using System.Data;
using System.Data.SqlClient;
using System.IO;
using System.Net;

namespace Dal
{
    public class EmployeesDal : Dapper
    {
        public EmployeesDal(string ConexionEmpleados)
        {
            Conexion = ConexionEmpleados;
        }

        public List<EmployeesDto> GetEmployees()
        {
            return ListQuery<object, EmployeesDto>("[dbo].[usp_view_sparta_users]", new { });
        }

        public List<EmployeesDto> FindEmployees(string Id)
        {
            return ListQuery<object, EmployeesDto>("[dbo].[usp_find_employee_data]", new { Id });
        }

        public List<IdEmployeesDto> GetIdEmployees()
        {
            return ListQuery<object, IdEmployeesDto>("[dbo].[usp_ids_employee]", new {  });
        }

        public List<GetCeCoDto> GetCeCo()
        {
            return ListQuery<object, GetCeCoDto>("[dbo].[usp_cost_center]", new { });
        }

    }
}
