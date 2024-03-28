var Url_Backend = "http://localhost:57737/";
//var Url_Backend = window.location.origin + '/inventario/Backend/';
var FormularioAsignacion;
var IdPlantillaAsigSeleccionado;
var DatosInv;
var modalAsignarOriginal;
var usuarioGeneral
var f = null;
var IdPlantillaHomeSeleccionado;
var FormularioHomeOffice;
var EnvioDoble = false;

function AsignarInventario(received, usuario) {
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
    $("#tituloAsignar").css("display", "none");
    $("#DivPlantillaAsignar").empty();
    DatosInv = received;

    modalAsignarOriginal = $('#ModalAsignar').clone();
    $('#ModalAsignar').on('hidden.bs.modal', function () {
        $('#ModalAsignar').replaceWith(modalAsignarOriginal);
    });

    $("#ModalAsignar").modal("show");

    GetPlantillasById(3);
    GetPlantillasById(2);

    $("#wizard3").steps({
        headerTag: "h3",
        bodyTag: "section",
        autoFocus: true,
        titleTemplate: '<span class="wizard-index">#index#</span> #title#',
        onStepChanging: function (b, a, e) {
            if (a < e) {
                var c = document.getElementById("form1Asignar"),
                    d = document.getElementById("formHomeOffice");
                var g = "Firmas"
                if (a === 0) {
                    if (c.checkValidity() === false) {
                        b.preventDefault();
                        b.stopPropagation();
                        c.classList.add("was-validated")
                        //return true //ELIMINAR ESTA LINEA
                    } else {
                        let validadUserExiste = ExisteEmpleado($("#AsignarEmpleado").val());
                        if (!validadUserExiste) {
                            toastr.error('No existe la identificacion del empleado en el sistema.');
                        } else {
                            TablaDetalleAsignacionFinal(DatosInv);
                            return true
                        }
                    }
                } else {
                    if (a === 1) {
                        if (f == null) {
                            if (d.checkValidity() === false) {
                                b.preventDefault();
                                b.stopPropagation();
                                d.classList.add("was-validated")
                                //return true //ELIMINAR ESTA LINEA
                            } else {
                                return true
                            }
                        } else {
                            if (d.checkValidity() === false || f.checkValidity() === false) {
                                b.preventDefault();
                                b.stopPropagation();
                                d.classList.add("was-validated")
                                f.classList.add("was-validated")
                                //return true //ELIMINAR ESTA LINEA
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
                title: "¿Esta seguro de hacer la asignacion de este dispositivo: " + serials.join(', ') + "?", icon: "warning", buttons: {
                    cancel: "No, cancelar",
                    confirm: "Sí"
                }, dangerMode: false,
            }).then((opcion) => {
                if (opcion) {
                    let usuario = $("#AsignarEmpleado").val();
                    if ($("#ValidarHomeOffice").val() == 1) {
                        $(".preloader").show();
                        EnvioDoble = true;
                        setTimeout(() => {
                            CrearDocumento(FormularioAsignacion, IdPlantillaAsigSeleccionado, "Asignacion", DatosInv, usuario);
                        }, 500);
                        setTimeout(() => {
                            CrearDocumento(FormularioHomeOffice, IdPlantillaHomeSeleccionado, "EnvHomeOfficeAsig", DatosInv, usuario);
                        }, 15000);
                    } else {

                        $(".preloader").show();
                        CrearDocumento(FormularioAsignacion, IdPlantillaAsigSeleccionado, "Asignacion", DatosInv, usuario);
                        EnvioDoble = false
                    }
                } else {
                    toastr.info("No se aplico ningun cambio");
                    return false
                }
            });
        }
    })

    $("#ValidarHomeOffice").on("change", function () {
        var selectedValue = $(this).val();
        if (selectedValue === "1") {
            $("#DivPlantillasHomeOffice").css("display", "block");
            $("#PlantillasHomeOffice").prop("required", true);
            f = document.getElementById("formAdicionalHomeOffice");
        } else {
            $("#DivPlantillasHomeOffice").css("display", "none");
            $("#FormularioAdicionalHomeOffice").css("display", "none");
            $("#PlantillasHomeOffice").prop("required", false);
            $("#PlantillasHomeOffice").val("");
            $("#DetalleHomeOffice").empty();
            $("#FormularioNuevoHomeOffice").empty();
            f = null
        }
    });

    $("#PlantillasHomeOffice").on("change", function () {
        IdPlantillaHomeSeleccionado = $(this).find(":selected").data("val");
        $("#FormularioAdicionalHomeOffice").css("display", "block");
        $("#FormularioNuevoHomeOffice").empty();
        $.ajax({
            url: Url_Backend + "GetTokensById?Id_Template=" + $(this).val(),
            type: 'GET',
            contentType: 'application/json',
            headers: {
                'Authorization': token_type + ' ' + access_token
            },
            async: false,
            success: function (response) {
                FormularioHomeOffice = response;
                var ArrayNumeroALetras = [];
                for (let i = 0; i < response.length; i++) {
                    var selectorId = (response[i].Token).replace(/\[|\]/g, '') + "UnicoId";
                    var nuevoSelectorId = selectorId + "_nuevo";
                    var selectorNumALetras = response[i].Numeros_A_Letras != null ? (response[i].Numeros_A_Letras).replace(/\[|\]/g, '') : "";

                    if (response[i].Tipo_Campo == "select") {
                        var OpcionesSeleccion = (response[i].Opciones_Seleccion).split(',');
                        if ($('#DivPlantillaAsignar #' + selectorId).length === 0) {
                            $("#FormularioNuevoHomeOffice").append(`
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
                            $("#FormularioNuevoHomeOffice").append(`
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
                        var divOrigen = $('#DivPlantillaAsignarBD');
                        var divDestino = $('#FormularioNuevoHomeOffice');
                        divDestino.html(divOrigen.html());
                        divOrigen.find('input, select').each(function (index, element) {
                            var value = $(element).val();
                            var newElement = $(element).clone().removeAttr('id').prop('disabled', true);
                            divDestino.find(element.tagName).eq(index).replaceWith(newElement.val(value));
                        });
                    } else {
                        if ($('#DivPlantillaAsignar #' + selectorId).length === 0) {
                            $("#FormularioNuevoHomeOffice").append(`
                            <div class="col-md-${response[i].Numeros_A_Letras != null ? 12 : 4} mb-3">
                                <label for="${selectorId}">${response[i].Numeros_A_Letras != null ? response[i].Nombre + " de acuerdo a: " + selectorNumALetras : response[i].Nombre}</label>
                                <input type="${response[i].Tipo_Campo}" class="form-control" id="${selectorId}"
                                    required ${response[i].Numeros_A_Letras != null ? "disabled" : ""}>
                                <div class="valid-feedback"> Correcto! </div>
                                <div class="invalid-feedback"> Completar! </div>
                            </div>
                            `);
                        } else {
                            $("#FormularioNuevoHomeOffice").append(`
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


    $("#PlantillaAsignar").on("change", function () {
        $("#AsignarEmpleado").removeAttr("disabled");
        IdPlantillaAsigSeleccionado = $(this).find(":selected").data("val");
        $("#tituloAsignar").css("display", "block");
        $("#DivPlantillaAsignar").empty();
        $.ajax({
            url: Url_Backend + "GetTokensById?Id_Template=" + $(this).val(),
            type: 'GET',
            contentType: 'application/json',
            headers: {
                'Authorization': token_type + ' ' + access_token
            },
            async: false,
            success: function (response) {
                FormularioAsignacion = response;
                var ArrayNumeroALetras = [];
                for (let i = 0; i < response.length; i++) {
                    var selectorId = (response[i].Token).replace(/\[|\]/g, '') + "UnicoId";
                    var selectorNumALetras = response[i].Numeros_A_Letras != null ? (response[i].Numeros_A_Letras).replace(/\[|\]/g, '') : "";
                    if (response[i].Tipo_Campo == "select") {
                        var OpcionesSeleccion = (response[i].Opciones_Seleccion).split(',');
                        $("#DivPlantillaAsignar").append(`
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
                        $("#DivPlantillaAsignarBD").append(`
                        <div class="col-md-${response[i].Numeros_A_Letras != null ? 12 : 4} mb-3">
                            <label for="${response[i].Dato_Empleado}">${response[i].Numeros_A_Letras != null ? response[i].Nombre + " de acuerdo a: " + selectorNumALetras : response[i].Nombre}</label>
                            <input type="${response[i].Tipo_Campo}" class="form-control" id="${response[i].Dato_Empleado}"
                                required ${response[i].Numeros_A_Letras != null ? "disabled" : ""}>
                            <div class="valid-feedback"> Correcto! </div>
                            <div class="invalid-feedback"> Completar! </div>
                        </div>
                        `);
                    } else {
                        $("#DivPlantillaAsignar").append(`
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
    });

};

//Tabla de dispositivos a devolver
function TablaDetalleAsignacionFinal(Datareceived) {
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
    if ($.fn.dataTable.isDataTable('#TablaDetalleAsignacion')) {
        TablaDetalleAsignacion.destroy();
    }
    TablaDetalleAsignacion = $("#TablaDetalleAsignacion").DataTable({
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

//Actualizar base de datos al asignar inventario
function AsignacionInventario(DatosInv, Id_Acta_Drive) {
    var totalElementos = DatosInv.length;
    var elementosProcesados = 0;
    var Identificacion_Empleado = $("#AsignarEmpleado").val();
    DatosInv.forEach(formElement => {
        var Id_Inventario = formElement.Id_Inventario;
        var Serial = formElement.Serial;
        $.ajax({
            url: Url_Backend + "AsignacionInventario?Id_Inventario=" + Id_Inventario + "&Serial=" + Serial + "&Usuario=" + $("#AsignarEmpleado").val() + "&UserGeneral=" + usuarioGeneral.Identificacion_Usuario + "&Id_Acta_Drive=" + Id_Acta_Drive,
            type: 'GET',
            contentType: 'application/json',
            headers: {
                'Authorization': token_type + ' ' + access_token
            },
            async: false,
            success: function (response) {
                elementosProcesados++;
                if (elementosProcesados === totalElementos) {
                    if (EnvioDoble) {
                        toastr.success("Listo! Se hizo la asignación correctamente.");
                    } else {
                        swal('Listo!', "Se hizo la asignación correctamente.", 'success');
                        $("#ModalAsignar .close").trigger("click");
                        $('#AsignarChecbox').hide();
                        $('#DevolverChecbox').hide();
                        $('#ProveedorChecbox').hide();
                        $('#ProveedorChecboxDiv').hide();
                        $('#ChecboxAll').hide();
                        GetInventarios();
                    }
                    EnviarCorreo(Id_Acta_Drive, Identificacion_Empleado);
                }
            },
            error: function (error) { },
            timeout: 300000
        });
    });

}

//Verificar existencia del empleado
function ExisteEmpleado(Identificacion) {
    var existe = false
    $.ajax({
        url: Url_Backend + "FindEmployees?Id=" + Identificacion,
        type: 'GET',
        contentType: 'application/json',
        headers: {
            'Authorization': token_type + ' ' + access_token
        },
        async: false,
        success: function (response) {
            response.length > 0 ? existe = true : existe = false;
            if (!existe) {
                $.ajax({
                    url: Url_Backend + "UsuarioByIdentificacion?Identificacion_Usuario=" + Identificacion,
                    type: 'GET',
                    contentType: 'application/json',
                    headers: {
                        'Authorization': token_type + ' ' + access_token
                    },
                    async: false,
                    success: function (response) {
                        response.length > 0 ? existe = true : existe = false;
                    },
                    error: function (error) {
                        swal("Upps!", "Error al obtener listado de usuarios: " + error, "error");
                    },
                    timeout: 300000
                });
            }
        },
        error: function (error) {
            swal("Upps!", "Error al obtener listado de usuarios: " + error, "error");
        },
        timeout: 300000
    });
    return existe
}