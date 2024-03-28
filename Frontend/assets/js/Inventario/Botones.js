var Url_Backend = "http://localhost:57737/";
//var Url_Backend = window.location.origin + '/inventario/Backend/';

var CheckboxAllGlobal;
var DevProveedorGlobal;
var AsignarGlobal;
var DesasignarGlobal;
var HomeOfficeGloal;
var TipoCheckDevProveedor;
var TipoCheckHomeOffice;
var CheckBoxSeleccionados;
var CheckBoxSeleccionadosHomeOffice;
var User

$(document).ready(function () {
    User = localStorage.getItem("User_Inventarios");
    if (User) {
        User = JSON.parse(atob(User));
        User = User[0];
    } else {
        window.location.assign("index.html");
    };
    GetAcciones();
});

//Obtener permisos de las acciones
function GetAcciones() {
    $.ajax({
        type: "GET",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        headers: {
            Authorization: token_type + " " + access_token,
        },
        async: false,
        url: Url_Backend + "GetAcciones?Role=" + User.Id_Rol,
        beforeSend: function () { },
        success: function (response) {
            let Descargar = response.filter(item => item.Accion === 'Descargar').length > 0 ? true : false
            let Agregar = response.filter(item => item.Accion === 'Agregar').length > 0 ? true : false

            let Agregar_Masivo = response.filter(item => item.Accion === 'Agregar_Masivo').length > 0 ? true : false
            let Modificar_Masivo = response.filter(item => item.Accion === 'Modificar_Masivo').length > 0 ? true : false
            let DevProveedor_Masivo = response.filter(item => item.Accion === 'DevProveedor_Masivo').length > 0 ? true : false
            let Desasignar_Masivo = response.filter(item => item.Accion === 'Desasignar_Masivo').length > 0 ? true : false
            let Asignar_Masivo = response.filter(item => item.Accion === 'Asignar_Masivo').length > 0 ? true : false
            let HomeOffice_Masivo = response.filter(item => item.Accion === 'HomeOffice_Masivo').length > 0 ? true : false

            DevProveedorGlobal = DevProveedor_Masivo;
            AsignarGlobal = Asignar_Masivo
            DesasignarGlobal = Desasignar_Masivo
            HomeOfficeGloal = HomeOffice_Masivo
            // ========================================== Botones Admin ========================================== //
            $("#divBotonesAdmin").empty();
            !Agregar && !Descargar ? $("#divAdmin").hide() : "";
            if (Descargar) {
                $("#divBotonesAdmin").append(`
                <div class="child2 child-1" id="DivDescargar"
                    style="margin-top: -15px; margin-right: -5px; margin-bottom: -10px; margin-left: -5px;">
                    <button id="DescargarInventarioBtn" class="button2 btn-1"
                        onclick="tableToExcel()"
                        title="Descargar todo el Inventario" data-toggle="tooltip">
                        <span style="color:#0004ff; margin-top: 10px;"
                            class="material-symbols-outlined">cloud_download</span>
                    </button>
                </div>
                `);
            }
            if (Agregar) {
                $("#divBotonesAdmin").append(`
                <div class="child2 child-2" id="DivAgregar"
                    style="margin-top: -15px; margin-right: -5px; margin-bottom: -10px; ">
                    <button id="BotonAgregarInv" class="button2 btn-2 " onclick="BotonAgregarInventarios()"
                        title="Agregar al Inventario" data-toggle="tooltip"
                        data-toggle="modal" data-target=".bd-example-modal-xl">
                        <span style="color:#9a00c9; margin-top: 10px;"
                            class="material-symbols-outlined">box_add</span>
                    </button>
                </div>
                `);
            }

            // ========================================== Botones Masivos ========================================== //
            $("#divBotonesMasivo").empty();
            !Agregar_Masivo && !Modificar_Masivo &&
                !DevProveedor_Masivo && !Desasignar_Masivo &&
                !Asignar_Masivo && !HomeOffice_Masivo ? $("#divMasivo").hide() : "";
            if (Agregar_Masivo) {
                $("#divBotonesMasivo").append(`
                <div class="child2 child-1" id="DivAgregarMasivo"
                    style="margin-top: -15px; margin-right: -5px; margin-bottom: -10px; margin-left: -5px;">
                    <button id="CargarInventarioBtn" class="button2 btn-1"
                        title="Agregar masivamente al Inventario"
                        data-toggle="tooltip"
                        onclick="SelectorMasivo('CargarInventarioBtn')">
                        <span style="color:#b31b00; margin-top: 10px;"
                            class="material-symbols-outlined">deployed_code_history</span>
                    </button>
                </div>
                `);
            }
            if (Modificar_Masivo) {
                $("#divBotonesMasivo").append(`
                <div class="child2 child-2" id="DivActualizarMasivo"
                    style="margin-top: -15px; margin-right: -5px; margin-bottom: -10px; ">
                    <button id="ActualizarInventarioBtn" class="button2 btn-2"
                        title="Actualizar masivamente el inventario"
                        data-toggle="tooltip"
                        onclick="SelectorMasivo('ActualizarInventarioBtn')">
                        <span style="color:#00b341; margin-top: 10px;"
                            class="material-symbols-outlined">draw</span>
                    </button>
                </div>
                `);
            }
            if (DevProveedor_Masivo) {
                $("#divBotonesMasivo").append(`
                <div class="child2 child-3" id="DivDevProveedorMasivo"
                    style="margin-top: -15px; margin-right: -5px; margin-bottom: -10px; ">
                    <button id="DevolucionProveedorInventarioBtn"
                        class="button2 btn-3"
                        title="Devolver masivamente al proveedor"
                        data-toggle="tooltip"
                        onclick="SelectorMasivo('DevolucionProveedorInventarioBtn')">
                        <span style="color:#7f5345; margin-top: 10px;"
                            class="material-symbols-outlined">rv_hookup</span>
                    </button>
                </div>
                `);
            }
            if (HomeOffice_Masivo) {
                $("#divBotonesMasivo").append(`
                <div class="child2 child-3" id="DivHomeOfficeMasivo"
                    style="margin-top: -15px; margin-right: -5px; margin-bottom: -10px; ">
                    <button id="HomeOfficeInventarioBtnExcel"
                        class="button2 btn-3"
                        title="Home Office Masivo"
                        data-toggle="tooltip">
                        <span style="color:#6f32be; margin-top: 10px;"
                            class="material-symbols-outlined">domain_add</span>
                    </button>
                </div>
                `);
            }
            if (Desasignar_Masivo) {
                $("#divBotonesMasivo").append(`
                <div class="child2 child-4" id="DivDesasignarMasivo"
                    style="margin-top: -15px; margin-right: -5px; margin-bottom: -10px; ">
                    <button id="DesasignacionInventarioBtnExcel"
                        class="button2 btn-4"
                        title="Desasignar masivamente inventario"
                        data-toggle="tooltip">
                        <span style="color:#00abfb; margin-top: 10px;"
                            class="material-symbols-outlined">group_remove</span>
                    </button>
                </div>
                `);
            }
            if (Asignar_Masivo) {
                $("#divBotonesMasivo").append(`
                <div class="child2 child-5" id="DivAsignarMasivo"
                    style="margin-top: -15px; margin-right: -5px; margin-bottom: -10px; ">
                    <button id="AsignacionInventarioBtnExcel" class="button2 btn-5"
                        title="Asignar masivamente inventario"
                        data-toggle="tooltip">
                        <span style="color:#c9de00; margin-top: 10px;"
                            class="material-symbols-outlined">group_add</span>
                    </button>
                </div>
                `);
            }
            

            // ========================================== Botones Checkbox ========================================== //
            $("#divBotonesCheckbox").empty();
            !DevProveedor_Masivo && !Desasignar_Masivo && !Asignar_Masivo && !HomeOffice_Masivo ? $("#ChecboxAll").hide() : "";
            !DevProveedor_Masivo && !Desasignar_Masivo && !Asignar_Masivo && !HomeOffice_Masivo ? window.CheckboxAllGlobal = false : window.CheckboxAllGlobal = true;

            if (Asignar_Masivo) {
                $("#divBotonesCheckbox").append(`
                <div class="child2 child-1" id="DivAsignarChecbox"
                    style="margin-top: -15px; margin-right: -5px; margin-bottom: -10px; margin-left: -5px;">
                    <button id="AsignarChecbox" class="button2 btn-1"
                        title="Asignar inventario seleccionado"
                        data-toggle="tooltip" style="display: none;">
                        <span style="color:#7100b3; margin-top: 10px;"
                            class="material-symbols-outlined">playlist_add_check</span>
                    </button>
                </div>
                `);
            }
            if (Desasignar_Masivo) {
                $("#divBotonesCheckbox").append(`
                <div class="child2 child-2" id="DivDevolverChecbox"
                    style="margin-top: -15px; margin-right: -5px; margin-bottom: -10px; ">
                    <button id="DesasignarChecbox" class="button2 btn-2 "
                        title="Desasignar inventario seleccionado"
                        data-toggle="tooltip" style="display: none;">
                        <span style="color:#ff0000; margin-top: 10px;"
                            class="material-symbols-outlined">playlist_remove</span>
                    </button>
                </div>
                `);
            }
            if (DevProveedor_Masivo) {
                $("#divBotonesCheckbox").append(`
                <div id="ProveedorChecboxDiv" class="child2 child-3"
                    style="margin-top: -15px; margin-right: -5px; margin-bottom: -10px; ">
                    <button id="ProveedorChecbox" class="button2 btn-3"
                        data-toggle="tooltip" style="display: none;">
                        <span id="SpanProveedorChecbox1" hidden="hidden"
                            style="color:#ffc400; margin-top: 10px;"
                            class="material-symbols-outlined">pip_exit</span>
                        <span id="SpanProveedorChecbox2" hidden="hidden"
                            style="color:#06ff2f; margin-top: 10px;"
                            class="material-symbols-outlined">pip</span>
                    </button>
                </div>
                `);
            }
            if (HomeOffice_Masivo) {
                $("#divBotonesCheckbox").append(`
                <div id="HomeOfficeChecboxDiv" class="child2 child-3"
                    style="margin-top: -15px; margin-right: -5px; margin-bottom: -10px; ">
                    <button id="HomeOfficeChecbox" class="button2 btn-3"
                        data-toggle="tooltip" style="display: none;">
                        <span id="SpanHomeOfficeChecbox1" hidden="hidden"
                            style="color:#6f32be; margin-top: 10px;"
                            class="material-symbols-outlined">location_away</span>
                        <span id="SpanHomeOfficeChecbox2" hidden="hidden"
                            style="color:#6f32be; margin-top: 10px;"
                            class="material-symbols-outlined">apartment</span>
                    </button>
                </div>
                `);
            }


        },
        error: function (err) { },
        timeout: 300000,
    });
}

// Controlador de eventos para los checkboxes
$(document).on('change', '.checkbox-select', function () {
    var isChecked = $(this).prop('checked');
    // Verificar si hay algún checkbox marcado
    var anyChecked = $('.checkbox-select:checked').length > 0;
    // Mostrar u ocultar el botón según la condición
    if (anyChecked) {
        //debugger 
        AsignarGlobal ? $('#AsignarChecbox').show() : $('#AsignarChecbox').hide()
        AsignarGlobal ? $('#DivAsignarChecbox').show() : $('#DivAsignarChecbox').hide()
        DesasignarGlobal ? $('#DesasignarChecbox').show() : $('#DesasignarChecbox').hide()
        DesasignarGlobal ? $('#DivDevolverChecbox').show() : $('#DivDevolverChecbox').hide()
        DevProveedorGlobal ? $('#ProveedorChecbox').show() : $('#ProveedorChecbox').hide()
        DevProveedorGlobal ? $('#ProveedorChecboxDiv').show() : $('#ProveedorChecboxDiv').hide()
        HomeOfficeGloal ? $('#HomeOfficeChecbox').show() : $('#HomeOfficeChecbox').hide()
        HomeOfficeGloal ? $('#HomeOfficeChecboxDiv').show() : $('#HomeOfficeChecboxDiv').hide()
        CheckboxAllGlobal ? $('#ChecboxAll').show() : $('#ChecboxAll').hide()

        var siProveedor = 0; noProveedor = 0;
        var siHomeOffice = 0; noHomeOffice = 0;
        var siUsuario = 0; noUsuario = 0;
        $('.checkbox-select:checked').each(function () {
            var rowData = TablaInventario.row($(this).closest('tr')).data();
            if (rowData !== undefined && !$(this).closest('tr').hasClass('thead')) {
                rowData.Dev_Proveedor == "SI" ? siProveedor += 1 : noProveedor += 1;
                rowData.Identificacion_Usuario != null ? siUsuario += 1 : noUsuario += 1;
                rowData.Home_Office == "SI" ? siHomeOffice += 1 : noHomeOffice += 1;
            }
        });

        // Validacion Dev proveedor
        if (siProveedor > 0 && noProveedor > 0) {
            $('#ProveedorChecbox, #ProveedorChecboxDiv').hide();
            TipoCheckDevProveedor = "Invalido"
        } else if (siProveedor == 0 && noProveedor > 0 && DevProveedorGlobal) {
            $('#ProveedorChecbox, #ProveedorChecboxDiv').show();
            $("#SpanProveedorChecbox1").removeAttr("hidden");
            $("#SpanProveedorChecbox2").prop("hidden", true);
            $("#tituloMotivoDevolucion").text("Motivo de Devolución a Proveedor");
            $('#ProveedorChecbox').attr("data-original-title", "Devolver al proveedor inventario seleccionado");
            $("#parrafoMotivoDevolucion").text("Por favor digite el motivo el cual va a hacer la devolucion al proveedor");
            TipoCheckDevProveedor = "SI"
        } else if (siProveedor > 0 && noProveedor == 0 && DevProveedorGlobal) {
            $('#ProveedorChecbox, #ProveedorChecboxDiv').show();
            $("#SpanProveedorChecbox2").removeAttr("hidden");
            $("#SpanProveedorChecbox1").prop("hidden", true);
            $("#tituloMotivoDevolucion").text("Motivo de Recibir a Proveedor");
            $('#ProveedorChecbox').attr("data-original-title", "Recibir del proveedor inventario seleccionado");
            $("#parrafoMotivoDevolucion").text("Por favor digite el motivo el cual va a recibir al proveedor");
            TipoCheckDevProveedor = "NO"
        }

        // Validacion HomeOffice
        if (siHomeOffice > 0 && noHomeOffice > 0) {
            $('#HomeOfficeChecbox, #HomeOfficeChecboxDiv').hide();
            TipoCheckHomeOffice = "Invalido"
        } else if (siHomeOffice == 0 && noHomeOffice > 0 && HomeOfficeGloal) {
            $('#HomeOfficeChecbox, #HomeOfficeChecboxDiv').show();
            $("#SpanHomeOfficeChecbox1").removeAttr("hidden");
            $("#SpanHomeOfficeChecbox2").prop("hidden", true);
            //$("#tituloMotivoDevolucion").text("Motivo de Devolución a HomeOffice");
            $('#HomeOfficeChecbox').attr("data-original-title", "Enviar a HomeOffice inventario seleccionado");
            //$("#parrafoMotivoDevolucion").text("Por favor digite el motivo el cual va a hacer la devolucion al HomeOffice");
            TipoCheckHomeOffice = "SI"
        } else if (siHomeOffice > 0 && noHomeOffice == 0 && HomeOfficeGloal) {
            $('#HomeOfficeChecbox, #HomeOfficeChecboxDiv').show();
            $("#SpanHomeOfficeChecbox2").removeAttr("hidden");
            $("#SpanHomeOfficeChecbox1").prop("hidden", true);
            //$("#tituloMotivoDevolucion").text("Motivo de Recibir a HomeOffice");
            $('#HomeOfficeChecbox').attr("data-original-title", "Regreso de HomeOffice inventario seleccionado");
            //$("#parrafoMotivoDevolucion").text("Por favor digite el motivo el cual va a recibir al HomeOffice");
            TipoCheckHomeOffice = "NO"
        }

    } else {
        $('#AsignarChecbox, #DesasignarChecbox, #DivDevolverChecbox, #DivAsignarChecbox, #ProveedorChecbox, #ProveedorChecboxDiv, #ChecboxAll').hide();
    };
});

//Obtener los datos de los checkbox seleccionados y dar click al boton de Devolver a proveedor
$(document).on('click', '#ProveedorChecbox', function () {
    var datosSeleccionados = [];
    var datosVacios = false;
    $('.checkbox-select:checked').each(function () {
        var rowData = TablaInventario.row($(this).closest('tr')).data();
        if (rowData.Identificacion_Usuario !== '' && rowData.Identificacion_Usuario !== null) {
            datosVacios = true
        }
        datosSeleccionados.push(rowData);
    });
    if (TipoCheckDevProveedor == "Invalido") {
        swal({ title: "Ha seleccionado recibir y devolver a proveedor, por favor valide.", icon: "error" });
    } else if (datosVacios) {
        swal({ title: "Hay dispositivos que tienen asignacion, por favor valide.", icon: "error" });
    } else if (TipoCheckDevProveedor == "SI" || TipoCheckDevProveedor == "NO") {
        CheckBoxSeleccionados = datosSeleccionados
        $("#DevRecProveedorCheck").removeAttr("hidden");
        $("#DevolucionProveedorUnica").prop("hidden", true);
        $("#ModalDevolucionProveedor").modal("show");
        $("#MotivoDevolucion").val("");
        TipoCheckDevProveedor == "SI" ? $('#DevRecProveedorCheck').text('Devolver') : $('#DevRecProveedorCheck').text('Recibir')
    }
});

function DevolverRecibiMultiple() {
    var motivoDevolucion = $('#MotivoDevolucion').val();
    var textoBoton = $('#DevRecProveedorCheck').text();
    var mensaje, tipo, mensajeSucces
    if (motivoDevolucion.trim() === '') {
        swal({ title: 'El campo "Motivo de Devolución" es obligatorio', icon: "info" });
    } else {
        if (textoBoton == "Devolver") {
            mensaje = "¿Esta seguro de hacer la devolucion al proveedor de los dispositivos seleccionados?";
            mensajeSucces = "Bien! se ha hecho la Devolucion multiple al proveedor de los dispositivos seleccionado!"
            tipo = 1;
        } else {
            mensaje = "¿Esta seguro de Recibir al proveedor los dispositivos seleccionados?";
            mensajeSucces = "Bien! se ha recibido al proveedor multiples dispositivos seleccionados!"
            tipo = 2;
        }
        swal({ title: mensaje, icon: "warning", buttons: true, dangerMode: false, }).then((opcion) => {
            if (opcion) {
                var count = 0;
                for (var key in CheckBoxSeleccionados) {
                    count++;
                    DevolverProveedor(CheckBoxSeleccionados[key], motivoDevolucion, tipo);
                    // Verificar si se ha recorrido todos los elementos
                    if (count === Object.keys(CheckBoxSeleccionados).length) {
                        // Se han recorrido todos los elementos
                        swal(mensajeSucces, { icon: "success" });
                        $('#AsignarChecbox').hide();
                        $('#DesasignarChecbox').hide();
                        $('#ProveedorChecbox').hide();
                        $('#ProveedorChecboxDiv').hide();
                        $('#ChecboxAll').hide();
                        $("#ModalDevolucionProveedor").modal("hide");
                    }
                }
                Inicializadores();
            } else {

                toastr.info('No se aplico ningún cambio.');
            }
        });

    };
};

function DevolverProveedor(datos, motivo, tipo) {
    // tipo = 1 Devolver a proveedor , tipo = 2 Recibir de proveedor
    var Param = {
        Serial: datos.Serial,
        Motivo: motivo,
        char: tipo,
        UserGeneral: User.Identificacion_Usuario
    };
    $.ajax({
        type: "POST",
        dataType: "json",
        contentType: "application/x-www-form-urlencoded; charset=utf-8",
        headers: {
            'Authorization': token_type + ' ' + access_token
        },
        url: Url_Backend + "DevolucionMasivaProveedor",
        data: Param,
        beforeSend: function () { },
        success: function (response) {

        },
        error: function (err) {
        },
        timeout: 300000,
    });
}

function DevolucionUnica() {
    var motivoDevolucion = $('#MotivoDevolucion').val();
    if (motivoDevolucion.trim() === '') {
        toastr.info('El campo "Motivo de devolución" es obligatorio.');
    } else {
        swal({ title: "¿Esta seguro de hacer la devolucion al proveedor del dispositivo seleccionado?", icon: "warning", buttons: true, dangerMode: false, }).then((opcion) => {
            if (opcion) {
                DevolverProveedor(InventarioSeleccionado, motivoDevolucion, 1);
                swal("Bien! se ha hecho la Devolucion al proveedor del inventario seleccionado!", { icon: "success" });
                $("#ModalDevolucionProveedor").modal("hide");
                Inicializadores();
            } else {
                toastr.info('No se aplico ningún cambio.');
            }
        });
    };
};

function RecibirUnica() {
    var motivoDevolucion = $('#MotivoDevolucion').val();
    if (motivoDevolucion.trim() === '') {
        swal({ title: 'El campo "Motivo de Devolución" es obligatorio', icon: "info" });
    } else {
        swal({ title: "¿Esta seguro de Recibir al proveedor el dispositivo seleccionado?", icon: "warning", buttons: true, dangerMode: false, }).then((opcion) => {
            if (opcion) {
                DevolverProveedor(InventarioSeleccionado, motivoDevolucion, 2);
                swal("Bien! se ha hecho la Devolucion al proveedor del inventario seleccionado!", { icon: "success" });
                $("#ModalDevolucionProveedor").modal("hide");
                Inicializadores();
            } else {
                toastr.info('No se aplico ningún cambio.');
            }
        });
    };
};

//Obtener los datos de los checkbox seleccionados y dar click al boton de asignar
$(document).on('click', '#HomeOfficeChecbox', function () {
    var datosSeleccionados = [];
    var datosVacios = false;
    var identificacionUsuarioArray = [];
    $('.checkbox-select:checked').each(function () {
        var rowData = TablaInventario.row($(this).closest('tr')).data();
        if (rowData.Identificacion_Usuario === null) {
            datosVacios = true
        }
        identificacionUsuarioArray.push(rowData.Identificacion_Usuario);
        datosSeleccionados.push(rowData);
    });
    if (identificacionUsuarioArray.length > 1 && !identificacionUsuarioArray.every(function(value) {
        return value === identificacionUsuarioArray[0];
    })) {
        swal({ title: "Los dispositivos seleccionados tienen diferente usuario, por favor valide.", icon: "error" });
    } else if (TipoCheckHomeOffice == "Invalido") {
        swal({ title: "Ha seleccionado Enviar y Regresar de HomeOffice, por favor valide.", icon: "error" });
    } else if (datosVacios) {
        swal({ title: "Hay dispositivos que no tienen asignación, por favor valide.", icon: "error" });
    } else if (TipoCheckHomeOffice == "SI" || TipoCheckHomeOffice == "NO") {
        HomeOffice(datosSeleccionados, User);
        FirmasModales("PlantillaHomeOffice", "DivFirmasHomeOffice");
    }

});

//Obtener los datos de los checkbox seleccionados y dar click al boton de asignar
$(document).on('click', '#AsignarChecbox', function () {
    var datosSeleccionados = [];
    var filasConIdentificacionVacia = [];
    $('.checkbox-select:checked').each(function () {
        var rowData = TablaInventario.row($(this).closest('tr')).data();
        if (rowData != undefined) {
            datosSeleccionados.push(rowData);
            if (rowData.Identificacion_Usuario) {
                filasConIdentificacionVacia.push(rowData);
            }
        }
    });
    if (filasConIdentificacionVacia.length > 0) {
        swal({ title: "Hay dispositivos que ya tienen un usuario asignado, por favor valide. ", icon: "info" });
    } else {
        AsignarInventario(datosSeleccionados, User);
        FirmasModales("PlantillaAsignar", "DivFirmasAsignacion");
    }

});

//Obtener los datos de los checkbox seleccionados y dar click al boton de Devolver dispositivo a inventario
$(document).on('click', '#DesasignarChecbox', function () {
    var datosSeleccionados = [];
    var identificacionesRepetidas = [];
    var datosDiferentes = false;
    var datosVacios = false;
    $('.checkbox-select:checked').each(function () {
        var rowData = TablaInventario.row($(this).closest('tr')).data();
        if (rowData != undefined) {
            if (!rowData.Identificacion_Usuario || rowData.Identificacion_Usuario.trim() === '') {
                datosVacios = true
            }
            datosSeleccionados.push(rowData);
            if (rowData.Identificacion_Usuario && !identificacionesRepetidas.includes(rowData.Identificacion_Usuario)) {
                identificacionesRepetidas.push(rowData.Identificacion_Usuario);
            };
        }
    });
    if (identificacionesRepetidas.length > 1) {
        var primerDato = identificacionesRepetidas[0];
        for (var i = 1; i < identificacionesRepetidas.length; i++) {
            if (identificacionesRepetidas[i] !== primerDato) {
                datosDiferentes = true;
                break;
            };
        };
    };
    if (datosDiferentes) {
        swal({ title: "Hay dispositivos que tienen mas de una identificacion, por favor valide. ", icon: "error" });
    } else if (datosVacios) {
        swal({ title: "Hay dispositivos que no tienen asignacion.", icon: "error" });
    } else {
        DevolverInventario(datosSeleccionados, User);
        FirmasModales("PlantillaDevolver", "DivFirmasDevolucion");

    };
});

//Dar click en el boton Asignacion inventario por medio de excel
$(document).on('click', '#AsignacionInventarioBtnExcel', function () {
    AsignarInventarioExcel(window.DatosInventario, User);
    FirmasModales("PlantillaAsignarExcel", "DivFirmasAsignacionExcel");
});

//Dar click en el boton desasignar inventario por medio de excel
$(document).on('click', '#DesasignacionInventarioBtnExcel', function () {
    DesasignarInventarioExcel(window.DatosInventario, User);
    FirmasModales("PlantillaDesasignarExcel", "DivFirmasDesasignarExcel");
});

//Dar click en el boton desasignar inventario por medio de excel
$(document).on('click', '#HomeOfficeInventarioBtnExcel', function () {
    HomeOfficeExcel(window.DatosInventario, User);
    FirmasModales("PlantillaHomeOfficeExcel", "DivFirmasHomeOfficeExcel");
});