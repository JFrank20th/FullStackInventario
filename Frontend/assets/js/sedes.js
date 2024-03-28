var Url_Backend = "http://localhost:57737/";//Prueba commit
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
    GetSedes();
    GetCiudades();

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
function GetSedes() {
    ObtenerToken(User.Identificacion_Usuario, User.Password)
    $.ajax({
        url: Url_Backend + "GetSedes",
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
                    "title": "Sede",
                    "data": "Id_Sede"
                },
                {
                    "title": "Ciudad",
                    "data": "Ciudad"
                },
                {
                    "title": "Direccion",
                    "data": "Direccion"
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

            if ($.fn.dataTable.isDataTable('#TablaSedes')) {
                TablaSedes.destroy();
            }
            TablaSedes = $("#TablaSedes").DataTable({
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
            $("#TablaSedes tbody").on("click", "a.editar", function () {
                var dataEditar = TablaSedes.row($(this).parents("tr")).data();
                EditMarca(dataEditar);

            });

            //Obtener datos al darle click en eliminar
            $("#TablaSedes tbody").on("click", "a.eliminar", function () {
                var dataEliminar = TablaSedes.row($(this).parents("tr")).data();
                desactivarSedes(dataEliminar);

            });

            //Funcion desactivar
            function desactivarSedes(dataE) {
                if (dataE.Id_Estado == "Activo") {
                    swal({
                        title: "¿Está seguro de Desactivar la Sede?",
                        text: "" + dataE.Id_Sede + "",
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
                                    Id_Sede: dataE.Id_Sede,
                                    Id_Departamento: dataE.Id_Departamento,
                                    Departamento: '0',
                                    Direccion: dataE.Direccion,
                                    Id_Ciudad: dataE.Id_Ciudad,
                                    Ciudad: '0',
                                    Id_Estado: dataE.Id_Estado == "Activo" ? "0" : "1"
                                });

                                var requestOptions = {
                                    method: 'POST',
                                    headers: myHeaders,
                                    body: raw,
                                    redirect: 'follow'
                                };
                                fetch(Url_Backend + "ActualizarSedes", requestOptions).then(response => response.text(
                                )).then(result => {
                                    var resultado = result;
                                    if (resultado != "false") {
                                        swal("Upps!", "No pudo desactivarse la Sede", "error");
                                    } else if (resultado == "false") {
                                        swal("Ey!", "La Sede seleccionada se ha desactivado con éxito", "success").then((result) => {
                                            GetSedes();
                                            /*if (result.value === true) {
                                                window.location.href = 'Sedes.html'
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
                        title: "¿Está seguro de Activar la Sede?",
                        text: "" + dataE.Id_Sede + "",
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
                                    Id_Sede: dataE.Id_Sede,
                                    Direccion: dataE.Direccion,
                                    Id_Ciudad: dataE.Id_Ciudad,
                                    Ciudad: '0',
                                    Id_Estado: dataE.Id_Estado == "Activo" ? "0" : "1"
                                });

                                var requestOptions = {
                                    method: 'POST',
                                    headers: myHeaders,
                                    body: raw,
                                    redirect: 'follow'
                                };
                                fetch(Url_Backend + "ActualizarSedes", requestOptions)
                                    .then(response => response.text(
                                    ))
                                    .then(result => {
                                        var resultado = result;
                                        if (resultado != "false") {
                                            swal("Upps!", "No pudo activarse la Sede", "error");
                                        } else if (resultado == "false") {
                                            swal("Ey!", "La Sede seleccionado se ha activado con éxito", "success").then((result) => {
                                                GetSedes();
                                                /*if (result.value === true) {
                                                    window.location.href = 'Sedes.html'
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
            function EditMarca(data) {
                $("#GSCCModal2").modal("show");
                document.getElementById("SedeActu").value = data.Id_Sede;
                //document.getElementById("CiudadActu").value = data.Id_Ciudad;
                document.getElementById("DireccionActu").value = data.Direccion;

                if (data.Id_Estado == "Inactivo") {
                    document.getElementById("EstadoActu").value = "0";
                } else if (data.Id_Estado == "Activo") {
                    document.getElementById("EstadoActu").value = "1";
                }

                ObtenerToken(User.Identificacion_Usuario, User.Password)
                $.ajax({
                    url: Url_Backend + 'GetCiudad',
                    type: 'GET',
                    contentType: 'application/json',
                    headers: {
                        'Authorization': token_type + ' ' + access_token
                    },
                    async: false,
                    success: function (response) {
                        $("#CiudadActu").empty();
                        for (var i = 0; i < response.length; i++) {
                            $("#CiudadActu").append("<option value='" + response[i].Id_Ciudad + "'>" + response[i].Ciudad + " </option>");
                        }
                        $("#CiudadActu").val(data.Id_Ciudad);
                    },
                    error: function (err) { },
                    timeout: 300000
                });

            }

        },
        error: function (error) {
            swal("Upps!", "Error al obtener los datos de las Sedes: " + error, "error");
        },
        timeout: 300000
    });

};


$("#AddSede").click(function () {
    GuardarSede();
});

function GuardarSede() {
    ObtenerToken(User.Identificacion_Usuario, User.Password);
    var SedeAgre = $("#SedeAgre").val();
    var CiudadAgre = $("#CiudadAgre").val();
    var DepartamentoAgre = $("#DepartamentoAgre").val();
    var Direcciongre = $("#Direcciongre").val();

    if (SedeAgre == "" || CiudadAgre == "" || DepartamentoAgre == "" || Direcciongre == "") {
        swal("Ey!", "Es obligatorio llenar los campos", "error");
        return false;
    }

    var Param = {
        Id_Sede: SedeAgre,
        Direccion: Direcciongre,
        Id_Ciudad: CiudadAgre,
        Ciudad: '0',
        Id_Estado: '1'
    };
    $.ajax({
        url: Url_Backend + "GuardarSedes",
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
            swal("Bien!", "La Sede fue agregada correctamente", "success").then((result) => {
                GetSedes();
                /*if (result.value == true) {
                    window.location.href = 'Sedes.html'
                }*/
            });
        },
        error: function (err) {
            swal("Ey!", "Error al agregar la Sede: " + err, "error");
        },
        timeout: 300000,
    });
};

function EditarMarca() {
    $("#GSCCModal2").modal("show");
}

$("#ActualizarSedes").click(function () {
    ActualizarSedes();
});

function ActualizarSedes() {
    ObtenerToken(User.Identificacion_Usuario, User.Password);
    var SedeActu = $("#SedeActu").val();
    var CiudadActu = $("#CiudadActu").val();
    var DepartamentoActu = $("#DepartamentoActu").val();
    var DireccionActu = $("#DireccionActu").val();
    var EstadoActu = $("#EstadoActu").val();

    if (CiudadActu == "" || DepartamentoActu =="" || DireccionActu =="") {
        swal("Ey!", "Es obligatorio llenar los campos", "error");
        return false;
    }

    var Param = {
        Id_Sede: SedeActu,
        Direccion: DireccionActu,
        Id_Ciudad: CiudadActu,
        Ciudad: '0',
        Id_Estado: EstadoActu
    };
    $.ajax({
        url: Url_Backend + "ActualizarSedes",
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
            swal("Bien!", "La Sede fue actualizada correctamente", "success").then((result) => {
                GetSedes();
                /*if (result.value == true) {
                    window.location.href = 'Sedes.html'
                }*/
            });
        },
        error: function (err) {
            swal("Ey!", "Error al actualizar la Sede: " + err, "error");
        },
        timeout: 300000,
    });
};

function GetCiudades() {
    ObtenerToken(User.Identificacion_Usuario, User.Password)
    $.ajax({
        url: Url_Backend + 'GetCiudad',
        type: 'GET',
        contentType: 'application/json',
        headers: {
            'Authorization': token_type + ' ' + access_token
        },
        async: false,
        success: function (response) {
            $("#CiudadAgre").empty();
            $("#CiudadAgre").append("<option value='' selected disable hidden>Elegir...</option>");
            for (var i = 0; i < response.length; i++) {
                $("#CiudadAgre").append("<option value='" + response[i].Id_Ciudad + "'>" + response[i].Ciudad + " </option>");
            }
        },
        error: function (err) { },
        timeout: 300000
    });
}