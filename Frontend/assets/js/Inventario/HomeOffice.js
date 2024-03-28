var Url_Backend = "http://localhost:57737/";
//var Url_Backend = window.location.origin + '/inventario/Backend/';
var FormularioEnvDevHomeOffice;
var IdPlantillaAsigSeleccionado;
var DatosInv;
var modalAsignarOriginal;
var usuarioGeneral

function HomeOffice(received, usuario) {
    usuarioGeneral = usuario
    DatosInv = received;
    modalAsignarOriginal = $('#ModalHomeOffice').clone();
    $('#ModalHomeOffice').on('hidden.bs.modal', function () {
        $('#ModalHomeOffice').replaceWith(modalAsignarOriginal);
    });
    var mensajeConfirm = DatosInv[0].Home_Office == "SI" ? "¿Esta seguro de hacer el regreso de Home Office: " : "¿Esta seguro de hacer el envio a Home Office: ";
    DatosInv[0].Home_Office == "SI" ? GetPlantillasById(1) : GetPlantillasById(2);
    DatosInv[0].Home_Office == "SI" ? $("#tituloModalHomeOffice").text("Regreso de Home Office") : $("#tituloModalHomeOffice").text("Enviar a Home Office");
    DatosInv[0].Home_Office == "SI" ? $("#TituloPrimerWizard").text("Regresar") : $("#TituloPrimerWizard").text("Enviar");
    DatosInv[0].Home_Office == "SI" ? $("#TextoDetalleHomeOffice").text("Los siguientes son los dispositivos para regresar de Home Office:") : $("#TextoDetalleHomeOffice").text("Los siguientes son los dispositivos para enviar a Home Office");
    DatosInv[0].Home_Office == "SI" ? $("#tituloEnvDevHomeOffice").text("Datos para regresar de Home Office") : $("#tituloEnvDevHomeOffice").text("Datos para enviar a Home Office");


    $("#ModalHomeOffice").modal("show");
    $("#wizard4").steps({
        headerTag: "h3",
        bodyTag: "section",
        autoFocus: true,
        titleTemplate: '<span class="wizard-index">#index#</span> #title#',
        onStepChanging: function (b, a, e) {
            if (a < e) {
                var c = document.getElementById("form1HomeOffice")
                var d = "Firmas"
                if (a === 0) {
                    if (c.checkValidity() === false) {
                        b.preventDefault();
                        b.stopPropagation();
                        c.classList.add("was-validated")
                    } else {
                        TablaDetalleEnvDevHomeOfficeFinal(received)
                        return true
                    }
                } else {
                    if (a === 1) {
                        if (d === false) {
                        } else {
                            return true
                        }
                    } else {
                        return true
                    }
                }
            } else { return true }
        },
        onFinished: function (event, currentIndex) {
            const serials = received.map(objeto => objeto.Serial);
            swal({
                title: mensajeConfirm + serials.join(', ') + "?", icon: "warning", buttons: {
                    cancel: "No, cancelar",
                    confirm: "Sí"
                }, dangerMode: false,
            }).then((opcion) => {
                if (opcion) {
                    $(".preloader").show();
                    var TipodeEnvio = DatosInv[0].Home_Office == "SI" ? "DevHomeOffice" : "EnvHomeOffice";
                    CrearDocumento(FormularioEnvDevHomeOffice, IdPlantillaAsigSeleccionado, TipodeEnvio, DatosInv);
                } else {
                    toastr.info("No se aplico ningun cambio");
                    return false
                }
            });
        }
    })

    $("#PlantillaHomeOffice").on("change", function () {
        IdPlantillaAsigSeleccionado = $(this).find(":selected").data("val");
        $("#tituloEnvDevHomeOffice").css("display", "block");
        $("#DivPlantillaEnvDevHomeOffice").empty();
        $.ajax({
            url: Url_Backend + "GetTokensById?Id_Template=" + $(this).val(),
            type: 'GET',
            contentType: 'application/json',
            headers: {
                'Authorization': token_type + ' ' + access_token
            },
            async: false,
            success: function (response) {
                FormularioEnvDevHomeOffice = response;
                var ArrayNumeroALetras = [];
                for (let i = 0; i < response.length; i++) {
                    var selectorId = (response[i].Token).replace(/\[|\]/g, '') + "UnicoId";
                    var selectorNumALetras = response[i].Numeros_A_Letras != null ? (response[i].Numeros_A_Letras).replace(/\[|\]/g, '') : "";
                    if (response[i].Tipo_Campo == "select") {
                        var OpcionesSeleccion = (response[i].Opciones_Seleccion).split(',');
                        $("#DivPlantillaEnvDevHomeOffice").append(`
                        <div class="col-md-4 mb-3">
                            <label for="${selectorId}">${response[i].Nombre}</label>
                            <select id="${selectorId}" class="form-control" required>
                                <option value="" disabled selected>Seleccione...</option>
                            </select>
                            <div class="valid-feedback"> Correcto! </div>
                            <div class="invalid-feedback"> Completar! </div>
                        </div>
                        `);
                        OpcionesSeleccion.forEach(function (elemento) {
                            $(`#${selectorId}`).append(`
                                <option value=${elemento}>${elemento}</option>
                            `)
                        });
                    } else if (response[i].Tipo_Campo == "firma") {

                    } else if (response[i].Dato_Empleado != null) {
                        $("#DivPlantillaEnvDevHomeOfficeBD").append(`
                        <div class="col-md-${response[i].Numeros_A_Letras != null ? 12 : 4} mb-3">
                            <label for="${response[i].Dato_Empleado}">${response[i].Numeros_A_Letras != null ? response[i].Nombre + " de acuerdo a: " + selectorNumALetras : response[i].Nombre}</label>
                            <input type="${response[i].Tipo_Campo}" class="form-control" id="${response[i].Dato_Empleado}"
                                required ${response[i].Numeros_A_Letras != null ? "disabled" : ""}>
                            <div class="valid-feedback"> Correcto! </div>
                            <div class="invalid-feedback"> Completar! </div>
                        </div>
                        `);
                    } else {
                        $("#DivPlantillaEnvDevHomeOffice").append(`
                        <div class="col-md-${response[i].Numeros_A_Letras != null ? 12 : 4} mb-3">
                            <label for="${selectorId}">${response[i].Numeros_A_Letras != null ? response[i].Nombre + " de acuerdo a: " + selectorNumALetras : response[i].Nombre}</label>
                            <input type="${response[i].Tipo_Campo}" class="form-control" id="${selectorId}"
                                required ${response[i].Numeros_A_Letras != null ? "disabled" : ""}>
                            <div class="valid-feedback"> Correcto! </div>
                            <div class="invalid-feedback"> Completar! </div>
                        </div>
                        `);
                    }

                    if (response[i].Caracter_Maximo != null) {
                        $(`#${selectorId}`).on("input", function () {
                            let value = $(this).val();
                            value = value.replace(/e/g, ''); // Eliminar todas las letras 'e'
                            $(this).val(value);
                            if (value.length > response[i].Caracter_Maximo) {
                                $(this).val(value.slice(0, response[i].Caracter_Maximo));
                            }
                        });
                    }
                    if (response[i].Numeros_A_Letras != null) {
                        var objeto = {
                            nombre: selectorId,
                            valor: selectorNumALetras + "UnicoId"
                        };
                        ArrayNumeroALetras.push(objeto);
                    }
                }

                for (var i = 0; i < ArrayNumeroALetras.length; i++) {
                    (function (i) {
                        $(`#${ArrayNumeroALetras[i].valor}`).on("input", function () {
                            var valor = $(`#${ArrayNumeroALetras[i].valor}`).val();
                            var nombre = ArrayNumeroALetras[i].nombre;
                            var letras = NumeroALetras(valor);
                            $(`#${nombre}`).val(letras);
                        });
                    })(i);
                }

            },
            error: function (error) { },
            timeout: 300000
        });

        $("#HomeOfficeEmpleadoExcel").val(DatosInv[0].Identificacion_Usuario);
        $('#HomeOfficeBuscarEmpleadoExcelBoton').click();
    });
};

//Tabla de dispositivos a devolver
function TablaDetalleEnvDevHomeOfficeFinal(Datareceived) {
    Tablecolumns = [
        {
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
            "title": "Nombre_Activo",
            "data": "Nombre_Activo"
        },
        {
            "title": "Marca",
            "data": "Marca"
        }];
    if ($.fn.dataTable.isDataTable('#TablaDetalleAEnvDevHomeOffice')) {
        TablaDetalleAEnvDevHomeOffice.destroy();
    }
    TablaDetalleAEnvDevHomeOffice = $("#TablaDetalleAEnvDevHomeOffice").DataTable({
        paging: false,
        searching: false,
        lengthChange: false,
        data: Datareceived,
        info: false,
        columns: Tablecolumns,
        select: true,
        autoWidth: false
    });
}

//Actualizar base de datos al devolver inventario
function EnvDevHomeOfficeInventario(DatosInv, Id_Acta_Drive, User, UserAsignado) {
    var identificacionUsuario = !User ? DatosInv[0].Identificacion_Usuario : UserAsignado ;
    var totalElementos = DatosInv.length;
    var elementosProcesados = 0;
    DatosInv.forEach(formElement => {
        var Id_Inventario = formElement.Id_Inventario;
        var Serial = formElement.Serial;
        var ActualizarHomeOffice = formElement.Home_Office == "SI" ? 0 : 1;
        var mensaje = formElement.Home_Office == "SI" ? "El regreso desde Home Office se ha completado con éxito." : "El envio a Home Office se ha completado con éxito.";
        $.ajax({
            url: Url_Backend + "EnvDevHomeOffice?Id_Inventario=" + Id_Inventario + "&Serial=" + Serial + "&Home_Office=" + ActualizarHomeOffice + "&UserGeneral=" + usuarioGeneral.Identificacion_Usuario + "&Id_Acta_Drive=" + Id_Acta_Drive,
            type: 'GET',
            contentType: 'application/json',
            headers: {
                'Authorization': token_type + ' ' + access_token
            },
            async: false,
            success: function (response) {
                elementosProcesados++;
                if (elementosProcesados === totalElementos) {
                    swal('Listo!', mensaje, 'success');
                    $("#ModalHomeOffice").modal("hide");
                    $("#ModalHomeOffice").modal("hide");
                    $("#ModalAsignar").modal("hide");
                    Inicializadores();
                    EnviarCorreo(Id_Acta_Drive, identificacionUsuario);
                }
            },
            error: function (error) { },
            timeout: 300000
        });
    });
}
