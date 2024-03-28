var Url_Backend = "http://localhost:57737/";
//var Url_Backend = window.location.origin + '/inventario/Backend/';
var f = null;
var FormularioDescuento;
var FormularioDevolucion;
var IdPlantillaDescSeleccionado;
var IdPlantillaDevolSeleccionado;
var DatosInv;
var modalDesasignarOriginal;
var usuarioGeneral;
var EnvioDoble = false;


function DevolverInventario(received, usuario) {

    toastr.options = {
        positionClass: "toast-top-center",
        timeOut: 3000,
        progressBar: true,
        showMethod: "slideDown",
        hideMethod: "slideUp",
        showDuration: 200,
        hideDuration: 200,
    };

    usuarioGeneral = usuario
    DatosInv = received;
    modalDesasignarOriginal = $('#ModalDesasignar').clone();
    $('#ModalDesasignar').on('hidden.bs.modal', function () {
        $('#ModalDesasignar').replaceWith(modalDesasignarOriginal);
    });

    $("#ModalDesasignar").modal("show");

    GetPlantillasById(4);
    GetPlantillasById(3);
    $("#wizard2").steps({
        headerTag: "h3",
        bodyTag: "section",
        autoFocus: true,
        titleTemplate: '<span class="wizard-index">#index#</span> #title#',
        onStepChanging: function (b, a, e) {

            if (a < e) {
                var c = document.getElementById("form1"),
                    d = document.getElementById("form2");
                var g = "Firmas"

                if (a === 0) {
                    if (c.checkValidity() === false) {
                        b.preventDefault();
                        b.stopPropagation();
                        c.classList.add("was-validated")
                    } else {
                        TablaDetalleDevolucionFinal(DatosInv);
                        return true
                    }
                } else {
                    if (a === 1) {
                        if (f == null) {
                            if (d.checkValidity() === false) {
                                b.preventDefault();
                                b.stopPropagation();
                                d.classList.add("was-validated")
                            } else {
                                return true
                            }
                        } else {
                            if (d.checkValidity() === false || f.checkValidity() === false) {
                                b.preventDefault();
                                b.stopPropagation();
                                d.classList.add("was-validated")
                                f.classList.add("was-validated")
                            } else {
                                DetalleDescuentoFinal();
                                return true
                            }
                        }

                    } else { return true }
                }
            } else { return true }

        },
        onFinished: function (event, currentIndex) {
            const serials = received.map(objeto => objeto.Serial);
            swal({
                title: "¿Esta seguro de hacer la devolucion los siguientes dispositivos: " + serials.join(', ') + "?", icon: "warning", buttons: {
                    cancel: "No, cancelar",
                    confirm: "Sí"
                }, dangerMode: false,
            }).then((opcion) => {
                if (opcion) {
                    if ($("#ValidarDescuento").val() == 1) {
                        $(".preloader").show();
                        EnvioDoble = true;
                        setTimeout(() => {
                            CrearDocumento(FormularioDescuento, IdPlantillaDescSeleccionado, "Descuento", DatosInv);
                        }, 500);
                        setTimeout(() => {
                            CrearDocumento(FormularioDevolucion, IdPlantillaDevolSeleccionado, "Devolucion", DatosInv);
                        }, 15000);
                    } else {
                        $(".preloader").show();
                        EnvioDoble = false;
                        CrearDocumento(FormularioDevolucion, IdPlantillaDevolSeleccionado, "Devolucion", DatosInv);
                    }
                    $('.preloader').fadeOut(500);
                } else {
                    toastr.info("No se aplico ningun cambio");
                    return false
                }
            });
        }
    })

    $("#ValidarDescuento").on("change", function () {
        var selectedValue = $(this).val();
        if (selectedValue === "1") {
            $("#DivPlantillas").css("display", "block");
            $("#PlantillasDescuento").prop("required", true);
            f = document.getElementById("form3");
        } else {
            $("#DivPlantillas").css("display", "none");
            $("#FormularioAdicional").css("display", "none");
            $("#PlantillasDescuento").prop("required", false);
            $("#PlantillasDescuento").val("");
            $("#DetalleDescuento").empty();
            $("#FormularioNuevo").empty();
            f = null
        }
    });

    $("#PlantillasDescuento").on("change", function () {
        IdPlantillaDescSeleccionado = $(this).find(":selected").data("val");
        $("#FormularioAdicional").css("display", "block");
        $("#FormularioNuevo").empty();
        $.ajax({
            url: Url_Backend + "GetTokensById?Id_Template=" + $(this).val(),
            type: 'GET',
            contentType: 'application/json',
            headers: {
                'Authorization': token_type + ' ' + access_token
            },
            async: false,
            success: function (response) {
                FormularioDescuento = response;
                var ArrayNumeroALetras = [];
                for (let i = 0; i < response.length; i++) {
                    var selectorId = (response[i].Token).replace(/\[|\]/g, '') + "UnicoId";
                    var nuevoSelectorId = selectorId + "_nuevo";
                    var selectorNumALetras = response[i].Numeros_A_Letras != null ? (response[i].Numeros_A_Letras).replace(/\[|\]/g, '') : "";
                    if (response[i].Tipo_Campo == "select") {
                        var OpcionesSeleccion = (response[i].Opciones_Seleccion).split(',');
                        if ($('#DivPlantillaDevolver #' + selectorId).length === 0) {
                            $("#FormularioNuevo").append(`
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
                        } else {
                            $("#FormularioNuevo").append(`
                                <div class="col-md-4 mb-3">
                                    <label for="${nuevoSelectorId}">${response[i].Nombre}</label>
                                    <select id="${nuevoSelectorId}" class="form-control" required disabled>
                                        <option value="" disabled selected>Seleccione...</option>
                                    </select>
                                    <div class="valid-feedback"> Correcto! </div>
                                    <div class="invalid-feedback"> Completar! </div>
                                </div>
                            `);
                            OpcionesSeleccion.forEach(function (elemento) {
                                $(`#${nuevoSelectorId}`).append(`
                                <option value=${elemento}>${elemento}</option>
                            `)
                            });
                            $(`#${nuevoSelectorId}`).val($(`#${selectorId}`).val());
                        }

                    } else if (response[i].Tipo_Campo == "firma") {

                    } else if (response[i].Dato_Empleado != null) {
                        var divOrigen = $('#DivPlantillaDevolverBD');
                        var divDestino = $('#FormularioNuevo');
                        divDestino.html(divOrigen.html());
                        divOrigen.find('input, select').each(function (index, element) {
                            var value = $(element).val();
                            var newElement = $(element).clone().removeAttr('id').prop('disabled', true);
                            divDestino.find(element.tagName).eq(index).replaceWith(newElement.val(value));
                        });
                    } else {
                        if ($('#DivPlantillaDevolver #' + selectorId).length === 0) {
                            $("#FormularioNuevo").append(`
                            <div class="col-md-${response[i].Numeros_A_Letras != null ? 12 : 4} mb-3">
                                <label for="${selectorId}">${response[i].Numeros_A_Letras != null ? response[i].Nombre + " de acuerdo a: " + selectorNumALetras : response[i].Nombre}</label>
                                <input type="${response[i].Tipo_Campo}" class="form-control" id="${selectorId}"
                                    required ${response[i].Numeros_A_Letras != null ? "disabled" : ""}>
                                <div class="valid-feedback"> Correcto! </div>
                                <div class="invalid-feedback"> Completar! </div>
                            </div>
                            `);
                        } else {
                            $("#FormularioNuevo").append(`
                            <div class="col-md-${response[i].Numeros_A_Letras != null ? 12 : 4} mb-3">
                                <label for="${nuevoSelectorId}">${response[i].Numeros_A_Letras != null ? response[i].Nombre + " de acuerdo a: " + selectorNumALetras : response[i].Nombre}</label>
                                <input type="${response[i].Tipo_Campo}" class="form-control" id="${nuevoSelectorId}" disabled required>
                                <div class="valid-feedback"> Correcto! </div>
                                <div class="invalid-feedback"> Completar! </div>
                            </div>
                            `);
                            $(`#${nuevoSelectorId}`).val($(`#${selectorId}`).val());
                        }
                        
                    }


                    if (response[i].Caracter_Maximo != null) {
                        $(`#${selectorId}, #${nuevoSelectorId}`).on("input", function () {
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
    });

    $("#PlantillaDevolver").on("change", function () {
        IdPlantillaDevolSeleccionado = $(this).find(":selected").data("val");
        $("#tituloDevolver").css("display", "block");
        $("#DivPlantillaDevolver").empty();
        $.ajax({
            url: Url_Backend + "GetTokensById?Id_Template=" + $(this).val(),
            type: 'GET',
            contentType: 'application/json',
            headers: {
                'Authorization': token_type + ' ' + access_token
            },
            async: false,
            success: function (response) {
                FormularioDevolucion = response;
                var ArrayNumeroALetras = [];
                for (let i = 0; i < response.length; i++) {
                    var selectorId = (response[i].Token).replace(/\[|\]/g, '') + "UnicoId";
                    var selectorNumALetras = response[i].Numeros_A_Letras != null ? (response[i].Numeros_A_Letras).replace(/\[|\]/g, '') : "";
                    if (response[i].Tipo_Campo == "select") {
                        var OpcionesSeleccion = (response[i].Opciones_Seleccion).split(',');
                        $("#DivPlantillaDevolver").append(`
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
                        $("#DivPlantillaDevolverBD").append(`
                        <div class="col-md-${response[i].Numeros_A_Letras != null ? 12 : 4} mb-3">
                            <label for="${response[i].Dato_Empleado}">${response[i].Numeros_A_Letras != null ? response[i].Nombre + " de acuerdo a: " + selectorNumALetras : response[i].Nombre}</label>
                            <input type="${response[i].Tipo_Campo}" class="form-control" id="${response[i].Dato_Empleado}"
                                required ${response[i].Numeros_A_Letras != null ? "disabled" : ""}>
                            <div class="valid-feedback"> Correcto! </div>
                            <div class="invalid-feedback"> Completar! </div>
                        </div>
                        `);
                    } else {
                        $("#DivPlantillaDevolver").append(`
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

        $("#DesasignarEmpleado").val(DatosInv[0].Identificacion_Usuario);
        $('#BuscarEmpleadoDesBoton').click();
    });

};

//Agrega detalles si hay descuetos
function DetalleDescuentoFinal() {
    var valorPesos = parseFloat($("#VDescuentoNumerosUnicoId").val()).toLocaleString("es-CO", {
        style: "currency",
        currency: "COP",
        minimumFractionDigits: 0 // Para que no muestre decimales
    });
    $("#DetalleDescuento").empty();
    $("#DetalleDescuento").append(`
    <h5>Duescuento</h5>
    <p>Se aplicara el descuento por un valor de: ${valorPesos + " Pesos"}</p>
    `);
};

//Tabla de dispositivos a devolver
function TablaDetalleDevolucionFinal(Datareceived) {
    Tablecolumns = [
        {
            "title": "Id",
            "data": "Id_Inventario"
        },
        {
            "title": "Usuario",
            "data": "Identificacion_Usuario"
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

    if ($.fn.dataTable.isDataTable('#TablaDetalleDevolucion')) {
        TablaDetalleDevolucion.destroy();
    }
    TablaDetalleDevolucion = $("#TablaDetalleDevolucion").DataTable({
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
function DevolucionInventario(DatosInv, Id_Acta_Drive) {
    var identificacionUsuario = DatosInv[0].Identificacion_Usuario
    var totalElementos = DatosInv.length;
    var elementosProcesados = 0;
    DatosInv.forEach(formElement => {
        var Id_Inventario = formElement.Id_Inventario;
        var Serial = formElement.Serial;
        $.ajax({
            url: Url_Backend + "DevolucionInventario?Id_Inventario=" + Id_Inventario + "&Serial=" + Serial + "&UserGeneral=" + usuarioGeneral.Identificacion_Usuario + "&Id_Acta_Drive=" + Id_Acta_Drive,
            type: 'GET',
            contentType: 'application/json',
            headers: {
                'Authorization': token_type + ' ' + access_token
            },
            async: false,
            success: function (response) {
                elementosProcesados++;
                if (elementosProcesados === totalElementos) {

                    swal('Listo!', "Se ha desasignado el dispositivo con éxito.", 'success');
                    $("#ModalDesasignar").modal("hide");
                    $('#AsignarChecbox').hide();
                    $('#DevolverChecbox').hide();
                    $('#ProveedorChecbox').hide();
                    $('#ProveedorChecboxDiv').hide();
                    $('#ChecboxAll').hide();
                    Inicializadores();
                    EnviarCorreo(Id_Acta_Drive, identificacionUsuario);
                }
            },
            error: function (error) { },
            timeout: 300000
        });
    });
}
