var Url_Backend = "http://localhost:57737/";
//var Url_Backend = window.location.origin + '/inventario/Backend/';
var access_token;
var token_type;
var User;
var OperacionesMain;

//Inicializa
function Inicializador() {
    User = localStorage.getItem("User_Inventarios");
    if (User) {
        User = JSON.parse(atob(User));
        User = User[0];
    } else {
        window.location.assign("index.html");
    };
    ObtenerToken(User.Identificacion_Usuario, User.Password);
    GetProveedores();

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
function GetProveedores() {
    ObtenerToken(User.Identificacion_Usuario, User.Password)
    $.ajax({
        url: Url_Backend + "GetProveedor",
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
                    "title": "Proveedor",
                    "data": "Proveedor"
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

            if ($.fn.dataTable.isDataTable('#TablaProveedor')) {
                TablaProveedor.destroy();
            }
            TablaProveedor = $("#TablaProveedor").DataTable({
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
            $("#TablaProveedor tbody").on("click", "a.editar", function () {
                var dataEditar = TablaProveedor.row($(this).parents("tr")).data();
                EditProveeedor(dataEditar);

            });

            //Obtener datos al darle click en eliminar
            $("#TablaProveedor tbody").on("click", "a.eliminar", function () {
                var dataEliminar = TablaProveedor.row($(this).parents("tr")).data();
                desactivarProveedor(dataEliminar);

            });

            //Funcion desactivar
            function desactivarProveedor(dataE) {
                if (dataE.Id_Estado == "Activo") {
                    swal({
                        title: "¿Está seguro de Desactivar el Proveedor?",
                        text: "" + dataE.Proveedor + "",
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
                                    Id_Proveedor: dataE.Id_Proveedor,
                                    Proveedor: dataE.Proveedor,
                                    Id_Estado: dataE.Id_Estado == "Activo" ? "0" : "1"
                                });

                                var requestOptions = {
                                    method: 'POST',
                                    headers: myHeaders,
                                    body: raw,
                                    redirect: 'follow'
                                };
                                fetch(Url_Backend + "ActualizarProveedor", requestOptions).then(response => response.text(
                                )).then(result => {
                                    var resultado = result;
                                    if (resultado != "false") {
                                        swal("Upps!", "No pudo desactivarse el Proveedor", "error");
                                    } else if (resultado == "false") {
                                        swal("Ey!", "El Proveedor seleccionado se ha desactivado con éxito", "success").then((result) => {
                                            GetProveedores();
                                            /* if (result.value === true) {
                                                window.location.href = 'Proveedores.html'
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
                        title: "¿Está seguro de Activar el Proveedor?",
                        text: "" + dataE.Proveedor + "",
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
                                    Id_Proveedor: dataE.Id_Proveedor,
                                    Proveedor: dataE.Proveedor,
                                    Id_Estado: dataE.Id_Estado == "Activo" ? "0" : "1"
                                });

                                var requestOptions = {
                                    method: 'POST',
                                    headers: myHeaders,
                                    body: raw,
                                    redirect: 'follow'
                                };
                                fetch(Url_Backend + "ActualizarProveedor", requestOptions)
                                    .then(response => response.text(
                                    ))
                                    .then(result => {
                                        var resultado = result;
                                        if (resultado != "false") {
                                            swal("Upps!", "No pudo activarse el Proveedor", "error");
                                        } else if (resultado == "false") {
                                            swal("Ey!", "El Proveedor seleccionado se ha activado con éxito", "success").then((result) => {
                                                GetProveedores();
                                                /*if (result.value === true) {
                                                    window.location.href = 'Proveedores.html'
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
            function EditProveeedor(data) {
                $("#GSCCModal2").modal("show");
                document.getElementById("IdActu").value = data.Id_Proveedor;
                document.getElementById("ProveedorActu").value = data.Proveedor;
                if (data.Id_Estado == "Inactivo") {
                    document.getElementById("EstadoActu").value = "0";
                } else if (data.Id_Estado == "Activo") {
                    document.getElementById("EstadoActu").value = "1";
                }
            }

        },
        error: function (error) {
            swal("Upps!", "Error al obtener los datos de los Proveedores: " + error, "error");
        },
        timeout: 300000
    });

};


$("#AddProveedor").click(function () {
    GuardarProveedor();
});

function GuardarProveedor() {
    ObtenerToken(User.Identificacion_Usuario, User.Password);
    var ProveedorAgre = $("#ProveedorAgre").val();

    if (ProveedorAgre == "") {
        swal("Ey!", "Es obligatorio llenar los campos", "error");
        return false;
    }

    var Param = {
        Id_Proveedor: '0',
        Proveedor: ProveedorAgre,
        Id_Estado: '1'
    };
    $.ajax({
        url: Url_Backend + "GuardarProveedor",
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
            swal("Bien!", "El Proveedor fue agregado correctamente", "success").then((result) => {
                GetProveedores();
                /*  if (result.value == true) {
                    window.location.href = 'Proveedores.html'
                }*/
            });
        },
        error: function (err) {
            swal("Ey!", "Error al agregar el Proveedor: " + err, "error");
        },
        timeout: 300000,
    });
};

function EditarProveeedor() {
    $("#GSCCModal2").modal("show");
}

$("#ActualizarProveedor").click(function () {
    ActualizarProveedor();
});

function ActualizarProveedor() {
    ObtenerToken(User.Identificacion_Usuario, User.Password);
    var IdActu = $("#IdActu").val();
    var ProveedorActu = $("#ProveedorActu").val();
    var EstadoActu = $("#EstadoActu").val();

    if (ProveedorActu == "") {
        swal("Ey!", "Es obligatorio llenar los campos", "error");
        return false;
    }

    var Param = {
        Id_Proveedor: IdActu,
        Proveedor: ProveedorActu,
        Id_Estado: EstadoActu
    };

    $.ajax({
        url: Url_Backend + "ActualizarProveedor",
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
            swal("Bien!", "El Proveedor fue actualizado correctamente", "success").then((result) => {
                GetProveedores();
                /*if (result.value == true) {
                    window.location.href = 'Proveedores.html'
                }*/
            });
        },
        error: function (err) {
            swal("Ey!", "Error al actualizar el Proveedor: " + err, "error");
        },
        timeout: 300000,
    });
};
