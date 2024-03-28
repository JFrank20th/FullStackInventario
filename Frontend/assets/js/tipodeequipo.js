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
    GetTipoEquipo();
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
        url: Url_Backend + "Get_Modulo_Operaciones?Role=" + User.Id_Rol + "&Modulo=Tipos de Equipos",
        beforeSend: function () { },
        success: function (response) {
            OperacionesMain = response;
        },
        error: function (err) { },
        timeout: 300000,
    });
}

//Tabla de Usuarios
function GetTipoEquipo() {
    ObtenerToken(User.Identificacion_Usuario, User.Password)
    $.ajax({
        url: Url_Backend + "GetTipoEquipo",
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
                    "title": "Nombre",
                    "data": "Nombre_Activo"
                },
                {
                    "title": "Procesador, RAM y Disco",
                    "data": "ProcesadorRamDisco"
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

            if ($.fn.dataTable.isDataTable('#TablaTipoEquipo')) {
                TablaTipoEquipo.destroy();
            }
            TablaTipoEquipo = $("#TablaTipoEquipo").DataTable({
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
            $("#TablaTipoEquipo tbody").on("click", "a.editar", function () {
                var dataEditar = TablaTipoEquipo.row($(this).parents("tr")).data();
                EditPuesto(dataEditar);

            });

            //Obtener datos al darle click en eliminar
            $("#TablaTipoEquipo tbody").on("click", "a.eliminar", function () {
                var dataEliminar = TablaTipoEquipo.row($(this).parents("tr")).data();
                desactivarTipoEquipo(dataEliminar);

            });

            //Funcion desactivar
            function desactivarTipoEquipo(dataE) {
                if (dataE.Id_Estado == "Activo") {
                    swal({
                        title: "¿Está seguro de Desactivar el Tipo de Equipo?",
                        text: "" + dataE.Nombre_Activo + "",
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
                                    Id_Tipo_Activo: dataE.Id_Tipo_Activo,
                                    Nombre_Activo: dataE.Nombre_Activo,
                                    Id_Estado: dataE.Id_Estado == "Activo" ? "0" : "1"
                                });

                                var requestOptions = {
                                    method: 'POST',
                                    headers: myHeaders,
                                    body: raw,
                                    redirect: 'follow'
                                };
                                fetch(Url_Backend + "ActualizarTipoEquipo", requestOptions).then(response => response.text(
                                )).then(result => {
                                    var resultado = result;
                                    if (resultado != "false") {
                                        swal("Upps!", "No pudo desactivarse el Tipo de Equipo", "error");
                                    } else if (resultado == "false") {
                                        swal("Ey!", "El Tipo de Equipo seleccionada se ha desactivado con éxito", "success").then((result) => {
                                            GetTipoEquipo();
                                            /* if (result.value === true) {
                                                window.location.href = 'TiposdeEquipos.html'
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
                        title: "¿Está seguro de Activar el Tipo de Equipo?",
                        text: "" + dataE.Nombre_Activo + "",
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
                                    Id_Tipo_Activo: dataE.Id_Tipo_Activo,
                                    Nombre_Activo: dataE.Nombre_Activo,
                                    Id_Estado: dataE.Id_Estado == "Activo" ? "0" : "1"
                                });

                                var requestOptions = {
                                    method: 'POST',
                                    headers: myHeaders,
                                    body: raw,
                                    redirect: 'follow'
                                };
                                fetch(Url_Backend + "ActualizarTipoEquipo", requestOptions)
                                    .then(response => response.text(
                                    ))
                                    .then(result => {
                                        var resultado = result;
                                        if (resultado != "false") {
                                            swal("Upps!", "No pudo activarse el Tipo de Equipo", "error");
                                        } else if (resultado == "false") {
                                            swal("Ey!", "El Tipo de Equipo seleccionado se ha activado con éxito", "success").then((result) => {
                                                GetTipoEquipo();
                                                /*if (result.value === true) {
                                                    window.location.href = 'TiposdeEquipos.html'
                                                }*/
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
            function EditPuesto(data) {
                $("#GSCCModal2").modal("show");
                document.getElementById("IdActu").value = data.Id_Tipo_Activo;
                document.getElementById("NombreActu").value = data.Nombre_Activo;
                if (data.Id_Estado == "Inactivo") {
                    document.getElementById("EstadoActu").value = "0";
                } else if (data.Id_Estado == "Activo") {
                    document.getElementById("EstadoActu").value = "1";
                }
                if (data.ProcesadorRamDisco == "SI") {
                    document.getElementById("ProcesadorRamDiscoActu").value = "1";
                } else {
                    document.getElementById("ProcesadorRamDiscoActu").value = "0";
                }
            }

        },
        error: function (error) {
            swal("Upps!", "Error al obtener los datos de el Tipo de Equipo: " + error, "error");
        },
        timeout: 300000
    });

};


function GuardarTipoEquipo() {
    ObtenerToken(User.Identificacion_Usuario, User.Password);
    var NombreAgre = $("#NombreAgre").val();
    var ContieneAgre = $("#ProcesadorRamDiscoAgre").val();

    if (NombreAgre == "" || ContieneAgre == "") {
        toastr.error('Es obligatorio llenar todos los campos');
        return false;
    }
    var Param = {
        Id_Tipo_Activo: '0',
        Nombre_Activo: NombreAgre,
        ProcesadorRamDisco: ContieneAgre,
        Id_Estado: '1'
    };
    $.ajax({
        url: Url_Backend + "GuardarTipoEquipo",
        type: "POST",
        dataType: "json",
        contentType: "application/x-www-form-urlencoded; charset=utf-8",
        headers: {
            'Authorization': token_type + ' ' + access_token
        },
        data: Param,
        async: false,
        beforeSend: function () { },
        success: function (response) {
            swal("Bien!", "El Tipo de Equipo fue agregado correctamente", "success");
            $("#GSCCModal").modal("hide");
            Inicializador();
        },
        error: function (err) {
            swal("Ey!", "Error al agregar el Tipo de Equipo: " + err, "error");
        },
        timeout: 300000,
    });
};

function EditarPuesto() {
    $("#GSCCModal2").modal("show");
}

function ActualizarTipoEquipo() {
    ObtenerToken(User.Identificacion_Usuario, User.Password);
    var IdActu = $("#IdActu").val();
    var NombreActu = $("#NombreActu").val();
    var EstadoActu = $("#EstadoActu").val();
    var ContieneActu = $("#ProcesadorRamDiscoActu").val();

    if (NombreActu == "" || ContieneActu == "") {
        toastr.error('Es obligatorio llenar todos los campos');
        return false;
    }
    var Param = {
        Id_Tipo_Activo: IdActu,
        Nombre_Activo: NombreActu,
        Id_Estado: EstadoActu,
        ProcesadorRamDisco: ContieneActu
    };
    $.ajax({
        url: Url_Backend + "ActualizarTipoEquipo",
        type: "POST",
        dataType: "json",
        contentType: "application/x-www-form-urlencoded; charset=utf-8",
        headers: {
            'Authorization': token_type + ' ' + access_token
        },
        data: Param,
        async: false,
        beforeSend: function () { },
        success: function (response) {
            swal("Bien!", "El Tipo de Equipo fue actualizada correctamente", "success");
            $("#GSCCModal2").modal("hide");
            Inicializador();
        },
        error: function (err) {
            swal("Ey!", "Error al actualizar el Tipo de Equipo: " + err, "error");
        },
        timeout: 300000,
    });
};

