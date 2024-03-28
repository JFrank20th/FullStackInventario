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
    GetCargos();
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
function GetCargos() {
    ObtenerToken(User.Identificacion_Usuario, User.Password)
    $.ajax({
        url: Url_Backend + "GetCargos",
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
                    "title": "Cargo",
                    "data": "Cargo"
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
                    <span style="color:#0532fa" class="material-symbols-outlined">task_alt</span>
                    </a>` : ''}
                    `
                }];

            if ($.fn.dataTable.isDataTable('#TablaCargo')) {
                TablaCargo.destroy();
            }
            TablaCargo = $("#TablaCargo").DataTable({
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
            $("#TablaCargo tbody").on("click", "a.editar", function () {
                var dataEditar = TablaCargo.row($(this).parents("tr")).data();
                EditCargo(dataEditar);

            });

            //Obtener datos al darle click en eliminar
            $("#TablaCargo tbody").on("click", "a.eliminar", function () {
                var dataEliminar = TablaCargo.row($(this).parents("tr")).data();
                desactivarMarcas(dataEliminar);

            });

            //Funcion desactivar
            function desactivarMarcas(dataE) {
                if (dataE.Id_Estado == "Activo") {
                    swal({
                        title: "¿Está seguro de Desactivar el Cargo?",
                        text: "" + dataE.Cargo + "",
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
                                    Id_Cargo: dataE.Id_Cargo,
                                    Cargo: dataE.Cargo,
                                    Id_Estado: dataE.Id_Estado == "Activo" ? "0" : "1"
                                });

                                var requestOptions = {
                                    method: 'POST',
                                    headers: myHeaders,
                                    body: raw,
                                    redirect: 'follow'
                                };
                                fetch(Url_Backend + "ActualizarCargos", requestOptions).then(response => response.text(
                                )).then(result => {
                              
                                    var resultado = result;
                                    if (resultado != "false") {
                                        swal("Upps!", "No pudo desactivarse el Cargo", "error");
                                    } else if (resultado == "false") {
                                        swal("Ey!", "El Cargo seleccionado se ha desactivado con éxito", "success").then((result) => {
                                            GetCargos();
                                          /*  if (result.value === true) {
                                                window.location.href = 'Cargos.html'
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
                        title: "¿Está seguro de Activar el Cargo?",
                        text: "" + dataE.Cargo + "",
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
                                    Id_Cargo: dataE.Id_Cargo,
                                    Cargo: dataE.Cargo,
                                    Id_Estado: dataE.Id_Estado == "Activo" ? "0" : "1"
                                });

                                var requestOptions = {
                                    method: 'POST',
                                    headers: myHeaders,
                                    body: raw,
                                    redirect: 'follow'
                                };
                                fetch(Url_Backend + "ActualizarCargos", requestOptions)
                                    .then(response => response.text(
                                    ))
                                    .then(result => {
                                        var resultado = result;
                                        if (resultado != "false") {
                                            swal("Upps!", "No pudo activarse el Cargo", "error");
                                        } else if (resultado == "false") {
                                            swal("Ey!", "El Cargo seleccionado se ha activado con éxito", "success").then((result) => {
                                                GetCargos();
                                                if (result.value == true) {
                                                  
                                                  //  window.location.reload = 'Cargos.html'
                                                }
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
            function EditCargo(data) {
                $("#GSCCModal2").modal("show");
                document.getElementById("IdActu").value = data.Id_Cargo;
                document.getElementById("CargoActu").value = data.Cargo;
                if (data.Id_Estado == "Inactivo") {
                    document.getElementById("EstadoActu").value = "0";
                } else if (data.Id_Estado == "Activo") {
                    document.getElementById("EstadoActu").value = "1";
                }
            }

        },
        error: function (error) {
            swal("Upps!", "Error al obtener los datos de los Cargos: " + error, "error");
        },
        timeout: 300000
    });

};


$("#AddCargo").click(function () {
    GuardarCargos();
});

function GuardarCargos() {
    ObtenerToken(User.Identificacion_Usuario, User.Password);
    var CargoAgre = $("#CargoAgre").val();

    if (CargoAgre == "") {
        swal("Ey!", "Es obligatorio llenar los campos", "error");
        return false;
    }
    $(".preloader").show();
    var Param = {
        Id_Cargo: '0',
        Cargo: CargoAgre,
        Id_Estado: '1'
    };
    $.ajax({
        url: Url_Backend + "GuardarCargos",
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
            swal("Bien!", "El Cargo fue agregada correctamente", "success").then((result) => {
                GetCargos();
               /* if (result.value == true) {
                    window.location.href = 'Cargos.html'
                }*/
            });
        },
        error: function (err) {
            $(".preloader").hide();
            swal("Ey!", "Error al agregar el Cargo: " + err, "error");
        },
        timeout: 300000,
    });
};

function EditarCargo() {
    $("#GSCCModal2").modal("show");
}

$("#ActualizarCargo").click(function () {
    ActualizarCargo();
});

function ActualizarCargo() {
    ObtenerToken(User.Identificacion_Usuario, User.Password);
    var IdActu = $("#IdActu").val();
    var CargoActu = $("#CargoActu").val();
    var EstadoActu = $("#EstadoActu").val();

    if (CargoActu == "") {
        swal("Ey!", "Es obligatorio llenar los campos", "error");
        return false;
    }
    $(".preloader").show();
    var Param = {
        Id_Cargo: IdActu,
        Cargo: CargoActu,
        Id_Estado: EstadoActu
    };
    $.ajax({
        url: Url_Backend + "ActualizarCargos",
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
            swal("Bien!", "El Cargo fue actualizado correctamente", "success").then((result) => {
                GetCargos();
               /* if (result.value == true) {
                    window.location.href = 'Cargos.html'
                }*/
            });
        },
        error: function (err) {
            $(".preloader").hide();
            swal("Ey!", "Error al actualizar el Cargo: " + err, "error");
        },
        timeout: 300000,
    });
};
