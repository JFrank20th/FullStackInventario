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
using GemBox.Document;
using GemBox.Spreadsheet;
using NPOI.Util;

namespace Inventarios.Controllers
{
    public class BackendController : ApiController
    {
        public ApiBusiness Business = new ApiBusiness(Properties.Settings.Default.Conexion);

        /// <summary>
        ///OBTIENE AUTENTICACION DE USUARIOS
        /// </summary>
        /// <returns></returns>
        [Authorize]
        [HttpGet, Route("GetUserLogin")]
        public List<UserLoginDto> GetUserLogin(string Username, string Password)
        {
            //Encriptar el password
            Password = AES.EncryptAES(Password);

            var user = Business.GetUserLogin(Username, Password);
            if (user.Count > 0)
            {
                //Desencriptar el password
                user[0].Password = AES.DecryptStringAES(user[0].Password);
            }
            return user;
        }

        /// <summary>
        /// OBTIENE MODULOS ACCESIBLES
        /// </summary>
        /// <param name="Role"></param>
        /// <returns></returns>
        [Authorize]
        [HttpGet, Route("Get_Acceso_Modulos")]
        public List<ModulosDto> Get_Acceso_Modulos(int Role)
        {
            return Business.Get_Acceso_Modulos(Role);
        }

        /// <summary>
        /// Obtener permisos de las acciones
        /// </summary>
        /// <param name="Role"></param>
        /// <returns></returns>
        //-[Authorize]
        [HttpGet, Route("GetAccesoAcciones")]
        public List<GetAccesoAccionesDto> GetAccesoAcciones(int Role)
        {
            return Business.GetAccesoAcciones(Role);
        }

        /// <summary>
        /// Obtener permisos de las acciones
        /// </summary>
        /// <param name="Role"></param>
        /// <returns></returns>
        //[Authorize]
        [HttpGet, Route("GetAcciones")]
        public List<GetAccionesDto> GetAcciones(int Role)
        {
            return Business.GetAcciones(Role);
        }

        /// <summary>
        /// OBTENER MODULO DE OPERACIONES
        /// </summary>
        /// <param name="Role"></param>
        /// <param name="Module"></param>
        /// <returns></returns>
        [Authorize]
        [HttpGet, Route("Get_Modulo_Operaciones")]
        public List<ModuloOperacionDto> Get_Modulo_Operaciones(int Role, string Modulo)
        {
            return Business.Get_Modulo_Operaciones(Role, Modulo);
        }

        /// <summary>
        /// Obtener el listado del inventario
        /// </summary>
        /// <returns></returns>
        [Authorize]
        [HttpGet, Route("Get_Inventario")]
        public List<GetInventarioDto> Get_Inventario()
        {
            return Business.Get_Inventario();
        }

        /// <summary>
        /// Obtener el listado del inventario asignado por usuario
        /// </summary>
        /// <param name="Usuario"></param>
        /// <returns></returns>
        [Authorize]
        [HttpGet, Route("Get_Inventario_Asignado")]
        public List<GetInventarioDto> Get_Inventario_Asignado(String Usuario)
        {
            return Business.Get_Inventario_Asignado(Usuario);
        }

        /// <summary>
        /// Obtener listado de Proveedores
        /// </summary>
        /// <returns></returns>
        [Authorize]
        [HttpGet, Route("GetProveedores")]
        public List<GetProveedoresDto> GetProveedores()
        {
            return Business.GetProveedores();
        }

        /// <summary>
        /// Obtener listado de Descuentos
        /// </summary>
        /// <returns></returns>
        [Authorize]
        [HttpGet, Route("GetDescuentos")]
        public List<GetDescuentosDto> GetDescuentos()
        {
            return Business.GetDescuentos();
        }

        /// <summary>
        /// Obtener listado de Proveedores
        /// </summary>
        /// <returns></returns>
        [Authorize]
        [HttpGet, Route("GetMarcas")]
        public List<GetMarcasDto> GetMarcas()
        {
            return Business.GetMarcas();
        }

        /// <summary>
        /// Obtener listado de Tipos de Activos
        /// </summary>
        /// <returns></returns>
        [Authorize]
        [HttpGet, Route("GetTipoActivo")]
        public List<GetTipoActivoDto> GetTipoActivo()
        {
            return Business.GetTipoActivo();
        }

        /// <summary>
        /// Obtener listado de Tipos de Activos
        /// </summary>
        /// <returns></returns>
        [Authorize]
        [HttpGet, Route("GetBodegas")]
        public List<GetBodegasDto> GetBodegas()
        {
            return Business.GetBodegas();
        }

        /// <summary>
        /// //Metodo encargado de  Guardar inventario uno a uno 
        /// </summary>
        /// <param name="Inventarios"></param>
        /// <returns></returns>
        [Authorize]
        [HttpPost, Route("GuardarInventario")]
        public bool GuardarInventario([FromBody] GuardarInventarioDto Inventarios)
        {
            return Business.GuardarInventario(Inventarios);
        }

        /// <summary>
        /// //Metodo encargado de  Guardar inventario uno a uno 
        /// </summary>
        /// <param name="Inventarios"></param>
        /// <returns></returns>
        [Authorize]
        [HttpPost, Route("SoporteActivaInventario")]
        public bool SoporteActivaInventario([FromBody] SAInventarioDto Inventarios)
        {
            return Business.SoporteActivaInventario(Inventarios);
        }

        /// <summary>
        /// //Metodo encargado de  Crear inventario uno a uno 
        /// </summary>
        /// <param name="Inventarios"></param>
        /// <returns></returns>
        [Authorize]
        [HttpPost, Route("CreateInventario")]
        public bool CreateInventario([FromBody] CreateInventarioDto Inventarios)
        {
            return Business.CreateInventario(Inventarios);
        }

        /// <summary>
        /// //Metodo encargado de  Actualizar inventario uno a uno 
        /// </summary>
        /// <param name="Inventarios"></param>
        /// <returns></returns>
        [Authorize]
        [HttpPost, Route("UpdateInventario")]
        public bool UpdateInventario([FromBody] UpdateInventarioDto Inventarios)
        {
            return Business.UpdateInventario(Inventarios);
        }

        /// <summary>
        /// Metodo para comporbar la caducidad de la contraseña
        /// </summary>
        /// <param name="Usuario"></param>
        /// <param name="Password"></param>
        /// <returns></returns>
        [Authorize]
        [HttpGet, Route("CaducidadContrasena")]
        public List<CaducidadContrasenaDto> CaducidadContrasena(string Usuario, string Password)
        {
            Password = AES.EncryptAES(Password);
            return Business.CaducidadContrasena(Usuario, Password);
        }


        /// <summary>
        /// Metodo para cambiar la contraseña
        /// </summary>
        /// <param name="Datos"></param>
        /// <returns></returns>
        [HttpPost, Route("CambiarContrasena")]
        public bool CambiarContrasena([FromBody] CambiarContrasenaDto Datos)
        {
            Datos.PasswordNuevo = AES.EncryptAES(Datos.PasswordNuevo);
            Datos.Password = AES.EncryptAES(Datos.Password);
            return Business.CambiarContrasena(Datos);
        }

        /// <summary>
        /// Obtener persona asignada
        /// </summary>
        /// <returns></returns>
        [Authorize]
        [HttpGet, Route("GetAsignacion")]
        public List<GetAsignacionDto> GetAsignacion(string Usuario)
        {
            return Business.GetAsignacion(Usuario);
        }

        /// <summary>
        /// Obtener ubicacion del usuario
        /// </summary>
        /// <returns></returns>
        [Authorize]
        [HttpGet, Route("GetUbicacion")]
        public List<GetUbicacionDto> GetUbicacion(string Id_Inventario)
        {
            return Business.GetUbicacion(Id_Inventario);
        }

        /// <summary>
        /// Obtener Foto seleccionada
        /// </summary>
        /// <returns></returns>
        [Authorize]
        [HttpGet, Route("GetFoto")]
        public List<GetFotoDto> GetFoto(string Id_Inventario)
        {
            return Business.GetFoto(Id_Inventario);
        }

        /// <summary>
        /// Obtener listado de identificacion de los usuarios
        /// </summary>
        /// <returns></returns>
        [Authorize]
        [HttpGet, Route("GetIdentificacionUsuarios")]
        public List<GetIdentificacionUsuariosDto> GetIdentificacionUsuarios()
        {
            return Business.GetIdentificacionUsuarios();
        }

        /// <summary>
        /// Obtener listado de identificacion de los usuarios
        /// </summary>
        /// <returns></returns>
        [Authorize]
        [HttpGet, Route("GetIdentificacionesUsuarios")]
        public List<GetIdentificacionUsuariosDto> GetIdentificacionesUsuarios()
        {
            return Business.GetIdentificacionesUsuarios();
        }
        /// <summary>
        /// Obtener listado de identificacion de los jefes
        /// </summary>
        /// <returns></returns>
        [Authorize]
        [HttpGet, Route("GetIdentificacionJefes")]
        public List<GetIdentificacionUsuariosDto> GetIdentificacionJefes()
        {
            return Business.GetIdentificacionJefes();
        }

        /// <summary>
        /// Obtener Usuarios
        /// </summary>
        /// <returns></returns>
        [Authorize]
        [HttpGet, Route("GetUsuarios")]
        public List<UserLoginDto> GetUsuarios()
        {
            var Users = Business.GetUsuarios();
            for (int i = 0; i < Users.Count; i++)
            {
                //Desencriptar el password
                if (Users[i].Password != null)
                {
                    Users[i].Password = AES.DecryptStringAES(Users[i].Password);
                }
            }
            return Users;
        }


        /// <summary>
        /// //Metodo encargado de  Guardar los Usuarios
        /// </summary>
        /// <returns></returns>
        [Authorize]
        [HttpPost, Route("GuardarUsuarios")]
        public bool GuardarUsuarios([FromBody] UsuariosDto Datos)
        {
            Datos.Password = AES.EncryptAES(Datos.Password);
            return Business.GuardarUsuarios(Datos);
        }

        /// <summary>
        /// //Metodo encargado de Actualizar los Usuarios
        /// </summary>
        /// <returns></returns>
        [Authorize]
        [HttpPost, Route("ActualizarUsuarios")]
        public bool ActualizarUsuarios([FromBody] UsuariosDto dat)
        {
            dat.Password = AES.EncryptAES(dat.Password);
            return Business.ActualizarUsuarios(dat);
        }

        /// <summary>
        /// Inactivar Usuarios
        /// </summary>
        /// <param name="dat"></param>
        /// <returns></returns>
        [Authorize]
        [HttpPost, Route("InactivarUsuarios")]
        public bool InactivarUsuarios([FromBody] InactivarUsuariosDto dat)
        {
            return Business.InactivarUsuarios(dat);
        }

        /// <summary>
        /// Obtener listado de Roles Activos
        /// </summary>
        /// <returns></returns>
        [Authorize]
        [HttpGet, Route("GetRol")]
        public List<RolesDto> GetRol()
        {
            return Business.GetRol();
        }

        /// <summary>
        /// Obtener listado de Roles
        /// </summary>
        /// <returns></returns>
        [Authorize]
        [HttpGet, Route("GetRoles")]
        public List<RolesDto> GetRoles()
        {
            return Business.GetRoles();
        }

        /// <summary>
        /// Obtener listado de Roles
        /// </summary>
        /// <returns></returns>
        [Authorize]
        [HttpGet, Route("GetPermisosRol")]
        public List<PertmisosRolDto> GetPermisosRol(string Id_Rol)
        {
            return Business.GetPermisosRol(Id_Rol);
        }

        /// <summary>
        /// //Metodo encargado de  actualizar los Roles 
        /// </summary>
        /// <returns></returns>
        [Authorize]
        [HttpPost, Route("ActualizarRoles")]
        public bool ActualizarRoles([FromBody] InsertaRolDto roles)
        {
            return Business.ActualizarRoles(roles);
        }


        [Authorize]
        [HttpPost, Route("GuardarRoles")]
        public bool GuardarRoles([FromBody] InsertaRolDto roles)
        {
            return Business.GuardarRoles(roles);
        }

        /// <summary>
        /// //Metodo encargado de Actualizar los roles
        /// </summary>
        /// <returns></returns>
        [Authorize]
        [HttpPost, Route("UpdatePermisosModulos")]
        public bool UpdatePermisosModulos([FromBody] UpdatePermisosModulosDto UpdatePermisosModulos)
        {
            return Business.UpdatePermisosModulos(UpdatePermisosModulos);
        }

        /// <summary>
        /// //Metodo encargado de Actualizar los roles
        /// </summary>
        /// <returns></returns>
        [Authorize]
        [HttpPost, Route("InactivarRoles")]
        public bool InactivarRoles([FromBody] /*RolesDto*/InactivarRolesDto rol)
        {
            return Business.InactivarRoles(rol);
        }

        /// <summary>
        /// Obtener listado de proveedores
        /// </summary>
        /// <returns></returns>
        [Authorize]
        [HttpGet, Route("GetProveedor")]
        public List<GetProveedoresDto> GetProveedor()
        {
            return Business.GetProveedor();
        }


        /// <summary>
        /// //Metodo encargado de Guardar los proveedores
        /// </summary>
        /// <returns></returns>
        [Authorize]
        [HttpPost, Route("GuardarProveedor")]
        public bool GuardarProveedor([FromBody] GetProveedoresDto proveedor)
        {
            return Business.GuardarProveedor(proveedor);
        }

        /// <summary>
        /// //Metodo encargado de Actualizar los proveedores
        /// </summary>
        /// <returns></returns>
        [Authorize]
        [HttpPost, Route("ActualizarProveedor")]
        public bool ActualizarProveedor([FromBody] GetProveedoresDto provee)
        {
            return Business.ActualizarProveedor(provee);
        }

        /// <summary>
        /// Guardar Descuento
        /// </summary>
        /// <param name="GuardarDescuento"></param>
        /// <returns></returns>
        [Authorize]
        [HttpPost, Route("GuardarDescuento")]
        public bool GuardarDescuento([FromBody] GuardarDescuentoDto GuardarDescuento)
        {
            return Business.GuardarDescuento(GuardarDescuento);
        }

        /// <summary>
        /// ActualizarDescuento
        /// </summary>
        /// <param name="ActualizarDescuento"></param>
        /// <returns></returns>
        [Authorize]
        [HttpPost, Route("ActualizarDescuento")]
        public bool ActualizarDescuento([FromBody] ActualizarDescuentoDto ActualizarDescuento)
        {
            return Business.ActualizarDescuento(ActualizarDescuento);
        }

        /// <summary>
        /// Obtener listado de Marcas
        /// </summary>
        /// <returns></returns>
        [Authorize]
        [HttpGet, Route("GetMarca")]
        public List<GetMarcasDto> GetMarca()
        {
            return Business.GetMarca();
        }


        /// <summary>
        /// //Metodo encargado de Guardar las Marcas
        /// </summary>
        /// <returns></returns>
        [Authorize]
        [HttpPost, Route("GuardarMarca")]
        public bool GuardarMarca([FromBody] GetMarcasDto marca)
        {
            return Business.GuardarMarca(marca);
        }

        /// <summary>
        /// //Metodo encargado de Actualizar las Marcas
        /// </summary>
        /// <returns></returns>
        [Authorize]
        [HttpPost, Route("ActualizarMarca")]
        public bool ActualizarMarca([FromBody] GetMarcasDto marc)
        {
            return Business.ActualizarMarca(marc);
        }

        /// <summary>
        /// Obtener listado de Centros de costo activos
        /// </summary>
        /// <returns></returns>
        [Authorize]
        [HttpGet, Route("GetCentroCostos")]
        public List<CentroCostosDto> GetCentroCostos()
        {
            return Business.GetCentroCostos();
        }

        ///// <summary>
        ///// Obtener listado de Centros de costo
        ///// </summary>
        ///// <returns></returns>
        //[Authorize]
        //[HttpGet, Route("GetCentroCosto")]
        //public List<CentroCostosDto> GetCentroCosto()
        //{
        //    return Business.GetCentroCosto();
        //}

        /// <summary>
        /// //Metodo encargado de Guardar los centros de costo
        /// </summary>
        /// <returns></returns>
        [Authorize]
        [HttpPost, Route("GuardarCentroCostos")]
        public bool GuardarCentroCostos([FromBody] CentroCostosDto centro)
        {
            return Business.GuardarCentroCostos(centro);
        }

        /// <summary>
        /// //Metodo encargado de Actualizar los centros de costo
        /// </summary>
        /// <returns></returns>
        [Authorize]
        [HttpPost, Route("ActualizarCentroCostos")]
        public bool ActualizarCentroCostos([FromBody] CentroCostosDto costo)
        {
            return Business.ActualizarCentroCostos(costo);
        }

        /// <summary>
        /// Obtener listado de Tipos de Identificacion Activos
        /// </summary>
        /// <returns></returns>
        [Authorize]
        [HttpGet, Route("GetTipoIdentificacion")]
        public List<TipoIdenficacionDto> GetTipoIdentificacion()
        {
            return Business.GetTipoIdentificacion();
        }

        /// <summary>
        /// Obtener listado de Cargos
        /// </summary>
        /// <returns></returns>
        [Authorize]
        [HttpGet, Route("GetCargos")]
        public List<CargoDto> GetCargos()
        {
            return Business.GetCargos();
        }

        /// <summary>
        /// //Metodo encargado de Guardar Cargo
        /// </summary>
        /// <returns></returns>
        [Authorize]
        [HttpPost, Route("GuardarCargos")]
        public bool GuardarCargos([FromBody] CargoDto cargo)
        {
            return Business.GuardarCargos(cargo);
        }

        /// <summary>
        /// //Metodo encargado de Actualizar Cargo
        /// </summary>
        /// <returns></returns>
        [Authorize]
        [HttpPost, Route("ActualizarCargos")]
        public bool ActualizarCargos([FromBody] CargoDto carg)
        {
            return Business.ActualizarCargos(carg);
        }

        /// <summary>
        /// Obtener listado de Sedes Activas
        /// </summary>
        /// <returns></returns>
        [Authorize]
        [HttpGet, Route("GetSede")]
        public List<SedesDto> GetSede()
        {
            return Business.GetSede();
        }

        /// <summary>
        /// Obtener listado de Sedes
        /// </summary>
        /// <returns></returns>
        [Authorize]
        [HttpGet, Route("GetSedes")]
        public List<SedesDto> GetSedes()
        {
            return Business.GetSedes();
        }

        /// <summary>
        /// //Metodo encargado de Guardar Sedes
        /// </summary>
        /// <returns></returns>
        [Authorize]
        [HttpPost, Route("GuardarSedes")]
        public bool GuardarSedes([FromBody] SedesDto sede)
        {
            return Business.GuardarSedes(sede);
        }

        /// <summary>
        /// //Metodo encargado de Actualizar Sedes
        /// </summary>
        /// <returns></returns>
        [Authorize]
        [HttpPost, Route("ActualizarSedes")]
        public bool ActualizarSedes([FromBody] SedesDto sedes)
        {
            return Business.ActualizarSedes(sedes);
        }

        /// <summary>
        /// Obtener listado de Ciudades activas
        /// </summary>
        /// <returns></returns>
        [Authorize]
        [HttpGet, Route("GetCiudades")]
        public List<CiudadDto> GetCiudades()
        {
            return Business.GetCiudades();
        }

        /// <summary>
        /// Obtener listado de Ciudades activas
        /// </summary>
        /// <returns></returns>
        [Authorize]
        [HttpGet, Route("GetCiudad")]
        public List<CiudadDto> GetCiudad()
        {
            return Business.GetCiudad();
        }

        /// <summary>
        /// Obtener listado de Pisos Activos
        /// </summary>
        /// <returns></returns>
        [Authorize]
        [HttpGet, Route("GetPiso")]
        public List<PisosDto> GetPiso(string Id_Sede)
        {
            return Business.GetPiso(Id_Sede);
        }

        /// <summary>
        /// Obtener listado de Pisos
        /// </summary>
        /// <returns></returns>
        [Authorize]
        [HttpGet, Route("GetPisos")]
        public List<PisosDto> GetPisos()
        {
            return Business.GetPisos();
        }

        /// <summary>
        /// Obtener listado de Puestos
        /// </summary>
        /// <returns></returns>
        [Authorize]
        [HttpGet, Route("GetPuestos")]
        public List<PuestosDto> GetPuestos()
        {
            return Business.GetPuestos();
        }

        /// <summary>
        /// //Metodo encargado de Guardar Pisos
        /// </summary>
        /// <returns></returns>
        [Authorize]
        [HttpPost, Route("GuardarPisos")]
        public bool GuardarPisos([FromBody] PisosDto pisos)
        {
            return Business.GuardarPisos(pisos);
        }

        /// <summary>
        /// //Metodo encargado de Actualizar Pisos
        /// </summary>
        /// <returns></returns>
        [Authorize]
        [HttpPost, Route("ActualizarPisos")]
        public bool ActualizarPisos([FromBody] PisosDto piso)
        {
            return Business.ActualizarPisos(piso);
        }


        /// <summary>
        /// Obtener listado de Bodegas
        /// </summary>
        /// <returns></returns>
        [Authorize]
        [HttpGet, Route("GetBodega")]
        public List<GetBodegasDto> GetBodega()
        {
            return Business.GetBodega();
        }

        /// <summary>
        /// //Metodo encargado de Guardar Bodegas
        /// </summary>
        /// <returns></returns>
        [Authorize]
        [HttpPost, Route("GuardarBodega")]
        public bool GuardarBodega([FromBody] GetBodegasDto bodega)
        {
            return Business.GuardarBodega(bodega);
        }

        /// <summary>
        /// //Metodo encargado de Actualizar Bodegas
        /// </summary>
        /// <returns></returns>
        [Authorize]
        [HttpPost, Route("ActualizarBodega")]
        public bool ActualizarBodega([FromBody] GetBodegasDto bodeg)
        {
            return Business.ActualizarBodega(bodeg);
        }

        /// <summary>
        /// Obtener listado de Puestos
        /// </summary>
        /// <returns></returns>
        [Authorize]
        [HttpGet, Route("GetPuesto")]
        public List<PuestosDto> GetPuesto()
        {
            return Business.GetPuesto();
        }

        /// <summary>
        /// //Metodo encargado de Guardar Puestos
        /// </summary>
        /// <returns></returns>
        [Authorize]
        [HttpPost, Route("GuardarPuesto")]
        public bool GuardarPuesto([FromBody] PuestosDto puesto)
        {
            return Business.GuardarPuesto(puesto);
        }

        /// <summary>
        /// //Metodo encargado de Actualizar Puestos
        /// </summary>
        /// <returns></returns>
        [Authorize]
        [HttpPost, Route("ActualizarPuesto")]
        public bool ActualizarPuesto([FromBody] PuestosDto puest)
        {
            return Business.ActualizarPuesto(puest);
        }

        /// <summary>
        /// Obtener listado de Tipos de Equipos
        /// </summary>
        /// <returns></returns>
        [Authorize]
        [HttpGet, Route("GetTipoEquipo")]
        public List<GetTipoActivoDto> GetTipoEquipo()
        {
            return Business.GetTipoEquipo();
        }

        /// <summary>
        /// //Metodo encargado de Guardar Tipos de Equipos
        /// </summary>
        /// <returns></returns>
        [Authorize]
        [HttpPost, Route("GuardarTipoEquipo")]
        public bool GuardarTipoEquipo([FromBody] GetTipoActivoDto t_equipo)
        {
            return Business.GuardarTipoEquipo(t_equipo);
        }

        /// <summary>
        /// //Metodo encargado de Actualizar Tipos de Equipos
        /// </summary>
        /// <returns></returns>
        [Authorize]
        [HttpPost, Route("ActualizarTipoEquipo")]
        public bool ActualizarTipoEquipo([FromBody] GetTipoActivoDto t_equi)
        {
            return Business.ActualizarTipoEquipo(t_equi);
        }

        /// <summary>
        /// Obtener listado de Estados de Equipos
        /// </summary>
        /// <returns></returns>
        [Authorize]
        [HttpGet, Route("GetEstadoEquipo")]
        public List<EstadoEquipoDto> GetEstadoEquipo()
        {
            return Business.GetEstadoEquipo();
        }

        /// <summary>
        /// Obtener listado de Estados de Equipos
        /// </summary>
        /// <returns></returns>
        [Authorize]
        [HttpGet, Route("GetEstadoEquipoActi")]
        public List<EstadoEquipoDto> GetEstadoEquipoActi()
        {
            return Business.GetEstadoEquipoActi();
        }

        /// <summary>
        /// //Metodo encargado de Guardar Estados de Equipos
        /// </summary>
        /// <returns></returns>
        [Authorize]
        [HttpPost, Route("GuardarEstadoEquipo")]
        public bool GuardarEstadoEquipo([FromBody] EstadoEquipoDto e_equipo)
        {
            return Business.GuardarEstadoEquipo(e_equipo);
        }

        /// <summary>
        /// //Metodo encargado de Actualizar Estados de Equipos
        /// </summary>
        /// <returns></returns>
        [Authorize]
        [HttpPost, Route("ActualizarEstadoEquipo")]
        public bool ActualizarEstadoEquipo([FromBody] EstadoEquipoDto e_equi)
        {
            return Business.ActualizarEstadoEquipo(e_equi);
        }

        /// <summary>
        /// Obtener  Reporte completo
        /// </summary>
        /// <returns></returns>
        [Authorize]
        [HttpGet, Route("GetReporteCompleto")]
        public List<ReportesDto> GetReporteCompleto()
        {
            return Business.GetReporteCompleto();
        }

        /// <summary>
        /// Obtener  Reporte por Asignacion
        /// </summary>
        /// <returns></returns>
        [Authorize]
        [HttpGet, Route("GetReporteAsignacion")]
        public List<ReportesDto> GetReporteAsignacion()
        {
            return Business.GetReporteAsignacion();
        }

        /// <summary>
        /// Obtener Reporte por Proveedor
        /// </summary>
        /// <returns></returns>
        [Authorize]
        [HttpGet, Route("GetReporteProveedores")]
        public List<ReportesDto> GetReporteProveedores(string Id_Proveedor)
        {
            return Business.GetReporteProveedores(Id_Proveedor);
        }

        /// <summary>
        /// Obtener  Reporte por Disponibilidad
        /// </summary>
        /// <returns></returns>
        [Authorize]
        [HttpGet, Route("GetReporteDisponibilidad")]
        public List<ReportesDto> GetReporteDisponibilidad()
        {
            return Business.GetReporteDisponibilidad();
        }


        /// <summary>
        /// Obtener  Reporte por Disponibilidad
        /// </summary>
        /// <returns></returns>
        [Authorize]
        [HttpGet, Route("GetReporteEstadosActivo")]
        public List<ReportesDto> GetReporteEstadosActivo(string Id_Estado_Activo)
        {
            return Business.GetReporteEstadosActivo(Id_Estado_Activo);
        }

        /// <summary>
        /// Obtener  Reporte por Disponibilidad
        /// </summary>
        /// <returns></returns>
        [Authorize]
        [HttpGet, Route("GetReporteCentroCosto")]
        public List<ReportesDto> GetReporteCentroCosto(string Id_Centro_Costo)
        {
            return Business.GetReporteCentroCosto(Id_Centro_Costo);
        }

        /// <summary>
        /// Obtener  Reporte por Disponibilidad
        /// </summary>
        /// <returns></returns>
        [Authorize]
        [HttpGet, Route("GetInventarioXUsuarios")]
        public List<GetInventarioDto> GetInventarioXUsuarios(string Identificacion)
        {
            return Business.GetInventarioXUsuarios(Identificacion);
        }

        /// <summary>
        /// Traer las plantillas
        /// </summary>
        /// <returns></returns>
        //[Authorize]
        //[HttpPost, Route("SolicitudesStorage")]
        //public dynamic SolicitudesStorage(SolicitudesStorage s)
        //{
        //    return Business.SolicitudesStorage(s);
        //}

        /// <summary>
        /// Inserta archivo de inventarios
        /// </summary>
        /// <returns></returns>
        [Authorize]
        [HttpPost, Route("DebuggDataT")]
        public string DebuggDataT([FromBody] string[,] file, string UserGeneral)
        {
            try
            {
                return Business.DebuggDataT(Properties.Settings.Default.DatabaseFields, file, UserGeneral, "Inventarios");
                //return true;
            }
            catch (Exception e)
            {
                System.Console.WriteLine(e);
                return string.Format("Error: {0}", e.Message);
                //return string.Format("Hacen falta las siguientes columnas en el archivo: {0}", missingColumns.Substring(1, missingColumns.Length - 1));
            }
        }

        /// <summary>
        /// Inserta archivo de usuarios
        /// </summary>
        /// <param name="file"></param>
        /// <param name="UserGeneral"></param>
        /// <returns></returns>
        [Authorize]
        [HttpPost, Route("DebuggDataUsuarios")]
        public string DebuggDataUsuarios([FromBody] string[,] file, string UserGeneral)
        {
            try
            {
                return Business.DebuggDataT(Properties.Settings.Default.DatabaseFieldsUsers, file, UserGeneral, "Usuarios");
                //return true;
            }
            catch (Exception e)
            {
                System.Console.WriteLine(e);
                return string.Format("Error: {0}", e.Message);
                //return string.Format("Hacen falta las siguientes columnas en el archivo: {0}", missingColumns.Substring(1, missingColumns.Length - 1));
            }
        }

        /// <summary>
        /// Obtener filtro de sedes segun ciudad.
        /// </summary>
        /// <param name="IdCiudad"></param>
        /// <returns></returns>
        [Authorize]
        [HttpGet, Route("GetFiltroSedes")]
        public List<SedesDto> GetFiltroSedes(string Id_Ciudad)
        {
            return Business.GetFiltroSedes(Id_Ciudad);
        }

        /// <summary>
        /// Obtener filtro de Pisos segun Sede.
        /// </summary>
        /// <param name="IdSede"></param>
        /// <returns></returns>
        [Authorize]
        [HttpGet, Route("GetFiltroPisos")]
        public List<PisosDto> GetFiltroPisos(string Id_Sede)
        {
            return Business.GetFiltroPisos(Id_Sede);
        }

        /// <summary>
        /// Obtener filtro de Puestos segun Pisos y sede.
        /// </summary>
        /// <param name="IdSede"></param>
        /// <param name="IdPiso"></param>
        /// <returns></returns>
        [Authorize]
        [HttpGet, Route("GetFiltroPuestos")]
        public List<PuestosDto> GetFiltroPuestos(string Id_Sede, int Id_Piso)
        {
            return Business.GetFiltroPuestos(Id_Sede, Id_Piso);
        }

        /// <summary>
        /// Obtener listado de seriales
        /// </summary>
        /// <returns></returns>
        [Authorize]
        [HttpGet, Route("GetSeriales")]
        public List<SerialesDto> GetSeriales()
        {
            return Business.GetSeriales();
        }

        /// <summary>
        /// Devolucion Masiva
        /// </summary>
        /// <returns></returns>
        [Authorize]
        [HttpPost, Route("DevolucionMasivaProveedor")]
        public bool DevolucionMasivaProveedor([FromBody] DevolucionMasivaProveedorDto Serial)
        {
            return Business.DevolucionMasivaProveedor(Serial);
        }

        /// <summary>
        /// Obtener Historial del serial
        /// </summary>
        /// <param name="Serial"></param>
        /// <returns></returns>
        [Authorize]
        [HttpGet, Route("GetHistorico")]
        public List<HistoricoDto> GetHistorico(string Serial)
        {
            return Business.GetHistorico(Serial);
        }

        /// <summary>
        /// Dashboard Inventario
        /// </summary>
        /// <param name="Id_Proveedor"></param>
        /// <param name="Id_Marca"></param>
        /// <param name="Id_Tipo_Activo"></param>
        /// <returns></returns>
        [Authorize]
        [HttpGet, Route("DashboardInventario")]
        public List<DashboardInventarioDto> DashboardInventario(int Id_Proveedor, int Id_Marca, int Id_Tipo_Activo)
        {
            return Business.DashboardInventario(Id_Proveedor, Id_Marca, Id_Tipo_Activo);
        }

        /// <summary>
        ///OBTIENE PLANTILLAS DE LOS DOCUMENTOS
        /// </summary>
        /// <returns></returns>
        [Authorize]
        [HttpGet, Route("PermissionsEdit")]
        public string PermissionsEdit(string IdFile)
        {
            System.Net.ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
            var url = new Uri($"https://services.grupogss.com.co/Servicios/StorageCloudServices/api/1.0/PermissionsEdit?IdFile={IdFile}");
            var request = (HttpWebRequest)WebRequest.Create(url);
            request.Method = "GET";
            request.Headers["Authorization"] = "AV_AppAuthorization dVI3Z3dmUEVFUkxsb0RFS2ZzM3FQNW1TamVSNnNMV04=";
            try
            {
                using (WebResponse response = request.GetResponse())
                {
                    using (Stream strReader = response.GetResponseStream())
                    {
                        using (StreamReader objReader = new StreamReader(strReader))
                        {
                            string responseBody = objReader.ReadToEnd();
                            return responseBody;
                        }
                    }
                }
            }
            catch (WebException ex)
            {
                return null;
            }

        }

        /// <summary>
        ///Suspender los permisos para editar
        /// </summary>
        /// <returns></returns>
        [Authorize]
        [HttpGet, Route("SuspendPermissionsEdit")]
        public string SuspendPermissionsEdit(string IdFile)
        {
            System.Net.ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
            var url = new Uri($"https://services.grupogss.com.co/Servicios/StorageCloudServices/api/1.0/SuspendPermissionsEdit?IdFile={IdFile}");
            var request = (HttpWebRequest)WebRequest.Create(url);
            request.Method = "GET";
            request.Headers["Authorization"] = "AV_AppAuthorization dVI3Z3dmUEVFUkxsb0RFS2ZzM3FQNW1TamVSNnNMV04=";
            try
            {
                using (WebResponse response = request.GetResponse())
                {
                    using (Stream strReader = response.GetResponseStream())
                    {
                        using (StreamReader objReader = new StreamReader(strReader))
                        {
                            string responseBody = objReader.ReadToEnd();
                            return responseBody;
                        }
                    }
                }
            }
            catch (WebException ex)
            {
                return null;
            }

        }

        /// <summary>
        /// DESCARGA DOCUMENTOS EN BASE64
        /// </summary>
        /// <returns></returns>
        [Authorize]
        [HttpGet, Route("DownLoadDocument")]
        public string DownLoadDocument(string IdFile)
        {
            System.Net.ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
            var url = new Uri($"https://services.grupogss.com.co/Servicios/StorageCloudServices/api/1.0/DownLoadDocument?IdFile={IdFile}");
            var request = (HttpWebRequest)WebRequest.Create(url);
            request.Method = "GET";
            request.Headers["Authorization"] = "AV_AppAuthorization dVI3Z3dmUEVFUkxsb0RFS2ZzM3FQNW1TamVSNnNMV04=";
            try
            {
                using (WebResponse response = request.GetResponse())
                {
                    using (Stream strReader = response.GetResponseStream())
                    {
                        using (StreamReader objReader = new StreamReader(strReader))
                        {
                            string responseBody = objReader.ReadToEnd();
                            return responseBody;
                        }
                    }
                }
            }
            catch (WebException ex)
            {
                return null;
            }

        }

        /// <summary>
        /// Obtener informacion del Documento
        /// </summary>
        /// <returns></returns>
        [Authorize]
        [HttpGet, Route("GetInformationFile")]
        public string GetInformationFile(string IdFile)
        {
            System.Net.ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
            var url = new Uri($"https://services.grupogss.com.co/Servicios/StorageCloudServices/api/1.0/GetInformationFile?IdFile={IdFile}");
            var request = (HttpWebRequest)WebRequest.Create(url);
            request.Method = "GET";
            request.Headers["Authorization"] = "AV_AppAuthorization dVI3Z3dmUEVFUkxsb0RFS2ZzM3FQNW1TamVSNnNMV04=";
            try
            {
                using (WebResponse response = request.GetResponse())
                {
                    using (Stream strReader = response.GetResponseStream())
                    {
                        using (StreamReader objReader = new StreamReader(strReader))
                        {
                            string responseBody = objReader.ReadToEnd();
                            return responseBody;
                        }
                    }
                }
            }
            catch (WebException ex)
            {
                return null;
            }

        }

        /// <summary>
        ///CARGA PLANTILLAS DE LOS DOCUMENTOS
        /// </summary>
        /// <returns></returns>
        [Authorize]
        [HttpPost, Route("LoadFile")]
        public string LoadFile(ApiDocumentDto ApiDocument)
        {
            System.Net.ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
            var url = new Uri($"https://services.grupogss.com.co/Servicios/StorageCloudServices/api/1.0/LoadFile");
            var request = (HttpWebRequest)WebRequest.Create(url);
            string postData = "nameFile=" + Uri.EscapeDataString(ApiDocument.nameFile);
            postData += "&mimetype=" + Uri.EscapeDataString(ApiDocument.mimetype);

            String value = ApiDocument.fileBase64;
            int limit = 2000;
            StringBuilder sb = new StringBuilder();
            int loops = value.Length / limit;
            for (int i = 0; i <= loops; i++)
            {
                if (i < loops)
                {
                    sb.Append(Uri.EscapeDataString(value.Substring(limit * i, limit)));
                }
                else
                {
                    sb.Append(Uri.EscapeDataString(value.Substring(limit * i)));
                }
            }

            postData += "&filebase64=" + sb;
            //string temp1 = (string)TempData["SectorIds"];
            var data = Encoding.ASCII.GetBytes(postData);
            request.Method = "POST";
            request.ContentType = "application/x-www-form-urlencoded";
            request.ContentLength = data.Length;
            request.Headers["Authorization"] = "AV_AppAuthorization dVI3Z3dmUEVFUkxsb0RFS2ZzM3FQNW1TamVSNnNMV04=";

            try
            {
                using (var stream = request.GetRequestStream())
                {
                    stream.Write(data, 0, data.Length);
                }
                var response = (HttpWebResponse)request.GetResponse();
                var responseString = new StreamReader(response.GetResponseStream()).ReadToEnd();
                return responseString;
            }
            catch (WebException ex)
            {
                return null;
            }
        }

        /// <summary>
        ///OBTIENE PLANTILLAS DE LOS DOCUMENTOS
        /// </summary>
        /// <returns></returns>
        [Authorize]
        [HttpGet, Route("GetApiDocument")]
        public List<GetApiDocumentDto> GetApiDocument()
        {
            return Business.GetApiDocument();
        }

        /// <summary>
        ///OBTIENE PLANTILLAS DE LOS DOCUMENTOS
        /// </summary>
        /// <returns></returns>
        [Authorize]
        [HttpGet, Route("GetApiDocumentById")]
        public List<DocumentApiDto> GetApiDocumentById(int Id_Tipo_Plantilla)
        {
            return Business.GetApiDocumentById(Id_Tipo_Plantilla);
        }

        /// <summary>
        /// INSERTAR PLANTILLA DE DOCUMENTOS
        /// </summary>
        /// <returns></returns>
        [Authorize]
        [HttpPost, Route("InsertApiDocument")]
        public bool InsertApiDocument(DocumentApiDto InsertApiDocument)
        {
            return Business.InsertApiDocument(InsertApiDocument);
        }

        /// <summary>
        ///ACTUALIZA PLANTILLAS DOCUMENTOS
        /// </summary>
        /// <returns></returns>
        [Authorize]
        [HttpPost, Route("UpdateApiDocument")]
        public List<ChangeStateTemplateDto> UpdateApiDocument(ChangeStateTemplateDto UpdateApiDocument)
        {
            return Business.UpdateApiDocument(UpdateApiDocument);
        }

        /// <summary>
        ///ACTUALIZA DESCRIPCION DE PLANTILLAS DOCUMENTOS
        /// </summary>
        /// <returns></returns>
        [Authorize]
        [HttpPost, Route("UpdateDescriptionApiDocument")]
        public List<UpdateDescriptionDto> UpdateDescriptionApiDocument(UpdateDescriptionDto UpdateDescription)
        {
            return Business.UpdateDescriptionApiDocument(UpdateDescription);
        }

        /// <summary>
        ///OBTIENE TODOS LOS TOKENS
        /// </summary>
        /// <returns></returns>
        [Authorize]
        [HttpGet, Route("GetTokens")]
        public List<tokensDto> GetTokens()
        {
            return Business.GetTokens();
        }

        /// <summary>
        ///OBTIENE TODOS LOS TOKENS
        /// </summary>
        /// <returns></returns>
        [Authorize]
        [HttpGet, Route("GetTokensAcive")]
        public List<tokensDto> GetTokensAcive(string Id_plantilla)
        {
            Id_plantilla = "%" + Id_plantilla + "%";
            return Business.GetTokensAcive(Id_plantilla);
        }

        /// <summary>
        /// Modificar Word
        /// </summary>
        /// <returns></returns>
        [Authorize]
        [HttpPost, Route("CreacionActaWord")]
        public IHttpActionResult CreacionActaWord(CreacionActaDto request)
        {
            try
            {
                string base64 = request.wordContent;
                List<string> additionalArray = request.arrayDeDatos;
                

                // Decodificar el contenido base64
                byte[] documentBytes = Convert.FromBase64String(base64);

                // Crear un flujo de memoria a partir de los bytes decodificados
                using (MemoryStream stream = new MemoryStream(documentBytes))
                {
                    // Cargar el documento Word utilizando la biblioteca DocX
                    using (DocX doc = DocX.Load(stream))
                    {

                        foreach (var jsonString in additionalArray)
                        {
                            // Deserializa el JSON en una lista de diccionarios.
                            List<Dictionary<string, string>> data = JsonConvert.DeserializeObject<List<Dictionary<string, string>>>(jsonString);

                            foreach (var dictionary in data)
                            {
                                foreach (var key in dictionary.Keys)
                                {
                                    string palabraABuscar = key;
                                    string palabraAReemplazar = dictionary[key];

                                    foreach (var paragraph in doc.Paragraphs)
                                    {
                                        if (!string.IsNullOrEmpty(palabraAReemplazar) && palabraAReemplazar.Contains("data:image/"))
                                        {
                                            string dataUrl = palabraAReemplazar;
                                            string base64Data = dataUrl.Substring(dataUrl.IndexOf(",") + 1);
                                            byte[] imageBytes = Convert.FromBase64String(base64Data);

                                            // Guarda temporalmente la imagen en un archivo
                                            string tempImageFileName = Path.GetTempFileName();
                                            File.WriteAllBytes(tempImageFileName, imageBytes);

                                            // Inserta la imagen desde el archivo temporal
                                            var image = doc.AddImage(tempImageFileName);
                                            var picture = image.CreatePicture();

                                            // Encuentra la ubicación de la palabra a reemplazar
                                            int index = paragraph.Text.IndexOf(palabraABuscar);

                                            if (index >= 0)
                                            {
                                                // Elimina la palabra
                                                paragraph.ReplaceText(palabraABuscar, string.Empty, false, RegexOptions.IgnoreCase);

                                                // Inserta la imagen en la posición de la palabra
                                                paragraph.InsertPicture(picture, index);
                                            }

                                            // Borra el archivo temporal
                                            File.Delete(tempImageFileName);
                                        }
                                        else
                                        {
                                            paragraph.ReplaceText(palabraABuscar, palabraAReemplazar, false, RegexOptions.IgnoreCase);
                                        }
                                    }
                                }
                            }
                        }


                        // Guardar el documento Word modificado en un flujo de memoria
                        MemoryStream modifiedStream = new MemoryStream();
                        doc.SaveAs(modifiedStream);

                        // Convertir el flujo de memoria en una cadena base64
                        string base64ModifiedContent = Convert.ToBase64String(modifiedStream.ToArray());

                        // Devolver el contenido base64 como una respuesta HTTP OK
                        return Ok(base64ModifiedContent);
                    }
                }
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }

        /// <summary>
        /// Modificar excel
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        [Authorize]
        [HttpPost, Route("CreacionActaExcel")]
        public IHttpActionResult CreacionActaExcel(CreacionActaDto request)
        {
            try
            {
                string base64 = request.wordContent;
                List<string> additionalArray = request.arrayDeDatos;
                List<string> additionalArrayDispo = request.arrayDeDispositivos;
                // Decodificar el contenido base64
                byte[] documentBytes = Convert.FromBase64String(base64);
                // Crear un flujo de memoria a partir de los bytes decodificados
                using (MemoryStream stream = new MemoryStream(documentBytes))
                {
                    // ======================================== Reemplazo de tokens Dinamicos ======================================== //

                    // Cargar el libro de Excel utilizando NPOI
                    XSSFWorkbook workbook = new XSSFWorkbook(stream);

                    // Crear una lista de modificaciones
                    List<Tuple<int, int, string, string, float>> imageModifications = new List<Tuple<int, int, string, string, float>>();

                    foreach (var jsonString in additionalArray)
                    {
                        // Deserializa el JSON en una lista de diccionarios.
                        List<Dictionary<string, string>> data = JsonConvert.DeserializeObject<List<Dictionary<string, string>>>(jsonString);
                        foreach (var dictionary in data)
                        {
                            foreach (var key in dictionary.Keys)
                            {
                                string palabraABuscar = key;
                                string palabraAReemplazar = dictionary[key];
                                foreach (var sheet in workbook)
                                {
                                    var rowEnumerator = sheet.GetRowEnumerator();
                                    while (rowEnumerator.MoveNext())
                                    {
                                        var row = (XSSFRow)rowEnumerator.Current;
                                        foreach (var cell in row.Cells)
                                        {
                                            if (cell.CellType == NPOI.SS.UserModel.CellType.String)
                                            {
                                                var cellValue = cell.StringCellValue;
                                                if (cellValue != null && cellValue.Contains(palabraABuscar))
                                                {
                                                    if (!string.IsNullOrEmpty(palabraAReemplazar) && palabraAReemplazar.Contains("data:image/"))
                                                    {
                                                        string cellTextWithImage = cellValue.Replace(palabraABuscar, "");
                                                        string dataUrl = palabraAReemplazar;
                                                        string base64Data = dataUrl.Substring(dataUrl.IndexOf(",") + 1);
                                                        // Obtén la altura de la fila actual
                                                        float rowHeight = row.HeightInPoints;
                                                        imageModifications.Add(Tuple.Create(cell.ColumnIndex, cell.RowIndex, cellTextWithImage, base64Data, rowHeight));
                                                    }
                                                    else {
                                                        cell.SetCellValue(cellValue.Replace(palabraABuscar, palabraAReemplazar));
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }

                    


                    // ======================================== Reemplazo de tokens Fijos (Varios dispositivos) ======================================== //

                    bool primeraInsercion = true;
                    IRow filaOriginal = null;
                    List<Action> accionesAModificar = new List<Action>();
                    List<CellRangeAddress> mergedRegionsProcesadas = new List<CellRangeAddress>();
                    Dictionary<CellRangeAddress, List<ICellStyle>> diccionarioEstilos = new Dictionary<CellRangeAddress, List<ICellStyle>>();
                    int incrementoFila = 0;
                    int numFila = 0;

                    // Todo los arrays del listado de dispositivos
                    foreach (var jsonString in additionalArrayDispo)
                    {
                        // Deserializa la cadena JSON en un objeto JArray
                        JArray jsonArray = JArray.Parse(jsonString);
                        // Array por Array
                        foreach (var jsonObject in jsonArray[0])
                        {
                            var data = JsonConvert.DeserializeObject<Dictionary<string, string>>(jsonObject.ToString());
                            bool insercionRealizada = false;
                            //Llave y valor de cada array
                            foreach (var dictionary in data)
                            { 
                                string palabraABuscar = dictionary.Key;
                                string palabraAReemplazar = dictionary.Value;

                                foreach (var sheet in workbook)
                                {
                                    var rowEnumerator = sheet.GetRowEnumerator();
                                    
                                    foreach (var mergedRegion in sheet.MergedRegions)
                                    {
                                        if (!diccionarioEstilos.ContainsKey(mergedRegion))
                                        {
                                            mergedRegionsProcesadas.Add(mergedRegion);

                                            // Obtener la lista de estilos para la región combinada
                                            List<ICellStyle> estilos = new List<ICellStyle>();

                                            // Iterar sobre todas las filas dentro de la región combinada
                                            for (int rowIndex = mergedRegion.FirstRow; rowIndex <= mergedRegion.LastRow; rowIndex++)
                                            {
                                                IRow row = sheet.GetRow(rowIndex);
                                                // Iterar sobre todas las celdas dentro de la fila
                                                for (int colIndex = mergedRegion.FirstColumn; colIndex <= mergedRegion.LastColumn; colIndex++)
                                                {
                                                    ICell cell = row.GetCell(colIndex, MissingCellPolicy.CREATE_NULL_AS_BLANK);
                                                    ICellStyle cellStyle = cell.CellStyle;
                                                    // Agregar el estilo a la lista
                                                    estilos.Add(cellStyle);
                                                }
                                            }
                                            // Almacenar la lista de estilos en el diccionario asociado a la región combinada
                                            diccionarioEstilos.Add(mergedRegion, estilos);
                                        }
                                    }
                                    while (rowEnumerator.MoveNext())
                                    {
                                        var row = (XSSFRow)rowEnumerator.Current;
                                        int rowIndex = row.RowNum;

                                        foreach (var cell in row.Cells)
                                        {
                                            if (cell.CellType == NPOI.SS.UserModel.CellType.String)
                                            {
                                                var cellValue = cell.StringCellValue;
                                                if (cellValue != null && cellValue.Contains(palabraABuscar))
                                                {
                                                    if (insercionRealizada)
                                                    {
                                                        accionesAModificar.Add(() =>
                                                        {
                                                            // Reemplazar el valor de la celda
                                                            cell.SetCellValue(cellValue.Replace(palabraABuscar, palabraAReemplazar));
                                                        });
                                                    }
                                                    else 
                                                    {
                                                        incrementoFila += 1;
                                                        numFila = rowIndex +2;
                                                        accionesAModificar.Add(() =>
                                                        {
                                                            // Desplazar filas hacia abajo para hacer espacio para la nueva fila
                                                            sheet.ShiftRows(rowIndex + 1, sheet.LastRowNum, 1, true, false);
                                                            var newRow = sheet.CreateRow(rowIndex + 1);
                                                            if (primeraInsercion)
                                                            {
                                                                filaOriginal = sheet.GetRow(rowIndex); // Guardar la fila original
                                                                primeraInsercion = false;
                                                            }

                                                            // Copiar cada celda de la fila original a la nueva fila
                                                            for (int i = 0; i < filaOriginal.LastCellNum; i++)
                                                            {
                                                                var sourceCell = filaOriginal.GetCell(i);
                                                                var newCell = newRow.CreateCell(i);
                                                                if (sourceCell != null)
                                                                {
                                                                    // Copiar el valor de la celda
                                                                    newCell.SetCellValue(sourceCell.StringCellValue);
                                                                    // Copiar el estilo de la celda si es necesario
                                                                    newCell.CellStyle = sourceCell.CellStyle;
                                                                }
                                                            }
                                                            foreach (var mergedRegion in sheet.MergedRegions)
                                                            {
                                                                // Verificar si la región combinada se superpone con la fila insertada
                                                                if (mergedRegion.FirstRow >= rowIndex && mergedRegion.LastRow <= rowIndex)
                                                                {
                                                                    // La región combinada está dentro de la fila insertada
                                                                    var newMergedRegion = new NPOI.SS.Util.CellRangeAddress(
                                                                        mergedRegion.FirstRow + 1,
                                                                        mergedRegion.LastRow + 1,
                                                                        mergedRegion.FirstColumn,
                                                                        mergedRegion.LastColumn);

                                                                    // Verificar si la región combinada ya existe antes de agregarla
                                                                    if (!sheet.MergedRegions.Contains(newMergedRegion))
                                                                    {
                                                                        sheet.AddMergedRegion(newMergedRegion);
                                                                    }
                                                                }
                                                                else if (mergedRegion.FirstRow < rowIndex && mergedRegion.LastRow >= rowIndex)
                                                                {
                                                                    // La región combinada se extiende a la fila original
                                                                    // Ajustar la región combinada en la nueva fila
                                                                    var newMergedRegion = new NPOI.SS.Util.CellRangeAddress(
                                                                        rowIndex,
                                                                        rowIndex + (mergedRegion.LastRow - rowIndex),
                                                                        mergedRegion.FirstColumn,
                                                                        mergedRegion.LastColumn);

                                                                    // Verificar si la región combinada ya existe antes de agregarla
                                                                    if (!sheet.MergedRegions.Contains(newMergedRegion))
                                                                    {
                                                                        sheet.AddMergedRegion(newMergedRegion);
                                                                    }
                                                                }
                                                            }
                                                            cell.SetCellValue(cellValue.Replace(palabraABuscar, palabraAReemplazar));
                                                            
                                                        });
                                                        insercionRealizada = true;
                                                    }

                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }

                    // Ejecutar todas las acciones recopiladas para agregar filas de todos los dispositivos seleccionados
                    foreach (var accion in accionesAModificar)
                    {
                        accion();
                    }


                    // ======================================== Agregar estilos de las celdas combinadas ======================================== //

                    foreach (var sheet in workbook)
                    {
                        var listaMergedRegions = mergedRegionsProcesadas.OrderBy(mergedRegion => mergedRegion.FirstRow).ToList();
                        // Iterar sobre la lista en orden descendente
                        foreach (var mergedRegion in listaMergedRegions)
                        {
                            // Obtener la fila de la primera celda de la región combinada
                            int filaRegion = mergedRegion.FirstRow + 1;
                            if (filaRegion > numFila)
                            {
                                // Crear una nueva instancia de CellRangeAddress con las filas ajustadas
                                var nuevaRegion = new CellRangeAddress(
                                    mergedRegion.FirstRow + incrementoFila,
                                    mergedRegion.LastRow + incrementoFila,
                                    mergedRegion.FirstColumn,
                                    mergedRegion.LastColumn);
                                // Verificar si la región combinada ya existe antes de agregarla
                                if (!sheet.MergedRegions.Contains(nuevaRegion))
                                {
                                    sheet.AddMergedRegion(nuevaRegion);
                                    // Obtener los estilos asociados a la región combinada desde el diccionario
                                    if (diccionarioEstilos.TryGetValue(mergedRegion, out var listaEstilos))
                                    {
                                        // Aplicar los estilos a todas las celdas de la nueva región combinada
                                        for (int rowIndex = nuevaRegion.FirstRow; rowIndex <= nuevaRegion.LastRow; rowIndex++)
                                        {
                                            IRow row = sheet.GetRow(rowIndex);
                                            if (row == null) continue;  // Evitar NullReferenceException si la fila es null
                                            for (int colIndex = nuevaRegion.FirstColumn; colIndex <= nuevaRegion.LastColumn; colIndex++)
                                            {
                                                ICell cell = row.GetCell(colIndex, MissingCellPolicy.CREATE_NULL_AS_BLANK);
                                                // Obtener el índice de estilo correspondiente para la celda actual
                                                int indiceEstilo = (rowIndex - nuevaRegion.FirstRow) * (nuevaRegion.LastColumn - nuevaRegion.FirstColumn + 1) + (colIndex - nuevaRegion.FirstColumn);
                                                if (indiceEstilo >= 0 && indiceEstilo < listaEstilos.Count)
                                                {
                                                    ICellStyle cellStyle = listaEstilos[indiceEstilo];
                                                    cell.CellStyle = cellStyle;
                                                }
                                            }
                                        }
                                    }
                                }
                            }

                        }
                    }

                    // ======================================== Reemplazo de tokens firmas ======================================== //

                    //insertar imagenes de las firmas en el documento
                    XSSFPicture picture = null; // Declaración fuera del bloque condicional

                    foreach (var modification in imageModifications)
                    {
                        int column = modification.Item1;
                        int row = modification.Item2 + incrementoFila;
                        string cellTextWithImage = modification.Item3;
                        string base64Data = modification.Item4;
                        float rowHeight = modification.Item5;

                        byte[] imageBytes = Convert.FromBase64String(base64Data);
                        int pictureIdx = workbook.AddPicture(imageBytes, XSSFWorkbook.PICTURE_TYPE_JPEG);

                        // Accede a la hoja correspondiente a través del índice o nombre
                        XSSFSheet sheet = (XSSFSheet)workbook.GetSheetAt(0);

                        // Crea el dibujo (drawing) y obtén el ancho y alto de la celda
                        XSSFDrawing drawing = (XSSFDrawing)sheet.CreateDrawingPatriarch();

                        // Crea el anclaje ajustando manualmente la posición Y
                        XSSFClientAnchor anchor = new XSSFClientAnchor(0, 0, 0, 0, column, row, column + 1, row + 1);
                        anchor.AnchorType = AnchorType.MoveAndResize;

                        // Crea la imagen usando el anclaje directamente
                        picture = (XSSFPicture)drawing.CreatePicture(anchor, pictureIdx);
                        picture.Resize(1.0, rowHeight/4.5);

                        // Accede a la celda correspondiente
                        XSSFCell cell = (XSSFCell)sheet.GetRow(row).GetCell(column);
                        cell.SetCellValue(new XSSFRichTextString(cellTextWithImage));
                    }

                    // ======================================== Eliminar tokens sin usar ======================================== //

                    //Eliminar todos los tokens sin reemplazar en el documento
                    string pattern = @"\[\[(.*?)\]\]";
                    foreach (var sheet in workbook)
                    {
                        var rowEnumerator = sheet.GetRowEnumerator();
                        while (rowEnumerator.MoveNext())
                        {
                            var row = (XSSFRow)rowEnumerator.Current;

                            foreach (var cell in row.Cells)
                            {
                                if (cell.CellType == NPOI.SS.UserModel.CellType.String)
                                {
                                    var cellValue = cell.StringCellValue;
                                    if (cellValue != null)
                                    {
                                        // Buscar coincidencias utilizando la expresión regular
                                        MatchCollection matches = Regex.Matches(cellValue, pattern);
                                        foreach (Match match in matches)
                                        {
                                            string contenidoEntreCorchetes = match.Groups[1].Value;
                                            // Reemplazar el contenido entre corchetes por una cadena vacía
                                            cellValue = cellValue.Replace(match.Value, "");
                                        }
                                        // Actualizar el valor de la celda
                                        cell.SetCellValue(cellValue);
                                    }
                                }
                            }
                        }
                    }

                    // ======================================== Guardar cambios ======================================== //

                    // Guardar el libro de Excel modificado en un flujo de memoria
                    MemoryStream modifiedStream = new MemoryStream();
                    workbook.Write(modifiedStream);
                    // Convertir el flujo de memoria en una cadena base64
                    string base64ModifiedContent = Convert.ToBase64String(modifiedStream.ToArray());
                    // Devolver el contenido base64 como una respuesta HTTP OK
                    return Ok(base64ModifiedContent);
                }
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }

        /// <summary>
        ///OBTIENE PLANTILLAS DE LOS DOCUMENTOS POR TOKENS
        /// </summary>
        /// <returns></returns>
        [Authorize]
        [HttpGet, Route("GetTemplateById")]
        public List<DocumentApiDto> GetTemplateById(string Id_Template)
        {
            return Business.GetTemplateById(Id_Template);
        }

        /// <summary>
        ///OBTIENE PLANTILLAS DE LOS DOCUMENTOS ACTIVOS
        /// </summary>
        /// <returns></returns>
        [Authorize]
        [HttpGet, Route("GetTemplateActive")]
        public List<DocumentApiDto> GetTemplateActive()
        {
            return Business.GetTemplateActive();
        }

        /// <summary>
        /// INSERTAR TOKENS
        /// </summary>
        /// <returns></returns>
        [Authorize]
        [HttpPost, Route("InsertToken")]
        public bool InsertToken(InsertTokenDto InsertToken)
        {
            return Business.InsertToken(InsertToken);
        }

        /// <summary>
        ///ACTUALIZA TOKENS
        /// </summary>
        /// <returns></returns>
        [Authorize]
        [HttpPost, Route("UpdateToken")]
        public List<UpdateTokenDto> UpdateToken(UpdateTokenDto UpdateToken)
        {
            return Business.UpdateToken(UpdateToken);
        }

        /// <summary>
        /// Api Encargada de cambiar estado del token
        /// </summary>
        /// <param name="Id"></param>
        /// <param name="Estado"></param>
        /// <returns></returns>
        [Authorize]
        [HttpGet, Route("ChangeStateToken")]
        public bool ChangeStateToken(string Id, string Estado)
        {
            return Business.ChangeStateToken(Id, Estado);
        }

        /// <summary>
        ///OBTIENE TIPOS DE PLANTILLAS
        /// </summary>
        /// <returns></returns>
        [Authorize]
        [HttpGet, Route("GetTipoPlantillas")]
        public List<GetTipoPlantillasDto> GetTipoPlantillas()
        {
            return Business.GetTipoPlantillas();
        }

        /// <summary>
        /// obtener los tokens por id de plantilla
        /// </summary>
        /// <returns></returns>
        [Authorize]
        [HttpGet, Route("GetTokensById")]
        public List<GetTokensByIdDto> GetTokensById(string Id_Template)
        {
            Id_Template = "%" + Id_Template + "%";
            return Business.GetTokensById(Id_Template);
        }

        /// <summary>
        /// obtener los tokens de las firmas por id de plantilla
        /// </summary>
        /// <returns></returns>
        [Authorize]
        [HttpGet, Route("GetTokensFirmasById")]
        public List<GetTokensFirmasByIdDto> GetTokensFirmasById(string Id_Template)
        {
            Id_Template = "%" + Id_Template + "%";
            return Business.GetTokensFirmasById(Id_Template);
        }

        /// <summary>
        /// INSERTAR ACTAS
        /// </summary>
        /// <returns></returns>
        [Authorize]
        [HttpPost, Route("InsertActa")]
        public bool InsertActa(InsertActaDto InsertActa)
        {
            return Business.InsertActa(InsertActa);
        }

        /// <summary>
        /// Api Encargada de devolver dispositivo
        /// </summary>
        /// <param name="Id_Inventario"></param>
        /// <param name="Serial"></param>
        /// <returns></returns>
        [Authorize]
        [HttpGet, Route("DevolucionInventario")]
        public bool DevolucionInventario(string Id_Inventario, string Serial, string UserGeneral, string Id_Acta_Drive)
        {
            return Business.DevolucionInventario(Id_Inventario, Serial, UserGeneral, Id_Acta_Drive);
        }

        /// <summary>
        /// Api Encargada de asignar dispositivo
        /// </summary>
        /// <param name="Id_Inventario"></param>
        /// <param name="Serial"></param>
        /// <param name="Usuario"></param>
        /// <returns></returns>
        [Authorize]
        [HttpGet, Route("AsignacionInventario")]
        public bool AsignacionInventario(string Id_Inventario, string Serial, string Usuario, string UserGeneral, string Id_Acta_Drive)
        {
            return Business.AsignacionInventario(Id_Inventario, Serial, Usuario, UserGeneral, Id_Acta_Drive);
        }

        /// <summary>
        /// obtener listado de todas las actas
        /// </summary>
        /// <returns></returns>
        [Authorize]
        [HttpGet, Route("GetActas")]
        public List<GetActasDto> GetActas()
        {
            return Business.GetActas();
        }

        /// <summary>
        /// obtener listado de todos los tokens fijos
        /// </summary>
        /// <returns></returns>
        [Authorize]
        [HttpGet, Route("GetTokensFijos")]
        public List<GetTokensFijosDto> GetTokensFijos()
        {
            return Business.GetTokensFijos();
        }

        /// <summary>
        /// Obtener el listado de los tokens de usuario
        /// </summary>
        /// <returns></returns>
        [Authorize]
        [HttpGet, Route("GetTokensUsuario")]
        public List<GetTokensUsuarioDto> GetTokensUsuario()
        {
            return Business.GetTokensUsuario();
        }

        /// <summary>
        /// Api Encargada marcar el inventario si esta en homeOffice O no
        /// </summary>
        /// <param name="Id_Inventario"></param>
        /// <param name="Serial"></param>
        /// <param name="Home_Office"></param>
        /// <returns></returns>
        [Authorize]
        [HttpGet, Route("EnvDevHomeOffice")]
        public bool EnvDevHomeOffice(string Id_Inventario, string Serial, int Home_Office, string UserGeneral, string Id_Acta_Drive)
        {
            return Business.EnvDevHomeOffice(Id_Inventario, Serial, Home_Office, UserGeneral, Id_Acta_Drive);
        }

        /// <summary>
        /// obtener listado de los tipos de fechas 
        /// </summary>
        /// <returns></returns>
        [Authorize]
        [HttpGet, Route("GetTipoFecha")]
        public List<GetTipoFechaDto> GetTipoFecha()
        {
            return Business.GetTipoFecha();
        }

        /// <summary>
        /// obtener listado de procesadores
        /// </summary>
        /// <returns></returns>
        [Authorize]
        [HttpGet, Route("GetProcesadores")]
        public List<GetProcesadoresDto> GetProcesadores()
        {
            return Business.GetProcesadores();
        }

        /// <summary>
        /// obtener listado de RAM
        /// </summary>
        /// <returns></returns>
        [Authorize]
        [HttpGet, Route("GetRAM")]
        public List<GetRAMDto> GetRAM()
        {
            return Business.GetRAM();
        }

        /// <summary>
        /// obtener listado de Discos
        /// </summary>
        /// <returns></returns>
        [Authorize]
        [HttpGet, Route("GetDisco")]
        public List<GetDiscoDto> GetDisco()
        {
            return Business.GetDisco();
        }

        /// <summary>
        /// Envio de correos
        /// </summary>
        /// <param name="destinatario"></param>
        /// <param name="asunto"></param>
        /// <param name="cuerpo"></param>
        /// <returns></returns>
        [Authorize]
        [HttpGet, Route("EnviarCorreo")]
        public bool EnviarCorreo(string destinatario, string asunto, string cuerpo, string cc, string cco, string Id_Acta_Drive)
        {
            try
            {
                string documentContent = DownLoadDocument(Id_Acta_Drive);
                byte[] pdfBytes = ConvertDocument(documentContent);

                List<GetEmailDto> emailDtos = Business.GetDatosEmail("jfjoya@covisian.com");

                // Credenciales de correo remitente
                string correoRemitente = emailDtos[0].Correo;
                string contraseñaRemitente = AES.DecryptStringAES(emailDtos[0].Password);

                // Crear una instancia de EmailService con las credenciales
                EmailService emailService = new EmailService(correoRemitente, contraseñaRemitente);

                // Enviar un correo electrónico
                //return emailService.EnviarCorreo(destinatario, asunto, cuerpo);
                return emailService.EnviarCorreo(destinatario, asunto, cuerpo, pdfBytes, "output.pdf", cc, cco);

            }
            catch (Exception ex)
            {
                return false;
            }
        }

        public byte[] ConvertDocument(string documentContent)
        {
            // Establecer la clave de licencia para GemBox
            ComponentInfo.SetLicense("FREE-LIMITED-KEY");
            SpreadsheetInfo.SetLicense("FREE-LIMITED-KEY");
            DocumentInfoDto documentInfo = JsonConvert.DeserializeObject<DocumentInfoDto>(documentContent);
            // Convertir el documento a PDF
            return ConvertToPdf(documentInfo);
        }

        static byte[] ConvertToPdf(DocumentInfoDto documentInfo)
        {
            // Determinar el tipo de documento (Word o Excel)
            string mimeType = documentInfo.MimeType;

            // Decodificar el contenido base64
            byte[] documentBytes = Convert.FromBase64String(documentInfo.FileBase64);

            if (mimeType == "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
            {
                byte[] limitedDocumentBytes = LimitExcelFile(documentBytes);
                // Crear un MemoryStream a partir del contenido decodificado
                using (MemoryStream documentStream = new MemoryStream(limitedDocumentBytes))
                {
                    // Convertir documento Excel a PDF
                    var workbook = ExcelFile.Load(documentStream, GemBox.Spreadsheet.LoadOptions.XlsxDefault);
                    var pdfStream = new MemoryStream();
                    workbook.Save(pdfStream, GemBox.Spreadsheet.SaveOptions.PdfDefault);
                    return pdfStream.ToArray();
                }
            }
            else if (mimeType == "application/vnd.openxmlformats-officedocument.wordprocessingml.document")
            {
                using (MemoryStream documentStream = new MemoryStream(documentBytes))
                {
                    // Convertir documento Word a PDF
                    var document = DocumentModel.Load(documentStream, GemBox.Document.LoadOptions.DocxDefault);
                    var pdfStream = new MemoryStream();
                    document.Save(pdfStream, GemBox.Document.SaveOptions.PdfDefault);
                    return pdfStream.ToArray();
                }
            }
            else
            {
                throw new NotSupportedException($"El tipo de documento '{mimeType}' no es compatible.");
            }


            
        }

        static byte[] LimitExcelFile(byte[] documentBytes)
        {
            using (MemoryStream documentStream = new MemoryStream(documentBytes))
            {
                XSSFWorkbook workbook = new XSSFWorkbook(documentStream);
                // Limitar a 1 hoja
                while (workbook.NumberOfSheets > 1)
                {
                    workbook.RemoveSheetAt(1);
                }
                // Limitar a 150 filas
                foreach (ISheet sheet in workbook)
                {
                    int maxRowCount = 150;
                    int rowCount = sheet.PhysicalNumberOfRows;

                    if (rowCount > maxRowCount)
                    {
                        for (int i = rowCount - 1; i >= maxRowCount; i--)
                        {
                            IRow row = sheet.GetRow(i);
                            sheet.RemoveRow(row);
                        }
                    }
                }

                // Limitar columnas a ultima en blanco
                int maxColumnCount = 0;
                foreach (ISheet sheet in workbook)
                {
                    int rowIndex = 0;
                    IRow row = sheet.GetRow(rowIndex);

                    if (row != null)
                    {
                        int lastCellNum = row.LastCellNum;
                        for (int cellIndex = lastCellNum - 1; cellIndex >= 0; cellIndex--)
                        {
                            ICell cell = row.GetCell(cellIndex);

                            if (cell != null)
                            {
                                if (cell.CellType != CellType.Blank)
                                {
                                    maxColumnCount = cellIndex + 1;
                                    break;
                                }
                            }
                        }
                    }
                }
                
                //Eliminar columnas en blanco
                foreach (ISheet sheet in workbook)
                {
                    int lastRowNum = sheet.LastRowNum;
                    for (int rowIndex = 0; rowIndex <= lastRowNum; rowIndex++)
                    {
                        IRow row = sheet.GetRow(rowIndex);
                        if (row != null)
                        {
                            int lastCellNum = row.LastCellNum;
                            for (int cellIndex = lastCellNum - 1; cellIndex >= maxColumnCount; cellIndex--)
                            {
                                ICell cell = row.GetCell(cellIndex);
                                if (cell != null)
                                {
                                    row.RemoveCell(cell);
                                }
                            }
                        }
                    }
                }

                MemoryStream limitedDocumentStream = new MemoryStream();
                workbook.Write(limitedDocumentStream);
                return limitedDocumentStream.ToArray();
            }
        }



        /// <summary>
        /// obtener Plantilla de correo
        /// </summary>
        /// <returns></returns>
        [Authorize]
        [HttpGet, Route("GetTemplateMail")]
        public List<GetTemplateMailDto> GetTemplateMail()
        {
            return Business.GetTemplateMail();
        }

        /// <summary>
        /// Insertar plantillas de correo
        /// </summary>
        /// <returns></returns>
        [Authorize]
        [HttpPost, Route("InsertTemplateMail")]
        public bool InsertTemplateMail(InsertTemplateMailDto InsertTemplateMail)
        {
            return Business.InsertTemplateMail(InsertTemplateMail);
        }

        /// <summary>
        /// actualizar plantilla de correo
        /// </summary>
        /// <returns></returns>
        [Authorize]
        [HttpPost, Route("UpdateTemplateMail")]
        public List<UpdateTemplateMailDto> UpdateTemplateMail(UpdateTemplateMailDto UpdateTemplateMail)
        {
            return Business.UpdateTemplateMail(UpdateTemplateMail);
        }

        /// <summary>
        /// Activar plantilla de correo
        /// </summary>
        /// <returns></returns>
        [Authorize]
        [HttpPost, Route("ActiveTemplateMail")]
        public List<ActiveTemplateMailDto> ActiveTemplateMail(ActiveTemplateMailDto ActiveTemplateMail)
        {
            return Business.ActiveTemplateMail(ActiveTemplateMail);
        }

        [Authorize]
        [HttpGet, Route("GetEmailUsaurio")]
        public List<GetEmailUsaurioDto> GetEmailUsaurio(string Identificacion)
        {
            return Business.GetEmailUsaurio(Identificacion);
        }

        /// <summary>
        /// Insertar procesador
        /// </summary>
        /// <param name="Procesador"></param>
        /// <returns></returns>
        [Authorize]
        [HttpPost, Route("InsertProcesador")]
        public bool InsertProcesador(string Procesador)
        {
            return Business.InsertProcesador(Procesador);
        }

        /// <summary>
        /// Actualizar procesador
        /// </summary>
        /// <param name="Id"></param>
        /// <param name="Procesador"></param>
        /// <param name="Id_Estado"></param>
        /// <returns></returns>
        [Authorize]
        [HttpPost, Route("UpdateProcesador")]
        public bool UpdateProcesador(string Id, string Procesador, int Id_Estado)
        {
            return Business.UpdateProcesador(Id, Procesador, Id_Estado);
        }

        /// <summary>
        /// Obtener columnas a ocultar
        /// </summary>
        /// <param name="Identificacion_Usuario"></param>
        /// <returns></returns>
        [Authorize]
        [HttpGet, Route("NoColumns")]
        public List<NoColumnsDto> NoColumns(string Identificacion_Usuario)
        {
            return Business.NoColumns(Identificacion_Usuario);
        }

        /// <summary>
        /// Actualizar columnas para no mostrar
        /// </summary>
        /// <param name="UpdateNoColumns"></param>
        /// <returns></returns>
        [Authorize]
        [HttpPost, Route("UpdateNoColumns")]
        public bool UpdateNoColumns(UpdateNoColumnsDto UpdateNoColumns)
        {
            return Business.UpdateNoColumns(UpdateNoColumns);
        }

        /// <summary>
        /// Obtener el listado de modulos
        /// </summary>
        /// <returns></returns>
        [Authorize]
        [HttpGet, Route("GetModulos")]
        public List<GetModulosDto> GetModulos()
        {
            return Business.GetModulos();
        }

        /// <summary>
        /// Crear rol y obtener Id
        /// </summary>
        /// <param name="Nombre_Rol"></param>
        /// <param name="Descripcion"></param>
        /// <param name="Jefe"></param>
        /// <returns></returns>
        [Authorize]
        [HttpGet, Route("CreateRol")]
        public List<CreateRolDto> CreateRol(string Nombre_Rol, string Descripcion, int Jefe)
        {
            return Business.CreateRol(Nombre_Rol, Descripcion, Jefe);
        }

        /// <summary>
        /// Crear permisos de los modulos
        /// </summary>
        /// <param name="CreatePermisosModulos"></param>
        /// <returns></returns>
        [Authorize]
        [HttpPost, Route("CreatePermisosModulos")]
        public bool CreatePermisosModulos(CreatePermisosModulosDto CreatePermisosModulos)
        {
            return Business.CreatePermisosModulos(CreatePermisosModulos);
        }

        /// <summary>
        /// Crear permisos de las acciones
        /// </summary>
        /// <param name="CreatePermisosAcciones"></param>
        /// <returns></returns>
        [Authorize]
        [HttpPost, Route("CreatePermisosAcciones")]
        public bool CreatePermisosAcciones(CreatePermisosAccionesDto CreatePermisosAcciones)
        {
            return Business.CreatePermisosAcciones(CreatePermisosAcciones);
        }

        /// <summary>
        /// Actualizar permisos de las acciones
        /// </summary>
        /// <param name="UpdatePermisosAcciones"></param>
        /// <returns></returns>
        [Authorize]
        [HttpPost, Route("UpdatePermisosAcciones")]
        public bool UpdatePermisosAcciones(CreatePermisosAccionesDto UpdatePermisosAcciones)
        {
            return Business.UpdatePermisosAcciones(UpdatePermisosAcciones);
        }

        /// <summary>
        /// Obtener usuario por identificacion
        /// </summary>
        /// <param name="Identificacion_Usuario"></param>
        /// <returns></returns>
        [Authorize]
        [HttpGet, Route("UsuarioByIdentificacion")]
        public List<IdentificacionDto> UsuarioByIdentificacion(string Identificacion_Usuario)
        {
            return Business.UsuarioByIdentificacion(Identificacion_Usuario);
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="Identificacion_Usuario"></param>
        /// <returns></returns>
        [Authorize]
        [HttpGet, Route("GetFirmaImagen")]
        public List<GetFirmaImagenDto> GetFirmaImagen(string Identificacion_Usuario)
        {
            return Business.GetFirmaImagen(Identificacion_Usuario);
        }

        /// <summary>
        /// Actualizar firma del usuario logueado
        /// </summary>
        /// <param name="UpdateFirmaImagen"></param>
        /// <returns></returns>
        [Authorize]
        [HttpPost, Route("UpdateFirmaImagen")]
        public bool UpdateFirmaImagen(UpdateFirmaImagenDto UpdateFirmaImagen)
        {
            return Business.UpdateFirmaImagen(UpdateFirmaImagen);
        }

        /// <summary>
        /// Obtener actas para quitarle los permisos
        /// </summary>
        /// <returns></returns>
        [Authorize]
        [HttpGet, Route("GetSuspendPermissions")]
        public List<SuspendPermissionsDto> GetSuspendPermissions()
        {
            return Business.GetSuspendPermissions();
        }

        /// <summary>
        /// Actualizar suspension de permisos de actas
        /// </summary>
        /// <param name="idFile"></param>
        /// <returns></returns>
        [Authorize]
        [HttpPost, Route("UpdateSuspendPermissions")]
        public bool UpdateSuspendPermissions(string idFile)
        {
            return Business.UpdateSuspendPermissions(idFile);
        }

        /// <summary>
        /// Obtener datos del usuario para los tokens.
        /// </summary>
        /// <param name="Identificacion_Usuario"></param>
        /// <returns></returns>
        [Authorize]
        [HttpGet, Route("GetDatosTokensUsuario")]
        public List<GetDatosTokensUsuarioDto> GetDatosTokensUsuario(string Identificacion_Usuario)
        {
            return Business.GetDatosTokensUsuario(Identificacion_Usuario);
        }
    }
}