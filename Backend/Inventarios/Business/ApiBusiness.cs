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
    public class ApiBusiness
    {
        public ApiDal Dal;

        public ApiBusiness(string Conexion)
        {
            Dal = new ApiDal(Conexion);
        }

        /// <summary>
        /// OBTENER TOKEN DE AUTENTICACION
        /// </summary>
        /// <param name="Usuario"></param>
        /// <param name="Password"></param>
        /// <returns></returns>

        public bool GetLoginToken(string Username, string Password)
        {
            return Dal.GetLoginToken(Username, Password);
        }

        /// <summary>
        /// OBTENER AUTENTICACION DE USUARIO
        /// </summary>
        /// <param name="Usuario"></param>
        /// <param name="Password"></param>
        /// <returns></returns>
        public List<UserLoginDto> GetUserLogin(string Username, string Password)
        {

            return Dal.GetUserLogin(Username, Password);
        }

        /// <summary>
        /// OBTENER MODULOS ACCESIBLES
        /// </summary>
        /// <param name="Role"></param>
        /// <returns></returns>
        public List<ModulosDto> Get_Acceso_Modulos(int Role)
        {
            return Dal.Get_Acceso_Modulos(Role);
        }

        /// <summary>
        /// Obtener permisos de las acciones
        /// </summary>
        /// <param name="Role"></param>
        /// <returns></returns>
        public List<GetAccesoAccionesDto> GetAccesoAcciones(int Role)
        {
            return Dal.GetAccesoAcciones(Role);
        }

        /// <summary>
        /// Obtener permisos de las acciones
        /// </summary>
        /// <param name="Role"></param>
        /// <returns></returns>
        public List<GetAccionesDto> GetAcciones(int Role)
        {
            return Dal.GetAcciones(Role);
        }

        /// <summary>
        /// OBTENER MODULO DE OPERACIONES
        /// </summary>
        /// <param name="Role"></param>
        /// <param name="Module"></param>
        /// <returns></returns>
        public List<ModuloOperacionDto> Get_Modulo_Operaciones(int Role, string Modulo)
        {
            return Dal.Get_Modulo_Operaciones(Role, Modulo);
        }

        /// <summary>
        /// Obtener el listado del inventario
        /// </summary>
        /// <returns></returns>
        public List<GetInventarioDto> Get_Inventario()
        {
            return Dal.Get_Inventario();
        }

        /// <summary>
        /// Obtener el listado del inventario asignado por usuario
        /// </summary>
        /// <param name="Usuario"></param>
        /// <returns></returns>
        public List<GetInventarioDto> Get_Inventario_Asignado(String Usuario)
        {
            return Dal.Get_Inventario_Asignado(Usuario);
        }

        /// <summary>
        /// Obtener listado de proveedores
        /// </summary>
        /// <returns></returns>
        public List<GetProveedoresDto> GetProveedores()
        {
            return Dal.GetProveedores();
        }

        /// <summary>
        /// Obtener listado de Descuentos
        /// </summary>
        /// <returns></returns>
        public List<GetDescuentosDto> GetDescuentos()
        {
            return Dal.GetDescuentos();
        }

        /// <summary>
        /// Obtener listado de Marcas
        /// </summary>
        /// <returns></returns>
        public List<GetMarcasDto> GetMarcas()
        {
            return Dal.GetMarcas();
        }

        /// <summary>
        /// Obtener listado de Tipos de activos
        /// </summary>
        /// <returns></returns>
        public List<GetTipoActivoDto> GetTipoActivo()
        {
            return Dal.GetTipoActivo();
        }

        /// <summary>
        /// Obtener listado de Bodegas Activas
        /// </summary>
        /// <returns></returns>
        public List<GetBodegasDto> GetBodegas()
        {
            return Dal.GetBodegas();
        }

        /// <summary>
        /// Guardar inventario uno a uno
        /// </summary>
        /// <param name="Inventarios"></param>
        /// <returns></returns>
        public bool GuardarInventario(GuardarInventarioDto Inventarios)
        {
            return Dal.GuardarInventario(Inventarios);
        }

        /// <summary>
        /// Guardar inventario uno a uno
        /// </summary>
        /// <param name="Inventarios"></param>
        /// <returns></returns>
        public bool SoporteActivaInventario(SAInventarioDto Inventarios)
        {
            return Dal.SoporteActivaInventario(Inventarios);
        }

        /// <summary>
        /// Crear inventario uno a uno
        /// </summary>
        /// <param name="Inventarios"></param>
        /// <returns></returns>
        public bool CreateInventario(CreateInventarioDto Inventarios)
        {
            return Dal.CreateInventario(Inventarios);
        }

        /// <summary>
        /// Actualizar inventario uno a uno
        /// </summary>
        /// <param name="Inventarios"></param>
        /// <returns></returns>
        public bool UpdateInventario(UpdateInventarioDto Inventarios)
        {
            return Dal.UpdateInventario(Inventarios);
        }

        /// <summary>
        /// Metodo para comprobar la caducidad de la contraseña
        /// </summary>
        /// <param name="Usuario"></param>
        /// <param name="Password"></param>
        /// <returns></returns>
        public List<CaducidadContrasenaDto> CaducidadContrasena(string Usuario, string Password)
        {
            return Dal.CaducidadContrasena(Usuario, Password);
        }

        /// <summary>
        /// Metodo para cambiar la contraseña
        /// </summary>
        /// <param name="Datos"></param>
        /// <returns></returns>
        public bool CambiarContrasena(CambiarContrasenaDto Datos)
        {
            return Dal.CambiarContrasena(Datos);
        }

        /// <summary>
        /// Obtener persona asignada
        /// </summary>
        /// <returns></returns>
        public List<GetAsignacionDto> GetAsignacion(string Usuario)
        {
            return Dal.GetAsignacion(Usuario);
        }

        /// <summary>
        /// Obtener ubicacion del usuario
        /// </summary>
        /// <returns></returns>
        public List<GetUbicacionDto> GetUbicacion(string Id_Inventario)
        {
            return Dal.GetUbicacion(Id_Inventario);
        }

        /// <summary>
        /// Obtener Foto seleccionada
        /// </summary>
        /// <returns></returns>
        public List<GetFotoDto> GetFoto(string Id_Inventario)
        {
            return Dal.GetFoto(Id_Inventario);
        }

        /// <summary>
        /// Obtener listado de identificacion de los usuarios
        /// </summary>
        /// <returns></returns>
        public List<GetIdentificacionUsuariosDto> GetIdentificacionUsuarios()
        {
            return Dal.GetIdentificacionUsuarios();
        }

        /// <summary>
        /// Obtener listado de identificacion de los usuarios
        /// </summary>
        /// <returns></returns>
        public List<GetIdentificacionUsuariosDto> GetIdentificacionesUsuarios()
        {
            return Dal.GetIdentificacionesUsuarios();
        }

        /// <summary>
        /// Obtener listado de identificacion de los jefes
        /// </summary>
        /// <returns></returns>
        public List<GetIdentificacionUsuariosDto> GetIdentificacionJefes()
        {
            return Dal.GetIdentificacionJefes();
        }

        /// <summary>
        /// Obtener usuarios
        /// </summary>
        /// <returns></returns>
        public List<UserLoginDto> GetUsuarios()
        {
            return Dal.GetUsuarios();

        }

        /// <summary>
        /// Guardar Usuarios
        /// </summary>
        /// <returns></returns>
        public bool GuardarUsuarios(UsuariosDto Datos)
        {
            return Dal.GuardarUsuarios(Datos);
        }

        /// <summary>
        /// Actualizar Usuarios
        /// </summary>
        /// <returns></returns>
        public bool ActualizarUsuarios(UsuariosDto dat)
        {
            return Dal.ActualizarUsuarios(dat);
        }

        /// <summary>
        /// Inactivar Usuarios
        /// </summary>
        /// <param name="dat"></param>
        /// <returns></returns>
        public bool InactivarUsuarios(InactivarUsuariosDto dat)
        {
            return Dal.InactivarUsuarios(dat);
        }

        /// <summary>
        /// Obtener listado de Tipos  de Activos
        /// </summary>
        /// <returns></returns>
        public List<RolesDto> GetRol()
        {
            return Dal.GetRol();
        }

        /// <summary>
        /// Obtener listado de Tipos  de Roles
        /// </summary>
        /// <returns></returns>
        public List<RolesDto> GetRoles()
        {
            return Dal.GetRoles();
        }

        /// <summary>
        /// Obtener listado de Tipos  de Roles
        /// </summary>
        /// <returns></returns>
        public List<PertmisosRolDto> GetPermisosRol(string Id_Rol)
        {
            return Dal.GetPermisosRol(Id_Rol);
        }

        /// <summary>
        /// Guardar Roles
        /// </summary>
        /// <returns></returns>
        public bool GuardarRoles(InsertaRolDto roles)
        {
            return Dal.GuardarRoles(roles);
        }


        /// <summary>
        ///Actualizar los roles
        /// </summary>
        /// <returns></returns>
        public bool ActualizarRoles(InsertaRolDto rol)
        {
            return Dal.ActualizarRoles(rol);
        }

        /// <summary>
        /// Actualizar permisos de los modulos
        /// </summary>
        /// <param name="UpdatePermisosModulos"></param>
        /// <returns></returns>
        public bool UpdatePermisosModulos(UpdatePermisosModulosDto UpdatePermisosModulos)
        {
            return Dal.UpdatePermisosModulos(UpdatePermisosModulos);
        }

        /// <summary>
        ///Actualizar los roles
        /// </summary>
        /// <returns></returns>
        public bool InactivarRoles(InactivarRolesDto rol)
        {
            return Dal.InactivarRoles(rol);
        }

        /// <summary>
        /// Obtener listado de Proveedores
        /// </summary>
        /// <returns></returns>
        public List<GetProveedoresDto> GetProveedor()
        {
            return Dal.GetProveedor();
        }


        /// <summary>
        ///Guardar los proveedores
        /// </summary>
        /// <returns></returns>
        public bool GuardarProveedor(GetProveedoresDto proveedor)
        {
            return Dal.GuardarProveedor(proveedor);
        }

        /// <summary>
        ///Actualizar los proveedores
        /// </summary>
        /// <returns></returns>
        public bool ActualizarProveedor(GetProveedoresDto provee)
        {
            return Dal.ActualizarProveedor(provee);
        }

        /// <summary>
        /// Guardar Descuento
        /// </summary>
        /// <param name="GuardarDescuento"></param>
        /// <returns></returns>
        public bool GuardarDescuento(GuardarDescuentoDto GuardarDescuento)
        {
            return Dal.GuardarDescuento(GuardarDescuento);
        }

        /// <summary>
        /// Actualizar Descuento
        /// </summary>
        /// <param name="ActualizarDescuento"></param>
        /// <returns></returns>
        public bool ActualizarDescuento(ActualizarDescuentoDto ActualizarDescuento)
        {
            return Dal.ActualizarDescuento(ActualizarDescuento);
        }


        /// <summary>
        /// Obtener listado de Marcas
        /// </summary>
        /// <returns></returns>
        public List<GetMarcasDto> GetMarca()
        {
            return Dal.GetMarca();
        }


        /// <summary>
        ///Guardar las Marcas
        /// </summary>
        /// <returns></returns>
        public bool GuardarMarca(GetMarcasDto marca)
        {
            return Dal.GuardarMarca(marca);
        }

        /// <summary>
        ///Actualizar las Marcas
        /// </summary>
        /// <returns></returns>
        public bool ActualizarMarca(GetMarcasDto marc)
        {
            return Dal.ActualizarMarca(marc);
        }


        /// <summary>
        /// Obtener listado de Centros de costo activos
        /// </summary>
        /// <returns></returns>
        public List<CentroCostosDto> GetCentroCostos()
        {
            return Dal.GetCentroCostos();
        }


        ///// <summary>
        ///// Obtener listado de Centros de costo
        ///// </summary>
        ///// <returns></returns>
        //public List<CentroCostosDto> GetCentroCosto()
        //{
        //    return Dal.GetCentroCosto();
        //}

        /// <summary>
        ///Guardar los centros de costo
        /// </summary>
        /// <returns></returns>
        public bool GuardarCentroCostos(CentroCostosDto centro)
        {
            return Dal.GuardarCentroCostos(centro);
        }

        /// <summary>
        ///Actualiza los centros de costo
        /// </summary>
        /// <returns></returns>
        public bool ActualizarCentroCostos(CentroCostosDto costo)
        {
            return Dal.ActualizarCentroCostos(costo);
        }

        /// <summary>
        /// Obtener listado de Tipos de Identificacion Activos
        /// </summary>
        /// <returns></returns>
        public List<TipoIdenficacionDto> GetTipoIdentificacion()
        {
            return Dal.GetTipoIdentificacion();
        }

        /// <summary>
        /// Obtener listado de Cargos
        /// </summary>
        /// <returns></returns>
        public List<CargoDto> GetCargos()
        {
            return Dal.GetCargos();
        }

        /// <summary>
        ///Guardar Cargo
        /// </summary>
        /// <returns></returns>
        public bool GuardarCargos(CargoDto cargo)
        {
            return Dal.GuardarCargos(cargo);
        }

        /// <summary>
        ///Actualizar Cargo
        /// </summary>
        /// <returns></returns>
        public bool ActualizarCargos(CargoDto carg)
        {
            return Dal.ActualizarCargos(carg);
        }

        /// <summary>
        /// Obtener listado de Sedes Activas
        /// </summary>
        /// <returns></returns>
        public List<SedesDto> GetSede()
        {
            return Dal.GetSede();
        }

        /// <summary>
        /// Obtener listado de Sedes
        /// </summary>
        /// <returns></returns>
        public List<SedesDto> GetSedes()
        {
            return Dal.GetSedes();
        }

        /// <summary>
        ///Guardar Sedes
        /// </summary>
        /// <returns></returns>
        public bool GuardarSedes(SedesDto sede)
        {
            return Dal.GuardarSedes(sede);
        }

        /// <summary>
        ///Actualizar Sedes
        /// </summary>
        /// <returns></returns>
        public bool ActualizarSedes(SedesDto sede)
        {
            return Dal.ActualizarSedes(sede);
        }

        /// <summary>
        /// Obtener listado de Ciudades activas
        /// </summary>
        /// <returns></returns>
        public List<CiudadDto> GetCiudad()
        {
            return Dal.GetCiudad();
        }

        /// <summary>
        /// Obtener listado de Ciudades activas
        /// </summary>
        /// <returns></returns>
        public List<CiudadDto> GetCiudades()
        {
            return Dal.GetCiudades();
        }

        /// <summary>
        /// Obtener listado de Pisos Activos 
        /// </summary>
        /// <returns></returns>
        public List<PisosDto> GetPiso(string Id_Sede)
        {
            return Dal.GetPiso(Id_Sede);
        }

        /// <summary>
        /// Obtener listado de Pisos
        /// </summary>
        /// <returns></returns>
        public List<PisosDto> GetPisos()
        {
            return Dal.GetPisos();
        }

        /// <summary>
        /// Obtener listado de Puestos
        /// </summary>
        /// <returns></returns>
        public List<PuestosDto> GetPuestos()
        {
            return Dal.GetPuestos();
        }

        /// <summary>
        ///Guardar Pisos
        /// </summary>
        /// <returns></returns>
        public bool GuardarPisos(PisosDto pisos)
        {
            return Dal.GuardarPisos(pisos);
        }

        /// <summary>
        ///Actualizar Pisos
        /// </summary>
        /// <returns></returns>
        public bool ActualizarPisos(PisosDto piso)
        {
            return Dal.ActualizarPisos(piso);
        }




        /// <summary>
        /// Obtener listado de Bodegas
        /// </summary>
        /// <returns></returns>
        public List<GetBodegasDto> GetBodega()
        {
            return Dal.GetBodega();
        }

        /// <summary>
        ///Guardar Bodegas
        /// </summary>
        /// <returns></returns>
        public bool GuardarBodega(GetBodegasDto bodega)
        {
            return Dal.GuardarBodega(bodega);
        }

        /// <summary>
        ///Actualizar Bodegas
        /// </summary>
        /// <returns></returns>
        public bool ActualizarBodega(GetBodegasDto bodeg)
        {
            return Dal.ActualizarBodega(bodeg);
        }

        /// <summary>
        /// Obtener listado de Puestos
        /// </summary>
        /// <returns></returns>
        public List<PuestosDto> GetPuesto()
        {
            return Dal.GetPuesto();
        }

        /// <summary>
        ///Guardar Puestos
        /// </summary>
        /// <returns></returns>
        public bool GuardarPuesto(PuestosDto puesto)
        {
            return Dal.GuardarPuesto(puesto);
        }

        /// <summary>
        ///Actualizar Puestos
        /// </summary>
        /// <returns></returns>
        public bool ActualizarPuesto(PuestosDto puest)
        {
            return Dal.ActualizarPuesto(puest);
        }

        /// <summary>
        /// Obtener listado de Tipos de Equipos
        /// </summary>
        /// <returns></returns>
        public List<GetTipoActivoDto> GetTipoEquipo()
        {
            return Dal.GetTipoEquipo();
        }

        /// <summary>
        ///Guardar Tipos de Equipos
        /// </summary>
        /// <returns></returns>
        public bool GuardarTipoEquipo(GetTipoActivoDto t_equipo)
        {
            return Dal.GuardarTipoEquipo(t_equipo);
        }

        /// <summary>
        ///Actualizar Tipos de Equipos
        /// </summary>
        /// <returns></returns>
        public bool ActualizarTipoEquipo(GetTipoActivoDto t_equi)
        {
            return Dal.ActualizarTipoEquipo(t_equi);
        }

        /// <summary>
        /// Obtener listado de Estados de Equipos
        /// </summary>
        /// <returns></returns>
        public List<EstadoEquipoDto> GetEstadoEquipo()
        {
            return Dal.GetEstadoEquipo();
        }

        /// <summary>
        /// Obtener listado de Estados de Equipos
        /// </summary>
        /// <returns></returns>
        public List<EstadoEquipoDto> GetEstadoEquipoActi()
        {
            return Dal.GetEstadoEquipoActi();
        }

        /// <summary>
        ///Guardar Estados de Equipos
        /// </summary>
        /// <returns></returns>
        public bool GuardarEstadoEquipo(EstadoEquipoDto e_equipo)
        {
            return Dal.GuardarEstadoEquipo(e_equipo);
        }

        /// <summary>
        ///Actualizar Estados de Equipos
        /// </summary>
        /// <returns></returns>
        public bool ActualizarEstadoEquipo(EstadoEquipoDto e_equi)
        {
            return Dal.ActualizarEstadoEquipo(e_equi);
        }

        /// <summary>
        /// Obtener  Reporte completo
        /// </summary>
        /// <returns></returns>
        public List<ReportesDto> GetReporteCompleto()
        {
            return Dal.GetReporteCompleto();
        }

        /// <summary>
        /// Obtener  Reporte por Asignacion
        /// </summary>
        /// <returns></returns>
        public List<ReportesDto> GetReporteAsignacion()
        {
            return Dal.GetReporteAsignacion();
        }

        /// <summary>
        /// Obtener Reporte por Proveedor
        /// </summary>
        /// <returns></returns>
        public List<ReportesDto> GetReporteProveedores(string Id_Proveedor)
        {
            return Dal.GetReporteProveedores(Id_Proveedor);
        }

        /// <summary>
        /// Obtener  Reporte por Disponibilidad
        /// </summary>
        /// <returns></returns>
        public List<ReportesDto> GetReporteDisponibilidad()
        {
            return Dal.GetReporteDisponibilidad();
        }

        /// <summary>
        /// Obtener  Reporte por Disponibilidad
        /// </summary>
        /// <returns></returns>
        public List<ReportesDto> GetReporteEstadosActivo(string Id_Estado_Activo)
        {
            return Dal.GetReporteEstadosActivo(Id_Estado_Activo);
        }

        /// <summary>
        /// Obtener  Reporte por Disponibilidad
        /// </summary>
        /// <returns></returns>
        public List<ReportesDto> GetReporteCentroCosto(string Id_Centro_Costo)
        {
            return Dal.GetReporteCentroCosto(Id_Centro_Costo);
        }

        /// <summary>
        /// Obtener  Reporte por Disponibilidad
        /// </summary>
        /// <returns></returns>
        public List<GetInventarioDto> GetInventarioXUsuarios(string Identificacion)
        {
            return Dal.GetInventarioXUsuarios(Identificacion);
        }

        //public dynamic SolicitudesStorage(SolicitudesStorage s)
        //{
        //    dynamic Response = "";
        //    System.Net.ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
        //    var client = new RestClient("https://services.grupogss.com.co/servicios/StorageCloudServices/api/1.0/" + s.endpoint);
        //    client.Timeout = -1;
        //    RestRequest request;
        //    switch (s.metodo)
        //    {
        //        case "GET":
        //            request = new RestRequest(Method.GET);
        //            request.AddHeader("Authorization", "AV_AppAuthorization ZTNhOWUyYTItZjc0Ny00NjU4LWI4MGYtYTYxMTllMjg5MzIz");
        //            IRestResponse response = client.Execute(request);
        //            Response = response.Content;
        //            break;
        //        case "POST":
        //            request = new RestRequest(Method.POST);
        //            request.AddHeader("Authorization", "AV_AppAuthorization ZTNhOWUyYTItZjc0Ny00NjU4LWI4MGYtYTYxMTllMjg5MzIz");
        //            request.AddHeader("Content-Type", "application/json");
        //            var body = @"{
        //                    " + "\n" +
        //                    @"    ""nameFile"":""[Nombre_Archivo]"",
        //                    " + "\n" +
        //                    @"    ""mimetype"":""[Mimetype]"",
        //                    " + "\n" +
        //                    @"    ""fileBase64"":""[Base64]""
        //                    " + "\n" +
        //                    @"}";
        //            body = body.Replace("[Nombre_Archivo]", s.data.nameFile).Replace("[Mimetype]", s.data.mimetype).Replace("[Base64]", s.data.fileBase64);
        //            request.AddParameter("application/json", body, ParameterType.RequestBody);
        //            IRestResponse responseRest = client.Execute(request);
        //            Response = responseRest.Content;
        //            break;
        //        default:
        //            Response = "Metodo invalido";
        //            break;
        //    }
        //    return Response;
        //}

        /// <summary>
        ///OBTIENE archivo Importacion base 
        /// </summary>
        /// <returns></returns>
        public string DebuggDataT(System.Collections.Specialized.StringCollection fields, string[,] file, string UserGeneral, string TipoProceso)
        {
            DataTable Datafile = ArraytoDatatableT(file, TipoProceso);
            int contador = 0;
            string fila1 = Datafile.Rows[0][0].ToString();

            if (TipoProceso == "Usuarios") {
                while (fila1 != "Identificacion_Usuario")
                {
                    Datafile.Rows[contador].Delete();
                    contador++;
                    fila1 = Datafile.Rows[contador][0].ToString();
                }
            }
            else {
                while (fila1 != "Serial")
                {
                    Datafile.Rows[contador].Delete();
                    contador++;
                    fila1 = Datafile.Rows[contador][0].ToString();
                }
            }

            
            Datafile.AcceptChanges();
            for (int k = 0; k < (Datafile.Columns.Count); k++)
            {
                string columname = Regex.Replace(Datafile.Rows[0].ItemArray[k].ToString(), @"[.|' ' |¿|?|\-|/]", "_", RegexOptions.None);
                columname = RemoveAccentsWithNormalizationT(columname);
                Datafile.Columns[k].ColumnName = columname;
            }
            Datafile.Rows[0].Delete();
            Datafile.AcceptChanges();
            return Dal.DebuggDataT(fields, Datafile, UserGeneral, TipoProceso);
        }


        /// <summary>
        /// 
        /// </summary>
        /// <param name="inputString"></param>
        /// <returns></returns>
        public static string RemoveAccentsWithNormalizationT(string inputString)
        {
            string normalizedString = inputString.Normalize(NormalizationForm.FormD);
            StringBuilder sb = new StringBuilder();
            for (int i = 0; i < normalizedString.Length; i++)
            {
                UnicodeCategory uc = CharUnicodeInfo.GetUnicodeCategory(normalizedString[i]);
                if (uc != UnicodeCategory.NonSpacingMark)
                {
                    sb.Append(normalizedString[i]);
                }
            }
            return (sb.ToString().Normalize(NormalizationForm.FormC));
        }

        /// <summary>
        ///Convertir el array a lista
        /// </summary>
        /// <returns></returns>
        public static DataTable ArraytoDatatableT(string[,] Array, string TipoProceso)
        {
            DataTable dt = new DataTable();

            int cont = 0;

            if (TipoProceso == "Usuarios")
            {
                while (Array[cont, 0] != "Identificacion_Usuario")
                {
                    cont++;
                }
            }
            else 
            {
                while (Array[cont, 0] != "Serial")
                {
                    cont++;
                }
            }
            

            for (int i = 0; i < Array.GetLength(1); i++)
            {
                dt.Columns.Add(Array[cont, i]);
            }
            string ledasfdg = Array[0, 0];

            DataRow dr = dt.NewRow();

            for (int i = cont; i < Array.GetLength(0); i++)
            {
                dr = dt.NewRow();
                for (int j = 0; j < Array.GetLength(1); j++)
                {
                    dr[Array[cont, j]] = Array[i, j];
                }
                dt.Rows.Add(dr);
            }
            return dt;
        }

        /// <summary>
        /// Obtener filtro de sedes segun ciudad.
        /// </summary>
        /// <param name="IdCiudad"></param>
        /// <returns></returns>
        public List<SedesDto> GetFiltroSedes(string Id_Ciudad)
        {
            return Dal.GetFiltroSedes(Id_Ciudad);
        }

        /// <summary>
        /// Obtener filtro de Pisos segun Sede.
        /// </summary>
        /// <param name="IdSede"></param>
        /// <returns></returns>
        public List<PisosDto> GetFiltroPisos(string Id_Sede)
        {
            return Dal.GetFiltroPisos(Id_Sede);
        }

        /// <summary>
        /// Obtener filtro de Puestos segun Pisos y sede.
        /// </summary>
        /// <param name="IdSede"></param>
        /// <param name="IdPiso"></param>
        /// <returns></returns>
        public List<PuestosDto> GetFiltroPuestos(string Id_Sede, int Id_Piso)
        {
            return Dal.GetFiltroPuestos(Id_Sede, Id_Piso);
        }

        /// <summary>
        /// Obtener listado de seriales
        /// </summary>
        /// <returns></returns>
        public List<SerialesDto> GetSeriales()
        {
            return Dal.GetSeriales();
        }


        /// <summary>
        /// Devolucion Masiva Proveedor
        /// </summary>
        /// <returns></returns>
        public bool DevolucionMasivaProveedor(DevolucionMasivaProveedorDto Serial)
        {
            return Dal.DevolucionMasivaProveedor(Serial);
        }

        /// <summary>
        /// Obtener Historial del serial
        /// </summary>
        /// <param name="Serial"></param>
        /// <returns></returns>
        public List<HistoricoDto> GetHistorico(string Serial)
        {
            return Dal.GetHistorico(Serial);
        }

        /// <summary>
        /// Dashboard Inventario
        /// </summary>
        /// <param name="Id_Proveedor"></param>
        /// <param name="Id_Marca"></param>
        /// <param name="Id_Tipo_Activo"></param>
        /// <returns></returns>
        public List<DashboardInventarioDto> DashboardInventario(int Id_Proveedor, int Id_Marca, int Id_Tipo_Activo)
        {
            return Dal.DashboardInventario(Id_Proveedor, Id_Marca, Id_Tipo_Activo);
        }

        /// <summary>
        /// OBTENER PLANTILLAS DE DOCUMENTOS
        /// </summary>
        /// <returns></returns>
        public List<GetApiDocumentDto> GetApiDocument()
        {
            return Dal.GetApiDocument();
        }

        /// <summary>
        /// OBTENER PLANTILLAS DE DOCUMENTOS POR ID
        /// </summary>
        /// <returns></returns>
        public List<DocumentApiDto> GetApiDocumentById(int Id_Tipo_Plantilla)
        {
            return Dal.GetApiDocumentById(Id_Tipo_Plantilla);
        }

        /// <summary>
        /// INSERTAR DATOS DE LAS PLANTILLAS DE LOS DOCUMENTOS
        /// </summary>
        /// <returns></returns>
        public bool InsertApiDocument(DocumentApiDto InsertApiDocument)
        {
            return Dal.InsertApiDocument(InsertApiDocument);
        }

        /// <summary>
        /// ACTUALIZAR DATOS DE LAS PLANTILLAS DE LOS DOCUMENTOS
        /// </summary>
        /// <returns></returns>
        public List<ChangeStateTemplateDto> UpdateApiDocument(ChangeStateTemplateDto UpdateApiDocument)
        {
            return Dal.UpdateApiDocument(UpdateApiDocument);
        }

        /// <summary>
        /// ACTUALIZAR dDESCRIPCION DE LAS PLANTILLAS DE LOS DOCUMENTOS
        /// </summary>
        /// <returns></returns>
        public List<UpdateDescriptionDto> UpdateDescriptionApiDocument(UpdateDescriptionDto UpdateDescription)
        {
            return Dal.UpdateDescriptionApiDocument(UpdateDescription);
        }

        /// <summary>
        /// OBTENER TOKENS
        /// </summary>
        /// <returns></returns>
        public List<tokensDto> GetTokens()
        {
            return Dal.GetTokens();
        }

        /// <summary>
        /// OBTENER TOKENS
        /// </summary>
        /// <returns></returns>
        public List<tokensDto> GetTokensAcive(string Id_plantilla)
        {
            return Dal.GetTokensAcive(Id_plantilla);
        }

        /// <summary>
        /// OBTENER PLANTILLAS DE DOCUMENTOS POR TOKENS
        /// </summary>
        /// <returns></returns>
        public List<DocumentApiDto> GetTemplateById(string Id_Template)
        {
            return Dal.GetTemplateById(Id_Template);
        }

        /// <summary>
        /// OBTENER PLANTILLAS DE DOCUMENTOS ACTIVOS
        /// </summary>
        /// <returns></returns>
        public List<DocumentApiDto> GetTemplateActive()
        {
            return Dal.GetTemplateActive();
        }

        /// <summary>
        /// INSERTAR DATOS DE LOS TOKENS
        /// </summary>
        /// <returns></returns>
        public bool InsertToken(InsertTokenDto InsertToken)
        {
            return Dal.InsertToken(InsertToken);
        }

        /// <summary>
        /// ACTUALIZAR TOKENS
        /// </summary>
        /// <returns></returns>
        public List<UpdateTokenDto> UpdateToken(UpdateTokenDto UpdateToken)
        {
            return Dal.UpdateToken(UpdateToken);
        }

        /// <summary>
        /// Api Encargada de cambiar estado del token
        /// </summary>
        /// <param name="Id"></param>
        /// <param name="Estado"></param>
        /// <returns></returns>
        public bool ChangeStateToken(string Id, string Estado)
        {
            return Dal.ChangeStateToken(Id, Estado);
        }

        /// <summary>
        /// OBTENER TIPOS DE PLANTILLAS 
        /// </summary>
        /// <returns></returns>
        public List<GetTipoPlantillasDto> GetTipoPlantillas()
        {
            return Dal.GetTipoPlantillas();
        }

        /// <summary>
        /// obtener los tokens por id de plantilla
        /// </summary>
        /// <returns></returns>
        public List<GetTokensByIdDto> GetTokensById(string Id_Template)
        {
            return Dal.GetTokensById(Id_Template);
        }

        /// <summary>
        /// obtener los tokens de las firmas por id de plantilla
        /// </summary>
        /// <returns></returns>
        public List<GetTokensFirmasByIdDto> GetTokensFirmasById(string Id_Template)
        {
            return Dal.GetTokensFirmasById(Id_Template);
        }

        /// <summary>
        /// INSERTAR ACTAS
        /// </summary>
        /// <returns></returns>
        public bool InsertActa(InsertActaDto InsertActa)
        {
            return Dal.InsertActa(InsertActa);
        }

        /// <summary>
        /// Api Encargada de devolver el dispositivo
        /// </summary>
        /// <param name="Id_Inventario"></param>
        /// <param name="Serial"></param>
        /// <returns></returns>
        public bool DevolucionInventario(string Id_Inventario, string Serial, string UserGeneral, string Id_Acta_Drive)
        {
            return Dal.DevolucionInventario(Id_Inventario, Serial, UserGeneral, Id_Acta_Drive);
        }

        /// <summary>
        /// Api Encargada de asignar el dispositivo
        /// </summary>
        /// <param name="Id_Inventario"></param>
        /// <param name="Serial"></param>
        /// <param name="Usuario"></param>
        /// <returns></returns>
        public bool AsignacionInventario(string Id_Inventario, string Serial, string Usuario, string UserGeneral, string Id_Acta_Drive)
        {
            return Dal.AsignacionInventario(Id_Inventario, Serial, Usuario, UserGeneral, Id_Acta_Drive);
        }

        /// <summary>
        /// obtener listado de todas las actas
        /// </summary>
        /// <returns></returns>
        public List<GetActasDto> GetActas()
        {
            return Dal.GetActas();
        }

        /// <summary>
        /// obtener listado de los tokens fijos
        /// </summary>
        /// <returns></returns>
        public List<GetTokensFijosDto> GetTokensFijos()
        {
            return Dal.GetTokensFijos();
        }

        /// <summary>
        /// Obtener el listado de los tokens de usuario
        /// </summary>
        /// <returns></returns>
        public List<GetTokensUsuarioDto> GetTokensUsuario()
        {
            return Dal.GetTokensUsuario();
        }

        /// <summary>
        /// Api Encargada marcar el inventario si esta en homeOffice O no
        /// </summary>
        /// <param name="Id_Inventario"></param>
        /// <param name="Serial"></param>
        /// <param name="Home_Office"></param>
        /// <returns></returns>
        public bool EnvDevHomeOffice(string Id_Inventario, string Serial, int Home_Office, string UserGeneral, string Id_Acta_Drive)
        {
            return Dal.EnvDevHomeOffice(Id_Inventario, Serial, Home_Office, UserGeneral, Id_Acta_Drive);
        }

        /// <summary>
        /// Obtener el listado de tipos de fechas
        /// </summary>
        /// <returns></returns>
        public List<GetTipoFechaDto> GetTipoFecha()
        {
            return Dal.GetTipoFecha();
        }

        /// <summary>
        /// Obtener el listado de procesadores
        /// </summary>
        /// <returns></returns>
        public List<GetProcesadoresDto> GetProcesadores()
        {
            return Dal.GetProcesadores();
        }

        /// <summary>
        /// Obtener el listado de RAM
        /// </summary>
        /// <returns></returns>
        public List<GetRAMDto> GetRAM()
        {
            return Dal.GetRAM();
        }

        /// <summary>
        /// Obtener el listado de Discos
        /// </summary>
        /// <returns></returns>
        public List<GetDiscoDto> GetDisco()
        {
            return Dal.GetDisco();
        }

        /// <summary>
        /// Obtener datos de email
        /// </summary>
        /// <param name="Email"></param>
        /// <returns></returns>
        public List<GetEmailDto> GetDatosEmail(string Email)
        {
            return Dal.GetDatosEmail(Email);
        }

        /// <summary>
        /// Obtener plantillas de correo
        /// </summary>
        /// <returns></returns>
        public List<GetTemplateMailDto> GetTemplateMail()
        {
            return Dal.GetTemplateMail();
        }

        /// <summary>
        /// Insertar plantillas de correo
        /// </summary>
        /// <returns></returns>
        public bool InsertTemplateMail(InsertTemplateMailDto InsertTemplateMail)
        {
            return Dal.InsertTemplateMail(InsertTemplateMail);
        }

        /// <summary>
        /// actualizar plantilla de correo
        /// </summary>
        /// <returns></returns>
        public List<UpdateTemplateMailDto> UpdateTemplateMail(UpdateTemplateMailDto UpdateTemplateMail)
        {
            return Dal.UpdateTemplateMail(UpdateTemplateMail);
        }

        /// <summary>
        /// Activar plantilla de correo
        /// </summary>
        /// <returns></returns>
        public List<ActiveTemplateMailDto> ActiveTemplateMail(ActiveTemplateMailDto ActiveTemplateMail)
        {
            return Dal.ActiveTemplateMail(ActiveTemplateMail);
        }

        /// <summary>
        /// Obtener email
        /// </summary>
        /// <param name="Identificacion"></param>
        /// <returns></returns>
        public List<GetEmailUsaurioDto> GetEmailUsaurio(string Identificacion)
        {
            return Dal.GetEmailUsaurio(Identificacion);
        }

        /// <summary>
        /// Insertar procesador
        /// </summary>
        /// <param name="Procesador"></param>
        /// <returns></returns>
        public bool InsertProcesador(string Procesador)
        {
            return Dal.InsertProcesador(Procesador);
        }

        /// <summary>
        /// Actualizar procesador
        /// </summary>
        /// <param name="Id"></param>
        /// <param name="Procesador"></param>
        /// <param name="Id_Estado"></param>
        /// <returns></returns>
        public bool UpdateProcesador(string Id, string Procesador, int Id_Estado)
        {
            return Dal.UpdateProcesador(Id, Procesador, Id_Estado);
        }

        /// <summary>
        /// Obtener columnas a ocultar
        /// </summary>
        /// <param name="Identificacion_Usuario"></param>
        /// <returns></returns>
        public List<NoColumnsDto> NoColumns(string Identificacion_Usuario)
        {
            return Dal.NoColumns(Identificacion_Usuario);
        }

        /// <summary>
        /// Actualizar columnas para no mostrar
        /// </summary>
        /// <param name="UpdateNoColumns"></param>
        /// <returns></returns>
        public bool UpdateNoColumns(UpdateNoColumnsDto UpdateNoColumns)
        {
            return Dal.UpdateNoColumns(UpdateNoColumns);
        }

        /// <summary>
        /// Obtener el listado de modulos
        /// </summary>
        /// <returns></returns>
        public List<GetModulosDto> GetModulos()
        {
            return Dal.GetModulos();
        }

        /// <summary>
        /// Crear rol y obtener Id
        /// </summary>
        /// <param name="Nombre_Rol"></param>
        /// <param name="Descripcion"></param>
        /// <param name="Jefe"></param>
        /// <returns></returns>
        public List<CreateRolDto> CreateRol(string Nombre_Rol, string Descripcion, int Jefe)
        {
            return Dal.CreateRol(Nombre_Rol, Descripcion, Jefe);
        }

        /// <summary>
        /// Crear permisos de los modulos
        /// </summary>
        /// <param name="CreatePermisosModulos"></param>
        /// <returns></returns>
        public bool CreatePermisosModulos(CreatePermisosModulosDto CreatePermisosModulos)
        {
            return Dal.CreatePermisosModulos(CreatePermisosModulos);
        }

        /// <summary>
        /// Crear permisos de las acciones
        /// </summary>
        /// <param name="CreatePermisosAcciones"></param>
        /// <returns></returns>
        public bool CreatePermisosAcciones(CreatePermisosAccionesDto CreatePermisosAcciones)
        {
            return Dal.CreatePermisosAcciones(CreatePermisosAcciones);
        }

        /// <summary>
        /// Actualizar permisos de las acciones
        /// </summary>
        /// <param name="UpdatePermisosAcciones"></param>
        /// <returns></returns>
        public bool UpdatePermisosAcciones(CreatePermisosAccionesDto UpdatePermisosAcciones)
        {
            return Dal.UpdatePermisosAcciones(UpdatePermisosAcciones);
        }

        /// <summary>
        /// Obtener usuario por identificacion
        /// </summary>
        /// <param name="Identificacion_Usuario"></param>
        /// <returns></returns>
        public List<IdentificacionDto> UsuarioByIdentificacion(string Identificacion_Usuario)
        {
            return Dal.UsuarioByIdentificacion(Identificacion_Usuario);
        }

        /// <summary>
        /// Obtener la imagen de la firma
        /// </summary>
        /// <param name="Identificacion_Usuario"></param>
        /// <returns></returns>
        public List<GetFirmaImagenDto> GetFirmaImagen(string Identificacion_Usuario)
        {
            return Dal.GetFirmaImagen(Identificacion_Usuario);
        }

        /// <summary>
        /// Actualizar firma del usuario logueado
        /// </summary>
        /// <param name="UpdateFirmaImagen"></param>
        /// <returns></returns>
        public bool UpdateFirmaImagen(UpdateFirmaImagenDto UpdateFirmaImagen)
        {
            return Dal.UpdateFirmaImagen(UpdateFirmaImagen);
        }

        /// <summary>
        /// Obtener actas para quitarle los permisos
        /// </summary>
        /// <returns></returns>
        public List<SuspendPermissionsDto> GetSuspendPermissions()
        {
            return Dal.GetSuspendPermissions();
        }

        /// <summary>
        /// Actualizar suspension de permisos de actas
        /// </summary>
        /// <param name="idFile"></param>
        /// <returns></returns>
        public bool UpdateSuspendPermissions(string idFile)
        {
            return Dal.UpdateSuspendPermissions(idFile);
        }

        /// <summary>
        /// Obtener datos del usuario para los tokens.
        /// </summary>
        /// <param name="Identificacion_Usuario"></param>
        /// <returns></returns>
        public List<GetDatosTokensUsuarioDto> GetDatosTokensUsuario(string Identificacion_Usuario)
        {
            return Dal.GetDatosTokensUsuario(Identificacion_Usuario);
        }
    }
}
