var Url_Backend = "http://localhost:57737/";
//var Url_Backend = window.location.origin + '/inventario/Backend/';
var jsonOutput1 = "";
var XL_row_object1 = "";
var json_object1 = "";
var allUsuarios;
var allProveedor;
var allNombreActivo;
var allNombreProcesadores;
var allNombreRAM;
var allNombreDiscos;
var allMarca;
var allBodegas;
var allCiudades;
var allSedes;
var allPisos;
var allPuestos;
var InvAsig = [];
var InvInac = [];
var usuarioNoExiste = [];
var proveedorNoExiste = [];
var nombreActivoNoExiste = [];
var necesitaProcesadorRamDisco = [];
var noNecesitaProcesadorRamDisco = [];
var nombreProcesadorNoExiste = [];
var nombreRAMNoExiste = [];
var nombreDiscoNoExiste = [];
var marcaNoExiste = [];
var ciudadNoExiste = [];
var puestoNoExiste = [];
var serialExiste = [];
var UsuarioAsignarDiferente = [];
var serialSinAsignacion = [];
var serialConAsignacion = [];
var diferenteUsuario = [];
var serialMismaAsignacion = [];
var DevolverSeriales = [];
var SerialesRepetidos = false;
var ExcelSerialesRepetidos = [];
var SerialRepetido = [];
var TipoProcesoSeleccionado
var access_token
var token_type;

//verificar archivo a cargar
function checkfile(sender) {
    var validExts = new Array(".xlsx");
    sender = sender.substring(sender.lastIndexOf('.'));
    if (validExts.indexOf(sender) < 0) {
        swal("Alto", "Archivo seleccionado invalido, archivos validos tipo: " + validExts.toString(), "error").then((result) => {
            if (result === true) {
                $("#FileData, #FileDataAsignarExcel").val("");
            }
        });
    }
    else {
        return true;
    }
};

(function (document, window, index) {
    var inputs = document.querySelectorAll('.inputfile');
    Array.prototype.forEach.call(inputs, function (input) {
        var label = input.nextElementSibling,
            labelVal = label.innerHTML;
        input.addEventListener('change', function (e) {
            var fileName = '';
            if (this.files && this.files.length > 1)
                fileName = (this.getAttribute('data-multiple-caption') || '').replace('{count}', this.files.length);
            else
                fileName = e.target.value.split('\\').pop();

            if (fileName)
                label.querySelector('span').innerHTML = fileName;
            else
                label.innerHTML = labelVal;
        });
    });
}(document, window, 0));

//upload change event  
$("#FileData").change(function (evt) {
    var TipoProceso = $(this).attr('id');
    //$(".spinner-border").show();
    ObtenerDatosBase();
    var file1 = evt.target.files[0] //retrieve the uploaded file  
    var bool = checkfile($(this).val());
    if (bool) {
        fnConvertExcelToJSON1(file1, TipoProceso);
    };
});

//method to convert excel to json 
function fnConvertExcelToJSON1(file, TipoProceso) {
    TipoProcesoSeleccionado = TipoProceso
    //$('.preloader').show();
    var reader1 = new FileReader();
    reader1.onload = async function (event) {
        var data = event.target.result
        var workbook = XLSX.read(data, {
            type: 'binary'
        });
        var Hoja = workbook.SheetNames[0];//primera hoja
        XL_row_object1 = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[Hoja], { header: 1, defval: "", raw: false });//header sin quitar vacias
        //remplaza los encabezados
        XL_row_object1[0] = JSON.parse(JSON.stringify(XL_row_object1[0]).replace(/ /g, "").replace(/\./g, ""));

        var ValidaeEncabezados = true;
        var titulo = $("#tituloModalMasivo").text();

        if (titulo == "Actualización masiva de inventario") {
            for (let j = 0; j < 1; j++) {
                if (XL_row_object1[j][0] != "Serial" || XL_row_object1[j][1] != "Placa" || XL_row_object1[j][2] != "Id_Proveedor" || XL_row_object1[j][3] != "Id_Nombre_Activo"
                    || XL_row_object1[j][4] != "Id_Procesador" || XL_row_object1[j][5] != "Id_RAM" || XL_row_object1[j][6] != "Id_Disco"
                    || XL_row_object1[j][7] != "Id_Marca" || XL_row_object1[j][8] != "Id_Ciudad" || XL_row_object1[j][9] != "Id_Sede" || XL_row_object1[j][10] != "Id_Piso"
                    || XL_row_object1[j][11] != "Id_Puesto" || XL_row_object1[j][12] != "Estado") {
                    ValidaeEncabezados = false;
                    MensajeAlertaValidacionExcel("Plantilla Incorrecta, valide el archivo.");
                } else {
                    // Agregar un dato en la posición 9 en todos los arrays
                    for (var i = 0; i < XL_row_object1.length; i++) {
                        if (i === 0) {
                            XL_row_object1[i].splice(12, 0, "Usuario_Asignar");
                        } else {
                            XL_row_object1[i].splice(12, 0, "");
                        }
                    }
                };
            };
        } else if (TipoProceso == "FileDataDesasignarExcel") {
            for (let j = 0; j < 1; j++) {
                if (XL_row_object1[j][0] != "Serial") {
                    ValidaeEncabezados = false;
                    MensajeAlertaValidacionExcel("Plantilla Incorrecta, valide el archivo.");
                }
            };
        } else if (titulo == "Devolución a proveedor masiva de inventario") {
            for (let j = 0; j < 1; j++) {
                if (XL_row_object1[j][0] != "Serial" || XL_row_object1[j][1] != "Motivo") {
                    ValidaeEncabezados = false;
                    MensajeAlertaValidacionExcel("Plantilla Incorrecta, valide el archivo.");
                }
            };
        } else if (TipoProceso == "FileDataAsignarExcel") {
            for (let j = 0; j < 1; j++) {
                if (XL_row_object1[j][0] != "Serial") {
                    ValidaeEncabezados = false;
                    MensajeAlertaValidacionExcel("Plantilla Incorrecta, valide el archivo.");
                    reiniciarExcel(TipoProceso)
                }
            };
        } else if (TipoProceso == "FileDataHomeOfficeExcel") {
            for (let j = 0; j < 1; j++) {
                if (XL_row_object1[j][0] != "Serial") {
                    ValidaeEncabezados = false;
                    MensajeAlertaValidacionExcel("Plantilla Incorrecta, valide el archivo.");
                    reiniciarExcel(TipoProceso)
                }
            };
        } else {
            for (let j = 0; j < 1; j++) {
                if (XL_row_object1[j][0] != "Serial" || XL_row_object1[j][1] != "Placa" || XL_row_object1[j][2] != "Descripcion" || XL_row_object1[j][3] != "Id_Proveedor" || XL_row_object1[j][4] != "Id_Nombre_Activo"
                    || XL_row_object1[j][5] != "Id_Procesador" || XL_row_object1[j][6] != "Id_RAM" || XL_row_object1[j][7] != "Id_Disco"
                    || XL_row_object1[j][8] != "Id_Marca" || XL_row_object1[j][9] != "Id_Ciudad" || XL_row_object1[j][10] != "Id_Sede" || XL_row_object1[j][11] != "Id_Piso"
                    || XL_row_object1[j][12] != "Id_Puesto" || XL_row_object1[j][13] != "Usuario_Asignar" || XL_row_object1[j][14] != "Estado") {
                    ValidaeEncabezados = false;
                    MensajeAlertaValidacionExcel("Plantilla Incorrecta, valide el archivo.");
                };
            };
        };


        if (ValidaeEncabezados) {
            if (TipoProceso == "FileDataDesasignarExcel") {
                //Crear un array con los seriales sin el titulo
                DevolverSeriales = Array.from(XL_row_object1.slice(1), function (item) {
                    return item[0].toUpperCase().trim();
                });
                ValidacionesDevolucion();
            } else if (titulo == "Devolución a proveedor masiva de inventario") {
                for (let i = 1; i < XL_row_object1.length; i++) {
                    XL_row_object1[i][0] = (XL_row_object1[i][0]).toUpperCase().trim();//Serial
                    XL_row_object1[i][1] = (XL_row_object1[i][1]); //Motivo
                };
                ValidacionesDevolucionProveedor();
            } else if (TipoProceso == "FileDataAsignarExcel") {
                for (let i = 1; i < XL_row_object1.length; i++) {
                    XL_row_object1[i][0] = (XL_row_object1[i][0]).toUpperCase().trim();//Serial
                };
                ValidacionesAsignacion();
            } else if (TipoProceso == "FileDataHomeOfficeExcel") {
                for (let i = 1; i < XL_row_object1.length; i++) {
                    XL_row_object1[i][0] = (XL_row_object1[i][0]).toUpperCase().trim();//Serial
                };
                ValidacionesHomeOffice();
            } else {
                for (let i = 1; i < XL_row_object1.length; i++) {
                    XL_row_object1[i][0] = (XL_row_object1[i][0]).toUpperCase().trim();//Serial
                    XL_row_object1[i][1] = (XL_row_object1[i][1]).toUpperCase().trim(); //Placa
                    XL_row_object1[i][2] = (XL_row_object1[i][2]).trim(); //Descripcion
                    XL_row_object1[i][3] = (XL_row_object1[i][3]).trim(); //Id_Proveedor
                    XL_row_object1[i][4] = (XL_row_object1[i][4]).trim(); //Id_Nombre_Activo
                    XL_row_object1[i][5] = (XL_row_object1[i][5]).trim(); //Id_Procesador
                    XL_row_object1[i][6] = (XL_row_object1[i][6]).trim(); //Id_RAM
                    XL_row_object1[i][7] = (XL_row_object1[i][7]).trim(); //Id_Disco
                    XL_row_object1[i][8] = (XL_row_object1[i][8]).trim(); //Id_Marca
                    XL_row_object1[i][9] = (XL_row_object1[i][9]).trim(); //Id_Ciudad
                    XL_row_object1[i][10] = (XL_row_object1[i][10]).trim(); //Id_Sede
                    XL_row_object1[i][11] = (XL_row_object1[i][11]).trim(); //Id_Piso
                    XL_row_object1[i][12] = (XL_row_object1[i][12]).trim(); //Id_Puesto
                    if ((XL_row_object1[i][13]).trim() == "1") {
                        XL_row_object1[i][13] = "True";
                    } else if ((XL_row_object1[i][13]).trim() == "0") {
                        XL_row_object1[i][13] = "False";
                    };
                };
                ValidacionesExcelCargueYUpdate();
            }

            json_object1 = JSON.stringify(XL_row_object1);
            jsonOutput1 = JSON.stringify(JSON.parse(json_object1), undefined, 4);
        };
    }
    reader1.onerror = function (event) {
    }
    reader1.readAsBinaryString(file);
    //$('.spinner-border').fadeOut(500);
};

// ========================= Begin Asignar Dispositivos de excel ========================= //

//Validaciones de los seriales a asignar
function ValidacionesHomeOffice() {
    let serialSet = new Set();
    let primerUsuario = null;
    for (let l = 1; l < XL_row_object1.length; l++) {
        let Serial = XL_row_object1[l][0];

        // Valida que el serial no tiene usuario asignado.
        var serialSinUsuario = window.DatosInventario.filter(function (el) { return ((el.Identificacion_Usuario == null && el.Identificacion_Usuario == "") && el.Serial == Serial) });
        (serialSinUsuario.length > 0) && (!serialConAsignacion.includes(Serial)) ? serialConAsignacion.push(Serial) : '';

        var MismoUsuario = window.DatosInventario.filter(function (el) {
            primerUsuario == null && el.Serial == Serial ? primerUsuario = el.Identificacion_Usuario : '';
            return (el.Serial == Serial && el.Identificacion_Usuario == primerUsuario)
        });
        (MismoUsuario.length == 0) && (!diferenteUsuario.includes(Serial)) ? diferenteUsuario.push(Serial) : '';

        // Valida serial Repetido
        serialSet.has(Serial) ? ExcelSerialesRepetidos.push(Serial) : serialSet.add(Serial);

        //Valida serial Inexiste
        var existeSerial = window.DatosInventario.filter(function (el) { return (el.Serial == Serial) });
        (existeSerial.length == 0) && (!serialExiste.includes(Serial)) ? serialExiste.push(Serial) : '';

        //Valida si el inventario esta inactivo
        var InvInactivo = window.DatosInventario.filter(function (el) { return (el.Serial == Serial && el.Id_Estado_Inventario == "False") });
        (InvInactivo.length > 0) && (!InvInac.includes(Serial)) ? InvInac.push(Serial) : '';
    };
}

//Validar archivo de excel devolucion a proveedor masiva
function validaExcelHomeoffice(TipoProcesoReceived, EnviarRegresar) {
    var retorno = true;
    for (let i = 1; i < XL_row_object1.length; i++) {
        let Serial = XL_row_object1[i][0];
        if (Serial.length > 100 || Serial.length <= 0) {
            retorno = false;
            MensajeAlertaValidacionExcel("Un Serial contiene mas de 100 caracteres o esta en blanco, valide el archivo.");
            break;
        } else if ((serialConAsignacion.length > 0)) {
            retorno = false;
            MensajeAlertaValidacionExcel("El archivo contiene los siguientes números de seriales que No tienen asignación de usuario: " + serialConAsignacion.join(' - '));
            serialConAsignacion = [];
            break;
        } else if ((diferenteUsuario.length > 0)) {
            retorno = false;
            MensajeAlertaValidacionExcel("El archivo contiene los siguientes números de seriales que tienen diferente usuario asignado: " + diferenteUsuario.join(' - '));
            diferenteUsuario = [];
            break;
        } else if (ExcelSerialesRepetidos.length > 0) {
            retorno = false;
            MensajeAlertaValidacionExcel("El archivo contiene números de seriales repetidos: " + ExcelSerialesRepetidos.join(' - '));
            ExcelSerialesRepetidos = [];
            break;
        } else if ((serialExiste.length > 0)) {
            retorno = false;
            MensajeAlertaValidacionExcel("El archivo contiene los siguientes numeros de seriales inexistentes en el sistema!: " + serialExiste.join(' - '));
            serialExiste = [];
            break;
        } else if ((InvInac.length > 0)) {
            retorno = false;
            MensajeAlertaValidacionExcel("El archivo contiene los siguientes numeros de seriales inactivos en el sistema: " + InvInac.join(' - '));
            InvInac = [];
            break;
        }

        if (EnviarRegresar == "Enviar") {
            let HomeEnviar = window.DatosInventario.filter(function (el) { return (el.Serial == Serial && el.Home_Office == "SI") });
            if (HomeEnviar.length > 0) {
                retorno = false;
                MensajeAlertaValidacionExcel("El archivo contiene dispositivos que ya estan en home office, por favor valide: " + HomeEnviar[0].Serial);
                break;
            }
        } else if (EnviarRegresar == "Regresar") {
            let HomeRegresar = window.DatosInventario.filter(function (el) { return (el.Serial == Serial && el.Home_Office == "NO") });
            if (HomeRegresar.length > 0) {
                retorno = false;
                MensajeAlertaValidacionExcel("El archivo contiene dispositivos que No estan en home office, por favor valide:" + HomeRegresar[0].Serial);
                break;
            }
        }

    };

    if (retorno) {
        return XL_row_object1;
    } else {
        reiniciarExcel(TipoProcesoReceived)
        return retorno
    };

    
};
// ========================= End Agignar Dispositivos de excel ========================= //


// ========================= Begin Asignar Dispositivos de excel ========================= //

//Validaciones de los seriales a asignar
function ValidacionesAsignacion() {
    let serialSet = new Set();
    for (let l = 1; l < XL_row_object1.length; l++) {
        let Serial = XL_row_object1[l][0];
        // Valida que el serial no tiene usuario asignado.
        var serialSinUsuario = window.DatosInventario.filter(function (el) { return ((el.Identificacion_Usuario != null && el.Identificacion_Usuario != "") && el.Serial == Serial) });
        (serialSinUsuario.length > 0) && (!serialConAsignacion.includes(Serial)) ? serialConAsignacion.push(Serial) : '';

        // Valida serial Repetido
        serialSet.has(Serial) ? ExcelSerialesRepetidos.push(Serial) : serialSet.add(Serial);

        //Valida serial Inexiste
        var existeSerial = window.DatosInventario.filter(function (el) { return (el.Serial == Serial) });
        (existeSerial.length == 0) && (!serialExiste.includes(Serial)) ? serialExiste.push(Serial) : '';

        //Valida si el inventario esta inactivo
        var InvInactivo = window.DatosInventario.filter(function (el) { return (el.Serial == Serial && el.Id_Estado_Inventario == "False") });
        (InvInactivo.length > 0) && (!InvInac.includes(Serial)) ? InvInac.push(Serial) : '';
    };
}

//Validar archivo de excel devolucion a proveedor masiva
function validaExcelAsignar(TipoProcesoReceived) {
    var retorno = true;
    for (let i = 1; i < XL_row_object1.length; i++) {
        let Serial = XL_row_object1[i][0];
        if (Serial.length > 100 || Serial.length <= 0) {
            retorno = false;
            MensajeAlertaValidacionExcel("Un Serial contiene mas de 100 caracteres o esta en blanco, valide el archivo.");
            break;
        } else if ((serialConAsignacion.length > 0)) {
            retorno = false;
            MensajeAlertaValidacionExcel("El archivo contiene los siguientes números de seriales que tienen asignación de usuario: " + serialConAsignacion.join(' - '));
            serialConAsignacion = [];
            break;
        } else if (ExcelSerialesRepetidos.length > 0) {
            retorno = false;
            MensajeAlertaValidacionExcel("El archivo contiene números de seriales repetidos: " + ExcelSerialesRepetidos.join(' - '));
            ExcelSerialesRepetidos = [];
            break;
        } else if ((serialExiste.length > 0)) {
            retorno = false;
            MensajeAlertaValidacionExcel("El archivo contiene los siguientes numeros de seriales inexistentes en el sistema!: " + serialExiste.join(' - '));
            serialExiste = [];
            break;
        } else if ((InvInac.length > 0)) {
            retorno = false;
            MensajeAlertaValidacionExcel("El archivo contiene los siguientes numeros de seriales inactivos en el sistema: " + InvInac.join(' - '));
            InvInac = [];
            break;
        }
    };

    if (retorno) {
        return XL_row_object1;
    } else {
        reiniciarExcel(TipoProcesoReceived)
        return retorno
    };

    
};

// ========================= End Agignar Dispositivos de excel ========================= //


// ========================= Begin Desasignar Dispositivos de excel ========================= //

//Validaciones de los seriales a devolver
function ValidacionesDevolucion() {
    DevolverSeriales.forEach(dato => {
        // Valida si el serial tiene usuario asignado.
        var serialSinUsuario = window.DatosInventario.filter(function (el) { return ((el.Identificacion_Usuario == null || el.Identificacion_Usuario == "") && el.Serial == dato) });
        (serialSinUsuario.length > 0) && (!serialSinAsignacion.includes(dato)) ? serialSinAsignacion.push(dato) : '';
        // Valida si los seriales corresponden al mismo usuario, para actualizacion masiva.
        var serialMismoUsuario = window.DatosInventario.filter(function (el) { return ((el.Identificacion_Usuario != null || el.Identificacion_Usuario != "") && el.Serial == dato) });
        (serialMismoUsuario.length > 0) && (!serialMismaAsignacion.includes(serialMismoUsuario[0].Identificacion_Usuario)) ? serialMismaAsignacion.push(serialMismoUsuario[0].Identificacion_Usuario) : '';
    });
    const tieneDuplicados = DevolverSeriales.length !== new Set(DevolverSeriales).size;
    tieneDuplicados ? SerialesRepetidos = true : SerialesRepetidos = false
}

//Validar archivo de excel devolucion masiva
function validaExcelDevolver(TipoProcesoReceived) {
    var retorno = true;
    if ((serialSinAsignacion.length > 0)) {
        MensajeAlertaValidacionExcel("El archivo contiene los siguientes números de seriales que no tienen asignación de usuario: " + serialSinAsignacion.join(' - '));
        serialSinAsignacion = [];
        retorno = false;
    } else if (serialMismaAsignacion.length > 1) {
        MensajeAlertaValidacionExcel("El archivo contiene números de seriales que pertenecen a diferentes usuarios, por favor valide.");
        serialMismaAsignacion = [];
        retorno = false;
    } else if (SerialesRepetidos) {
        MensajeAlertaValidacionExcel("El archivo contiene números de seriales repetidos, por favor valide.");
        SerialesRepetidos = false;
        retorno = false;
    }
    if (retorno) {
        return XL_row_object1;
    } else {
        reiniciarExcel(TipoProcesoReceived)
        return retorno
    };
}

// ========================= End Desasignar Dispositivos de excel ========================= //

//Validaciones de los seriales a devolver a proveedor
function ValidacionesDevolucionProveedor() {
    let serialSet = new Set();
    for (let l = 1; l < XL_row_object1.length; l++) {
        let Serial = XL_row_object1[l][0];
        // Valida que el serial no tiene usuario asignado.
        var serialSinUsuario = window.DatosInventario.filter(function (el) { return ((el.Identificacion_Usuario != null && el.Identificacion_Usuario != "") && el.Serial == Serial) });
        (serialSinUsuario.length > 0) && (!serialConAsignacion.includes(Serial)) ? serialConAsignacion.push(Serial) : '';

        // Valida serial Repetido
        serialSet.has(Serial) ? ExcelSerialesRepetidos.push(Serial) : serialSet.add(Serial);

        //Valida serial Inexiste
        var existeSerial = window.DatosInventario.filter(function (el) { return (el.Serial == Serial) });
        (existeSerial.length == 0) && (!serialExiste.includes(Serial)) ? serialExiste.push(Serial) : '';

        //Valida si el inventario esta asignado
        var InvAsignado = window.DatosInventario.filter(function (el) { return (el.Serial == Serial && el.Identificacion_Usuario != null) });
        (InvAsignado.length > 0) && (!InvAsig.includes(Serial)) ? InvAsig.push(Serial) : '';
    };
}

//hacer todas las validaciones en el excel Recorre el excel de cargue y actualizacion. 
function ValidacionesExcelCargueYUpdate() {
    let primerUsuarioAsignar = XL_row_object1[1][12];
    let serialSet = new Set();
    for (let l = 1; l < XL_row_object1.length; l++) {
        let Serial = XL_row_object1[l][0];
        let Id_Proveedor = XL_row_object1[l][3];
        let Id_Nombre_Activo = XL_row_object1[l][4];
        let Id_Procesadores = XL_row_object1[l][5];
        let Id_RAM = XL_row_object1[l][6];
        let Id_Discos = XL_row_object1[l][7];
        let Id_Marca = XL_row_object1[l][8];
        let Id_Ciudad = XL_row_object1[l][9];
        let Id_Sede = XL_row_object1[l][10];
        let Id_Piso = XL_row_object1[l][11];
        let Id_Puesto = XL_row_object1[l][12];
        //let Usuario_Asignar = XL_row_object1[l][13];

        //Valida serial Existe
        var existeSerial = window.DatosInventario.filter(function (el) { return (el.Serial == Serial) });
        (existeSerial.length > 0) && (!serialExiste.includes(Serial)) ? serialExiste.push(Serial) : '';

        //Valida si existe proveedor
        var existeProveedor = allProveedor.filter(function (el) { return (el.Id_Proveedor == Id_Proveedor) });
        (existeProveedor.length == 0) && (!proveedorNoExiste.includes(Id_Proveedor)) ? proveedorNoExiste.push(Id_Proveedor) : '';

        //Valida si existe nombre de activo
        var existeNombreActivo = allNombreActivo.filter(function (el) { return (el.Id_Tipo_Activo == Id_Nombre_Activo) });
        (existeNombreActivo.length == 0) && (!nombreActivoNoExiste.includes(Id_Nombre_Activo)) ? nombreActivoNoExiste.push(Id_Nombre_Activo) : '';


        //Valida si el activo necesita Procesador, Ram y Disco.
        var ProcesadorRamDisco = allNombreActivo.filter(function (el) { return (el.Id_Tipo_Activo == Id_Nombre_Activo && el.ProcesadorRamDisco == "True") });
        (ProcesadorRamDisco.length > 0)
            && (!necesitaProcesadorRamDisco.includes(Id_Nombre_Activo))
            && (Id_Procesadores == "" || Id_Procesadores == undefined || Id_Procesadores == null || Id_Procesadores == "null"
                || Id_RAM == "" || Id_RAM == undefined || Id_RAM == null || Id_RAM == "null"
                || Id_Discos == "" || Id_Discos == undefined || Id_Discos == null || Id_Discos == "null")
            ? necesitaProcesadorRamDisco.push(Id_Nombre_Activo) : '';

        //Valida si el activo NO necesita Procesador, Ram y Disco.
        var NoProcesadorRamDisco = allNombreActivo.filter(function (el) { return (el.Id_Tipo_Activo == Id_Nombre_Activo && el.ProcesadorRamDisco != "True") });
        (NoProcesadorRamDisco.length > 0)
            && (!noNecesitaProcesadorRamDisco.includes(Id_Nombre_Activo))
            && (Id_Procesadores != "" || Id_RAM != "" || Id_Discos != "")
            ? noNecesitaProcesadorRamDisco.push(Id_Nombre_Activo) : '';

        //Valida si existe Procesador
        if (Id_Procesadores != "") {
            var existeNombreProcesador = allNombreProcesadores.filter(function (el) { return (el.Id == Id_Procesadores) });
            (existeNombreProcesador.length == 0) && (!nombreProcesadorNoExiste.includes(Id_Procesadores)) ? nombreProcesadorNoExiste.push(Id_Procesadores) : '';
        }

        //Valida si existe RAM
        if (Id_RAM != "") {
            var existeNombreRAM = allNombreRAM.filter(function (el) { return (el.Id == Id_RAM) });
            (existeNombreRAM.length == 0) && (!nombreRAMNoExiste.includes(Id_RAM)) ? nombreRAMNoExiste.push(Id_RAM) : '';
        }

        //Valida si existe Disco
        if (Id_Discos != "") {
            var existeNombreDisco = allNombreDiscos.filter(function (el) { return (el.Id == Id_Discos) });
            (existeNombreDisco.length == 0) && (!nombreDiscoNoExiste.includes(Id_Discos)) ? nombreDiscoNoExiste.push(Id_Discos) : '';
        }

        //Valida si existe id marca
        var existeMarca = allMarca.filter(function (el) { return (el.Id_Marca == Id_Marca) });
        (existeMarca.length == 0) && (!marcaNoExiste.includes(Id_Marca)) ? marcaNoExiste.push(Id_Marca) : '';

        //Valida si existe id ciudad
        var existeCiudad = allCiudades.filter(function (el) { return (el.Id_Ciudad == Id_Ciudad) });
        (existeCiudad.length == 0) && (!ciudadNoExiste.includes(Id_Ciudad)) ? ciudadNoExiste.push(Id_Ciudad) : '';

        //Valida si existe puesto piso y sede
        var existePuesto = allPuestos.filter(function (el) { return (el.Id_Puesto == Id_Puesto) });
        var existePiso = existePuesto.filter(function (el) { return (el.Id_Piso == Id_Piso) });
        var existeSede = existePiso.filter(function (el) { return (el.Id_Sede == Id_Sede) });
        (existeSede.length == 0) && (!puestoNoExiste.includes(Id_Puesto)) ? puestoNoExiste.push(Id_Puesto) : '';

        // //Valida si existe id usuarios
        // var existeUsuario = allUsuarios.filter(function (el) { return (el.Identificacion_Usuario == Usuario_Asignar) });
        // (existeUsuario.length == 0) && (!usuarioNoExiste.includes(Usuario_Asignar)) && usuarioNoExiste != "" ? usuarioNoExiste.push(Usuario_Asignar) : '';

        // // Valida si es el mismo usuario a asignar
        // if (Usuario_Asignar !== primerUsuarioAsignar) {
        //     UsuarioAsignarDiferente.push(Usuario_Asignar);
        // };

        // Valida serial Repetido
        serialSet.has(Serial) ? SerialRepetido.push(Serial) : serialSet.add(Serial);

        var InvAsignado = window.DatosInventario.filter(function (el) { return (el.Serial == Serial && el.Identificacion_Usuario != null) });
        (InvAsignado.length > 0) && (!InvAsig.includes(Serial)) ? InvAsig.push(Serial) : '';
    };
};


//Mensajes de validacion para el excel
function MensajeAlertaValidacionExcel(mensaje) {
    swal("Alto!", "" + mensaje + "", "error").then((result) => {
        if (result === true) {
            jsonOutput1 = "";
            XL_row_object1 = "";
            json_object1 = "";
            $("#FileData").val("");
        }
    });
};


//Validar archivo de excel cargue y actualizacion masiva
function validaExcelCargueYUpdate() {
    var retorno = true;
    const isNumber = n => $.isNumeric(n);
    for (let i = 1; i < XL_row_object1.length; i++) {
        let Serial = XL_row_object1[i][0];
        let Placa = XL_row_object1[i][1];
        let Descripcion = XL_row_object1[i][2];
        let Id_Proveedor = XL_row_object1[i][3];
        let Id_Nombre_Activo = XL_row_object1[i][4];
        let Id_Procesador = XL_row_object1[i][5];
        let Id_RAM = XL_row_object1[i][6];
        let Id_Disco = XL_row_object1[i][7];
        let Id_Marca = XL_row_object1[i][8];
        let Id_Ciudad = XL_row_object1[i][9];
        let Id_Sede = XL_row_object1[i][10];
        let Id_Piso = XL_row_object1[i][11];
        let Id_Puesto = XL_row_object1[i][12];
        let Estado = XL_row_object1[i][13];

        if (Serial.length > 100 || Serial.length <= 0) {
            retorno = false;
            MensajeAlertaValidacionExcel("Un Serial contiene mas de 100 caracteres o esta en blanco, valide el archivo.");
            return false;
        } else if ((Placa.length > 100 || Placa.length <= 0) && $("#tituloModalMasivo").text() == "Cargue masivo de inventario") {
            retorno = false;
            MensajeAlertaValidacionExcel("Una Placa contiene mas de 100 caracteres o esta en blanco, valide el archivo.");
            return false;
        } else if ((Descripcion.length > 200 || Descripcion.length <= 0) && $("#tituloModalMasivo").text() == "Cargue masivo de inventario") {
            retorno = false;
            MensajeAlertaValidacionExcel("Una Descripción contiene mas de 200 caracteres o esta en blanco, valide el archivo.");
            return false;
        } else if ((isNumber(Id_Proveedor) !== true || Id_Proveedor.length > 4 || Id_Proveedor.length <= 0) && $("#tituloModalMasivo").text() == "Cargue masivo de inventario") {
            retorno = false;
            MensajeAlertaValidacionExcel("El id de un proveedor no es numerico o esta en blanco, valide el archivo.");
            return false;
        } else if ((isNumber(Id_Nombre_Activo) !== true || Id_Nombre_Activo.length > 4 || Id_Nombre_Activo.length <= 0) && $("#tituloModalMasivo").text() == "Cargue masivo de inventario") {
            retorno = false;
            MensajeAlertaValidacionExcel("El id de un nombre de activo no es numerico o esta en blanco, valide el archivo.");
            return false;
        } else if ((isNumber(Id_Marca) !== true || Id_Marca.length > 4 || Id_Marca.length <= 0) && $("#tituloModalMasivo").text() == "Cargue masivo de inventario") {
            retorno = false;
            MensajeAlertaValidacionExcel("El id de una marca no es numerico o esta en blanco, valide el archivo.");
            return false;
        } else if ((isNumber(Id_Ciudad) !== true || Id_Ciudad.length > 4 || Id_Ciudad.length <= 0) && $("#tituloModalMasivo").text() == "Cargue masivo de inventario") {
            retorno = false;
            MensajeAlertaValidacionExcel("El id de una Ciudad no es numerico o esta en blanco, valide el archivo.");
            return false;
        } else if ((Id_Sede.length > 1 || Id_Sede.length <= 0) && $("#tituloModalMasivo").text() == "Cargue masivo de inventario") {
            retorno = false;
            MensajeAlertaValidacionExcel("El id de una Sede esta en blanco, valide el archivo.");
            return false;
        } else if ((isNumber(Id_Piso) !== true || Id_Piso.length > 4 || Id_Piso.length <= 0) && $("#tituloModalMasivo").text() == "Cargue masivo de inventario") {
            retorno = false;
            MensajeAlertaValidacionExcel("El id de un Piso no es numerico o esta en blanco, valide el archivo.");
            return false;
        } else if ((isNumber(Id_Puesto) !== true || Id_Puesto.length > 4 || Id_Puesto.length <= 0) && $("#tituloModalMasivo").text() == "Cargue masivo de inventario") {
            retorno = false;
            MensajeAlertaValidacionExcel("El id de un Puesto no es numerico o esta en blanco, valide el archivo.");
            return false;
        } else if ((Estado != "True" && Estado != "False") && $("#tituloModalMasivo").text() == "Cargue masivo de inventario") {
            retorno = false;
            MensajeAlertaValidacionExcel("El Estado de un dispositivo no es 1 ni 0, valide el archivo.");
            return false;
        } else if ((usuarioNoExiste.length > 0) && $("#tituloModalMasivo").text() == "Cargue masivo de inventario") {
            debugger;
            retorno = false;
            MensajeAlertaValidacionExcel("El archivo contiene Usuarios que no existen en el sistema: " + usuarioNoExiste.join(' - '));
            usuarioNoExiste = [];
            return false;
        } else if ((proveedorNoExiste.length > 0) && $("#tituloModalMasivo").text() == "Cargue masivo de inventario") {
            retorno = false;
            MensajeAlertaValidacionExcel("El archivo contiene Proveedores que no existen en el sistema: " + proveedorNoExiste.join(' - '));
            proveedorNoExiste = [];
            return false;
        } else if ((nombreActivoNoExiste.length > 0) && $("#tituloModalMasivo").text() == "Cargue masivo de inventario") {
            retorno = false;
            MensajeAlertaValidacionExcel("El archivo contiene Nombre de activos que no existen en el sistema: " + nombreActivoNoExiste.join(' - '));
            nombreActivoNoExiste = [];
            return false;
        } else if ((necesitaProcesadorRamDisco.length > 0) && $("#tituloModalMasivo").text() == "Cargue masivo de inventario") {
            retorno = false;
            MensajeAlertaValidacionExcel("El archivo contiene activos que necesitan Procesador, RAM y Disco: " + necesitaProcesadorRamDisco.join(' - '));
            necesitaProcesadorRamDisco = [];
            return false;
        } else if ((noNecesitaProcesadorRamDisco.length > 0) && $("#tituloModalMasivo").text() == "Cargue masivo de inventario") {
            retorno = false;
            MensajeAlertaValidacionExcel("El archivo contiene activos que NO necesitan Procesador, RAM y Disco: " + noNecesitaProcesadorRamDisco.join(' - '));
            noNecesitaProcesadorRamDisco = [];
            return false;
        } else if ((nombreProcesadorNoExiste.length > 0) && $("#tituloModalMasivo").text() == "Cargue masivo de inventario") {
            retorno = false;
            MensajeAlertaValidacionExcel("El archivo contiene Procesadores que no existen en el sistema: " + nombreProcesadorNoExiste.join(' - '));
            nombreProcesadorNoExiste = [];
            return false;
        } else if ((nombreRAMNoExiste.length > 0) && $("#tituloModalMasivo").text() == "Cargue masivo de inventario") {
            retorno = false;
            MensajeAlertaValidacionExcel("El archivo contiene id de RAM que no existen en el sistema: " + nombreRAMNoExiste.join(' - '));
            nombreRAMNoExiste = [];
            return false;
        } else if ((nombreDiscoNoExiste.length > 0) && $("#tituloModalMasivo").text() == "Cargue masivo de inventario") {
            retorno = false;
            MensajeAlertaValidacionExcel("El archivo contiene Discos que no existen en el sistema: " + nombreDiscoNoExiste.join(' - '));
            nombreDiscoNoExiste = [];
            return false;
        } else if ((marcaNoExiste.length > 0) && $("#tituloModalMasivo").text() == "Cargue masivo de inventario") {
            retorno = false;
            MensajeAlertaValidacionExcel("El archivo contiene Marcas que no existen en el sistema: " + marcaNoExiste.join(' - '));
            marcaNoExiste = [];
            return false;
        } else if ((ciudadNoExiste.length > 0) && $("#tituloModalMasivo").text() == "Cargue masivo de inventario") {
            retorno = false;
            MensajeAlertaValidacionExcel("El archivo contiene Ciudades que no existen en el sistema: " + ciudadNoExiste.join(' - '));
            ciudadNoExiste = [];
            return false;
        } else if ((puestoNoExiste.length > 0) && $("#tituloModalMasivo").text() == "Cargue masivo de inventario") {
            retorno = false;
            MensajeAlertaValidacionExcel("El archivo contiene Puestos que no Concuerdan con el piso y la Sede del sistema: " + puestoNoExiste.join(' - '));
            puestoNoExiste = [];
            return false;
        } else if ((UsuarioAsignarDiferente.length > 0) && $("#tituloModalMasivo").text() == "Cargue masivo de inventario") {
            retorno = false;
            MensajeAlertaValidacionExcel("El archivo contiene usuarios a asignar diferentes. por favor valide el archivo.");
            UsuarioAsignarDiferente = [];
            return false;
        } else if ((serialExiste.length > 0) && $("#tituloModalMasivo").text() == "Cargue masivo de inventario") {
            retorno = false;
            MensajeAlertaValidacionExcel("El archivo contiene los siguientes numeros de seriales existentes en el sistema: " + serialExiste.join(' - ') + ", los cuales deben cargarse desde el boton de Actualización Masiva");
            serialExiste = [];
            return false;
        } else if ((SerialRepetido.length > 0)) {
            retorno = false;
            MensajeAlertaValidacionExcel("El archivo contiene los siguientes numeros de seriales repetidos: " + SerialRepetido.join(' - '));
            SerialRepetido = [];
            return false;
        } else if ((InvAsig.length > 0)) {
            retorno = false;
            MensajeAlertaValidacionExcel("El archivo contiene los siguientes numeros de seriales con asignación: " + InvAsig.join(' - '));
            InvAsig = [];
            return false;
        };

        if (retorno) {
            return true;
        };
    };
}

//Validar archivo de excel devolucion a proveedor masiva
function validaExcelDevolverProveedor() {
    var retorno = true;
    for (let i = 1; i < XL_row_object1.length; i++) {
        let Serial = XL_row_object1[i][0];
        let Motivo = XL_row_object1[i][1];
        if (Serial.length > 100 || Serial.length <= 0) {
            retorno = false;
            MensajeAlertaValidacionExcel("Un Serial contiene mas de 100 caracteres o esta en blanco, valide el archivo.");
            return false;
        } else if ((Motivo.length > 300 || Motivo.length <= 0) && $("#tituloModalMasivo").text() == "Devolución a proveedor masiva de inventario") {
            retorno = false;
            MensajeAlertaValidacionExcel("Un Motivo contiene mas de 300 caracteres o esta en blanco, valide el archivo.");
            return false;
        } else if ((serialConAsignacion.length > 0) && $("#tituloModalMasivo").text() == "Devolución a proveedor masiva de inventario") {
            retorno = false;
            MensajeAlertaValidacionExcel("El archivo contiene los siguientes números de seriales que tienen asignación de usuario: " + serialConAsignacion.join(' - '));
            serialConAsignacion = [];
            return false;
        } else if (ExcelSerialesRepetidos.length > 0 && $("#tituloModalMasivo").text() == "Devolución a proveedor masiva de inventario") {
            retorno = false;
            MensajeAlertaValidacionExcel("El archivo contiene números de seriales repetidos: " + ExcelSerialesRepetidos.join(' - '));
            ExcelSerialesRepetidos = [];
            return false;
        } else if ((serialExiste.length > 0) && $("#tituloModalMasivo").text() == "Devolución a proveedor masiva de inventario") {
            retorno = false;
            MensajeAlertaValidacionExcel("El archivo contiene los siguientes numeros de seriales inexistentes en el sistema: " + serialExiste.join(' - '));
            serialExiste = [];
            return false;
        } else if ((InvAsig.length > 0) && $("#tituloModalMasivo").text() == "Devolución a proveedor masiva de inventario") {
            retorno = false;
            MensajeAlertaValidacionExcel("El archivo contiene los siguientes numeros de seriales con asignación: " + InvAsig.join(' - '));
            InvAsig = [];
            return false;
        }

        if (retorno) {
            return true;
        };
    };
};


//Funcion para agregar y actualizar masivamento usuarios mediante excel
async function CargueMasivo() {
    try {
        let validacionExcel = await validaExcelCargueYUpdate();
        if (validacionExcel) {
            enviarExcel();
        } else {
            reiniciarExcel();
        };
    } catch (error) {
        swal("Upps!", "Por favor seleccione un archivo valido.", "error");
    }
}

function enviarExcel() {
    User = localStorage.getItem("User_Inventarios");
    if (User) {
        User = JSON.parse(atob(User));
        User = User[0];
    } else {
        window.location.assign("index.html");
    };
    if ($("#FileData").val() != "") {
        var data1 = jsonOutput1;
        $.ajax({
            type: 'POST',
            url: Url_Backend + "DebuggDataT?UserGeneral=" + User.Identificacion_Usuario,
            dataType: 'json',
            contentType: "application/json",
            headers: {
                Authorization: token_type + " " + access_token,
            },
            async: true,
            data: data1,
            beforeSend: function () { },
            success: function (response) {
                if (response == "OK") {
                    swal("Bien!", "Su registro fue cargado con éxito", "success").then((result) => {
                        if (result == true) {
                            window.location.href = 'Inventario.html'
                        };
                    });
                } else {
                    swal("Upps!", "Ha ocurrido un error, " + response.toString(), "error");
                    reiniciarExcel();
                }
            },
            error: function (error) {
                swal("Upps!", "No pudo guardarse el registro", "error");
                reiniciarExcel();
            },
            timeout: 30000
        });
        $(".spinner-border").fadeOut();
    } else {
        swal.fire("Alto", "No hay archivo adjunto", "error");
        //$(".spinner-border").fadeOut();
    };
}

function reiniciarExcel(TipoProceso) {
    //$(".spinner-border").fadeOut();
    jsonOutput1 = "";
    XL_row_object1 = "";
    json_object1 = "";
    $(`#${TipoProceso}`).val("");
}

async function DevolverInvProveedor() {
    try {
        let validacionSeriales = await validaExcelDevolverProveedor();
        if (validacionSeriales) {
            for (let l = 1; l < XL_row_object1.length; l++) {
                await enviarAjaxDevolverProveedor(XL_row_object1[l][0], XL_row_object1[l][1]);
            };

            swal("Bien!", "Se devolvierón los dispositivos satisfactoriamente al proveedor.", "success").then((result) => {
                if (result == true) {
                    window.location.href = 'Inventario.html'
                };
            });
        } else {
            reiniciarExcel();
        }
    } catch (error) {
        swal("Upps!", "Por favor seleccione un archivo valido.", "error");
    }
}

function enviarAjaxDevolverProveedor(serial, motivo) {
    User = localStorage.getItem("User_Inventarios");
    if (User) {
        User = JSON.parse(atob(User));
        User = User[0];
    } else {
        window.location.assign("index.html");
    };

    return new Promise((resolve, reject) => {
        var Param = {
            Serial: serial,
            Motivo: motivo,
            Char: 1,
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
                resolve(true);
            },
            error: function (err) {
                reject(err);
            },
            timeout: 300000,
        });
    });
}

function SelectorMasivo(received) {
    var configuraciones = {
        "CargarInventarioBtn": {
            titulo: "Cargue masivo de inventario",
            linkDescarga: "files/CargueMasiva.xlsx",
            //funcion: CargueMasivo,
            textoBoton: "Cargar",
            nombreBoton: "CargueMasivo"
        },
        "ActualizarInventarioBtn": {
            titulo: "Actualización masiva de inventario",
            linkDescarga: "files/ActualizacionMasiva.xlsx",
            //funcion: CargueMasivo,
            textoBoton: "Actualizar",
            nombreBoton: "CargueMasivo"
        },
        "DevolucionProveedorInventarioBtn": {
            titulo: "Devolución a proveedor masiva de inventario",
            linkDescarga: "files/DevolucionProveedorMasiva.xlsx",
            //funcion: CargueMasivo,
            textoBoton: "Devolver",
            nombreBoton: "DevolverInvProveedor"
        }
    };

    if (configuraciones.hasOwnProperty(received)) {
        var configuracion = configuraciones[received];
        $("#tituloModalMasivo").text(configuracion.titulo);
        $('#linkDescarga').attr('href', configuracion.linkDescarga);
        //$("#InventarioMasivo").off("click").on("click", configuracion.funcion);
        $("#InventarioMasivo").text(configuracion.textoBoton);
        $("#InventarioMasivo").attr("onclick", configuracion.nombreBoton + "()");
    }
    $('#ModalCargueInventario').modal('show');
}

function ObtenerDatosBase() {
    GetAjaxAll("GetIdentificacionUsuarios", "allUsuarios");
    GetAjaxAll("GetMarcas", "allMarca");
    GetAjaxAll("GetProveedores", "allProveedor");
    GetAjaxAll("GetTipoActivo", "allNombreActivo");
    GetAjaxAll("GetProcesadores", "allNombreProcesadores");
    GetAjaxAll("GetRAM", "allNombreRAM");
    GetAjaxAll("GetDisco", "allNombreDiscos");
    GetAjaxAll("GetCiudades", "allCiudades");
    GetAjaxAll("GetSede", "allSedes");
    GetAjaxAll("GetPisos", "allPisos");
    GetAjaxAll("GetPuestos", "allPuestos");
};
function GetAjaxAll(Api, variable) {
    $.ajax({
        url: Url_Backend + Api,
        type: 'GET',
        contentType: 'application/json',
        headers: {
            'Authorization': token_type + ' ' + access_token
        },
        async: false,
        success: function (response) {
            window[variable] = response;
            if ("allNombreActivo" == variable || "allNombreProcesadores" == variable) {
            }
            //
        },
        error: function (error) {
            swal("Upps!", "Error al obtener listado de usuarios: " + error, "error");
        },
        timeout: 300000
    });
}