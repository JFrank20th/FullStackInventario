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
    GetBodegas();
    TraerSede();

    TraerPsio();

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
function GetBodegas() {
    ObtenerToken(User.Identificacion_Usuario, User.Password)
    $.ajax({
        url: Url_Backend + "GetBodega",
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
                    "title": "Nombre Bodega",
                    "data": "Nombre_Bodega"
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
                    "title": "Estado",
                    "data": "Id_Estado"
                },
                {
                    "title": "Acciones",
                    "defaultContent": `
                    ${ModificarMain ? `<a href="#" class="editar" title="Editar" data-toggle="tooltip">
                    <span style="color:#00b341" class="material-symbols-outlined">stylus_note</span>
                    </a> ` : ''}
                    ${DesactivarMain ? `<a href="#" class="eliminar" title="Activar" data-toggle="tooltip">
                    <span style="color:#597e8d" class="material-symbols-outlined">task_alt</span>
                    </a>` : ''}
                    `
                }];

            if ($.fn.dataTable.isDataTable('#TablaBodegas')) {
                TablaBodegas.destroy();
            }
            TablaBodegas = $("#TablaBodegas").DataTable({
                pageLength: 10,
                lengthMenu: [
                    [10, 20, 30, -1],
                    [10, 20, 30, "Todos"]
                ],
                data: response,
                columns: Tablecolumns,
                select: true,
                fnRowCallback: function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
                    if (aData.Id_Estado == "Activo") {
                        var svg = $(nRow).find('.eliminar span');
                        var nuevoSVG = '\
                            <span style="color:#597e8d" class="material-symbols-outlined">cancel</span>';
                        svg.html(nuevoSVG);
                        $('.eliminar', nRow).attr('title', 'Inactivar');
                    };
                },
            });

            //Obtener datos al darle click en editar
            $("#TablaBodegas tbody").on("click", "a.editar", function () {
                var dataEditar = TablaBodegas.row($(this).parents("tr")).data();
                EditBodega(dataEditar);

            });

            //Obtener datos al darle click en eliminar
            $("#TablaBodegas tbody").on("click", "a.eliminar", function () {
                var dataEliminar = TablaBodegas.row($(this).parents("tr")).data();
                desactivarPiso(dataEliminar);

            });

            //Funcion desactivar
            function desactivarPiso(dataE) {
                if (dataE.Id_Estado == "Activo") {
                    swal({
                        title: "¿Está seguro de Desactivar la Bodega?",
                        text: "" + dataE.Nombre_Bodega + "",
                        icon: "warning",
                        buttons: true,
                        dangerMode: true,
                    })
                        .then((willDelete) => {
                            if (willDelete) {
                                var myHeaders = new Headers();
                                myHeaders.append("Content-Type", "application/json");
                                myHeaders.append("Authorization", token_type + " " + access_token);

                                var raw = JSON.stringify({
                                    Id_Bodega: dataE.Id_Bodega,
                                    Nombre_Bodega: dataE.Nombre_Bodega,
                                    Id_Piso: dataE.Id_Piso,
                                    Id_Sede: dataE.Id_Sede,
                                    Id_Estado: dataE.Id_Estado == "Activo" ? "0" : "1"
                                });

                                var requestOptions = {
                                    method: 'POST',
                                    headers: myHeaders,
                                    body: raw,
                                    redirect: 'follow'
                                };
                                fetch(Url_Backend + "ActualizarBodega", requestOptions).then(response => response.text(
                                )).then(result => {
                                    var resultado = result;
                                    if (resultado != "false") {
                                        swal("Upps!", "No pudo desactivarse la Bodega", "error");
                                    } else if (resultado == "false") {
                                        swal("Ey!", "La Bodega seleccionada se ha desactivado con éxito", "success").then((result) => {
                                            GetBodegas();
                                            /* if (result.value === true) {
                                                window.location.href = 'Bodegas.html'
                                            }*/
                                        });
                                    } else {
                                        alert("")
                                    }
                                })
                                    .catch(error => console.log('error', error));

                            } else {
                                return false;
                            }
                        });
                } else {
                    swal({
                        title: "¿Está seguro de Activar la Bodega?",
                        text: "" + dataE.Nombre_Bodega + "",
                        icon: "warning",
                        buttons: true,
                        dangerMode: true,
                    })
                        .then((willDelete) => {
                            if (willDelete) {
                                var myHeaders = new Headers();
                                myHeaders.append("Content-Type", "application/json");
                                myHeaders.append("Authorization", token_type + " " + access_token);

                                var raw = JSON.stringify({
                                    Id_Bodega: dataE.Id_Bodega,
                                    Nombre_Bodega: dataE.Nombre_Bodega,
                                    Id_Piso: dataE.Id_Piso,
                                    Id_Sede: dataE.Id_Sede,
                                    Id_Estado: dataE.Id_Estado == "Activo" ? "0" : "1"
                                });

                                var requestOptions = {
                                    method: 'POST',
                                    headers: myHeaders,
                                    body: raw,
                                    redirect: 'follow'
                                };
                                fetch(Url_Backend + "ActualizarBodega", requestOptions)
                                    .then(response => response.text(
                                    ))
                                    .then(result => {
                                        var resultado = result;
                                        if (resultado != "false") {
                                            swal("Upps!", "No pudo activarse la Bodega", "error");
                                        } else if (resultado == "false") {
                                            swal("Ey!", "La Bodega seleccionado se ha activado con éxito", "success").then((result) => {
                                                GetBodegas();
                                                /* if (result.value === true) {
                                                    window.location.href = 'Bodegas.html'
                                                }
                                                */
                                            });
                                        } else {
                                            alert("")
                                        }
                                    })
                                    .catch(error => console.log('error', error));
                            } else {
                                // Dijeron que no
                                return false;
                            }
                        });
                }
            }

            //Funcion editar
            function EditBodega(data) {
                $("#GSCCModal2").modal("show");

                document.getElementById("IdActu").value = data.Id_Bodega;
                document.getElementById("NombreBodegaActu").value = data.Nombre_Bodega;

                document.getElementById("SedeActu").value = data.Id_Sede;
                document.getElementById("PisoActu").value = data.Id_Piso;
                if (data.Id_Estado == "Inactivo") {
                    document.getElementById("EstadoActu").value = "0";
                } else if (data.Id_Estado == "Activo") {
                    document.getElementById("EstadoActu").value = "1";
                }
           
            }

        },
        error: function (error) {
            swal("Upps!", "Error al obtener los datos de las Marcas: " + error, "error");
        },
        timeout: 300000
    });

};


$("#AddBodega").click(function () {
    GuardarBodega();
});

function GuardarBodega() {

    ObtenerToken(User.Identificacion_Usuario, User.Password);
    var NombreBodegaAgre = $("#NombreBodegaAgre").val();
    var SedeAgre = $("#SedeAgre").val();
    var PisoAgre = $("#PisoAgre").val();

    if (SedeAgre == "" || PisoAgre == "" || NombreBodegaAgre == "") {
        swal("Ey!", "Es obligatorio llenar los campos", "error");
        return false;
    }
    $(".preloader").show();
    var Param = {
        Id_Bodega: '0',
        Nombre_Bodega: NombreBodegaAgre,
        Id_Sede: SedeAgre,
        Id_Piso: PisoAgre,
        Id_Estado: '1'
    };
    $.ajax({
        url: Url_Backend + "GuardarBodega",
        type: "POST",
        dataType: "json",
        contentType: "application/x-www-form-urlencoded; charset=utf-8",
        headers: {
            'Authorization': token_type + ' ' + access_token
        },
        data: Param,
        //async: false,
        beforeSend: function () { },
        success: function (response) {
            $(".preloader").hide();
            swal("Bien!", "La Bodega fue agregado correctamente", "success").then((result) => {
                GetBodegas();

                /*if (result.value == true) {
                    window.location.href = 'Bodegas.html'
                }*/
            });
        },
        error: function (err) {
            $(".preloader").hide();
            swal("Ey!", "Error al agregar la Bodega: " + err, "error");
        },
        timeout: 300000,
    });
};

function EditarBodega() {
    $("#GSCCModal2").modal("show");
}

$("#ActualizarBodega").click(function () {
    ActualizarBodega();
});

function ActualizarBodega() {
    ObtenerToken(User.Identificacion_Usuario, User.Password);
    var IdActu = $("#IdActu").val();
    var NombreBodegaActu = $("#NombreBodegaActu").val();
    var SedeActu = $("#SedeActu").val();
    var PisoActu = $("#PisoActu").val();
    var EstadoActu = $("#EstadoActu").val();

    if (SedeActu == "" || NombreBodegaActu == "" || PisoActu == "") {
        swal("Ey!", "Es obligatorio llenar los campos", "error");
        return false;
    }
    $(".preloader").show();
    var Param = {
        Id_Bodega: IdActu,
        Nombre_Bodega: NombreBodegaActu,
        Id_Sede: SedeActu,
        Id_Piso: PisoActu,
        Id_Estado: EstadoActu
    };
    $.ajax({
        url: Url_Backend + "ActualizarBodega",
        type: "POST",
        dataType: "json",
        contentType: "application/x-www-form-urlencoded; charset=utf-8",
        headers: {
            'Authorization': token_type + ' ' + access_token
        },
        data: Param,
        //async: false,
        beforeSend: function () { },
        success: function (response) {
            $(".preloader").hide();
            swal("Bien!", "La Bodega  fue actualizada correctamente", "success").then((result) => {
                GetBodegas();
                /*if (result.value == true) {
                    window.location.href = 'Bodegas.html'
                }*/
            });
        },
        error: function (err) {
            $(".preloader").hide();
            swal("Ey!", "Error al actualizar la Bodega: " + err, "error");
        },
        timeout: 300000,
    });
};

function TraerSede() {
    ObtenerToken(User.Identificacion_Usuario, User.Password)
    $.ajax({
        url: Url_Backend + 'GetSede',
        type: 'GET',
        contentType: 'application/json',
        headers: {
            'Authorization': token_type + ' ' + access_token
        },
        async: false,
        success: function (response) {
            $("#SedeAgre").empty();
            $("#SedeAgre").append("<option value='' selected disable hidden>Elegir...</option>");
            for (var i = 0; i < response.length; i++) {
                $("#SedeAgre").append("<option value='" + response[i].Id_Sede + "'>" + response[i].Id_Sede + " </option>");
            }

            $("#SedeActu").empty();
            $("#SedeActu").append("<option value='' selected disable hidden>Elegir...</option>");
            for (var i = 0; i < response.length; i++) {
                $("#SedeActu").append("<option value='" + response[i].Id_Sede + "'>" + response[i].Id_Sede + " </option>");
            }
        },
        error: function (err) { },
        timeout: 300000
    });
};

$("#SedeAgre").change(function () {
    var SedeId = $("#SedeAgre").val();
    ObtenerToken(User.Identificacion_Usuario, User.Password)
    $.ajax({
        url: Url_Backend + 'GetPiso?Id_Sede=' + SedeId,
        type: 'GET',
        contentType: 'application/json',
        headers: {
            'Authorization': token_type + ' ' + access_token
        },
        async: false,
        success: function (response) {
            $("#PisoAgre").empty();
            $("#PisoAgre").append("<option value='' selected disable hidden>Elegir...</option>");
            for (var i = 0; i < response.length; i++) {
                $("#PisoAgre").append("<option value='" + response[i].Id + "'>"+ response[i].Id_Piso + " </option>");
            }
        },
        error: function (err) { },
        timeout: 300000
    });
});

$("#SedeActu").change(function () {
    var SedeId = $("#SedeActu").val();
    ObtenerToken(User.Identificacion_Usuario, User.Password)
    $.ajax({
        url: Url_Backend + 'GetPiso?Id_Sede=' + SedeId,
        type: 'GET',
        contentType: 'application/json',
        headers: {
            'Authorization': token_type + ' ' + access_token
        },
        async: false,
        success: function (response) {
            (response)
            $("#PisoActu").empty();
            $("#PisoActu").append("<option value='' selected disable hidden>Elegir...</option>");
            for (var i = 0; i < response.length; i++) {
                $("#PisoActu").append("<option value='" + response[i].Id + "'>"+ response[i].Id_Piso + " </option>");
            }
        },
        error: function (err) { },
        timeout: 300000
    });
});


function TraerPsio() {
    ObtenerToken(User.Identificacion_Usuario, User.Password)
    $.ajax({
        url: Url_Backend + 'GetPisos',
        type: 'GET',
        contentType: 'application/json',
        headers: {
            'Authorization': token_type + ' ' + access_token
        },
        async: false,
        success: function (response) {

            $("#PisoActu").empty();
            $("#PisoActu").append("<option value='' selected disable hidden>Elegir...</option>");
            for (var i = 0; i < response.length; i++) {
                $("#PisoActu").append("<option value='" + response[i].Id + "'>" + response[i].Id_Piso + " </option>");
            }
        },
        error: function (err) { },
        timeout: 300000
    });
};