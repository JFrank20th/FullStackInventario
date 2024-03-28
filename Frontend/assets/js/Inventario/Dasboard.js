var Url_Backend = "http://localhost:57737/";
//var Url_Backend = window.location.origin + '/inventario/Backend/';
var access_token;
var token_type;

//Inicializar
function Inicializador() {
    User = localStorage.getItem("User_Inventarios");
    if (User) {
        User = JSON.parse(atob(User));
        User = User[0];
    } else {
        window.location.assign("index.html");
    };
    ObtenerToken(User.Identificacion_Usuario, User.Password);
    DashboardInvetario()
}; Inicializador();

// Función Encargada de Obtener el Token generado por el Backend,
function ObtenerToken(Username, Password) {
    var Param = {
        Username: Username,
        Password: Password,
        grant_type: "password",
    };
    $.ajax({
        type: "POST",
        dataType: "json",
        contentType: "application/x-www-form-urlencoded; charset=utf-8",
        url: Url_Backend + "token",
        data: Param,
        async: false,
        beforeSend: function () { },
        success: function (response) {
            access_token = response.access_token;
            token_type = response.token_type;
        },
        error: function (err) {
            swal("Upps!", "Usuario y/o Contraseña Incorrectos", "error");
        },
        timeout: 300000,
    });
};

function DashboardInvetario(Proveedor, Marca, Tipo_Activo) {
    let Id_Proveedor = Proveedor == undefined || Proveedor == "" ? 0 : Proveedor
    let Id_Marca = Marca == undefined || Marca == "" ? 0 : Marca
    let Id_Tipo_Activo = Tipo_Activo == undefined || Tipo_Activo == "" ? 0 : Tipo_Activo
    $.ajax({
        url: Url_Backend + "DashboardInventario?Id_Proveedor=" + Id_Proveedor + "&Id_Marca=" + Id_Marca + "&Id_Tipo_Activo=" + Id_Tipo_Activo,
        type: 'GET',
        contentType: 'application/json',
        headers: {
            'Authorization': token_type + ' ' + access_token
        },
        async: false,
        success: function (response) {
            var totalidad = response[0].Totalidad;
            var asignado = response[0].Asignado;
            var activo = response[0].Activo;
            var si_Soporte = response[0].Si_Soporte;
            var si_Proveedor = response[0].Si_Proveedor;

            //Asignacion
            var porcentajeAsignado = Math.floor((asignado / totalidad) * 100);
            var porcentajeLibre = 100 - porcentajeAsignado;

            $("#Asignado").css("width", porcentajeAsignado + "%");
            $("#Libre").css("width", porcentajeLibre + "%");
            $("#numeroAsignado").text(asignado + " -");
            $("#porcentajeAsignado").text(porcentajeAsignado + "%");
            $("#numeroLibre").text((totalidad - asignado) + " -");
            $("#porcentajeLibre").text(porcentajeLibre + "%");

            //Estado
            var porcentajeActivo = Math.floor((activo / totalidad) * 100);
            var porcentajeInactivo = 100 - porcentajeActivo;

            $("#Activo").css("width", porcentajeActivo + "%");
            $("#Inactivo").css("width", porcentajeInactivo + "%");
            $("#numeroActivo").text(activo + " -");
            $("#porcentajeActivo").text(porcentajeActivo + "%");
            $("#numeroInactivo").text((totalidad - activo) + " -");
            $("#porcentajeInactivo").text(porcentajeInactivo + "%");

            //Soporte
            var porcentajeSiSoporte = Math.floor((si_Soporte / totalidad) * 100);
            var porcentajeNoSoporte = 100 - porcentajeSiSoporte;

            $("#SiSoporte").css("width", porcentajeSiSoporte + "%");
            $("#NoSoporte").css("width", porcentajeNoSoporte + "%");
            $("#numeroSiSoporte").text(si_Soporte + " -");
            $("#porcentajeSiSoporte").text(porcentajeSiSoporte + "%");
            $("#numeroNoSoporte").text((totalidad - si_Soporte) + " -");
            $("#porcentajeNoSoporte").text(porcentajeNoSoporte + "%");

            //Proveedor
            var porcentajeSiProveedor = Math.floor((si_Proveedor / totalidad) * 100);
            var porcentajeNoProveedor = 100 - porcentajeSiProveedor;

            $("#SiProveedor").css("width", porcentajeSiProveedor + "%");
            $("#NoProveedor").css("width", porcentajeNoProveedor + "%");
            $("#numeroSiProveedor").text(si_Proveedor + " -");
            $("#porcentajeSiProveedor").text(porcentajeSiProveedor + "%");
            $("#numeroNoProveedor").text((totalidad - si_Proveedor) + " -");
            $("#porcentajeNoProveedor").text(porcentajeNoProveedor + "%");
        },
        error: function (error) {
            swal("Upps!", "Error al obtener los datos para el Dashboard: " + error, "error");
        },
        timeout: 300000
    });
}

$(document).on('click', '#botonFiltroDashboard', function () {
    var FiltroNombreActivo = $("#FiltroNombreActivo").val();
    var FiltroMarca = $("#FiltroMarca").val();
    var FiltroProveedor = $("#FiltroProveedor").val();
    DashboardInvetario(FiltroProveedor, FiltroMarca, FiltroNombreActivo)
});