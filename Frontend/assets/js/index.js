var Url_Backend = "http://localhost:57737/";
//var Url_Backend = window.location.origin + '/inventario/Backend/';
var access_token;
var token_type;

// Función Encargada de Obtener el Token generado por el Backend,
// para la autenticación del consumo de API's
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

// Función Encargada de validar la autenticación del Usuario
function AutenticarUsuario(url) {
    if ($("#Username").val() != "" && $("#Password").val() != "") {
        var Param = {
            Username: $("#Username").val(),
            Password: $("#Password").val(),
        };
        ObtenerToken(Param.Username, Param.Password);
        $.ajax({
            type: "GET",
            dataType: "json",
            contentType: "application/json",
            headers: {
                Authorization: token_type + " " + access_token,
            },
            url: Url_Backend + "GetUserLogin?Username=" + Param.Username + "&Password=" + Param.Password,
            beforeSend: function () { },
            success: function (response) {
                if (response != "") {
                    if (response[0].Fecha_Creacion == null || response[0].Fecha_Creacion == "") {
                        //caducidadContrasena($("#Username").val(), $("#Password").val(), response);
                        swal("Alto!", "Es su primer inicio de sesion y la contraseña debe Cambiar", "info");
                        $("#FormInicio").prop("hidden", true);
                        $("#FormCambio").removeAttr("hidden");

                    } else {
                        caducidadContrasena($("#Username").val(), $("#Password").val(), response);
                    };
                };
            },
            error: function (err) {
                swal("Upps!", "Usuario y/o Contraseña Incorrectos", "warning");
            },
            timeout: 300000,
        });
    };
};

function caducidadContrasena(entradaUsuario, entradaPassword, datosUsuario) {
    $.ajax({
        type: 'GET',
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        headers: {
            Authorization: token_type + " " + access_token,
        },
        url: Url_Backend + "CaducidadContrasena?Usuario=" + entradaUsuario + "&Password=" + entradaPassword,
        success: function (response) {
            if (response[0].DIAS == '1') {
                //Cambiar contraseña
                swal("Alto!", "La contraseña caduco y debe cambiarse", "info");
                $("#FormInicio").prop("hidden", true);
                $("#FormCambio").removeAttr("hidden");
            } else {
                localStorage.setItem("User_Inventarios", btoa(JSON.stringify(datosUsuario)));
                window.location.href = "Inventario.html";
            }
        },
        error: function (err) {
            swal("Upps!", "No se pudo comprobar la caducidad de la contraseña", "error");
        },
        timeout: 300000
    });
};

function ActualizarContrasena() {
    var UsuarioActu = $("#Username").val();
    var ContraseñaActu = $("#Password").val();
    var ContaseñaNueva = $("#NewPassword").val();
    var ContraseñaConf = $("#RepeatNewPassword").val();

    var raw = JSON.stringify({
        "Usuario": UsuarioActu,
        "Password": ContraseñaActu,
        "PasswordNuevo": ContaseñaNueva,
    });

    if (ContraseñaActu == ContaseñaNueva) {
        swal("Ey!", "La contraseña nueva no puede ser igual a la anterior", "error");
        return false;
    }

    if (ContaseñaNueva !== ContraseñaConf) {
        swal("Ey!", "Las contraseñas no coinciden", "error");
        return false;
    }

    var myregex = /^(?=.*[a-z])(?=.*[\W])(?=.*[A-Z]).{8,}$/;

    if (myregex.test(ContaseñaNueva = $("#NewPassword").val())) {

    } else {
        swal("Ey!", "La contraseña no cumple con las politicas de seguridad", "error");
        return false;
    };

    if (ContaseñaNueva == "" || ContraseñaConf == "") {
        swal("Ey!", "Todos los Campos son Obligatorios", "error");
        return false;
    };

    $.ajax({
        type: 'POST',
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        url: Url_Backend + 'CambiarContrasena',
        async: true,
        data: raw,
        beforeSend: function () { },
        success: function (response) {
            swal("Bien!", "La contraseña fue actualizada con éxito", "success").then((result) => {
                if (result == true) {
                    window.location.href = 'index.html'
                };
            });
        },
        error: function (err) {
            swal("Upps!", "No se pudo cambiar la contraseña", "error");
        },
        timeout: 300000
    });
};

$("#Restablecer").click(function () {
    $("#FormInicio").prop("hidden", true);
    $("#FormReset").removeAttr("hidden");
});