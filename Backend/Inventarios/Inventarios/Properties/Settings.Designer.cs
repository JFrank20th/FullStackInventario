﻿//------------------------------------------------------------------------------
// <auto-generated>
//     Este código fue generado por una herramienta.
//     Versión de runtime:4.0.30319.42000
//
//     Los cambios en este archivo podrían causar un comportamiento incorrecto y se perderán si
//     se vuelve a generar el código.
// </auto-generated>
//------------------------------------------------------------------------------

namespace Inventarios.Properties {
    
    
    [global::System.Runtime.CompilerServices.CompilerGeneratedAttribute()]
    [global::System.CodeDom.Compiler.GeneratedCodeAttribute("Microsoft.VisualStudio.Editors.SettingsDesigner.SettingsSingleFileGenerator", "17.2.0.0")]
    internal sealed partial class Settings : global::System.Configuration.ApplicationSettingsBase {
        
        private static Settings defaultInstance = ((Settings)(global::System.Configuration.ApplicationSettingsBase.Synchronized(new Settings())));
        
        public static Settings Default {
            get {
                return defaultInstance;
            }
        }
        
        [global::System.Configuration.ApplicationScopedSettingAttribute()]
        [global::System.Diagnostics.DebuggerNonUserCodeAttribute()]
        [global::System.Configuration.SpecialSettingAttribute(global::System.Configuration.SpecialSetting.WebServiceUrl)]
        public string frontend_url {
            get {
                return ((string)(this["frontend_url"]));
            }
        }
        
        [global::System.Configuration.ApplicationScopedSettingAttribute()]
        [global::System.Diagnostics.DebuggerNonUserCodeAttribute()]
        [global::System.Configuration.SpecialSettingAttribute(global::System.Configuration.SpecialSetting.ConnectionString)]
        [global::System.Configuration.DefaultSettingValueAttribute("Data Source=10.80.40.52;Initial Catalog=analytics;Integrated Security=True")]
        public string ConexionEmpleados {
            get {
                return ((string)(this["ConexionEmpleados"]));
            }
        }
        
        [global::System.Configuration.ApplicationScopedSettingAttribute()]
        [global::System.Diagnostics.DebuggerNonUserCodeAttribute()]
        [global::System.Configuration.SpecialSettingAttribute(global::System.Configuration.SpecialSetting.ConnectionString)]
        [global::System.Configuration.DefaultSettingValueAttribute("Data Source=10.80.40.214;Initial Catalog=Inventario;User ID=user_inventario;Passw" +
            "ord=£17:5te:cCiP")]
        public string Conexion {
            get {
                return ((string)(this["Conexion"]));
            }
        }
        
        [global::System.Configuration.ApplicationScopedSettingAttribute()]
        [global::System.Diagnostics.DebuggerNonUserCodeAttribute()]
        [global::System.Configuration.DefaultSettingValueAttribute(@"<?xml version=""1.0"" encoding=""utf-16""?>
<ArrayOfString xmlns:xsd=""http://www.w3.org/2001/XMLSchema"" xmlns:xsi=""http://www.w3.org/2001/XMLSchema-instance"">
  <string>Serial</string>
  <string>Placa</string>
  <string>Id_Proveedor</string>
  <string>Id_Nombre_Activo</string>
  <string>Id_Marca</string>
  <string>Id_Ciudad</string>
  <string>Id_Sede</string>
  <string>Id_Piso</string>
  <string>Id_Puesto</string>
  <string>Usuario_Asignar</string>
  <string>Estado</string>
</ArrayOfString>")]
        public global::System.Collections.Specialized.StringCollection DatabaseFields {
            get {
                return ((global::System.Collections.Specialized.StringCollection)(this["DatabaseFields"]));
            }
        }
        
        [global::System.Configuration.ApplicationScopedSettingAttribute()]
        [global::System.Diagnostics.DebuggerNonUserCodeAttribute()]
        [global::System.Configuration.DefaultSettingValueAttribute(@"<?xml version=""1.0"" encoding=""utf-16""?>
<ArrayOfString xmlns:xsd=""http://www.w3.org/2001/XMLSchema"" xmlns:xsi=""http://www.w3.org/2001/XMLSchema-instance"">
  <string>Identificacion_Usuario</string>
  <string>Id_Tipo_Identificacion</string>
  <string>Nombres</string>
  <string>Apellidos</string>
  <string>Direccion_Domicilio</string>
  <string>Id_Centro_Costos</string>
  <string>Id_Cargo</string>
  <string>Email</string>
  <string>Id_Rol</string>
  <string>Id_Estado</string>
  <string>Identificacion_Jefe</string>
</ArrayOfString>")]
        public global::System.Collections.Specialized.StringCollection DatabaseFieldsUsers {
            get {
                return ((global::System.Collections.Specialized.StringCollection)(this["DatabaseFieldsUsers"]));
            }
        }
    }
}
