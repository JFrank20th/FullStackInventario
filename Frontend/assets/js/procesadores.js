var Url_Backend = "http://localhost:57737/";
//var Url_Backend = window.location.origin + '/inventario/Backend/';
var access_token;
var token_type;
var User;
var dataInv;
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
    GetProcesadores();

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

//Tabla de Usuarios
function GetProcesadores() {
    ObtenerToken(User.Identificacion_Usuario, User.Password)
    $.ajax({
        url: Url_Backend + "GetProcesadores",
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
                $("#AgregarMain").append(`
                    <button type="button" class="btn btn-primary btn-rounded btn-sm"
                    data-toggle="modal"
                    data-target=".bd-example-modal-lg">Agregar</button>
                `);
            }

            Tablecolumns = [
                {
                    "title": "Id",
                    "data": "Id"
                },
                {
                    "title": "Procesador",
                    "data": "Procesador"
                },
                {
                    "title": "Estado",
                    "data": "Id_Estado"
                },
                {
                    "title": "Acciones",
                    "defaultContent": `
                    ${ModificarMain ? `<a href="#" class="editar" title="Editar" data-toggle="tooltip">
                    <span style="color:#00b341" class="material-symbols-outlined">stylus_note</span>
                    </a>` : ''}
                    ${DesactivarMain ? `<a href="#" class="eliminar" title="Activar" data-toggle="tooltip">
                    <span style="color:#597e8d" class="material-symbols-outlined">task_alt</span>
                    </a>` : ''}
                    `
                }];

            if ($.fn.dataTable.isDataTable('#TablaProcesadores')) {
                TablaProcesadores.destroy();
            }
            TablaProcesadores = $("#TablaProcesadores").DataTable({
                pageLength: 10,
                lengthMenu: [
                    [10, 20, 30, -1],
                    [10, 20, 30, "Todos"]
                ],
                data: response,
                columns: Tablecolumns,
                select: true,
                fnRowCallback: function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
                    if (aData.Id_Estado == "True") {
                        var svg = $(nRow).find('.eliminar span');
                        var nuevoSVG = '\
                            <span style="color:#597e8d" class="material-symbols-outlined">cancel</span>';
                        svg.html(nuevoSVG);
                        $('.eliminar', nRow).attr('title', 'Inactivar');
                    };
                },
            });

            //Obtener datos al darle click en editar
            $("#TablaProcesadores tbody").on("click", "a.editar", function () {
                var dataEditar = TablaProcesadores.row($(this).parents("tr")).data();
                EditProcesador(dataEditar);
            });

            //Obtener datos al darle click en eliminar
            $("#TablaProcesadores tbody").on("click", "a.eliminar", function () {
                var dataEliminar = TablaProcesadores.row($(this).parents("tr")).data();
                desactivarProcesador(dataEliminar);

            });

            //Funcion desactivar
            function desactivarProcesador(dataE) {
                
                var Id_Estado = dataE.Id_Estado == "True" ? 0 : 1
                var mensaje = dataE.Id_Estado == "True" ? "El Procesador fue desactivado correctamente" : "El Procesador fue activado correctamente"
                $.ajax({
                    url: Url_Backend + "UpdateProcesador?Id=" + dataE.Id + "&Procesador=" + dataE.Procesador + "&Id_Estado=" + Id_Estado,
                    type: 'POST',
                    contentType: 'application/json',
                    headers: {
                        'Authorization': token_type + ' ' + access_token
                    },
                    async: false,
                    success: function (response) {

                        swal("Bien!", mensaje, "success");
                        $("#GSCCModal2").modal("hide");
                        Inicializador();
                    },
                    error: function (error) {
                        swal("Error!", "Error al actualizar procesador", "error");
                    },
                    timeout: 300000
                });
            }

            //Funcion editar
            function EditProcesador(data) {
                dataInv = data
                $("#GSCCModal2").modal("show");
                document.getElementById("IdProcesadorActu").value = data.Id;
                const Cadena = (data.Procesador).split(' ');
                const Marca = Cadena[0];
                document.getElementById("MarcaProcesadorActu").value = Marca;
                let GHZ = Cadena[Cadena.length - 1];
                GHZ = GHZ.replace(/GHz/g, "");
                document.getElementById("GHzActu").value = GHZ;
                const textoIntermedio = (data.Procesador).substring(Cadena[0].length + 1, (data.Procesador).lastIndexOf('-') - 1);
                document.getElementById("ReferenciaProcesadorActu").value = textoIntermedio.trim();
                document.getElementById("NombreProcesadorActu").value = data.Procesador;
            }

        },
        error: function (error) {
            swal("Upps!", "Error al obtener los datos de el Tipo de Equipo: " + error, "error");
        },
        timeout: 300000
    });

};

//Eventos para concatenar nombre del procesador
$("#MarcaProcesadorAgre, #ReferenciaProcesadorAgre, #GHzAgre").on("keyup change", function () {
    const marca = $("#MarcaProcesadorAgre").val();
    const referencia = $("#ReferenciaProcesadorAgre").val().toLowerCase().replace(/^\w/, l => l.toUpperCase());
    let ghzValue = $("#GHzAgre").val();
    ghzValue = ghzValue.replace(/[e+\-]/gi, '');
    if (ghzValue.length > 3) {
        $("#GHzAgre").val(ghzValue.slice(0, 3));
    }
    $("#NombreProcesadorAgre").val(`${marca == null ? "" : marca} ${referencia} - ${ghzValue.substring(0, 3)}GHz`);
});

//Eventos para concatenar nombre del procesador
$("#MarcaProcesadorActu, #ReferenciaProcesadorActu, #GHzActu").on("keyup change", function () {
    const marca = $("#MarcaProcesadorActu").val();
    const referencia = $("#ReferenciaProcesadorActu").val().toLowerCase().replace(/^\w/, l => l.toUpperCase());
    let ghzValue = $("#GHzActu").val();
    ghzValue = ghzValue.replace(/[e+\-]/gi, '');
    if (ghzValue.length > 3) {
        $("#GHzActu").val(ghzValue.slice(0, 3));
    }
    $("#NombreProcesadorActu").val(`${marca == null ? "" : marca} ${referencia} - ${ghzValue.substring(0, 3)}GHz`);
});

//Guardar procesador
function GuardarProcesador() {
    var NombreProcesador = $("#NombreProcesadorAgre").val();
    if (NombreProcesador == "") {
        toastr.error('Es obligatorio llenar todos los campos');
        return false;
    }
    $.ajax({
        url: Url_Backend + "InsertProcesador?Procesador=" + NombreProcesador,
        type: 'POST',
        contentType: 'application/json',
        headers: {
            'Authorization': token_type + ' ' + access_token
        },
        async: false,
        success: function (response) {
            swal("Bien!", "El Tipo de Equipo fue actualizada correctamente", "success");
            $("#GSCCModal").modal("hide");
            Inicializador();
        },
        error: function (error) {
            swal("Error!", "Error al agregar procesador", "error");
        },
        timeout: 300000
    });
};


function ActualizarProcesador() {
    var NombreProcesador = $("#NombreProcesadorActu").val();
    var Id_Estado = dataInv.Id_Estado == "True" ? 1 : 0
    if (NombreProcesador == "") {
        toastr.error('Es obligatorio llenar todos los campos');
        return false;
    }
    $.ajax({
        url: Url_Backend + "UpdateProcesador?Id=" + dataInv.Id + "&Procesador=" + NombreProcesador + "&Id_Estado=" + Id_Estado,
        type: 'POST',
        contentType: 'application/json',
        headers: {
            'Authorization': token_type + ' ' + access_token
        },
        async: false,
        success: function (response) {
            swal("Bien!", "El Procesador fue actualizada correctamente", "success");
            $("#GSCCModal2").modal("hide");
            Inicializador();
        },
        error: function (error) {
            swal("Error!", "Error al actualizar procesador", "error");
        },
        timeout: 300000
    });
};

