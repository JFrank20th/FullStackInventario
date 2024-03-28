var Url_Backend = "http://localhost:57737/";
//var Url_Backend = window.location.origin + '/inventario/Backend/';
var FormularioAsignacion;
var IdPlantillaAsigSeleccionado;
var DatosInv;
var modalAsignarOriginal;
var TipoProceso;
var usuarioGeneral

function AsignarInventarioExcel(received, usuario) {
    usuarioGeneral = usuario
    $("#tituloAsignarExcel").css("display", "none");
    $("#DivPlantillaAsignarExcel").empty();

    modalAsignarOriginal = $('#ModalAsignarExcel').clone();
    $('#ModalAsignarExcel').on('hidden.bs.modal', function () {
        $('#ModalAsignarExcel').replaceWith(modalAsignarOriginal);
    });

    $("#ModalAsignarExcel").modal("show");

    GetPlantillasById(3);

    $("#wizard5").steps({
        headerTag: "h3",
        bodyTag: "section",
        autoFocus: true,
        titleTemplate: '<span class="wizard-index">#index#</span> #title#',
        onStepChanging: function (b, a, e) {
            if (a < e) {
                var c = document.getElementById("formCargarExcel");
                var k = document.getElementById("form1AsignarExcel");
                var d = "Firmas"
                if (a === 0) {
                    if (c.checkValidity() === false) {
                        b.preventDefault();
                        b.stopPropagation();
                        c.classList.add("was-validated")
                    } else {

                        var DatosReceived = validaExcelAsignar(TipoProceso)
                        if (DatosReceived.length > 1) {
                            const serials = DatosReceived.map(arr => arr[0]);
                            const objetosFiltrados = received.filter(objeto => serials.includes(objeto.Serial));
                            DatosInv = objetosFiltrados
                            TablaDetalleAsignacionFinalExcel(DatosInv)
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
                            let validadUserExiste = ExisteEmpleadoExcel($("#EmpleadoAsignarExcel").val());
                            if (!validadUserExiste) {
                                toastr.error('No existe la identificacion del empleado en el sistema.');
                            } else {
                                TablaDetalleAsignacionFinal(DatosInv);
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
                title: "¿Esta seguro de hacer la asignacion de estos dispositivos: " + serials.join(', ') + "?", icon: "warning", buttons: {
                    cancel: "No, cancelar",
                    confirm: "Sí"
                }, dangerMode: false,
            }).then((opcion) => {
                let usuario = $("#EmpleadoAsignarExcel").val()
                if (opcion) {
                    $(".preloader").show();
                    CrearDocumento(FormularioAsignacion, IdPlantillaAsigSeleccionado, "AsignacionExcel", DatosInv, usuario);
                } else {
                    toastr.info("No se aplico ningun cambio");
                    return false
                }
            });
        }
    })

    $("#FileDataAsignarExcel").change(function (evt) {
        TipoProceso = $(this).attr('id');
        //$(".spinner-border").show();
        ObtenerDatosBase();
        var file1 = evt.target.files[0] //retrieve the uploaded file  
        var bool = checkfile($(this).val());
        if (bool) {
            fnConvertExcelToJSON1(file1, TipoProceso);
        };
    });

    $("#PlantillaAsignarExcel").on("change", function () {
        $("#EmpleadoAsignarExcel").removeAttr("disabled");
        IdPlantillaAsigSeleccionado = $(this).find(":selected").data("val");
        $("#tituloAsignarExcel").css("display", "block");
        $("#DivPlantillaAsignarExcel").empty();
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
                        $("#DivPlantillaAsignarExcel").append(`
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
                        $("#DivPlantillaAsignarExcel").append(`
                        <div class="col-md-${response[i].Numeros_A_Letras != null ? 12 : 4} mb-3">
                            <label for="${response[i].Dato_Empleado}">${response[i].Numeros_A_Letras != null ? response[i].Nombre + " de acuerdo a: " + selectorNumALetras : response[i].Nombre}</label>
                            <input type="${response[i].Tipo_Campo}" class="form-control" id="${response[i].Dato_Empleado}"
                                required ${response[i].Numeros_A_Letras != null ? "disabled" : ""}>
                            <div class="valid-feedback"> Correcto! </div>
                            <div class="invalid-feedback"> Completar! </div>
                        </div>
                        `);
                    } else {
                        $("#DivPlantillaAsignarExcel").append(`
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
function TablaDetalleAsignacionFinalExcel(Datareceived) {
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
    if ($.fn.dataTable.isDataTable('#TablaDetalleAsignacionExcel')) {
        TablaDetalleAsignacionExcel.destroy();
    }
    TablaDetalleAsignacionExcel = $("#TablaDetalleAsignacionExcel").DataTable({
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
function AsignacionInventarioExcel(DatosInv, Id_Acta_Drive) {
    var totalElementos = DatosInv.length;
    var elementosProcesados = 0;
    var Identificacion_Empleado = $("#EmpleadoAsignarExcel").val();
    DatosInv.forEach(formElement => {
        var Id_Inventario = formElement.Id_Inventario;
        var Serial = formElement.Serial;
        $.ajax({
            url: Url_Backend + "AsignacionInventario?Id_Inventario=" + Id_Inventario + "&Serial=" + Serial + "&Usuario=" + $("#EmpleadoAsignarExcel").val() + "&UserGeneral=" + usuarioGeneral.Identificacion_Usuario + "&Id_Acta_Drive=" + Id_Acta_Drive,
            type: 'GET',
            contentType: 'application/json',
            headers: {
                'Authorization': token_type + ' ' + access_token
            },
            async: false,
            success: function (response) {
                elementosProcesados++;
                if (elementosProcesados === totalElementos) {
                    swal('Listo!', "Se han asignado los dispositivos con exito.", 'success');
                    $("#ModalAsignarExcel").modal("hide");
                    $('#ChecboxAll').hide();
                    Inicializadores();
                    EnviarCorreo(Id_Acta_Drive, Identificacion_Empleado);
                }
            },
            error: function (error) { },
            timeout: 300000
        });
    });

}

//Verificar existencia del empleado
function ExisteEmpleadoExcel(Identificacion) {
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

