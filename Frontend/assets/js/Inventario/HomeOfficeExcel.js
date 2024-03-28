var Url_Backend = "http://localhost:57737/";
//var Url_Backend = window.location.origin + '/inventario/Backend/';
var FormularioHomeOffice;
var IdPlantillaHomeSeleccionado;
var DatosInv;
var modalHomeOfficeOriginal;
var TipoProceso;
var usuarioGeneral

function HomeOfficeExcel(received, usuario) {
    usuarioGeneral = usuario
    $("#tituloHomeOfficeExcel").css("display", "none");
    $("#DivPlantillaHomeOfficeExcel").empty();
    modalHomeOfficeOriginal = $('#ModalHomeOffcieExcel').clone();
    $('#ModalHomeOffcieExcel').on('hidden.bs.modal', function () {
        $('#ModalHomeOffcieExcel').replaceWith(modalHomeOfficeOriginal);
    });
    $("#ModalHomeOffcieExcel").modal("show");

    $("#wizard7").steps({
        headerTag: "h3",
        bodyTag: "section",
        autoFocus: true,
        titleTemplate: '<span class="wizard-index">#index#</span> #title#',
        onStepChanging: function (b, a, e) {
            if (a < e) {
                var c = document.getElementById("formHomeOfficeCargarExcel");
                var k = document.getElementById("form1HomeofficeExcel");
                var d = "Firmas"
                if (a === 0) {
                    if (c.checkValidity() === false) {
                        b.preventDefault();
                        b.stopPropagation();
                        c.classList.add("was-validated")
                    } else {
                        EnviarRegresar = $("#SelectHomeOfficeExcel").val();
                        var DatosReceived = validaExcelHomeoffice(TipoProceso, EnviarRegresar)
                        if (DatosReceived.length > 1) {
                            const serials = DatosReceived.map(arr => arr[0]);
                            const objetosFiltrados = received.filter(objeto => serials.includes(objeto.Serial));
                            DatosInv = objetosFiltrados
                            TablaDetalleHomeOfficeFinalExcel(DatosInv);
                            EnviarRegresar == "Enviar" ? GetPlantillasById(2) : GetPlantillasById(1);
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
                    } else {
                        return true
                    }
                }
            } else { return true }
        },
        onFinished: function (event, currentIndex) {
            const serials = DatosInv.map(objeto => objeto.Serial);
            swal({
                title: "¿Esta seguro de realizar el proceso de Home Office de estos dispositivos: " + serials.join(', ') + "?", icon: "warning", buttons: {
                    cancel: "No, cancelar",
                    confirm: "Sí"
                }, dangerMode: false,
            }).then((opcion) => {
                if (opcion) {
                    $(".preloader").show();
                    CrearDocumento(FormularioHomeOffice, IdPlantillaHomeSeleccionado, "HomeOfficeExcel", DatosInv);
                } else {
                    toastr.info("No se aplico ningun cambio");
                    return false
                }
            });
        }
    })

    $("#FileDataHomeOfficeExcel").change(function (evt) {
        TipoProceso = $(this).attr('id'); // Obtener el id para el tipo de proceso
        //$(".spinner-border").show();
        ObtenerDatosBase();
        var file1 = evt.target.files[0] //retrieve the uploaded file  
        var bool = checkfile($(this).val());
        if (bool) {
            fnConvertExcelToJSON1(file1, TipoProceso);
        };
    });

    $("#PlantillaHomeOfficeExcel").on("change", function () {
        IdPlantillaHomeSeleccionado = $(this).find(":selected").data("val");
        $("#tituloHomeOfficeExcel").css("display", "block");
        $("#DivPlantillaHomeOfficeExcel").empty();
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
                    var selectorNumALetras = response[i].Numeros_A_Letras != null ? (response[i].Numeros_A_Letras).replace(/\[|\]/g, '') : "";
                    if (response[i].Tipo_Campo == "select") {
                        var OpcionesSeleccion = (response[i].Opciones_Seleccion).split(',');
                        $("#DivPlantillaHomeOfficeExcel").append(`
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

                    }  else if (response[i].Dato_Empleado != null) {
                        $("#DivPlantillaHomeOfficeExcelBD").append(`
                        <div class="col-md-${response[i].Numeros_A_Letras != null ? 12 : 4} mb-3">
                            <label for="${response[i].Dato_Empleado}">${response[i].Numeros_A_Letras != null ? response[i].Nombre + " de acuerdo a: " + selectorNumALetras : response[i].Nombre}</label>
                            <input type="${response[i].Tipo_Campo}" class="form-control" id="${response[i].Dato_Empleado}"
                                required ${response[i].Numeros_A_Letras != null ? "disabled" : ""}>
                            <div class="valid-feedback"> Correcto! </div>
                            <div class="invalid-feedback"> Completar! </div>
                        </div>
                        `);
                    } else if (response[i].Dato_Empleado != null) {
                        $("#DivPlantillaHomeOfficeExcel").append(`
                        <div class="col-md-${response[i].Numeros_A_Letras != null ? 12 : 4} mb-3">
                            <label for="${response[i].Dato_Empleado}">${response[i].Numeros_A_Letras != null ? response[i].Nombre + " de acuerdo a: " + selectorNumALetras : response[i].Nombre}</label>
                            <input type="${response[i].Tipo_Campo}" class="form-control" id="${response[i].Dato_Empleado}"
                                required ${response[i].Numeros_A_Letras != null ? "disabled" : ""}>
                            <div class="valid-feedback"> Correcto! </div>
                            <div class="invalid-feedback"> Completar! </div>
                        </div>
                        `);
                    } else {
                        $("#DivPlantillaHomeOfficeExcel").append(`
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
        $("#HomeOfficeEmpleado").val(DatosInv[0].Identificacion_Usuario);
        $('#HomeOfficeBuscarEmpleadoBoton').click();
    });

};

//Tabla de dispositivos a devolver
function TablaDetalleHomeOfficeFinalExcel(Datareceived) {
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
    if ($.fn.dataTable.isDataTable('#TablaDetalleHomeOfficeExcel')) {
        TablaDetalleHomeOfficeExcel.destroy();
    }
    TablaDetalleHomeOfficeExcel = $("#TablaDetalleHomeOfficeExcel").DataTable({
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

//Actualizar base de datos al Enviar o regresar de homeOffice
function EnvDevHomeOfficeInventarioExcel(DatosInv, Id_Acta_Drive) {
    var identificacionUsuario = DatosInv[0].Identificacion_Usuario
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
                    $("#ModalHomeOffcieExcel").modal("hide");
                    Inicializadores();
                    EnviarCorreo(Id_Acta_Drive, identificacionUsuario);
                }
            },
            error: function (error) { },
            timeout: 300000
        });
    });
}
