var Url_Backend = "http://localhost:57737/";
//var Url_Backend = window.location.origin + '/inventario/Backend/';
var access_token;
var token_type;
var User;
var OperacionesMain;

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
    GetActas();
};

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

//Traer operaciones del modulo
function TraerOperacionesMain() {
    console.log(window.NombreModuloMain);
    $.ajax({
        type: "GET",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        headers: {
            Authorization: token_type + " " + access_token,
        },
        async: false,
        url: Url_Backend + "Get_Modulo_Operaciones?Role=" + User.Id_Rol + "&Modulo=" + NombreModuloMain.split("/").pop(),
        beforeSend: function () { },
        success: function (response) {
            OperacionesMain = response;
        },
        error: function (err) { },
        timeout: 300000,
    });
}

//Funcionn para obtener todos los documentos de la Bd
function GetActas() {
    $.ajax({
        url: Url_Backend + "GetActas",
        type: 'GET',
        contentType: 'application/json',
        headers: {
            'Authorization': token_type + ' ' + access_token
        },
        success: function (response) {
            let AgregarMain = OperacionesMain.find(function(item) { return item.Id_Operacion === '2'}).Id_Estado == "True" ? true : false
            let ModificarMain = OperacionesMain.find(function(item) { return item.Id_Operacion === '3'}).Id_Estado == "True" ? true : false
            let DesactivarMain = OperacionesMain.find(function(item) { return item.Id_Operacion === '4'}).Id_Estado == "True" ? true : false

            if (AgregarMain) {
                $("#AgregarMain").empty();
                $("#AgregarMain").append(`
                    
                `);
            }

            Tablecolumns = [
                {
                    "title": "Id Acta",
                    "data": "Id"
                },
                {
                    "title": "Nombre Acta",
                    "data": "Nombre"
                },
                {
                    "title": "Pendiente",
                    "data": "Pendiente_Firmas"
                },
                {
                    "title": "Creación",
                    "data": "Date_Create"
                },
                {
                    "title": "Acciones",
                    "defaultContent": `<a href="#" class="ver" title="Ver acta" data-toggle="tooltip">
                        <span style="color:#029499" class="material-symbols-outlined">visibility</span>
                    </a>`
                }];

            if ($.fn.dataTable.isDataTable('#TablaActas')) {
                TablaActas.destroy();
            }
            TablaActas = $("#TablaActas").DataTable({
                pageLength: 10,
                lengthMenu: [
                    [10, 20, 30, -1],
                    [10, 20, 30, "Todos"]
                ],
                data: response,
                columns: Tablecolumns,
                select: true,
            });

            //Obtener datos al darle click en editar
            $("#TablaActas tbody").on("click", "a.ver", function () {
                var verData = TablaActas.row($(this).parents("tr")).data();
                VerActa(verData);
            });

            //Funcion editar
            function VerActa(data) {
                $('#PlantillaIframe').modal('show');
                $('#tituloModalPlantilla').text("Plantilla: " + data.Nombre);
                PermissionsEdit(data);
            };

        },
        error: function (error) { },
        timeout: 300000

    });

}

//Verificar si se pueden abrir en PDF
//Funcion para abrir los documentos en un iframe
function PermissionsEdit(data) {
    $.ajax({
        url: Url_Backend + "PermissionsEdit?idFile=" + data.Id_Acta_Drive,
        type: 'GET',
        contentType: 'application/json',
        headers: {
            'Authorization': token_type + ' ' + access_token
        },
        async: false,
        success: function (response) {
            var regex = /"/g
            const nuevaStr = response.replace(regex, '');
            $("#iframelink").prop('src', nuevaStr);
        },
        error: function (error) { },
        timeout: 300000
    });
}
