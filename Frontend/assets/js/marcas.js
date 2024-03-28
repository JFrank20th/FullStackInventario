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
    GetMarcas();

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
function GetMarcas() {
    ObtenerToken(User.Identificacion_Usuario, User.Password)
    $.ajax({
        url: Url_Backend + "GetMarca",
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
                    "title": "Marca",
                    "data": "Marca"
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

            if ($.fn.dataTable.isDataTable('#TablaMarca')) {
                TablaMarca.destroy();
            }
            TablaMarca = $("#TablaMarca").DataTable({
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
            $("#TablaMarca tbody").on("click", "a.editar", function () {
                var dataEditar = TablaMarca.row($(this).parents("tr")).data();
                EditMarca(dataEditar);

            });

            //Obtener datos al darle click en eliminar
            $("#TablaMarca tbody").on("click", "a.eliminar", function () {
                var dataEliminar = TablaMarca.row($(this).parents("tr")).data();
                desactivarMarcas(dataEliminar);

            });

            //Funcion desactivar
            function desactivarMarcas(dataE) {
                if (dataE.Id_Estado == "Activo") {
                    swal({
                        title: "¿Está seguro de Desactivar la Marca?",
                        text: "" + dataE.Marca + "",
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
                                    Id_Marca: dataE.Id_Marca,
                                    Marca: dataE.Marca,
                                    Id_Estado: dataE.Id_Estado == "Activo" ? "0" : "1"
                                });

                                var requestOptions = {
                                    method: 'POST',
                                    headers: myHeaders,
                                    body: raw,
                                    redirect: 'follow'
                                };
                                fetch(Url_Backend + "ActualizarMarca", requestOptions).then(response => response.text(
                                )).then(result => {
                                    var resultado = result;
                                    if (resultado != "false") {
                                        swal("Upps!", "No pudo desactivarse la Marca", "error");
                                    } else if (resultado == "false") {
                                        swal("Ey!", "La Marca seleccionado se ha desactivado con éxito", "success").then((result) => {
                                            GetMarcas();
                                            /* if (result.value === true) {
                                                window.location.href = 'Marcas.html'
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
                        title: "¿Está seguro de Activar la Marca?",
                        text: "" + dataE.Marca + "",
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
                                    Id_Marca: dataE.Id_Marca,
                                    Marca: dataE.Marca,
                                    Id_Estado: dataE.Id_Estado == "Activo" ? "0" : "1"
                                });

                                var requestOptions = {
                                    method: 'POST',
                                    headers: myHeaders,
                                    body: raw,
                                    redirect: 'follow'
                                };
                                fetch(Url_Backend + "ActualizarMarca", requestOptions)
                                    .then(response => response.text(
                                    ))
                                    .then(result => {
                                        var resultado = result;
                                        if (resultado != "false") {
                                            swal("Upps!", "No pudo activarse la Marca", "error");
                                        } else if (resultado == "false") {
                                            swal("Ey!", "La Marca seleccionado se ha activado con éxito", "success").then((result) => {
                                                GetMarcas();
                                                /*if (result.value === true) {
                                                    window.location.href = 'Marcas.html'
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
                document.getElementById("IdActu").value = data.Id_Marca;
                document.getElementById("MarcaActu").value = data.Marca;
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


$("#AddMarcas").click(function () {
    GuardarMarcas();
});

function GuardarMarcas() {
    ObtenerToken(User.Identificacion_Usuario, User.Password);
    var MarcaAgre = $("#MarcaAgre").val();

    if (MarcaAgre == "") {
        swal("Ey!", "Es obligatorio llenar los campos", "error");
        return false;
    }

    var Param = {
        Id_Marca: '0',
        Marca: MarcaAgre,
        Id_Estado: '1'
    };
    $(".preloader").show();
    $.ajax({
        url: Url_Backend + "GuardarMarca",
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
            swal("Bien!", "La Marca fue agregada correctamente", "success").then((result) => {
                GetMarcas();
                /*if (result.value == true) {
                    window.location.href = 'Marcas.html'
                }*/
            });
        },
        error: function (err) {
            $(".preloader").hide();
            swal("Ey!", "Error al agregar la Marca: " + err, "error");
        },
        timeout: 300000,
    });
};

function EditarMarca() {
    $("#GSCCModal2").modal("show");
}

$("#ActualizarMarcas").click(function () {
    ActualizarMarcas();
});

function ActualizarMarcas() {
    ObtenerToken(User.Identificacion_Usuario, User.Password);
    var IdActu = $("#IdActu").val();
    var MarcaActu = $("#MarcaActu").val();
    var EstadoActu = $("#EstadoActu").val();

    if (MarcaActu == "") {
        swal("Ey!", "Es obligatorio llenar los campos", "error");
        return false;
    }
    var Param = {
        Id_Marca: IdActu,
        Marca: MarcaActu,
        Id_Estado: EstadoActu
    };
    $(".preloader").show();
    $.ajax({
        url: Url_Backend + "ActualizarMarca",
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
            swal("Bien!", "La marca fue actualizado correctamente", "success").then((result) => {
                GetMarcas();
                /*if (result.value == true) {
                    window.location.href = 'Usuarios.html'
                }*/
            });
        },
        error: function (err) {
            $(".preloader").hide();
            swal("Ey!", "Error al actualizar la Marca: " + err, "error");
        },
        timeout: 300000,
    });
};
