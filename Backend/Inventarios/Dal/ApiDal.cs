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
    public class ApiDal : Dapper
    {
        public ApiDal(string ConexionString)
        {
            Conexion = ConexionString;
        }

        /// <summary>
        /// Api Encargada de realizar autenticación por token
        /// </summary>
        /// <param name="Usuario"></param>
        /// <param name="Password"></param>
        /// <returns></returns>
        public bool GetLoginToken(string Username, string Password)
        {
            try
            {
                return SingleQuery<object, bool>("[Usuarios].[SP_GetTokenLogin]", new { Username = Username, Password = Password });
            }
            catch (Exception ex)
            {
                return false;
            }
        }

        /// <summary>
        /// Método encargado de realizar la autenticación del usuario
        /// </summary>
        /// <param name="Username"></param>
        /// <param name="Password"></param>
        /// <returns></returns>
        public List<UserLoginDto> GetUserLogin(string Username, string Password)
        {
            return ListQuery<object, UserLoginDto>("[Auth].[GetUserLogin]", new { Username, Password  });
        }

        /// <summary>
        /// Método encargado de realizar laconsulta de modulos accesibles
        /// </summary>
        /// <param name="Usuario"></param>
        /// <returns></returns>
        public List<ModulosDto> Get_Acceso_Modulos(int Role)
        {
            return ListQuery<object, ModulosDto>("[Auth].[SP_Get_Acceso_Modulos]", new { Role });
        }

        /// <summary>
        /// Obtener permisos de las acciones
        /// </summary>
        /// <param name="Role"></param>
        /// <returns></returns>
        public List<GetAccesoAccionesDto> GetAccesoAcciones(int Role)
        {
            return ListQuery<object, GetAccesoAccionesDto>("[Inventario].[SP_Get_Acceso_Acciones]", new { Role });
        }

        /// <summary>
        /// Obtener permisos de las acciones
        /// </summary>
        /// <param name="Role"></param>
        /// <returns></returns>
        public List<GetAccionesDto> GetAcciones(int Role)
        {
            return ListQuery<object, GetAccionesDto>("[Inventario].[SP_Get_Acciones]", new { Role });
        }

        /// <summary>
        /// Método encargado de realizar laconsulta de modulos de las operaciones
        /// </summary>
        /// <param name="Role"></param>
        /// <param name="Module"></param>
        /// <returns></returns>
        public List<ModuloOperacionDto> Get_Modulo_Operaciones(int Role, string Modulo)
        {
            return ListQuery<object, ModuloOperacionDto>("[Auth].[SP_Get_Modulo_Operaciones]", new { Role, Modulo });
        }

        /// <summary>
        /// Obtener el listado del inventario
        /// </summary>
        /// <returns></returns>
        public List<GetInventarioDto> Get_Inventario()
        {
            return ListQuery<object, GetInventarioDto>("[Inventario].[SP_Get_Inventario]", new { });
        }

        /// <summary>
        /// Obtener el listado del inventario asignado por usuario
        /// </summary>
        /// <param name="Usuario"></param>
        /// <returns></returns>
        public List<GetInventarioDto> Get_Inventario_Asignado(string Usuario)
        {
            return ListQuery<object, GetInventarioDto>("[Inventario].[SP_Get_Inventario_Asignado]", new { Usuario });
        }

        /// <summary>
        /// Obtener listado de Proveedores
        /// </summary>
        /// <returns></returns>
        public List<GetProveedoresDto> GetProveedores()
        {
            return ListQuery<object, GetProveedoresDto>("[Inventario].[Get_Proveedores]", new { });
        }

        /// <summary>
        /// Obtener listado de Descuentos
        /// </summary>
        /// <returns></returns>
        public List<GetDescuentosDto> GetDescuentos()
        {
            return ListQuery<object, GetDescuentosDto>("[Inventario].[Get_Descuentos]", new { });
        }

        /// <summary>
        /// Obtener listado de Marcas
        /// </summary>
        /// <returns></returns>
        public List<GetMarcasDto> GetMarcas()
        {
            return ListQuery<object, GetMarcasDto>("[Inventario].[Get_Marcas]", new { });
        }

        /// <summary>
        /// Obtener listado de Tipos de activos
        /// </summary>
        /// <returns></returns>
        public List<GetTipoActivoDto> GetTipoActivo()
        {
            return ListQuery<object, GetTipoActivoDto>("[Inventario].[Get_Tipo_Activo]", new { });
        }

        /// <summary>
        /// Obtener listado de Bodegas
        /// </summary>
        /// <returns></returns>
        public List<GetBodegasDto> GetBodegas()
        {
            return ListQuery<object, GetBodegasDto>("[Sedes].[Get_Bodegas]", new { });
        }

        /// <summary>
        /// Guardar Inventarios uno a uno
        /// </summary>
        /// <param name="Inventarios"></param>
        /// <returns></returns>
        public bool GuardarInventario(GuardarInventarioDto Inventarios)
        {
            return SingleQuery<GuardarInventarioDto, bool>("[Inventario].[SP_Guardar_Inventario]", Inventarios);
        }

        /// <summary>
        /// Guardar Inventarios uno a uno
        /// </summary>
        /// <param name="Inventarios"></param>
        /// <returns></returns>
        public bool SoporteActivaInventario(SAInventarioDto Inventarios)
        {
            return SingleQuery<SAInventarioDto, bool>("[Inventario].[SP_Soporte&Activa_Inventario]", Inventarios);
        }

        /// <summary>
        /// Crear Inventarios uno a uno
        /// </summary>
        /// <param name="Inventarios"></param>
        /// <returns></returns>
        public bool CreateInventario(CreateInventarioDto Inventarios)
        {
            return SingleQuery<CreateInventarioDto, bool>("[Inventario].[SP_Create_Inventario]", Inventarios);
        }

        /// <summary>
        /// Crear Inventarios uno a uno
        /// </summary>
        /// <param name="Inventarios"></param>
        /// <returns></returns>
        public bool UpdateInventario(UpdateInventarioDto Inventarios)
        {
            return SingleQuery<UpdateInventarioDto, bool>("[Inventario].[SP_Update_Inventario]", Inventarios);
        }

        /// <summary>
        /// Metodo para comprobar la caducidad de la contraseña
        /// </summary>
        /// <param name="Usuario"></param>
        /// <param name="Password"></param>
        /// <returns></returns>
        public List<CaducidadContrasenaDto> CaducidadContrasena(string Usuario, string Password)
        {
            return ListQuery<object, CaducidadContrasenaDto>("[Auth].[SP_CaducidadContrasena]", new { Usuario, Password });
        }

        /// <summary>
        /// Metodo para cambiar la contraseña
        /// </summary>
        /// <param name="Datos"></param>
        /// <returns></returns>
        public bool CambiarContrasena(CambiarContrasenaDto Datos)
        {
            return SingleQuery<CambiarContrasenaDto, bool>("[Auth].[SP_CambiarContrasena]", Datos);
        }

        /// <summary>
        /// Obtener listado de Bodegas
        /// </summary>
        /// <returns></returns>
        public List<GetAsignacionDto> GetAsignacion(string Usuario)
        {
            return ListQuery<object, GetAsignacionDto>("[Usuarios].[Get_Asignacion]", new { Usuario });
        }

        /// <summary>
        /// Obtener ubicacion del usuario
        /// </summary>
        /// <returns></returns>
        public List<GetUbicacionDto> GetUbicacion(string Id_Inventario)
        {
            return ListQuery<object, GetUbicacionDto>("[Inventario].[Get_Ubicacion]", new { Id_Inventario });
        }

        /// <summary>
        /// Obtener foto seleccionada
        /// </summary>
        /// <returns></returns>
        public List<GetFotoDto> GetFoto(string Id_Inventario)
        {
            return ListQuery<object, GetFotoDto>("[Inventario].[Get_Foto]", new { Id_Inventario });
        }

        /// <summary>
        /// Obtener listado de identificacion de los usuarios
        /// </summary>
        /// <returns></returns>
        public List<GetIdentificacionUsuariosDto> GetIdentificacionUsuarios()
        {
            return ListQuery<object, GetIdentificacionUsuariosDto>("[Usuarios].[SP_Get_Identificacion_Usuarios]", new { });
        }

        /// <summary>
        /// Obtener listado de identificacion de los usuarios
        /// </summary>
        /// <returns></returns>
        public List<GetIdentificacionUsuariosDto> GetIdentificacionesUsuarios()
        {
            return ListQuery<object, GetIdentificacionUsuariosDto>("[Usuarios].[SP_Get_Identificaciones_Usuarios]", new { });
        }

        /// <summary>
        /// Obtener listado de identificacion de los jefes
        /// </summary>
        /// <returns></returns>
        public List<GetIdentificacionUsuariosDto> GetIdentificacionJefes()
        {
            return ListQuery<object, GetIdentificacionUsuariosDto>("[Usuarios].[SP_Get_Identificacion_Jefes]", new { });
        }

        /// <summary>
        /// SP QUE MUESTRA USUARIOS
        /// </summary>
        /// <returns></returns>
        public List<UserLoginDto> GetUsuarios()
        {
            return ListQuery<object, UserLoginDto>("[Usuarios].[SP_GetUsuarios]", new { });
        }

        /// <summary>
        /// Guardar Usuarios
        /// </summary>
        /// <returns></returns>
        public bool GuardarUsuarios(UsuariosDto Datos)
        {
            return SingleQuery<UsuariosDto, bool>("[Usuarios].[SP_Guardar_Usuarios]", Datos);
        }

        /// <summary>
        /// Actualizar Usuarios
        /// </summary>
        /// <returns></returns>
        public bool ActualizarUsuarios(UsuariosDto dat)
        {
            return SingleQuery<UsuariosDto, bool>("[Usuarios].[SP_Actualizar_Usuarios]", dat);
        }

        /// <summary>
        /// Inactivar Usuarios
        /// </summary>
        /// <param name="dat"></param>
        /// <returns></returns>
        public bool InactivarUsuarios(InactivarUsuariosDto dat)
        {
            return SingleQuery<InactivarUsuariosDto, bool>("[Usuarios].[SP_Inactivar_Usuarios]", dat);
        }

        /// <summary>
        /// Obtener listado  de Activos
        /// </summary>
        /// <returns></returns>
        public List<RolesDto> GetRol()
        {
            return ListQuery<object, RolesDto>("[Auth].[Get_Rol]", new { });
        }

        /// <summary>
        /// Obtener listado  de Roles
        /// </summary>
        /// <returns></returns>
        public List<RolesDto> GetRoles()
        {
            return ListQuery<object, RolesDto>("[Auth].[Get_Roles]", new { });
        }

        /// <summary>
        /// Obtener listado  de Roles
        /// </summary>
        /// <returns></returns>
        public List<PertmisosRolDto> GetPermisosRol(string Id_Rol)
        {
            return ListQuery<object, PertmisosRolDto>("[Auth].[Get_PermisosXRol]", new { Id_Rol = Id_Rol });
        }

        /// <summary>
        /// Guardar Rolesl
        /// </summary>
        /// <returns></returns>
        public bool GuardarRoles(InsertaRolDto roles)
        {
            return SingleQuery<InsertaRolDto, bool>("[Auth].[SP_Guardar_Roles]", roles);
        }


        /// <summary>
        /// Actualizar los roles
        /// </summary>
        /// <returns></returns>
        public bool ActualizarRoles(InsertaRolDto rol)
        {
            return SingleQuery<InsertaRolDto, bool>("[Auth].[SP_Actualizar_Roles]", rol);
        }

        /// <summary>
        /// Actualizar permisos de los modulos
        /// </summary>
        /// <param name="UpdatePermisosModulos"></param>
        /// <returns></returns>
        public bool UpdatePermisosModulos(UpdatePermisosModulosDto UpdatePermisosModulos)
        {
            return SingleQuery<UpdatePermisosModulosDto, bool>("[Auth].[SP_Update_Permisos_Modulos]", UpdatePermisosModulos);
        }

        /// <summary>
        /// Actualizar los roles
        /// </summary>
        /// <returns></returns>
        public bool InactivarRoles(InactivarRolesDto rol)
        {
            return SingleQuery<InactivarRolesDto, bool>("[Auth].[SP_Inactivar_Rol]", rol);
        }

        /// <summary>
        /// Obtener listado de Proveedores
        /// </summary>
        /// <returns></returns>
        public List<GetProveedoresDto> GetProveedor()
        {
            return ListQuery<object, GetProveedoresDto>("[Inventario].[Get_Proveedor]", new { });
        }

        /// <summary>
        /// Guardar los proveedores
        /// </summary>
        /// <returns></returns>
        public bool GuardarProveedor(GetProveedoresDto proveedor)
        {
            return SingleQuery<GetProveedoresDto, bool>("[Inventario].[SP_Guardar_Proveedor]", proveedor);
        }

        /// <summary>
        /// Actualizar los proveedores
        /// </summary>
        /// <returns></returns>
        public bool ActualizarProveedor(GetProveedoresDto provee)
        {
            return SingleQuery<GetProveedoresDto, bool>("[Inventario].[SP_Actualizar_Proveedor]", provee);
        }

        /// <summary>
        /// Guardar Descuento
        /// </summary>
        /// <param name="GuardarDescuento"></param>
        /// <returns></returns>
        public bool GuardarDescuento(GuardarDescuentoDto GuardarDescuento)
        {
            return SingleQuery<GuardarDescuentoDto, bool>("[Inventario].[SP_Guardar_Descuento]", GuardarDescuento);
        }

        /// <summary>
        /// Actualizar Descuento
        /// </summary>
        /// <param name="ActualizarDescuento"></param>
        /// <returns></returns>
        public bool ActualizarDescuento(ActualizarDescuentoDto ActualizarDescuento)
        {
            return SingleQuery<ActualizarDescuentoDto, bool>("[Inventario].[SP_Actualizar_Descuento]", ActualizarDescuento);
        }

        /// <summary>
        /// Obtener listado de Marcas
        /// </summary>
        /// <returns></returns>
        public List<GetMarcasDto> GetMarca()
        {
            return ListQuery<object, GetMarcasDto>("[Inventario].[SP_Get_Marca]", new { });
        }

        /// <summary>
        /// Guardar las Marcas
        /// </summary>
        /// <returns></returns>
        public bool GuardarMarca(GetMarcasDto marca)
        {
            return SingleQuery<GetMarcasDto, bool>("[Inventario].[SP_Guardar_Marca]", marca);
        }

        /// <summary>
        /// Actualizar las Marcas
        /// </summary>
        /// <returns></returns>
        public bool ActualizarMarca(GetMarcasDto marc)
        {
            return SingleQuery<GetMarcasDto, bool>("[Inventario].[SP_Actualizar_Marca]", marc);
        }


        /// <summary>
        /// Obtener listado de Centros de costo
        /// </summary>
        /// <returns></returns>
        public List<CentroCostosDto> GetCentroCostos()
        {
            return ListQuery<object, CentroCostosDto>("[Usuarios].[Get_Centro_Costos]", new { });
        }


        ///// <summary>
        ///// Obtener listado de Centros de costo activos
        ///// </summary>
        ///// <returns></returns>
        //public List<CentroCostosDto> GetCentroCosto()
        //{
        //    return ListQuery<object, CentroCostosDto>("[Usuarios].[Get_CentroCosto]", new { });
        //}

        /// <summary>
        /// Guardar los centros de costo
        /// </summary>
        /// <returns></returns>
        public bool GuardarCentroCostos(CentroCostosDto centro)
        {
            return SingleQuery<CentroCostosDto, bool>("[Usuarios].[SP_Guardar_CentroCostos]", centro);
        }

        /// <summary>
        /// Actualiza los centros de costo
        /// </summary>
        /// <returns></returns>
        public bool ActualizarCentroCostos(CentroCostosDto costo)
        {
            return SingleQuery<CentroCostosDto, bool>("[Usuarios].[SP_Actualizar_CentroCostos]", costo);
        }

        /// <summary>
        /// Obtener listado de Tipos de Identificacion Activos
        /// </summary>
        /// <returns></returns>
        public List<TipoIdenficacionDto> GetTipoIdentificacion()
        {
            return ListQuery<object, TipoIdenficacionDto>("[Usuarios].[Get_Tipo_Identificacion]", new { });
        }

        /// <summary>
        /// Obtener listado de Cargos
        /// </summary>
        /// <returns></returns>
        public List<CargoDto> GetCargos()
        {
            return ListQuery<object, CargoDto>("[Usuarios].[SP_Get_Cargos]", new { });
        }

        /// <summary>
        /// Guardar Cargo
        /// </summary>
        /// <returns></returns>
        public bool GuardarCargos(CargoDto cargo)
        {
            return SingleQuery<CargoDto, bool>("[Usuarios].[SP_Guardar_Cargos]", cargo);
        }

        /// <summary>
        /// Actualizar Cargo
        /// </summary>
        /// <returns></returns>
        public bool ActualizarCargos(CargoDto carg)
        {
            return SingleQuery<CargoDto, bool>("[Usuarios].[SP_Actualizar_Cargos]", carg);
        }

        /// <summary>
        /// Obtener listado de Sedes Activas
        /// </summary>
        /// <returns></returns>
        public List<SedesDto> GetSede()
        {
            return ListQuery<object, SedesDto>("[Sedes].[SP_Get_Sede]", new { });
        }

        /// <summary>
        /// Obtener listado de Sedes
        /// </summary>
        /// <returns></returns>
        public List<SedesDto> GetSedes()
        {
            return ListQuery<object, SedesDto>("[Sedes].[SP_Get_Sedes]", new { });
        }

        /// <summary>
        /// Guardar Sedes
        /// </summary>
        /// <returns></returns>
        public bool GuardarSedes(SedesDto sede)
        {
            return SingleQuery<SedesDto, bool>("[Sedes].[SP_Guardar_Sedes]", sede);
        }

        /// <summary>
        /// Actualizar Sedes
        /// </summary>
        /// <returns></returns>
        public bool ActualizarSedes(SedesDto sedes)
        {
            return SingleQuery<SedesDto, bool>("[Sedes].[SP_Actualizar_Sedes]", sedes);
        }

        /// <summary>
        /// Obtener listado de Ciudades activas
        /// </summary>
        /// <returns></returns>
        public List<CiudadDto> GetCiudades()
        {
            return ListQuery<object, CiudadDto>("[Inventario].[SP_Get_Ciudades]", new { });
        }

        /// <summary>
        /// Obtener listado de Ciudades activas
        /// </summary>
        /// <returns></returns>
        public List<CiudadDto> GetCiudad()
        {
            return ListQuery<object, CiudadDto>("[Inventario].[SP_Get_Ciudades]", new { });
        }

        /// <summary>
        /// Obtener listado de Pisos Activos
        /// </summary>
        /// <returns></returns>
        public List<PisosDto> GetPiso(string Id_Sede)
        {
            return ListQuery<object, PisosDto>("[Sedes].[SP_Get_Piso]", new { Id_Sede });
        }

        /// <summary>
        /// Obtener listado de Pisos
        /// </summary>
        /// <returns></returns>
        public List<PisosDto> GetPisos()
        {
            return ListQuery<object, PisosDto>("[Sedes].[SP_Get_Pisos]", new { });
        }

        /// <summary>
        /// Obtener listado de Puestos
        /// </summary>
        /// <returns></returns>
        public List<PuestosDto> GetPuestos()
        {
            return ListQuery<object, PuestosDto>("[Sedes].[SP_Get_Puestos]", new { });
        }

        /// <summary>
        /// Obtener listado de Puestos
        /// </summary>
        /// <returns></returns>
        public List<PuestosDto> GetPuesto()
        {
            return ListQuery<object, PuestosDto>("[Sedes].[SP_Get_Puestos]", new { });
        }

        /// <summary>
        /// Guardar Puestos
        /// </summary>
        /// <returns></returns>
        public bool GuardarPuesto(PuestosDto puesto)
        {
            return SingleQuery<PuestosDto, bool>("[Sedes].[SP_Guardar_Puesto]", puesto);
        }

        /// <summary>
        /// Actualizar Puestos
        /// </summary>
        /// <returns></returns>
        public bool ActualizarPuesto(PuestosDto puest)
        {
            return SingleQuery<PuestosDto, bool>("[Sedes].[SP_Actualizar_Puesto]", puest);
        }

        /// <summary>
        /// Obtener listado de Tipos de Equipos
        /// </summary>
        /// <returns></returns>
        public List<GetTipoActivoDto> GetTipoEquipo()
        {
            return ListQuery<object, GetTipoActivoDto>("[Inventario].[SP_Get_Tipo_Equipo]", new { });
        }

        /// <summary>
        /// Guardar Tipos de Equipos
        /// </summary>
        /// <returns></returns>
        public bool GuardarTipoEquipo(GetTipoActivoDto t_equipo)
        {
            return SingleQuery<GetTipoActivoDto, bool>("[Inventario].[SP_Guardar_Tipo_Equipo]", t_equipo);
        }

        /// <summary>
        /// Actualizar Tipos de Equipos
        /// </summary>
        /// <returns></returns>
        public bool ActualizarTipoEquipo(GetTipoActivoDto t_equi)
        {
            return SingleQuery<GetTipoActivoDto, bool>("[Inventario].[SP_Actualizar_Tipo_Equipo]", t_equi);
        }

        /// <summary>
        /// Obtener listado de Estados de Equipos
        /// </summary>
        /// <returns></returns>
        public List<EstadoEquipoDto> GetEstadoEquipoActi()
        {
            return ListQuery<object, EstadoEquipoDto>("[Inventario].[SP_Get_EstadoEquipo]", new { });
        }

        /// <summary>
        /// Obtener listado de Estados de Equipos
        /// </summary>
        /// <returns></returns>
        public List<EstadoEquipoDto> GetEstadoEquipo()
        {
            return ListQuery<object, EstadoEquipoDto>("[Inventario].[SP_Get_Estado_Equipos]", new { });
        }

        /// <summary>
        /// Guardar Estados de Equipos
        /// </summary>
        /// <returns></returns>
        public bool GuardarEstadoEquipo(EstadoEquipoDto e_equipo)
        {
            return SingleQuery<EstadoEquipoDto, bool>("[Inventario].[SP_Guardar_Estado_Equipos]", e_equipo);
        }

        /// <summary>
        /// Actualizar Estados de Equipos
        /// </summary>
        /// <returns></returns>
        public bool ActualizarEstadoEquipo(EstadoEquipoDto e_equi)
        {
            return SingleQuery<EstadoEquipoDto, bool>("[Inventario].[SP_Actualizar_Estado_Equipos]", e_equi);
        }

        /// <summary>
        /// Obtener Reporte completo
        /// </summary>
        /// <returns></returns>
        public List<ReportesDto> GetReporteCompleto()
        {
            return ListQuery<object, ReportesDto>("[Inventario].[SP_Get_Reporte_Completo]", new { });
        }

        /// <summary>
        /// Obtener Reporte por Asignacion
        /// </summary>
        /// <returns></returns>
        public List<ReportesDto> GetReporteAsignacion()
        {
            return ListQuery<object, ReportesDto>("[Inventario].[SP_Get_Reporte_Asignacion]", new { });
        }

        /// <summary>
        /// Obtener Reporte por Proveedor
        /// </summary>
        /// <returns></returns>
        public List<ReportesDto> GetReporteProveedores(string Id_Proveedor)
        {
            return ListQuery<object, ReportesDto>("[Inventario].[SP_Get_Reporte_Proveedores]", new { Id_Proveedor = Id_Proveedor });
        }

        /// <summary>
        /// Obtener Reporte por Disponibilidad
        /// </summary>
        /// <returns></returns>
        public List<ReportesDto> GetReporteDisponibilidad()
        {
            return ListQuery<object, ReportesDto>("[Inventario].[SP_Get_Reporte_Disponibilidad]", new { });
        }

        /// <summary>
        /// Obtener Reporte por Disponibilidad
        /// </summary>
        /// <returns></returns>
        public List<ReportesDto> GetReporteEstadosActivo(string Id_Estado_Activo)
        {
            return ListQuery<object, ReportesDto>("[Inventario].[SP_Get_Reporte_EstadoActivos]", new { Id_Estado_Activo = Id_Estado_Activo });
        }

        /// <summary>
        /// Obtener Reporte por Disponibilidad
        /// </summary>
        /// <returns></returns>
        public List<ReportesDto> GetReporteCentroCosto(string Id_Centro_Costo)
        {
            return ListQuery<object, ReportesDto>("[Inventario].[SP_Get_Reporte_CentroCosto]", new { Id_Centro_Costo = Id_Centro_Costo });
        }

        /// <summary>
        /// Obtener Reporte por Disponibilidad
        /// </summary>
        /// <returns></returns>
        public List<GetInventarioDto> GetInventarioXUsuarios(string Identificacion)
        {
            return ListQuery<object, GetInventarioDto>("[Usuarios].[SP_UsuarioXInventario]", new { Identificacion = Identificacion });
        }

        /// <summary>
        /// Guardar Pisos
        /// </summary>
        /// <returns></returns>
        public bool GuardarPisos(PisosDto pisos)
        {
            return SingleQuery<PisosDto, bool>("[Sedes].[SP_Guardar_Pisos]", pisos);
        }

        /// <summary>
        /// Actualizar Pisos
        /// </summary>
        /// <returns></returns>
        public bool ActualizarPisos(PisosDto piso)
        {
            return SingleQuery<PisosDto, bool>("[Sedes].[SP_Actualizar_Pisos]", piso);
        }

        /// <summary>
        /// Obtener listado de Bodegas
        /// </summary>
        /// <returns></returns>
        public List<GetBodegasDto> GetBodega()
        {
            return ListQuery<object, GetBodegasDto>("[Sedes].[SP_Get_Bodega]", new { });
        }

        /// <summary>
        /// Guardar Bodegas
        /// </summary>
        /// <returns></returns>
        public bool GuardarBodega(GetBodegasDto bodega)
        {
            return SingleQuery<GetBodegasDto, bool>("[Sedes].[SP_Guardar_Bodega]", bodega);
        }

        /// <summary>
        /// Actualizar Bodegas
        /// </summary>
        /// <returns></returns>
        public bool ActualizarBodega(GetBodegasDto bodeg)
        {
            return SingleQuery<GetBodegasDto, bool>("[Sedes].[SP_Actualizar_Bodega]", bodeg);
        }

        /// <summary>
        /// Inserta inventario
        /// </summary>
        /// <param name="fields"></param>
        /// <param name="Datafile"></param>
        /// <returns></returns>
        public string DebuggDataT(StringCollection fields, DataTable Datafile, string UserGeneral, string TipoProceso)
        {
            try
            {
                string TableName;

                if (TipoProceso == "Usuarios")
                {
                    TableName = "[Usuarios].[InsertarMasivoUsuarios]";
                }
                else
                {
                    TableName = "[Inventario].[InsertarMasivoInventario]";
                }
                
                //Hace el Bulk
                var Mensaje = UploadDatabaseT(fields, Datafile, TableName);
                if (Mensaje == "OK")
                {
                    if (TipoProceso == "Usuarios")
                    {
                        //Hace la depuracion
                        SingleQuery<object, string>("[dbo].[DebuggInsertarMasivoUsuarios]", new { UserGeneral });
                        return Mensaje;
                    }
                    else
                    {
                        //Hace la depuracion
                        SingleQuery<object, string>("[dbo].[DebuggInsertarMasivoInventario]", new { UserGeneral });
                        return Mensaje;
                    }
                        
                }
                else
                {
                    return Mensaje;
                }
            }
            catch (Exception ex)
            {
                return string.Format("Error: {0}", ex.Message);
            }
        }

        /// <summary>
        ///Hace el Bulk Copy
        /// </summary>
        /// <returns></returns>
        public string UploadDatabaseT(StringCollection fields, DataTable Datafile, string TableName)
        {
            try
            {
                string connString = Conexion;
                var dataTable = Datafile;
                string missingColumns = "";

                foreach (string value in fields)
                {
                    if (!dataTable.Columns.Contains(value.Trim()))
                        missingColumns += string.Format(",{0}", value);
                }
                if (missingColumns.Length > 0)
                    return string.Format("Hacen falta las siguientes columnas en el archivo: {0}", missingColumns.Substring(1, missingColumns.Length - 1));
                else
                {
                    SqlBulkCopy sqlBulk = new SqlBulkCopy(connString);

                    sqlBulk.DestinationTableName = TableName;
                    foreach (string col in fields)
                    {
                        sqlBulk.ColumnMappings.Add(col, col);
                    }
                    sqlBulk.BulkCopyTimeout = 2000;
                    sqlBulk.WriteToServer(dataTable);
                    //var BaseDal = new BaseDal();
                    //BaseDal.Depuration(User);
                    return "OK";
                }
            }
            catch (Exception e)
            {
                return string.Format("Error: {0}", e.Message);
            }
        }

        /// <summary>
        /// Obtener filtro de sedes segun ciudad.
        /// </summary>
        /// <param name="IdCiudad"></param>
        /// <returns></returns>
        public List<SedesDto> GetFiltroSedes(string Id_Ciudad)
        {
            return ListQuery<object, SedesDto>("[Inventario].[SP_Get_Filtro_Sedes]", new { Id_Ciudad });
        }

        /// <summary>
        /// Obtener filtro de Pisos segun Sede.
        /// </summary>
        /// <param name="IdCiudad"></param>
        /// <returns></returns>
        public List<PisosDto> GetFiltroPisos(string Id_Sede)
        {
            return ListQuery<object, PisosDto>("[Inventario].[SP_Get_Filtro_Pisos]", new { Id_Sede });
        }

        /// <summary>
        /// Obtener filtro de Puestos segun Pisos y sede.
        /// </summary>
        /// <param name="IdSede"></param>
        /// <param name="IdPiso"></param>
        /// <returns></returns>
        public List<PuestosDto> GetFiltroPuestos(string Id_Sede, int Id_Piso)
        {
            return ListQuery<object, PuestosDto>("[Inventario].[SP_Get_Filtro_Puestos]", new { Id_Sede, Id_Piso });
        }

        /// <summary>
        /// Obtener listado de seriales
        /// </summary>
        /// <returns></returns>
        public List<SerialesDto> GetSeriales()
        {
            return ListQuery<object, SerialesDto>("[Inventario].[SP_Get_Seriales]", new { });
        }

        /// <summary>
        /// Devolucion Masiva Proveedor
        /// </summary>
        /// <returns></returns>
        public bool DevolucionMasivaProveedor(DevolucionMasivaProveedorDto Serial)
        {
            return SingleQuery<DevolucionMasivaProveedorDto, bool>("[Inventario].[SP_Devolucion_Masiva_Proveedor]", Serial);
        }

        /// <summary>
        /// Obtener Historial del serial
        /// </summary>
        /// <param name="Serial"></param>
        /// <returns></returns>
        public List<HistoricoDto> GetHistorico(string Serial)
        {
            return ListQuery<object, HistoricoDto>("[Inventario].[SP_Get_Historial]", new { Serial });
        }

        /// <summary>
        /// Dashboard de inventario.
        /// </summary>
        /// <param name="Id_Proveedor"></param>
        /// <param name="Id_Marca"></param>
        /// <param name="Id_Tipo_Activo"></param>
        /// <returns></returns>
        public List<DashboardInventarioDto> DashboardInventario(int Id_Proveedor, int Id_Marca, int Id_Tipo_Activo)
        {
            return ListQuery<object, DashboardInventarioDto>("[Inventario].[Get_Dashboard_Inventario]", new { Id_Proveedor, Id_Marca, Id_Tipo_Activo });
        }

        /// <summary>
        /// Método encargado de realizar la consulta de las plantillas de los Documentos
        /// </summary>
        /// <returns></returns>
        public List<GetApiDocumentDto> GetApiDocument()
        {
            return ListQuery<object, GetApiDocumentDto>("[Template].[GetApiDocument]", new { });
        }

        /// <summary>
        /// Método encargado de realizar la consulta de las plantillas de los Documentos por Id
        /// </summary>
        /// <returns></returns>
        public List<DocumentApiDto> GetApiDocumentById(int Id_Tipo_Plantilla)
        {
            return ListQuery<object, DocumentApiDto>("[Template].[GetApiDocumentById]", new { Id_Tipo_Plantilla });
        }

        /// <summary>
        /// Método encargado de realizar la insercion de una plantilla nueva
        /// </summary>
        /// <returns></returns>
        public bool InsertApiDocument(DocumentApiDto InsertApiDocument)
        {
            return SingleQuery<DocumentApiDto, bool>("[Template].[InsertApiDocument]", InsertApiDocument);
        }

        /// <summary>
        /// Método encargado de actualizar las plantillas de los documentos
        /// </summary>
        /// <returns></returns>
        public List<ChangeStateTemplateDto> UpdateApiDocument(ChangeStateTemplateDto UpdateApiDocument)
        {
            return ListQuery<object, ChangeStateTemplateDto>("[Template].[UpdateApiDocument]", UpdateApiDocument);
        }

        /// <summary>
        /// Método encargado de actualizar descripcion las plantillas de los documentos
        /// </summary>
        /// <returns></returns>
        public List<UpdateDescriptionDto> UpdateDescriptionApiDocument(UpdateDescriptionDto UpdateDescription)
        {
            return ListQuery<object, UpdateDescriptionDto>("[Template].[UpdateDescriptionApiDocument]", UpdateDescription);
        }

        /// <summary>
        /// Método encargado de realizar la consulta todos los tokens
        /// </summary>
        /// <returns></returns>
        public List<tokensDto> GetTokens()
        {
            return ListQuery<object, tokensDto>("[Template].[Get_Tokens]", new { });
        }

        /// <summary>
        /// Método encargado de realizar la consulta todos los tokens
        /// </summary>
        /// <returns></returns>
        public List<tokensDto> GetTokensAcive(string Id_plantilla)
        {
            return ListQuery<object, tokensDto>("[Template].[Get_Tokens_Acive]", new { Id_plantilla });
        }

        /// <summary>
        /// Método encargado de realizar la consulta de las plantillas por tokens
        /// </summary>
        /// <returns></returns>
        public List<DocumentApiDto> GetTemplateById(string Id_Template)
        {
            return ListQuery<object, DocumentApiDto>("[Template].[GetTemplateById]", new { Id_Template });
        }

        /// <summary>
        /// Método encargado de realizar la consulta de las plantillas activas
        /// </summary>
        /// <returns></returns>
        public List<DocumentApiDto> GetTemplateActive()
        {
            return ListQuery<object, DocumentApiDto>("[Template].[GetTemplateActive]", new { });
        }

        /// <summary>
        /// Método encargado de realizar la insercion de un token
        /// </summary>
        /// <returns></returns>
        public bool InsertToken(InsertTokenDto InsertToken)
        {
            return SingleQuery<InsertTokenDto, bool>("[Template].[InsertToken]", InsertToken);
        }

        /// <summary>
        /// Método encargado de actualizar token
        /// </summary>
        /// <returns></returns>
        public List<UpdateTokenDto> UpdateToken(UpdateTokenDto UpdateToken)
        {
            return ListQuery<object, UpdateTokenDto>("[Template].[UpdateToken]", UpdateToken);
        }

        /// <summary>
        /// Api Encargada de cambiar estado del token
        /// </summary>
        /// <param name="Id"></param>
        /// <param name="Estado"></param>
        /// <returns></returns>
        public bool ChangeStateToken(string Id, string Estado)
        {
            return SingleQuery<object, bool>("[Template].[ChangeStateToken]", new { Id, Estado });
        }

        /// <summary>
        /// Método encargado de realizar la consulta tipos de plantillas activas
        /// </summary>
        /// <returns></returns>
        public List<GetTipoPlantillasDto> GetTipoPlantillas()
        {
            return ListQuery<object, GetTipoPlantillasDto>("[Template].[Get_Tipo_Plantillas]", new { });
        }

        /// <summary>
        /// Método encargado de obtener los tokens por id de plantilla
        /// </summary>
        /// <returns></returns>
        public List<GetTokensByIdDto> GetTokensById(string Id_Template)
        {
            return ListQuery<object, GetTokensByIdDto>("[Template].[GetTokensById]", new { Id_Template });
        }

        /// <summary>
        /// Método encargado de obtener los tokens de las firmas por id de plantilla
        /// </summary>
        /// <returns></returns>
        public List<GetTokensFirmasByIdDto> GetTokensFirmasById(string Id_Template)
        {
            return ListQuery<object, GetTokensFirmasByIdDto>("[Template].[GetTokensFirmasById]", new { Id_Template });
        }

        /// <summary>
        /// Método encargado de insertar actas
        /// </summary>
        /// <returns></returns>
        public bool InsertActa(InsertActaDto InsertToken)
        {
            return SingleQuery<InsertActaDto, bool>("[Actas].[InsertActa]", InsertToken);
        }

        /// <summary>
        /// Api Encargada de devolver el dispositivo
        /// </summary>
        /// <param name="Id_Inventario"></param>
        /// <param name="Serial"></param>
        /// <returns></returns>
        public bool DevolucionInventario(string Id_Inventario, string Serial, string UserGeneral, string Id_Acta_Drive)
        {
            return SingleQuery<object, bool>("[Inventario].[Devolucion_Inventario]", new { Id_Inventario, Serial, UserGeneral, Id_Acta_Drive });
        }

        /// <summary>
        /// Api Encargada de asignar el dispositivo
        /// </summary>
        /// <param name="Id_Inventario"></param>
        /// <param name="Serial"></param>
        /// <param name="Serial"></param>
        /// <returns></returns>
        public bool AsignacionInventario(string Id_Inventario, string Serial, string Usuario, string UserGeneral, string Id_Acta_Drive)
        {
            return SingleQuery<object, bool>("[Inventario].[Asignacion_Inventario]", new { Id_Inventario, Serial, Usuario, UserGeneral, Id_Acta_Drive });
        }

        /// <summary>
        /// Obtener el listado de todas las actas
        /// </summary>
        /// <returns></returns>
        public List<GetActasDto> GetActas()
        {
            return ListQuery<object, GetActasDto>("[Actas].[Get_Actas]", new { });
        }

        /// <summary>
        /// Obtener el listado de los tokens fijos
        /// </summary>
        /// <returns></returns>
        public List<GetTokensFijosDto> GetTokensFijos()
        {
            return ListQuery<object, GetTokensFijosDto>("[Template].[GetTokensFijos]", new { });
        }

        /// <summary>
        /// Obtener el listado de los tokens de usuario
        /// </summary>
        /// <returns></returns>
        public List<GetTokensUsuarioDto> GetTokensUsuario()
        {
            return ListQuery<object, GetTokensUsuarioDto>("[Template].[GetTokensUsaurio]", new { });
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
            return SingleQuery<object, bool>("[Inventario].[Env_Dev_HomeOffice]", new { Id_Inventario, Serial, Home_Office, UserGeneral, Id_Acta_Drive });
        }

        /// <summary>
        /// Obtener el listado de tipos de fechas
        /// </summary>
        /// <returns></returns>
        public List<GetTipoFechaDto> GetTipoFecha()
        {
            return ListQuery<object, GetTipoFechaDto>("[Token].[Get_Tipo_Fecha]", new { });
        }

        /// <summary>
        /// Obtener el listado de Procesadores
        /// </summary>
        /// <returns></returns>
        public List<GetProcesadoresDto> GetProcesadores()
        {
            return ListQuery<object, GetProcesadoresDto>("[Inventario].[SP_Get_Procesadores]", new { });
        }

        /// <summary>
        /// Obtener el listado de RAM
        /// </summary>
        /// <returns></returns>
        public List<GetRAMDto> GetRAM()
        {
            return ListQuery<object, GetRAMDto>("[Inventario].[SP_Get_RAM]", new { });
        }

        /// <summary>
        /// Obtener el listado de Discos
        /// </summary>
        /// <returns></returns>
        public List<GetDiscoDto> GetDisco()
        {
            return ListQuery<object, GetDiscoDto>("[Inventario].[SP_Get_Disco]", new { });
        }

        /// <summary>
        /// Obtener datos de email
        /// </summary>
        /// <param name="Email"></param>
        /// <returns></returns>
        public List<GetEmailDto> GetDatosEmail(string Email)
        {
            return ListQuery<object, GetEmailDto>("[Email].[Get_Email]", new { Email });
        }

        /// <summary>
        /// Obtener plantillas de correo
        /// </summary>
        /// <returns></returns>
        public List<GetTemplateMailDto> GetTemplateMail()
        {
            return ListQuery<object, GetTemplateMailDto>("[Email].[Get_Template_Mail]", new { });
        }

        /// <summary>
        /// Método encargado de insertar plantillas de correo
        /// </summary>
        /// <returns></returns>
        public bool InsertTemplateMail(InsertTemplateMailDto InsertTemplateMail)
        {
            return SingleQuery<InsertTemplateMailDto, bool>("[Email].[Insert_Template_Mail]", InsertTemplateMail);
        }

        /// <summary>
        /// Método encargado de actualizar plantilla de correo
        /// </summary>
        /// <returns></returns>
        public List<UpdateTemplateMailDto> UpdateTemplateMail(UpdateTemplateMailDto UpdateTemplateMail)
        {
            return ListQuery<object, UpdateTemplateMailDto>("[Email].[Update_Template_Mail]", UpdateTemplateMail);
        }

        /// <summary>
        /// Método encargado de activar plantilla de correo
        /// </summary>
        /// <returns></returns>
        public List<ActiveTemplateMailDto> ActiveTemplateMail(ActiveTemplateMailDto ActiveTemplateMail)
        {
            return ListQuery<object, ActiveTemplateMailDto>("[Email].[Active_Template_Mail]", ActiveTemplateMail);
        }

        /// <summary>
        /// Traer usuario
        /// </summary>
        /// <param name="Identificacion"></param>
        /// <returns></returns>
        public List<GetEmailUsaurioDto> GetEmailUsaurio(string Identificacion)
        {
            return ListQuery<object, GetEmailUsaurioDto>("[Usuarios].[SP_Get_Email_Usaurio]", new { Identificacion });
        }

        /// <summary>
        /// Insertar Procesador
        /// </summary>
        /// <param name="Procesador"></param>
        /// <returns></returns>
        public bool InsertProcesador(string Procesador)
        {
            return SingleQuery<object, bool>("[Inventario].[SP_InsertProcesador]", new { Procesador });
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
            return SingleQuery<object, bool>("[Inventario].[SP_UpdateProcesador]", new { Id, Procesador, Id_Estado });
        }

        /// <summary>
        /// Obtener columnas a ocultar
        /// </summary>
        /// <param name="Identificacion_Usuario"></param>
        /// <returns></returns>
        public List<NoColumnsDto> NoColumns(string Identificacion_Usuario)
        {
            return ListQuery<object, NoColumnsDto>("[Inventario].[Get_NoColumns]", new { Identificacion_Usuario });
        }

        /// <summary>
        /// Actualizar columnas para no mostrar
        /// </summary>
        /// <param name="UpdateNoColumns"></param>
        /// <returns></returns>
        public bool UpdateNoColumns(UpdateNoColumnsDto UpdateNoColumns)
        {
            return SingleQuery<UpdateNoColumnsDto, bool>("[Inventario].[Update_NoColumns]", UpdateNoColumns);
        }

        /// <summary>
        /// Obtener el listado de modulos 
        /// </summary>
        /// <returns></returns>
        public List<GetModulosDto> GetModulos()
        {
            return ListQuery<object, GetModulosDto>("[Auth].[SP_Get_Modulos]", new {  });
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
            return ListQuery<object, CreateRolDto>("[Auth].[SP_Create_Rol]", new { Nombre_Rol , Descripcion , Jefe });
        }

        /// <summary>
        /// Crear permisos de los modulos
        /// </summary>
        /// <param name="CreatePermisosModulos"></param>
        /// <returns></returns>
        public bool CreatePermisosModulos(CreatePermisosModulosDto CreatePermisosModulos)
        {
            return SingleQuery<CreatePermisosModulosDto, bool>("[Auth].[SP_Create_Permisos_Modulos]", CreatePermisosModulos);
        }

        /// <summary>
        /// Crear permisos de las acciones
        /// </summary>
        /// <param name="CreatePermisosAcciones"></param>
        /// <returns></returns>
        public bool CreatePermisosAcciones(CreatePermisosAccionesDto CreatePermisosAcciones)
        {
            return SingleQuery<CreatePermisosAccionesDto, bool>("[Inventario].[SP_Create_Permisos_Acciones]", CreatePermisosAcciones);
        }

        /// <summary>
        /// Actualizar permisos de las acciones
        /// </summary>
        /// <param name="UpdatePermisosAcciones"></param>
        /// <returns></returns>
        public bool UpdatePermisosAcciones(CreatePermisosAccionesDto UpdatePermisosAcciones)
        {
            return SingleQuery<CreatePermisosAccionesDto, bool>("[Inventario].[SP_Update_Permisos_Acciones]", UpdatePermisosAcciones);
        }

        /// <summary>
        /// Obtener usuario por identificacion
        /// </summary>
        /// <param name="Identificacion_Usuario"></param>
        /// <returns></returns>
        public List<IdentificacionDto> UsuarioByIdentificacion(string Identificacion_Usuario)
        {
            return ListQuery<object, IdentificacionDto>("[Usuarios].[SP_Get_Usuario_By_Identificacion]", new { Identificacion_Usuario });
        }

        /// <summary>
        /// Obtener la imagen de la firma
        /// </summary>
        /// <param name="Identificacion_Usuario"></param>
        /// <returns></returns>
        public List<GetFirmaImagenDto> GetFirmaImagen(string Identificacion_Usuario)
        {
            return ListQuery<object, GetFirmaImagenDto>("[Usuarios].[Get_Firma_Imagen]", new { Identificacion_Usuario });
        }

        /// <summary>
        /// Actualizar firma del usuario logueado
        /// </summary>
        /// <param name="UpdateFirmaImagen"></param>
        /// <returns></returns>
        public bool UpdateFirmaImagen(UpdateFirmaImagenDto UpdateFirmaImagen)
        {
            return SingleQuery<UpdateFirmaImagenDto, bool>("[Usuarios].[Update_Firma_Imagen]", UpdateFirmaImagen);
        }

        /// <summary>
        /// Obtener actas para quitarle los permisos
        /// </summary>
        /// <returns></returns>
        public List<SuspendPermissionsDto> GetSuspendPermissions()
        {
            return ListQuery<object, SuspendPermissionsDto>("[Actas].[Suspend_Permissions]", new { });
        }

        /// <summary>
        /// Actualizar suspension de permisos de actas
        /// </summary>
        /// <param name="idFile"></param>
        /// <returns></returns>
        public bool UpdateSuspendPermissions(string idFile)
        {
            return SingleQuery<object, bool>("[Actas].[Update_Suspend_Permissions]", new { idFile });
        }

        /// <summary>
        /// Obtener datos del usuario para los tokens.
        /// </summary>
        /// <param name="Identificacion_Usuario"></param>
        /// <returns></returns>
        public List<GetDatosTokensUsuarioDto> GetDatosTokensUsuario(string Identificacion_Usuario)
        {
            return ListQuery<object, GetDatosTokensUsuarioDto>("[Template].[GetDatosTokensUsuario]", new { Identificacion_Usuario });
        }

    }
}
