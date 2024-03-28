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
    GetAsignados();
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

//Tabla de inventarios
function GetAsignados() {
    $("#TablaAsignados").empty();
    $("#divTablaAsignados").append(`
        <table style="width:100%;" id="TablaAsignados" class="table table-striped table-bordered compact">
        </table> `);
    $.ajax({
        url: Url_Backend + "Get_Inventario_Asignado?Usuario=" + User.Identificacion_Usuario,
        type: 'GET',
        contentType: 'application/json',
        headers: {
            'Authorization': token_type + ' ' + access_token
        },
        async: false,
        success: function (response) {
            let AgregarMain = OperacionesMain.find(function(item) { return item.Id_Operacion === '2'}).Id_Estado == "True" ? true : false
            let ModificarMain = OperacionesMain.find(function(item) { return item.Id_Operacion === '3'}).Id_Estado == "True" ? true : false
            let DesactivarMain = OperacionesMain.find(function(item) { return item.Id_Operacion === '4'}).Id_Estado == "True" ? true : false

            if (AgregarMain) {
                $("#AgregarMain").empty();
                $("#AgregarMain").append(``);
            }

            Tablecolumns = [{
                "title": "Id",
                "data": "Id_Inventario"
            },
            {
                "title": "Serial",
                "data": "Serial"
            },
            {
                "title": "Placa",
                "data": "Placa"
            },
            {
                "title": "Usuario",
                "data": "Identificacion_Usuario"
            },
            {
                "title": "Proveedor",
                "data": "Proveedor"
            },
            {
                "title": "Activo",
                "data": "Nombre_Activo"
            },
            {
                "title": "Procesador",
                "data": "Procesador"
            },

            {
                "title": "RAM",
                "data": "RAM"
            },

            {
                "title": "Disco",
                "data": "Disco"
            },
            {
                "title": "Marca",
                "data": "Marca"
            },
            {
                "title": "Soporte",
                "data": "Soporte"
            },
            {
                "title": "Estado",
                "data": "Nombre_Estado"
            },
            {
                "title": "Ciudad",
                "data": "Ciudad"
            },
            {
                "title": "Sede",
                "data": "Id_Sede"
            },
            {
                "title": "Piso",
                "data": "Id_Piso"
            },
            {
                "title": "Puesto",
                "data": "Id_Puesto"
            },
            {
                "title": "C. Costo",
                "data": "Centro_Costo"
            },
            {
                "title": "Home Office",
                "data": "Home_Office"
            },
            {
                "title": "Dev. Proveedor",
                "data": "Dev_Proveedor"
            }];

            if ($.fn.dataTable.isDataTable('#TablaAsignados')) {
                TablaAsignados.destroy();
            }
            //Crear tabla
            TablaAsignados = $("#TablaAsignados").DataTable({
                select: true,
                pageLength: 15,
                lengthMenu: [
                    [5, 10, 15, 20, -1],
                    [5, 10, 15, 20, "Todos"]
                ],
                data: response,
                columns: Tablecolumns,
                columnDefs: [
                    { searchable: true, targets: [0, 1, 2] } // Habilitar búsqueda en las columnas 0, 1 y 2
                ],
                drawCallback: function () {
                    $('[data-toggle="tooltip"]').tooltip();
                    
                },
                dom: "<'row'<'col-sm-1'l><'col-sm-9'<'Boton-tabla'B>><'col-sm-2'f>>" +
                    "<'row'<'col-sm-12'tr>>" +
                    "<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>",
                buttons: [
                    'colvis',
                ],
            }).columns.adjust().draw();

            // Crear un mapeo de nombre de columna a índice
            var nombreAIndice = {};
            TablaAsignados.columns().every(function (index) {
                var data = this.dataSrc();
                nombreAIndice[data] = index;
            });

            //Buscadores en input o select
            $('#TablaAsignados thead th').each(function (i) {
                var title = $(this).text();
                $(this).html(title + '<input type="text" class="form-control form-control-sm" placeholder="Buscar ' + title + '" />');
            });

            //Evento para el buscador de cada columna
            TablaAsignados.columns().every(function () {
                var table = this;
                $('input, select', this.header()).not('#checkbox-select-all').on('keyup change', function () {
                    if (table.search() !== this.value) {
                        table.search(this.value).draw();
                    }
                });
            });
        },
        error: function (error) {
            swal("Upps!", "Error al obtener los datos del inventario: " + error, "error");
        },
        timeout: 300000
    });
};