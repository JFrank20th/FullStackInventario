
var Url_Backend = "http://localhost:57737/";
//var Url_Backend = window.location.origin + '/inventario/Backend/';
var TokensFijos;
var TipoDoc;
var DatosInv;
var UsuarioAsignado;
var FirmaPendiente = false;
var DatosUsuario;

// =============================== CREACION DEL DOCUMENTO =============================== //

//Guarda los datos del formulario en un array
function CrearDocumento(datosFormulario, IdPlantilla, TipoDeSeleccion, datosSeleccionados, usuario) {
    $(".preloader").show();
    FirmaPendiente = false;
    var User = localStorage.getItem("User_Inventarios");
    if (User) {
        User = JSON.parse(atob(User));
        User = User[0];
    } else {
        window.location.assign("index.html");
    };


    UsuarioAsignado = usuario
    TipoDoc = TipoDeSeleccion;
    DatosInv = datosSeleccionados;

    GetTokensFijos();
    GetTokensUsuario();

    var datosForm = {};
    const nuevoArray = [];

    // Tokens Dinamicos
    datosFormulario.forEach(formElement => {
        var token = formElement.Token;
        var selectorId = formElement.Dato_Empleado != null ? formElement.Dato_Empleado : token.replace(/\[|\]/g, '') + "UnicoId";

        var value = formElement.Tipo_Campo === "date" ?
            CrearFecha(($("#" + selectorId).val()), formElement.Id_Tipo_Fecha) :
            formElement.Tipo_Campo === "firma" ?
                imageBase64(selectorId) :
                $("#" + selectorId).val();
        datosForm[token] = value;
    });

    //Agregar datos del Usuario logueado
    datosForm["[[IdentificacionUser]]"] = DatosUsuario[0].Identificacion_Usuario;
    datosForm["[[TipoIdentificacionUser]]"] = DatosUsuario[0].Id_Tipo_Identificacion;
    datosForm["[[NombresUser]]"] = DatosUsuario[0].Nombres;
    datosForm["[[ApellidosUser]]"] = DatosUsuario[0].Apellidos;
    datosForm["[[CargoUser]]"] = DatosUsuario[0].Cargo;
    datosForm["[[EmailUser]]"] = DatosUsuario[0].Email;
    datosForm["[[FirmaUser]]"] = DatosUsuario[0].Firma_Imagen;

    DatosInv.forEach((datos) => {
        const nuevoObjeto = {};
        TokensFijos.forEach((token) => {
            token.Token == "[[Serial]]" ? nuevoObjeto[token.Token] = datos.Serial : "";
            token.Token == "[[Placa]]" ? nuevoObjeto[token.Token] = datos.Placa : "";
            token.Token == "[[Usuario]]" ? nuevoObjeto[token.Token] = datos.Identificacion_Usuario : "";
            token.Token == "[[Proveedor]]" ? nuevoObjeto[token.Token] = datos.Proveedor : "";
            token.Token == "[[NombreActivo]]" ? nuevoObjeto[token.Token] = datos.Nombre_Activo : "";
            token.Token == "[[Marca]]" ? nuevoObjeto[token.Token] = datos.Marca : "";
            token.Token == "[[Descripcion]]" ? nuevoObjeto[token.Token] = datos.Descripcion : "";
        });
        nuevoArray.push(nuevoObjeto);
    });
    GuardarFirmausuario();
    //Se separan en dos nuevoArray es donde va a estar los datos de los dispositivo seleccionados
    const arrayEnviar = [datosForm, nuevoArray];
    DownLoadDocument(arrayEnviar, IdPlantilla);
}

function GuardarFirmausuario() {
    $(".preloader").show();
    var firmaUser = imageBase64(User.Identificacion_Usuario);
    firmaUser == "" ? null : firmaUser;
    var Param = {
        Identificacion_Usuario: User.Identificacion_Usuario,
        Firma_Imagen: firmaUser
    };
    $.ajax({
        type: 'POST',
        dataType: 'json',
        contentType: "application/x-www-form-urlencoded; charset=utf-8",
        url: Url_Backend + "UpdateFirmaImagen",
        headers: {
            'Authorization': token_type + ' ' + access_token
        },
        async: false,
        data: Param,
        beforeSend: function () { },
        success: function (response) {
        },
        error: function (err) {
            swal("Error!", "Error al actualizar la firma del usuario logueado", "error");
        },
        timeout: 300000
    });
}

function imageBase64(Id) {
    const lienzo = document.getElementById(Id);
    const context = lienzo.getContext('2d');
    const imageData = context.getImageData(0, 0, lienzo.width, lienzo.height);
    const pixels = imageData.data;
    let hasContent = false;
    for (let i = 0; i < pixels.length; i += 4) {
        const red = pixels[i];
        const green = pixels[i + 1];
        const blue = pixels[i + 2];
        const alpha = pixels[i + 3];
        if (alpha > 0) {
            hasContent = true;
            break;
        }
    }
    if (hasContent) {
        const base64ImageData = lienzo.toDataURL("image/png");
        FirmaPendiente == true ? FirmaPendiente = true : FirmaPendiente = false;
        return base64ImageData;
    } else {
        FirmaPendiente = true;
        return "";
    }
}

//Setear fecha
function CrearFecha(FechaRec, TipoFecha) {
    var fecha = new Date(FechaRec);
    if (TipoFecha == "1") { // DD/MM/AAAA
        const dia = String(fecha.getDate() + 1).padStart(2, '0');
        const mes = String(fecha.getMonth() + 1).padStart(2, '0');
        const anio = fecha.getFullYear();
        return dia + '/' + mes + '/' + anio;
    } else if (TipoFecha == "2") { // DD de MMM de AAAA
        var meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
        var dia = fecha.getDate() + 1;
        var mes = meses[fecha.getMonth()];
        var año = fecha.getFullYear();
        var fechaFormateada = dia + " de " + mes + " de " + año;
        return fechaFormateada;
    }

}

//Obtiene la plantilla 
function DownLoadDocument(arrayAllDatos, IdPLantilla) {
    $(".preloader").show();
    $.ajax({
        url: Url_Backend + "DownLoadDocument?idFile=" + IdPLantilla,
        type: 'GET',
        contentType: 'application/json',
        headers: {
            'Authorization': token_type + ' ' + access_token
        },
        async: false,
        success: function (response) {
            var objetoJSON = JSON.parse(response.replace(/"([^"]+)":/g, '"$1":'));
            var tipoDocumento = obtenerNombreYExtension(objetoJSON.nameFile);
            if (tipoDocumento.extension == ".docx") {
                CreacionActa(objetoJSON, arrayAllDatos, "CreacionActaWord");
            } else {
                CreacionActa(objetoJSON, arrayAllDatos, "CreacionActaExcel");
            }
        },
        error: function (error) { },
        timeout: 300000
    });
}

//Modifica la plantilla en el backend 
function CreacionActa(wordContent, arrayAllDatos, TipoApi) {
    $(".preloader").show();
    var tokensArray = arrayAllDatos[0];
    var tokensArrayDispositovos = arrayAllDatos[1];

    var arrayDeDatos1 = [tokensArray];
    var jsonDeDatos = JSON.stringify(arrayDeDatos1);

    var arrayDeDatos2 = [tokensArrayDispositovos];
    var jsonDeDatos2 = JSON.stringify(arrayDeDatos2);

    var Param = {
        wordContent: wordContent.fileBase64,
        arrayDeDatos: jsonDeDatos,
        arrayDeDispositivos: jsonDeDatos2
    };


    $.ajax({
        type: 'POST',
        dataType: 'json',
        contentType: "application/x-www-form-urlencoded; charset=utf-8",
        url: Url_Backend + TipoApi,
        headers: {
            'Authorization': token_type + ' ' + access_token
        },
        async: false,
        data: Param,
        beforeSend: function () { },
        success: function (response) {
            //return
            LoadFile(response, wordContent);
        },
        error: function (err) {
            swal("Error!", "Error al crear el acta", "error");
        },
        timeout: 300000
    });
}

//Obtener nombre y extension por separado
function obtenerNombreYExtension(nombreArchivo) {
    var lastIndex = nombreArchivo.lastIndexOf(".");
    var nombre = lastIndex !== -1 ? nombreArchivo.substring(0, lastIndex) : nombreArchivo;
    var extension = lastIndex !== -1 ? nombreArchivo.substring(lastIndex) : "";
    return { nombre, extension };
}

//Carga la nueva plantilla
function LoadFile(fileBase64, wordContent) { //
    $(".preloader").show();
    var NombreYExtension = obtenerNombreYExtension(wordContent.nameFile)
    var Usuario = TipoDoc == "Asignacion" ? UsuarioAsignado : TipoDoc == "AsignacionExcel" ? UsuarioAsignado : TipoDoc == "EnvHomeOfficeAsig" ? UsuarioAsignado : DatosInv[0].Identificacion_Usuario;
    var Param = {
        nameFile: NombreYExtension.nombre + " - " + Usuario + NombreYExtension.extension,
        mimetype: wordContent.mimetype,
        fileBase64: fileBase64,
    };
    $.ajax({
        type: 'POST',
        contentType: "application/json",
        url: Url_Backend + 'LoadFile',
        headers: {
            'Authorization': token_type + ' ' + access_token
        },
        async: true,
        data: JSON.stringify(Param),
        beforeSend: function () { },
        success: function (response) {
            var regex = /"/g
            const nuevaStr = response.replace(regex, '');
            InsertActa(nuevaStr, Param.nameFile)
        },
        error: function (err) {
            $('#pageloader-overlay').fadeOut(500);
            swal("Error!", "Ha ocurrido un error", "error");
        },
        timeout: 300000
    });
}

//Funcion para guardar el Id del documento en la Bd del nuevo documento
function InsertActa(IdFile, nameFile) {
    $(".preloader").show();
    var Param = {
        Id: '',
        Pendiente_Firmas: FirmaPendiente ? 1 : 0,
        Nombre: nameFile,
        Id_Acta_Drive: IdFile
    };
    $.ajax({
        type: 'POST',
        dataType: 'json',
        contentType: 'application/json',
        headers: {
            'Authorization': token_type + ' ' + access_token
        },
        url: Url_Backend + 'InsertActa',
        data: JSON.stringify(Param),
        beforeSend: function () {
        },
        success: function (response) { // 
            if (TipoDoc == "Devolucion") {
                DevolucionInventario(DatosInv, IdFile);
            } else if (TipoDoc == "Asignacion") {
                AsignacionInventario(DatosInv, IdFile);
            } else if (TipoDoc == "AsignacionExcel") {
                AsignacionInventarioExcel(DatosInv, IdFile);
            } else if (TipoDoc == "DesasignacionExcel") {
                DesasignacionInventarioExcel(DatosInv, IdFile);
            } else if (TipoDoc == "DevHomeOffice" || TipoDoc == "EnvHomeOffice") {
                EnvDevHomeOfficeInventario(DatosInv, IdFile, false, "");
            } else if (TipoDoc == "EnvHomeOfficeAsig") {
                EnvDevHomeOfficeInventario(DatosInv, IdFile, true, UsuarioAsignado);
            } else if (TipoDoc == "HomeOfficeExcel") {
                EnvDevHomeOfficeInventarioExcel(DatosInv, IdFile);
            } else if (TipoDoc == "Descuento") {
                EnviarCorreo(IdFile, DatosInv[0].Identificacion_Usuario);
            }
        },
        error: function (err) {
            swal("Error!", "Ha ocurrido un error", "error");
        },
        timeout: 300000
    });
}

//Traer todos los tokens fijos
function GetTokensFijos() {
    $.ajax({
        url: Url_Backend + "GetTokensFijos",
        type: 'GET',
        contentType: 'application/json',
        headers: {
            'Authorization': token_type + ' ' + access_token
        },
        async: false,
        success: function (response) {
            TokensFijos = response
        },
        error: function (error) { },
        timeout: 300000
    });
};

function GetTokensUsuario() {
    $.ajax({
        url: Url_Backend + "GetDatosTokensUsuario?Identificacion_Usuario=" + User.Identificacion_Usuario,
        type: 'GET',
        contentType: 'application/json',
        headers: {
            'Authorization': token_type + ' ' + access_token
        },
        async: false,
        success: function (response) {
            DatosUsuario = response
        },
        error: function (error) { },
        timeout: 300000
    });
}

//Listar plantillas
function GetPlantillasById(Id) {
    //debugger
    $.ajax({
        url: Url_Backend + "GetApiDocumentById?Id_Tipo_Plantilla=" + Id,
        type: 'GET',
        contentType: 'application/json',
        headers: {
            'Authorization': token_type + ' ' + access_token
        },
        success: function (response) {
            if (Id == 3) {
                $("#PlantillaDevolver").empty();
                $("#PlantillaAsignar").empty();
                $("#PlantillaDesasignarExcel").empty();
                $("#PlantillaAsignarExcel").empty();
                $("#PlantillaDevolver").append(`<option value="" disabled selected>Seleccione...</option>`);
                $("#PlantillaAsignar").append(`<option value="" disabled selected>Seleccione...</option>`);
                $("#PlantillaDesasignarExcel").append(`<option value="" disabled selected>Seleccione...</option>`);
                $("#PlantillaAsignarExcel").append(`<option value="" disabled selected>Seleccione...</option>`);
                for (let i = 0; i < response.length; i++) {
                    $("#PlantillaDevolver").append(`<option data-val="${response[i].Id_Acta_Drive}" value="${response[i].Id_Plantilla}" >${response[i].Id_Plantilla + " - " + response[i].Nombre} </option>`);
                    $("#PlantillaAsignar").append(`<option data-val="${response[i].Id_Acta_Drive}" value="${response[i].Id_Plantilla}" >${response[i].Id_Plantilla + " - " + response[i].Nombre} </option>`);
                    $("#PlantillaDesasignarExcel").append(`<option data-val="${response[i].Id_Acta_Drive}" value="${response[i].Id_Plantilla}" >${response[i].Id_Plantilla + " - " + response[i].Nombre} </option>`);
                    $("#PlantillaAsignarExcel").append(`<option data-val="${response[i].Id_Acta_Drive}" value="${response[i].Id_Plantilla}" >${response[i].Id_Plantilla + " - " + response[i].Nombre} </option>`);
                }
            } else if (Id == 4) {//
                $("#PlantillasDescuento").empty();
                $("#PlantillasDescuentoExcel").empty();
                $("#PlantillasDescuento").append(`<option value="" disabled selected>Seleccione...</option>`);
                $("#PlantillasDescuentoExcel").append(`<option value="" disabled selected>Seleccione...</option>`);
                for (let i = 0; i < response.length; i++) {
                    $("#PlantillasDescuento").append(`<option data-val="${response[i].Id_Acta_Drive}" value="${response[i].Id_Plantilla}" >${response[i].Id_Plantilla + " - " + response[i].Nombre} </option>`);
                    $("#PlantillasDescuentoExcel").append(`<option data-val="${response[i].Id_Acta_Drive}" value="${response[i].Id_Plantilla}" >${response[i].Id_Plantilla + " - " + response[i].Nombre} </option>`);
                }
            } else if (Id == 1 || Id == 2) { // 
                $("#PlantillaHomeOffice").empty();
                $("#PlantillasHomeOffice").empty();
                $("#PlantillaHomeOfficeExcel").empty();
                $("#PlantillasHomeOffice").empty();
                $("#PlantillaHomeOffice").append(`<option value="" disabled selected>Seleccione...</option>`);
                $("#PlantillaHomeOfficeExcel").append(`<option value="" disabled selected>Seleccione...</option>`);
                $("#PlantillasHomeOffice").append(`<option value="" disabled selected>Seleccione...</option>`);
                for (let i = 0; i < response.length; i++) {
                    $("#PlantillaHomeOffice").append(`<option data-val="${response[i].Id_Acta_Drive}" value="${response[i].Id_Plantilla}" >${response[i].Id_Plantilla + " - " + response[i].Nombre} </option>`);
                    $("#PlantillaHomeOfficeExcel").append(`<option data-val="${response[i].Id_Acta_Drive}" value="${response[i].Id_Plantilla}" >${response[i].Id_Plantilla + " - " + response[i].Nombre} </option>`);
                    $("#PlantillasHomeOffice").append(`<option data-val="${response[i].Id_Acta_Drive}" value="${response[i].Id_Plantilla}" >${response[i].Id_Plantilla + " - " + response[i].Nombre} </option>`);
                }
            }
        },
        error: function (error) { },
        timeout: 300000

    });
}


function BuscarEmpleado(Id) {
    var IdEmpleado = $(`#${Id}`).val();
    $.ajax({
        url: Url_Backend + "FindEmployees?Id=" + IdEmpleado,
        type: 'GET',
        contentType: 'application/json',
        headers: {
            'Authorization': token_type + ' ' + access_token
        },
        async: false,
        success: function (response) {
            var datos = response[0];
            for (var propiedad in datos) {
                if (datos.hasOwnProperty(propiedad)) {
                    $(`#${propiedad}`).val(datos[propiedad]);
                }
            }
        },
        error: function (error) {
            swal("Upps!", "Error al obtener listado de usuarios: " + error, "error");
        },
        timeout: 300000
    });
}