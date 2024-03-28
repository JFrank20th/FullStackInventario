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
    GetCentroCosto();

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
        url: Url_Backend + "Get_Modulo_Operaciones?Role=" + User.Id_Rol + "&Modulo=Centros de Costos" ,
        beforeSend: function () { },
        success: function (response) {
            OperacionesMain = response;
        },
        error: function (err) { },
        timeout: 300000,
    });
};

//Tabla de Usuarios
function GetCentroCosto() {
    ObtenerToken(User.Identificacion_Usuario, User.Password)
    $.ajax({
        url: Url_Backend + "GetCeCo",
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
                `);
            }

            Tablecolumns = [
                {
                    "title": "Id",
                    "data": "id_ceco"
                },
                {
                    "title": "Centro de Costo",
                    "data": "ceco"
                },
                {
                    "title": "Nombre",
                    "data": "name_ceco"
                }];

            if ($.fn.dataTable.isDataTable('#TablaCostos')) {
                TablaCostos.destroy();
            }
            TablaCostos = $("#TablaCostos").DataTable({
                pageLength: 10,
                lengthMenu: [
                    [10, 20, 30, -1],
                    [10, 20, 30, "Todos"]
                ],
                data: response,
                columns: Tablecolumns,
                select: true,
                // fnRowCallback: function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
                //     if (aData.Id_Estado == "Activo") {
                //         var svg = $(nRow).find('.eliminar span');
                //         var nuevoSVG = '\
                //             <span style="color:#597e8d" class="material-symbols-outlined">cancel</span>';
                //         svg.html(nuevoSVG);
                //         $('.eliminar', nRow).attr('title', 'Inactivar');
                //     };
                // },
            });

            //Obtener datos al darle click en editar
            // $("#TablaCostos tbody").on("click", "a.editar", function () {
            //     var dataEditar = TablaCostos.row($(this).parents("tr")).data();
            //     EditCentro(dataEditar);

            // });

            //Obtener datos al darle click en eliminar
            // $("#TablaCostos tbody").on("click", "a.eliminar", function () {
            //     var dataEliminar = TablaCostos.row($(this).parents("tr")).data();
            //     desactivarCentro(dataEliminar);

            // });

            //Funcion desactivar
            // function desactivarCentro(dataE) {
            //     if (dataE.Id_Estado == "Activo") {
            //         swal({
            //             title: "¿Está seguro de Desactivar el Centro de Costo?",
            //             text: "" + dataE.Centro_Costo + "",
            //             icon: "warning",
            //             buttons: true,
            //             dangerMode: true,
            //         })
            //             .then((willDelete) => {
            //                 if (willDelete) {

            //                     var myHeaders = new Headers();
            //                     myHeaders.append("Content-Type", "application/json");
            //                     myHeaders.append("Authorization", token_type + " " + access_token);

            //                     var raw = JSON.stringify({
            //                         Id_Centro_Costos: dataE.Id_Centro_Costos,
            //                         Centro_Costo: dataE.Centro_Costo,
            //                         Id_Estado: dataE.Id_Estado == "Activo" ? "0" : "1"
            //                     });

            //                     var requestOptions = {
            //                         method: 'POST',
            //                         headers: myHeaders,
            //                         body: raw,
            //                         redirect: 'follow'
            //                     };
            //                     fetch(Url_Backend + "ActualizarCentroCostos", requestOptions).then(response => response.text(
            //                     )).then(result => {
            //                         var resultado = result;
            //                         if (resultado != "false") {
            //                             swal("Upps!", "No pudo desactivarse el Centro de costo", "error");
            //                         } else if (resultado == "false") {
            //                             swal("Ey!", "El Centro de costo seleccionado se ha desactivado con éxito", "success").then((result) => {
            //                                 if (result.value === true) {
            //                                     window.location.href = 'CentrosdeCostos.html'
            //                                 }
            //                             });
            //                         } else {
            //                             alert("")
            //                         }
            //                     })
            //                         .catch(error => console.log('error', error));

            //                 } else {
            //                     return false;
            //                 }
            //             });
            //     } else {
            //         swal({
            //             title: "¿Está seguro de Activar el Centro de costo?",
            //             text: "" + dataE.Centro_Costo + "",
            //             icon: "warning",
            //             buttons: true,
            //             dangerMode: true,
            //         })
            //             .then((willDelete) => {
            //                 if (willDelete) {

            //                     var myHeaders = new Headers();
            //                     myHeaders.append("Content-Type", "application/json");
            //                     myHeaders.append("Authorization", token_type + " " + access_token);

            //                     var raw = JSON.stringify({
            //                         Id_Centro_Costos: dataE.Id_Centro_Costos,
            //                         Centro_Costo: dataE.Centro_Costo,
            //                         Id_Estado: dataE.Id_Estado == "Activo" ? "0" : "1"
            //                     });

            //                     var requestOptions = {
            //                         method: 'POST',
            //                         headers: myHeaders,
            //                         body: raw,
            //                         redirect: 'follow'
            //                     };
            //                     fetch(Url_Backend + "ActualizarCentroCostos", requestOptions)
            //                         .then(response => response.text(
            //                         ))
            //                         .then(result => {
            //                             var resultado = result;
            //                             if (resultado != "false") {
            //                                 swal("Upps!", "No pudo activarse el Centro de costo", "error");
            //                             } else if (resultado == "false") {
            //                                 swal("Ey!", "El Centro de costo seleccionado se ha activado con éxito", "success").then((result) => {
            //                                     if (result.value === true) {
            //                                         window.location.href = 'CentrosdeCostos.html'
            //                                     }
            //                                 });
            //                             } else {
            //                                 alert("")
            //                             }
            //                         })
            //                         .catch(error => console.log('error', error));
            //                 } else {
            //                     // Dijeron que no
            //                     return false;
            //                 }
            //             });
            //     }
            // }

            //Funcion editar
            // function EditCentro(data) {
            //     $("#GSCCModal2").modal("show");
            //     document.getElementById("IdActu").value = data.Id_Centro_Costos;
            //     document.getElementById("CentroActu").value = data.Centro_Costo;
            //     if (data.Id_Estado == "Inactivo") {
            //         document.getElementById("EstadoActu").value = "0";
            //     } else if (data.Id_Estado == "Activo") {
            //         document.getElementById("EstadoActu").value = "1";
            //     }
            // }

        },
        error: function (error) {
            swal("Upps!", "Error al obtener los datos de los Centros de costos: " + error, "error");
        },
        timeout: 300000
    });

};


// $("#AddCentro").click(function () {
//     GuardarCentro();
// });

// function GuardarCentro() {
//     debugger;
//     ObtenerToken(User.Identificacion_Usuario, User.Password);
//     var CentroAgre = $("#CentroAgre").val();

//     if (CentroAgre == "") {
//         swal("Ey!", "Es obligatorio llenar los campos", "error");
//         return false;
//     }

//     var Param = {
//         Id_Centro_Costos: '0',
//         Centro_Costo: CentroAgre,
//         Id_Estado: '1'
//     };
//     $.ajax({
//         url: Url_Backend + "GuardarCentroCostos",
//         type: "POST",
//         dataType: "json",
//         contentType: "application/x-www-form-urlencoded; charset=utf-8",
//         headers: {
//             'Authorization': token_type + ' ' + access_token
//         },
//         data: Param,
//         async: false,
//         beforeSend: function () { },
//         success: function (response) {
//             swal("Bien!", "El Centro de costo fue agregado correctamente", "success").then((result) => {
//                 if (result.value == true) {
//                     window.location.href = 'CentrosdeCostos.html'
//                 }
//             });
//         },
//         error: function (err) {
//             swal("Ey!", "Error al agregar el Centro de costo: " + err, "error");
//         },
//         timeout: 300000,
//     });
// };

// function EditarCentro() {
//     $("#GSCCModal2").modal("show");
// }

// $("#ActualizarCentro").click(function () {
//     ActualizarCentro();
// });

// function ActualizarCentro() {
//     debugger;
//     ObtenerToken(User.Identificacion_Usuario, User.Password);
//     var IdActu = $("#IdActu").val();
//     var CentroActu = $("#CentroActu").val();
//     var EstadoActu = $("#EstadoActu").val();

//     if (CentroActu == "") {
//         swal("Ey!", "Es obligatorio llenar los campos", "error");
//         return false;
//     }

//     var Param = {
//         Id_Centro_Costos: IdActu,
//         Centro_Costo: CentroActu,
//         Id_Estado: EstadoActu
//     };

//     $.ajax({
//         url: Url_Backend + "ActualizarCentroCostos",
//         type: "POST",
//         dataType: "json",
//         contentType: "application/x-www-form-urlencoded; charset=utf-8",
//         headers: {
//             'Authorization': token_type + ' ' + access_token
//         },
//         data: Param,
//         async: false,
//         beforeSend: function () { },
//         success: function (response) {
//             swal("Bien!", "El Centro de costo fue actualizado correctamente", "success").then((result) => {
//                 if (result.value == true) {
//                     window.location.href = 'CentrosdeCostos.html'
//                 }
//             });
//         },
//         error: function (err) {
//             swal("Ey!", "Error al actualizar el Centro de costo: " + err, "error");
//         },
//         timeout: 300000,
//     });
// };
