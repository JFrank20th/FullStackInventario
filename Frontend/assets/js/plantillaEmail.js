var Url_Backend = "http://localhost:57737/";
//var Url_Backend = window.location.origin + '/inventario/Backend/';
var access_token;
var token_type;
var User;
var editorAgregar;
var editorActualizar;
var AllTemplates;
var OperacionesMain;
editorAgregar = new RichTextEditor("#div_editoAgregar");
editorActualizar = new RichTextEditor("#div_editoActu");

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
    
    GetplantillasCorreo();

};

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
        url: Url_Backend + "Get_Modulo_Operaciones?Role=" + User.Id_Rol + "&Modulo=Plantillas de Correos",
        beforeSend: function () { },
        success: function (response) {
            OperacionesMain = response;
            console.log(OperacionesMain);
        },
        error: function (err) { },
        timeout: 300000,
    });
}

//Tabla de Usuarios
function GetplantillasCorreo() {
    editorAgregar.setHTMLCode('');
    editorActualizar.setHTMLCode('');
    $.ajax({
        url: Url_Backend + "GetTemplateMail",
        type: 'GET',
        contentType: 'application/json',
        headers: {
            'Authorization': token_type + ' ' + access_token
        },
        async: false,
        success: function (response) {
            let AgregarMain = OperacionesMain.find(function(item) { return item.Id_Operacion === '2'}).Id_Estado == "True" ? true : false
            let ModificarMain = OperacionesMain.find(function(item) { return item.Id_Operacion === '3'}).Id_Estado == "True" ? true : false
            let DesactivarMain = OperacionesMain.find(function(item) { return item.Id_Operacion === '4'}).Id_Estado == "True" ? true : false

            if (AgregarMain) {
                $("#AgregarMain").empty();
                $("#AgregarMain").append(`
                <button type="button" class="btn btn-primary btn-rounded btn-sm"
                data-toggle="modal" id="AddPlantillaCorreo"
                data-target=".bd-example-modal-lg">Agregar</button>
                `);
            }

            AllTemplates = response
            $("#CardsPlantillasCorreo").empty();
            for (let i = 0; i < response.length; i++) {
                $("#CardsPlantillasCorreo").append(`
                <div class="form-group col-md-4 mb-3">
                    <div class="card">
                        <div class="card-header d-flex justify-content-between align-items-center">
                            <label>${response[i].Nombre}</label>
                            <div class="d-flex align-items-center">
                                ${DesactivarMain ? `<div class="custom-control custom-switch custom-checkbox-info mr-3" title="${response[i].Id_Estado == 1 ? "": "Activar"}" data-toggle="tooltip">
                                <input ${response[i].Id_Estado == 1 ? "disabled": ""} type="checkbox" class="custom-control-input" id="${response[i].Id}" ${response[i].Id_Estado == 1 ? "checked": ""} onclick="ActivarTemplate('${response[i].Id}')">
                                <label class="custom-control-label" for="${response[i].Id}"></label>
                                </div>` : ""}
                                
                                ${ModificarMain ? `<a href="#" class="editar" title="Editar" data-toggle="tooltip" onclick="EditarPlantillaCorreo('${response[i].Id}')">
                                <span style="color:#00b341" class="material-symbols-outlined">stylus_note</span>
                                </a>`: ""}
                                
                            </div>
                        </div>
                        <div class="card-body" style="margin-bottom: -20px">
                            <label class="d-block"><strong>Asunto: </strong>${response[i].Asunto}</label>
                            <label class="d-block"><strong>CC: </strong>${response[i].CC}</label>
                            <label class="d-block"><strong>CCO: </strong>${response[i].CCO}</label>
                        </div>
                        <hr>
                        <div class="card-body" style="margin-top: -30px">
                            <div class="card-scroll">${response[i].Body}</div>
                        </div>
                    </div>
                </div>
                `);
            }
        },
        error: function (error) {
            swal("Upps!", "Error al obtener los datos de los Centros de costos: " + error, "error");
        },
        timeout: 300000
    });

};

//Activar plantilla de correo
function ActivarTemplate(Id) {
    var Param = {
        Id : Id,
        Id_Estado : 1
    };
    $.ajax({
        url: Url_Backend + "ActiveTemplateMail",
        type: "POST",
        dataType: "json",
        contentType: "application/x-www-form-urlencoded; charset=utf-8",
        headers: {
            'Authorization': token_type + ' ' + access_token
        },
        data: Param,
        async: false,
        beforeSend: function () { },
        success: function (response) {
            swal("Bien!", "la plantilla se activo correctamente", "success");
            Inicializador();
        },
        error: function (err) {
            swal("Ey!", "Error al activar la plantilla de correo: " + err, "error");
        },
        timeout: 300000,
    });
};


//Funcion editar plantilla de correo
function EditarPlantillaCorreo(id) {
    var TemplateToEdit = AllTemplates.find(Template => Template.Id == id);
    document.getElementById("Id").value = TemplateToEdit.Id;
    document.getElementById("NombreActu").value = TemplateToEdit.Nombre;
    document.getElementById("AsuntoActu").value = TemplateToEdit.Asunto;
    document.getElementById("CCActu").value = TemplateToEdit.CC;
    document.getElementById("CCOActu").value = TemplateToEdit.CCO;
    editorActualizar.setHTMLCode(TemplateToEdit.Body);
    $("#GSCCModal2").modal("show");
}

$("#AddPlantillaCorreo").click(function () {
    editorAgregar.setHTMLCode('');
});

//Guardar plantilla de correo
function GuardarPlantillaCorreo() {
    var CC = $("#CCAgre").val();
    var CCO = $("#CCOAgre").val();
    var arrayIds = [];
    $("#GSCCModal :input[required]:not(:file,:submit)").each(function () {
        var id = $(this).attr("id");
        if (id !== undefined) {
            arrayIds.push(id);
        }
    });
    for (let campo of arrayIds) {
        let valor = $("#" + campo).val();
        if (!valor || valor.trim() === "") {
            toastr.error('Por favor completar todos los campos.');
            return;
        }
    }
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const correosCC = CC.split(';');
    const correosCCO = CCO.split(';');
    const correosCCValidos = correosCC.every(correo => regex.test(correo.trim()));
    const correosCCOValidos = correosCCO.every(correo => regex.test(correo.trim()));
    if (!correosCCValidos || !correosCCOValidos) {
        if (!correosCCValidos && !correosCCOValidos) {
            toastr.error('No son válidos los correos electrónicos de CC y CCO');
        } else if (!correosCCValidos) {
            toastr.error('No son válidos los correos electrónicos de CC');
        } else {
            toastr.error('No son válidos los correos electrónicos de CCO');
        }
        return;
    }
    var Param = {
        Nombre : $("#NombreAgre").val(),
        Asunto : $("#AsuntoAgre").val(),
        CC : $("#CCAgre").val(),
        CCO : $("#CCOAgre").val(),
        Body: editorAgregar.getHTMLCode()
    };
    $.ajax({
        url: Url_Backend + "InsertTemplateMail",
        type: "POST",
        dataType: "json",
        contentType: "application/x-www-form-urlencoded; charset=utf-8",
        headers: {
            'Authorization': token_type + ' ' + access_token
        },
        data: Param,
        async: false,
        beforeSend: function () { },
        success: function (response) {
            swal("Bien!", "la plantilla de correo fue agregada correctamente", "success");
            $("#GSCCModal").modal("hide");
            Inicializador();
        },
        error: function (err) {
            swal("Ey!", "Error al agregar plantilla de correo: " + err, "error");
        },
        timeout: 300000,
    });
};

//Actualizar plantillas de correo
function ActualizarPlantillaCorreo() {
    var CC = $("#CCActu").val();
    var CCO = $("#CCOActu").val();
    var arrayIds = [];
    $("#GSCCModal2 :input[required]:not(:file,:submit)").each(function () {
        var id = $(this).attr("id");
        if (id !== undefined) {
            arrayIds.push(id);
        }
    });
    for (let campo of arrayIds) {
        let valor = $("#" + campo).val();
        if (!valor || valor.trim() === "") {
            toastr.error('Por favor completar todos los campos.');
            return;
        }
    }
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const correosCC = CC.split(';');
    const correosCCO = CCO.split(';');
    const correosCCValidos = correosCC.every(correo => regex.test(correo.trim()));
    const correosCCOValidos = correosCCO.every(correo => regex.test(correo.trim()));
    if (!correosCCValidos || !correosCCOValidos) {
        if (!correosCCValidos && !correosCCOValidos) {
            toastr.error('No son válidos los correos electrónicos de CC y CCO');
        } else if (!correosCCValidos) {
            toastr.error('No son válidos los correos electrónicos de CC');
        } else {
            toastr.error('No son válidos los correos electrónicos de CCO');
        }
        return;
    }
    var Param = {
        Id : $("#Id").val(),
        Nombre : $("#NombreActu").val(),
        Asunto : $("#AsuntoActu").val(),
        CC : $("#CCActu").val(),
        CCO : $("#CCOActu").val(),
        Body: editorActualizar.getHTMLCode()
    };
    $.ajax({
        url: Url_Backend + "UpdateTemplateMail",
        type: "POST",
        dataType: "json",
        contentType: "application/x-www-form-urlencoded; charset=utf-8",
        headers: {
            'Authorization': token_type + ' ' + access_token
        },
        data: Param,
        async: false,
        beforeSend: function () { },
        success: function (response) {
            swal("Bien!", "la plantilla de correo se actualizo correctamente", "success");
            $("#GSCCModal2").modal("hide");
            Inicializador();
        },
        error: function (err) {
            swal("Ey!", "Error al actualizar la plantilla de correo: " + err, "error");
        },
        timeout: 300000,
    });
};

function validarCorreos(input) {
    // Obtener el valor del campo de entrada
    const value = input.value.trim();

    // Dividir las direcciones de correo electrónico utilizando punto y coma
    const correos = value.split(';');

    // Validar cada dirección de correo electrónico
    const correosValidos = correos.every(correo => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(correo.trim()));

    // Actualizar el estilo del campo de entrada según la validez de los correos
    if (correosValidos) {
        input.classList.remove('error');
    } else {
        input.classList.add('error');
    }
}