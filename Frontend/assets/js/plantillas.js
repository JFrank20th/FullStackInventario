var Url_Backend = "http://localhost:57737/";
//var Url_Backend = window.location.origin + '/inventario/Backend/';
var access_token;
var token_type;
var User;
var Documents;
var UlrEdit;
var TemplatesData;
var IdFile;
var Descripcion;
var Id_Plantilla;
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
    GetApiDocument()
} 

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
        url: Url_Backend + "Get_Modulo_Operaciones?Role=" + User.Id_Rol + "&Modulo=" + NombreModuloMain.split("/").pop(),
        beforeSend: function () { },
        success: function (response) {
            OperacionesMain = response;
        },
        error: function (err) { },
        timeout: 300000,
    });
}

//Funcionn para obtener todos los documentos de la Bd
function GetApiDocument() {
    $.ajax({
        url: Url_Backend + "GetApiDocument",
        type: 'GET',
        contentType: 'application/json',
        headers: {
            'Authorization': token_type + ' ' + access_token
        },
        success: function (response) {
            let AgregarMain = OperacionesMain.find(function(item) { return item.Id_Operacion === '2'}).Id_Estado == "True" ? true : false
            let ModificarMain = OperacionesMain.find(function(item) { return item.Id_Operacion === '3'}).Id_Estado == "True" ? true : false
            let DesactivarMain = OperacionesMain.find(function(item) { return item.Id_Operacion === '4'}).Id_Estado == "True" ? true : false

            if (AgregarMain) {
                $("#AgregarMain").empty();
                $("#AgregarMain").append(`
                    <button type="button" class="btn btn-primary btn-rounded btn-sm"
                    data-toggle="modal" onclick="UploadFile()"
                    data-target=".bd-example-modal-lg">Agregar</button>
                `);
            }

            $("#card-documents").empty();
            Tablecolumns = [
                {
                    "title": "Id",
                    "data": "Id_Plantilla"
                },
                {
                    "title": "Nombre",
                    "data": "Nombre"
                },
                {
                    "title": "Descripcion",
                    "data": "Descripcion"
                },
                {
                    "title": "Tipo Plantilla",
                    "data": "Tipo_Plantilla"
                },
                {
                    "title": "Cant. Tokens",
                    "data": "Token"
                },
                {
                    "title": "Acciones",
                    "defaultContent": `
                    ${ModificarMain ? `<a href="#" class="editar ModificarMain" title="Editar" data-toggle="tooltip">
                    <span style="color:#00b341" class="material-symbols-outlined">stylus_note</span>
                    </a> ` : ''}
                    ${DesactivarMain ? `<a href="#" class="eliminar" title="Activar" data-toggle="tooltip">
                    <span style="color:#0532fa" class="material-symbols-outlined">task_alt</span>
                    </a>` : ''}
                    `
                }];

            if ($.fn.dataTable.isDataTable('#TablaPlantillas')) {
                TablaPlantillas.destroy();
            }
            TablaPlantillas = $("#TablaPlantillas").DataTable({
                pageLength: 10,
                lengthMenu: [
                    [10, 20, 30, -1],
                    [10, 20, 30, "Todos"]
                ],
                data: response,
                columns: Tablecolumns,
                select: true,
                fnRowCallback: function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
                    if (aData.Id_Estado == "True") {
                        var svg = $(nRow).find('.eliminar span');
                        var nuevoSVG = '\
                            <span style="color:#597e8d" class="material-symbols-outlined">cancel</span>';
                        svg.html(nuevoSVG);
                        $('.eliminar', nRow).attr('title', 'Inactivar');
                    };
                },
            });

            //Obtener datos al darle click en editar
            $("#TablaPlantillas tbody").on("click", "a.editar", function () {
                var dataEditar = TablaPlantillas.row($(this).parents("tr")).data();
                EditTemplate(dataEditar);

            });

            //Obtener datos al darle click en eliminar
            $("#TablaPlantillas tbody").on("click", "a.eliminar", function () {
                var dataEliminar = TablaPlantillas.row($(this).parents("tr")).data();
                desactivarTemplate(dataEliminar);
            });


            //Funcion editar
            function EditTemplate(data) {
                $('#PlantillaIframe').modal('show');
                $('#Descripcion').val(data.Descripcion);
                $('#tituloModalPlantilla').text("Plantilla: " + data.Nombre);
                PermissionsEdit(data);
                IdFile = data.Id_Acta_Drive;
                Id_Plantilla = data.Id_Plantilla
                Descripcion = data.Descripcion
            }

            //Funcion desactivar
            function desactivarTemplate(data) {
                var mensaje = data.Id_Estado === "True" ? "¿Está seguro de Desactivar la plantilla?" : "¿Está seguro de Activar la plantilla?"
                var mensajeSuccess = data.Id_Estado === "True" ? "Se ha desactivado con exito" : "Se ha activado con exito"
                var Param = {
                    Id_Plantilla: data.Id_Plantilla,
                    Id_Estado: data.Id_Estado === "True" ? 0 : 1
                }
                swal({
                    title: mensaje,
                    icon: "warning",
                    buttons: true,
                    dangerMode: true,
                })
                    .then((willDelete) => {
                        if (willDelete) {
                            $.ajax({
                                type: 'POST',
                                dataType: 'json',
                                contentType: "application/x-www-form-urlencoded; charset=utf-8",
                                url: Url_Backend + 'UpdateApiDocument',
                                headers: {
                                    'Authorization': token_type + ' ' + access_token
                                },
                                async: false,
                                data: Param,
                                beforeSend: function () { },
                                success: function (response) {
                                    swal('Listo!', mensajeSuccess, 'success').then((result) => {
                                        if (result == true) {
                                            GetApiDocument();
                                        }
                                    });
                                },
                                error: function (err) {
                                    swal("Error!", "Ha ocurrido un error al cambiar el estado", "error");
                                },
                                timeout: 300000
                            });
                        } else {
                            return false;
                        }
                    });
            };
        },
        error: function (error) { },
        timeout: 300000

    });

}

//Funcion para abrir los documentos en un iframe
function PermissionsEdit(data) {
    $.ajax({
        url: Url_Backend + "PermissionsEdit?idFile=" + data.Id_Acta_Drive,
        type: 'GET',
        contentType: 'application/json',
        headers: {
            'Authorization': token_type + ' ' + access_token
        },
        async: false,
        success: function (response) {
            var regex = /"/g
            const nuevaStr = response.replace(regex, '');
            $("#iframelink").prop('src', nuevaStr);
            GetTokensUsuario();
            GetTokensFijos();
            GetTokens(data.Id_Plantilla);
        },
        error: function (error) { },
        timeout: 300000
    });
}

//Traer todos los tokens
function GetTokens(Id_Plantilla) {

    $.ajax({
        url: Url_Backend + "GetTokensAcive?Id_Plantilla=" + Id_Plantilla,
        type: 'GET',
        contentType: 'application/json',
        headers: {
            'Authorization': token_type + ' ' + access_token
        },
        async: false,
        success: function (response) {
            $("#AccordeonTokensDinamicos").empty();
            for (let i = 0; i < response.length; i++) {
                $("#AccordeonTokensDinamicos").append(`
                <div class="accordion-row">
                    <a href="#" class="accordion-header">
                        <span>${response[i].Nombre}</span>
                        <i class="accordion-status-icon close fa fa-chevron-up"></i>
                        <i class="accordion-status-icon open fa fa-chevron-down"></i>
                    </a>
                    <div class="accordion-body">
                        <p>${response[i].Descripcion}</p>
                        <p>Usar:</h6>
                        <h6>${response[i].Token}</h6>
                        <button type="button" class="btn btn-info btn-xs" onclick="copiarTexto(this)">Copiar</button>
                    </div>
                </div>`);
            };
        },
        error: function (error) { },
        timeout: 300000
    });
};

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
            $("#AccordeonTokensFijos").empty();
            for (let i = 0; i < response.length; i++) {
                $("#AccordeonTokensFijos").append(`
                <div class="accordion-row">
                    <a href="#" class="accordion-header">
                        <span>${response[i].Nombre}</span>
                        <i class="accordion-status-icon close fa fa-chevron-up"></i>
                        <i class="accordion-status-icon open fa fa-chevron-down"></i>
                    </a>
                    <div class="accordion-body">
                        <p>${response[i].Descripcion}</p>
                        <p>Usar:</h6>
                        <h6>${response[i].Token}</h6>
                        <button type="button" class="btn btn-info btn-xs" onclick="copiarTexto(this)">Copiar</button>
                    </div>
                </div>`);
            };
        },
        error: function (error) { },
        timeout: 300000
    });
};

//Traer todos los tokens fijos
function GetTokensUsuario() {
    $.ajax({
        url: Url_Backend + "GetTokensUsuario",
        type: 'GET',
        contentType: 'application/json',
        headers: {
            'Authorization': token_type + ' ' + access_token
        },
        async: false,
        success: function (response) {
            $("#AccordeonTokensUsuario").empty();
            for (let i = 0; i < response.length; i++) {
                $("#AccordeonTokensUsuario").append(`
                <div class="accordion-row">
                    <a href="#" class="accordion-header">
                        <span>${response[i].Nombre}</span>
                        <i class="accordion-status-icon close fa fa-chevron-up"></i>
                        <i class="accordion-status-icon open fa fa-chevron-down"></i>
                    </a>
                    <div class="accordion-body">
                        <p>${response[i].Descripcion}</p>
                        <p>Usar:</h6>
                        <h6>${response[i].Token}</h6>
                        <button type="button" class="btn btn-info btn-xs" onclick="copiarTexto(this)">Copiar</button>
                    </div>
                </div>`);
            };
        },
        error: function (error) { },
        timeout: 300000
    });
};

//Abrir modal de carga de documentos
function UploadFile() {
    $('#UploadFile').modal('show');
    $('#DescriptionTemplate').val('');
    $.ajax({
        url: Url_Backend + "GetTipoPlantillas",
        type: 'GET',
        contentType: 'application/json',
        headers: {
            'Authorization': token_type + ' ' + access_token
        },
        async: false,
        success: function (response) {
            $("#TipoPlantilla").empty();
            $("#TipoPlantilla").append(`<option value="" selected disabled>Seleccione...</option>`);
            for (let i = 0; i < response.length; i++) {
                $("#TipoPlantilla").append(`
                    <option value=${response[i].Id}>${response[i].Tipo_Plantilla}</option>
                `);
            }
        },
        error: function (error) { },
        timeout: 300000
    });
};

//Validar si la descripcion cambio
$('#Descripcion').on('keyup', function () {
    Descripcion == $("#Descripcion").val() ? $('#BotonDescripcion').attr('disabled', true) : $('#BotonDescripcion').removeAttr('disabled')
});

//Actualizar descripcion de una plantilla.
function UpdateDescripcion() {
    var Param = {
        Id_Plantilla: Id_Plantilla,
        Descripcion: $("#Descripcion").val()
    }
    swal({
        title: "Está seguro de Actualizar la descripción?",
        icon: "warning",
        buttons: true,
        dangerMode: true,
    })
        .then((willDelete) => {
            if (willDelete) {
                $.ajax({
                    type: 'POST',
                    dataType: 'json',
                    contentType: "application/x-www-form-urlencoded; charset=utf-8",
                    url: Url_Backend + 'UpdateDescriptionApiDocument',
                    headers: {
                        'Authorization': token_type + ' ' + access_token
                    },
                    async: false,
                    data: Param,
                    beforeSend: function () { },
                    success: function (response) {
                        swal('Listo!', "Se ha actualizado la descripción con exito.", 'success').then((result) => {
                            if (result == true) {
                                GetApiDocument();
                            }
                        });
                    },
                    error: function (err) {
                        swal("Error!", "Ha ocurrido un error al cambiar el estado", "error");
                    },
                    timeout: 300000
                });
            } else {
                return false;
            }
        });
}

//Funcion para convertir los documentos en Base64
const toBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
});


function CargarArchivo() {
    var Descripcion = $("#DescriptionTemplate").val();
    var TipoPlantilla = $("#TipoPlantilla").val();
    var UploadFileDoc = $("#UploadFileDoc").val();
    if(Descripcion == "" || TipoPlantilla == "" || TipoPlantilla == null  || UploadFileDoc == ""){
        swal("Ey!", "Es obligatorio llenar todos los campos", "error");
        return;
    };
    ToBase64();
}

//Funcion para separar Base64
async function ToBase64() {
    var general;
    var data;
    var Base;
    var name;
    var file = document.querySelector('#UploadFileDoc').files[0];
    var Base64 = await toBase64(file);
    general = Base64.split(";");
    data = general[0].replace("data:", "");
    Base = general[1].replace("base64,", "");
    name = (document.querySelector('#UploadFileDoc').files[0].name);
    LoadFile(name, data, Base);
}

//Funcion para cargar los archivos en el drive
function LoadFile(nameFile, mimetype, fileBase64) {
    $(".preloader").show();
    var Param = {
        nameFile: nameFile,
        mimetype: mimetype,
        fileBase64: fileBase64,
    };
    $.ajax({
        type: 'POST',
        contentType: "application/json",
        url: Url_Backend + 'LoadFile',
        headers: {
            'Authorization': token_type + ' ' + access_token
        },
        //async: true,
        data: JSON.stringify(Param),
        beforeSend: function () { },
        success: function (response) {
            var regex = /"/g
            const nuevaStr = response.replace(regex, '');
            InsertApiDocument(nuevaStr, nameFile, fileBase64);

        },
        error: function (err) {
            $('#pageloader-overlay').fadeOut(500);
            swal("Error!", "Ha ocurrido un error", "error");
        },
        timeout: 300000
    });
}

//Funcion para guardar el Id del documento en la Bd
function InsertApiDocument(IdFile, nameFile, fileBase64) {
    $(".preloader").show();
    var Param = {
        Id_Plantilla: '',
        Nombre: nameFile,
        Descripcion: $('#DescriptionTemplate').val(),
        Id_Tipo_Plantilla: $('#TipoPlantilla').val(),
        Id_Acta_Drive: IdFile,
        Id_Estado: 1,
    };
    $.ajax({
        type: 'POST',
        dataType: 'json',
        contentType: 'application/json',
        headers: {
            'Authorization': token_type + ' ' + access_token
        },
        url: Url_Backend + 'InsertApiDocument',
        data: JSON.stringify(Param),
        beforeSend: function () {
        },
        success: function (response) {
            swal('Listo!', 'Se ha Guardado con Éxito', 'success').then((result) => {
                if (result == true) {
                    GetApiDocument();
                    $('#UploadFile').modal('hide');
                }
            });
            $(".preloader").hide();
        },
        error: function (err) {
            swal("Error!", "Ha ocurrido un error", "error");
        },
        timeout: 300000
    });
}

function copiarTexto(button) {
    var textoACopiar = button.parentElement.querySelector("h6").innerText;
    // Intenta copiar el texto al portapapeles usando el API Clipboard
    navigator.clipboard.writeText(textoACopiar)
        .then(function () {
            //alert("Texto copiado al portapapeles: " + textoACopiar);
        })
        .catch(function (err) {
            console.error("No se pudo copiar el texto: " + err);
        });
}
