var Url_Backend = "http://localhost:57737/";
//var Url_Backend = window.location.origin + '/inventario/Backend/';
var FormularioDesasignacion;
var FormularioDescuento;
var IdPlantillaDesasignarSeleccionado;
var IdPlantillaDescSeleccionado;
var DatosInv;
var modalAsignarOriginal;
var TipoProceso;
var f = null;
var usuarioGeneral;
var EnvioDoble = false;

function DesasignarInventarioExcel(received, usuario) {
    usuarioGeneral = usuario
    $("#tituloDesasignarExcel").css("display", "none");
    $("#DivPlantillaDesasignarExcel").empty();

    modalAsignarOriginal = $('#ModalDesasignarExcel').clone();
    $('#ModalDesasignarExcel').on('hidden.bs.modal', function () {
        $('#ModalDesasignarExcel').replaceWith(modalAsignarOriginal);
    });

    $("#ModalDesasignarExcel").modal("show");

    GetPlantillasById(4);
    GetPlantillasById(3);

    $("#wizard6").steps({
        headerTag: "h3",
        bodyTag: "section",
        autoFocus: true,
        titleTemplate: '<span class="wizard-index">#index#</span> #title#',
        onStepChanging: function (b, a, e) {
            if (a < e) {
                var c = document.getElementById("formCargarExcelDesasignar");
                var k = document.getElementById("form1DesasignarExcel");
                var Desc = document.getElementById("formDescuentoExcel");
                var d = "Firmas"
                if (a === 0) {
                    if (c.checkValidity() === false) {
                        b.preventDefault();
                        b.stopPropagation();
                        c.classList.add("was-validated")
                    } else {
                        var DatosReceived = validaExcelDevolver(TipoProceso)
                        if (DatosReceived.length > 1) {
                            const serials = DatosReceived.map(arr => arr[0]);
                            const objetosFiltrados = received.filter(objeto => serials.includes(objeto.Serial));
                            DatosInv = objetosFiltrados
                            TablaDetalleDesasignacionFinalExcel(DatosInv)
                            return true
                        }
                    }
                } else {
                    if (a === 1) {
                        if (k.checkValidity() === false) {
                            b.preventDefault();
                            b.stopPropagation();
                            k.classList.add("was-validated")
                        } else {
                            return true
                        }
                    } else if (a === 2) {
                        if (f == null) {
                            if (Desc.checkValidity() === false) {
                                b.preventDefault();
                                b.stopPropagation();
                                Desc.classList.add("was-validated")
                            } else {
                                return true
                            }
                        } else {
                            if (Desc.checkValidity() === false || f.checkValidity() === false) {
                                b.preventDefault();
                                b.stopPropagation();
                                Desc.classList.add("was-validated")
                                f.classList.add("was-validated")
                            } else {
                                DetalleDescuentoFinalExcel();
                                return true
                            }
                        }
                    } else {
                        return true
                    }
                }
            } else { return true }
        },
        onFinished: function (event, currentIndex) {
            const serials = DatosInv.map(objeto => objeto.Serial);
            swal({
                title: "¿Esta seguro de hacer la desasignacion de estos dispositivos: " + serials.join(', ') + "?", icon: "warning", buttons: {
                    cancel: "No, cancelar",
                    confirm: "Sí"
                }, dangerMode: false,
            }).then((opcion) => {
                if (opcion) {
                    if ($("#ValidarDescuentoExcel").val() == 1) {
                        $(".preloader").show();
                        EnvioDoble = true;
                        setTimeout(() => {
                            CrearDocumento(FormularioDescuento, IdPlantillaDescSeleccionado, "Descuento", DatosInv);
                        }, 500);
                        setTimeout(() => {
                            CrearDocumento(FormularioDesasignacion, IdPlantillaDesasignarSeleccionado, "DesasignacionExcel", DatosInv);
                        }, 15000);
                    } else {
                        $(".preloader").show();
                        EnvioDoble = false;
                        CrearDocumento(FormularioDesasignacion, IdPlantillaDesasignarSeleccionado, "DesasignacionExcel", DatosInv);
                    }


                } else {
                    toastr.info("No se aplico ningun cambio");
                    return false
                }
            });
        }
    })

    $("#ValidarDescuentoExcel").on("change", function () {
        var selectedValue = $(this).val();
        if (selectedValue === "1") {
            $("#DivPlantillasExcel").css("display", "block");
            $("#PlantillasDescuentoExcel").prop("required", true);
            f = document.getElementById("formDescuentoExcel2");
        } else {
            $("#DivPlantillasExcel").css("display", "none");
            $("#FormularioAdicionalExcel").css("display", "none");
            $("#PlantillasDescuentoExcel").prop("required", false);
            $("#PlantillasDescuentoExcel").val("");
            $("#DetalleDescuentoExcel").empty();
            $("#FormularioNuevoExcel").empty();
            f = null
        }
    });

    $("#PlantillasDescuentoExcel").on("change", function () {
        IdPlantillaDescSeleccionado = $(this).find(":selected").data("val");
        $("#FormularioAdicionalExcel").css("display", "block");
        $("#FormularioNuevoExcel").empty();
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
                        if ($('#DivPlantillaDesasignarExcel #' + selectorId).length === 0) {
                            $("#FormularioNuevoExcel").append(`
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
                            $("#FormularioNuevoExcel").append(`
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
                        var divOrigen = $('#DivPlantillaDesasignarExcelBD');
                        var divDestino = $('#FormularioNuevoExcel');
                        divDestino.html(divOrigen.html());
                        divOrigen.find('input, select').each(function (index, element) {
                            var value = $(element).val();
                            var newElement = $(element).clone().removeAttr('id').prop('disabled', true);
                            divDestino.find(element.tagName).eq(index).replaceWith(newElement.val(value));
                        });
                    } else {
                        if ($('#DivPlantillaDesasignarExcel #' + selectorId).length === 0) {
                            $("#FormularioNuevoExcel").append(`
                            <div class="col-md-${response[i].Numeros_A_Letras != null ? 12 : 4} mb-3">
                                <label for="${selectorId}">${response[i].Numeros_A_Letras != null ? response[i].Nombre + " de acuerdo a: " + selectorNumALetras : response[i].Nombre}</label>
                                <input type="${response[i].Tipo_Campo}" class="form-control" id="${selectorId}"
                                    required ${response[i].Numeros_A_Letras != null ? "disabled" : ""}>
                                <div class="valid-feedback"> Correcto! </div>
                                <div class="invalid-feedback"> Completar! </div>
                            </div>
                            `);
                        } else {
                            $("#FormularioNuevoExcel").append(`
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

    $("#FileDataDesasignarExcel").change(function (evt) {
        TipoProceso = $(this).attr('id');
        //$(".spinner-border").show();
        ObtenerDatosBase();
        var file1 = evt.target.files[0] //retrieve the uploaded file  
        var bool = checkfile($(this).val());
        if (bool) {
            fnConvertExcelToJSON1(file1, TipoProceso);
        };
    });

    $("#PlantillaDesasignarExcel").on("change", function () {
        IdPlantillaDesasignarSeleccionado = $(this).find(":selected").data("val");
        $("#tituloDesasignarExcel").css("display", "block");
        $("#DivPlantillaDesasignarExcel").empty();
        $.ajax({
            url: Url_Backend + "GetTokensById?Id_Template=" + $(this).val(),
            type: 'GET',
            contentType: 'application/json',
            headers: {
                'Authorization': token_type + ' ' + access_token
            },
            async: false,
            success: function (response) {
                FormularioDesasignacion = response;
                var ArrayNumeroALetras = [];
                for (let i = 0; i < response.length; i++) {
                    var selectorId = (response[i].Token).replace(/\[|\]/g, '') + "UnicoId";
                    var selectorNumALetras = response[i].Numeros_A_Letras != null ? (response[i].Numeros_A_Letras).replace(/\[|\]/g, '') : "";
                    if (response[i].Tipo_Campo == "select") {
                        var OpcionesSeleccion = (response[i].Opciones_Seleccion).split(',');
                        $("#DivPlantillaDesasignarExcel").append(`
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
                        $("#DivPlantillaDesasignarExcelBD").append(`
                        <div class="col-md-${response[i].Numeros_A_Letras != null ? 12 : 4} mb-3">
                            <label for="${response[i].Dato_Empleado}">${response[i].Numeros_A_Letras != null ? response[i].Nombre + " de acuerdo a: " + selectorNumALetras : response[i].Nombre}</label>
                            <input type="${response[i].Tipo_Campo}" class="form-control" id="${response[i].Dato_Empleado}"
                                required ${response[i].Numeros_A_Letras != null ? "disabled" : ""}>
                            <div class="valid-feedback"> Correcto! </div>
                            <div class="invalid-feedback"> Completar! </div>
                        </div>
                        `);
                    } else {
                        $("#DivPlantillaDesasignarExcel").append(`
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

        $("#DesasignarEmpleadoExcel").val(DatosInv[0].Identificacion_Usuario);
        $('#BuscarEmpleadoDesExcelBoton').click();
    });

};

//Agrega detalles si hay descuetos
function DetalleDescuentoFinalExcel() {
    // ERROR   Este Id debe ser dinamico 
    var valorPesos = parseFloat($("#VDescuentoNumerosUnicoId").val()).toLocaleString("es-CO", {
        style: "currency",
        currency: "COP",
        minimumFractionDigits: 0 // Para que no muestre decimales
    });
    $("#DetalleDescuentoExcel").empty();
    $("#DetalleDescuentoExcel").append(`
    <h5>Duescuento</h5>
    <p>Se aplicara el descuento por un valor de: ${valorPesos + " Pesos"}</p>
    `);
};

//Tabla de dispositivos a devolver
function TablaDetalleDesasignacionFinalExcel(Datareceived) {
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
    if ($.fn.dataTable.isDataTable('#TablaDetalleDesasignarExcel')) {
        TablaDetalleDesasignarExcel.destroy();
    }
    TablaDetalleDesasignarExcel = $("#TablaDetalleDesasignarExcel").DataTable({
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
function DesasignacionInventarioExcel(DatosInv, Id_Acta_Drive) {
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
                    swal('Listo!', "Se han desasignado los dispositivos con exito.", 'success');
                    $("#ModalDesasignarExcel").modal("hide");
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

