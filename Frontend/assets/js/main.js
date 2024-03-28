var Url_Backend = "http://localhost:57737/";
//var Url_Backend = window.location.origin + '/inventario/Backend/';
var User;
var access_token;
var token_type;
var pathname
var ModulosAll
var NombreModuloMain;
var PermisoOperacionesMain;

$(document).ready(function () {
    User = localStorage.getItem("User_Inventarios");

    if (User) {
        User = JSON.parse(atob(User));
        User = User[0];
    } else {
        window.location.assign("index.html");
    }
    pathname = window.location.pathname;
    pathname = pathname.replace(/\//g, ""); // Comentar esta linea en produccion
    pathname = pathname.replace(/\#/g, "");
    window.NombreModuloMain = pathname.replace(/\.html$/, "");
    // pathname = pathname.substring(pathname.lastIndexOf("/") + 1); //Descomentar esta en produccion
    //Cambia el Nombre
    $("#nameUser").empty();
    $("#nameUser").append(User.Nombres + " " + User.Apellidos);
    //Cambia el Titulo por el nombre
    $("#NameHover").attr("data-original-title", User.Nombres + " " + User.Apellidos);
    //Cambia el Rol
    $("#roleUser").empty();
    $("#roleUser").append(User.Nombre_Rol);
    Trae_Modulos_Accesibles(User.Id_Rol);
    $("[data-toggle='tooltip']").tooltip();

    //Quitar elemento de la pagina
    var div = document.getElementById('');
    //div.parentNode.removeChild(div);

    toastr.options = {
        positionClass: "toast-top-center",
        timeOut: 3000,
        progressBar: true,
        showMethod: "slideDown",
        hideMethod: "slideUp",
        showDuration: 200,
        hideDuration: 200,
    };
    GetSuspendPermissions(); //Suspender permisos despues de una hora!!
});


$(".Logout").click(function () {
    localStorage.removeItem("User_Inventarios");
    window.location.assign("index.html");
});

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
            swal("Upps!", "Usuario y/o Contraseña Incorrectos", "warning");
            window.location.assign("index.html");
        },
        timeout: 300000,
    });
}

// Función Encargada de validar que el/los módulo(s) de los usuarios sea validada dentro de la BD
function Trae_Modulos_Accesibles(Role) {
    ObtenerToken(User.Identificacion_Usuario, User.Password);
    $.ajax({
        type: "GET",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        headers: {
            Authorization: token_type + " " + access_token,
        },
        async: false,
        url: Url_Backend + "Get_Acceso_Modulos?Role=" + Role,

        beforeSend: function () { },
        success: function (response) {
            if (response != "") {
                ModulosAll = response;
                //Nombre Modulos del padre
                var FiltroModulos = ModulosAll.filter(
                    (Module) => Module.Url === pathname
                )
                //Nombre padre Modulos
                var Filtropadre = ModulosAll.filter(
                    (Module) => Module.Id_Modulo === FiltroModulos[0].Id_Menu
                );
                $("#NombreModuloPadre").empty();
                $("#NombreModuloPadre").text(Filtropadre[0].Nombre_Modulo);
                $("#RutaModulos").empty();
                $("#RutaModulos").append(`
                <li class='breadcrumb-item'>
                    <a href='#'>
                        <span style="vertical-align: middle;">${Filtropadre[0].Icono}</span>
                        <span>${Filtropadre[0].Nombre_Modulo}</span> 
                    </a>
                </li>
                <li class='breadcrumb-item active' aria-current='page'>${FiltroModulos[0].Nombre_Modulo}</li>`);

                $("#MenuPadre").empty();
                $("#MenuHijo").empty();

                ModulosAll.forEach((Modulo) => {
                    if (Modulo.Id_Menu === "0") {
                        $("#MenuPadre").append(`
                            <li><a href="#" data-toggle="tooltip" data-placement="right" title=" ${Modulo.Nombre_Modulo} " data-nav-target="#Modulo${Modulo.Id_Modulo}">
                                    ${Modulo.Icono}
                                </a>
                            </li>`
                        );

                        $("#MenuHijo").append(`
                            <div id="Modulo${Modulo.Id_Modulo}">
                                <ul id="ul${Modulo.Id_Modulo}">
                                    <li style="color:#17a2b8"  class="navigation-divider">${Modulo.Nombre_Modulo}</li>
                                </ul>
                            </div>`
                        );

                        if (Modulo.Id_Modulo === Filtropadre[0].Id_Modulo) {
                            $("#Modulo" + Modulo.Id_Modulo).addClass("open");
                            $("a[data-nav-target='#Modulo" + Modulo.Id_Modulo + "']").addClass("active");
                        };

                    }
                });

                ModulosAll.forEach((Modulo) => {
                    if (Modulo.Id_Menu !== "0") {
                        $("#ul" + Modulo.Id_Menu).append(`<li><a  href="${Modulo.Url}" >${Modulo.Nombre_Modulo}</a></li>`);

                        if (Modulo.Id_Modulo === FiltroModulos[0].Id_Modulo) {
                            $("a[href='/" + Modulo.Url + "']").addClass("active");
                        };

                    } 
                });

                setTimeout(() => {
                    TraerOperacionesMain();
                    TraerOperaciones(Role, ModulosAll);
                    Inicializador();
                }, 100);

            } else {
                //window.location.assign("index.html");
            };

        },
        error: function (err) { },
        timeout: 300000,
    });
};


// Función Encargada de validar que el/los módulo(s) de los usuarios sea validada dentro de la BD
function TraerOperaciones(Role, ModulosAll) {
    ObtenerToken(User.Identificacion_Usuario, User.Password);
    $.ajax({
        type: "GET",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        headers: {
            Authorization: token_type + " " + access_token,
        },
        async: false,
        url: Url_Backend + "Get_Modulo_Operaciones?Role=" + Role + "&Modulo=" + NombreModuloMain,
        beforeSend: function () { },
        success: function (response) {
            var Operaciones = response;
            for (let i = 0; i < Operaciones.length; i++) {

                switch (Operaciones[i].Operacion) {
                    case "Ver":
                        if (Operaciones[i].Id_Estado == "True") {
                            //OK
                        } else {
                            $(".wrapper").css("filter", "blur(8px)");

                            swal("Error!", "No tiene permisos para ver este modulo", "error").then((result) => {
                                if (result.isConfirmed) {
                                    //Verificar a donde enviarlo si no tiene acceso a este modulo
                                    var FiltroModulos = ModulosAll.filter((Module) =>
                                        Module.Url !== null &&
                                        Module.Url !== "" &&
                                        Module.Url !== ""
                                    );
                                    FiltroModulos = FiltroModulos.filter(
                                        (Module) => Module.Operacion === "Ver"
                                    );
                                    location.href = FiltroModulos[0].Url;
                                };
                            });
                        };
                        break;
                    case "Agregar":
                        
                        if (Operaciones[i].Id_Estado == "True") {
                            $(".AgregarMain").attr("disabled", false);
                        } else {
                            $(".AgregarMain").attr("disabled", true);
                        }
                        break;
                    case "Modificar":
                        if (Operaciones[i].Id_Estado == "True") {
                            $(".ModificarMain").attr("disabled", false);
                        } else {
                            $(".ModificarMain").attr("disabled", true);
                        }
                        break;
                    case "Desactivar":
                        if (Operaciones[i].Id_Estado == "True") {
                            $(".Desactivar").attr("disabled", false);
                        } else {
                            $(".Desactivar").attr("disabled", true);
                        }
                        break;

                    default:
                        break;
                }
            }
        },
        error: function (err) { },
        timeout: 300000,
    });
}

function ValidarCampos() {
    var ValidacionR = true;
    $(".Validar").each(function () {
        if (
            $(this).val() === "" ||
            $(this).val() === null ||
            $(this).val() === undefined
        ) {
            $(this).removeClass("is-valid");
            $(this).addClass("is-invalid");
            ValidacionR = false;
        } else {
            $(this).removeClass("is-invalid");
            $(this).addClass("is-valid");
        }
    });
    return ValidacionR;
}

$(".Validar").change(function () {
    if ($(this).val() !== "" && $(this).val() !== null) {
        $(this).removeClass("is-invalid");
        $(this).addClass("is-valid");
    } else {
        $(this).removeClass("is-valid");
        $(this).addClass("is-invalid");
    }
});

$(".Validar").blur(function () {
    if ($(this).val() !== "" && $(this).val() !== null) {
        $(this).removeClass("is-invalid");
        $(this).addClass("is-valid");
    } else {
        $(this).removeClass("is-valid");
        $(this).addClass("is-invalid");
    }
});


function GetSuspendPermissions() {
    $.ajax({
        url: Url_Backend + "GetSuspendPermissions",
        type: 'GET',
        contentType: 'application/json',
        headers: {
            'Authorization': token_type + ' ' + access_token
        },
        success: function (response) {
            response.forEach(formElement => {
                
                console.log(formElement.Id_Acta_Drive);
                $.ajax({
                    url: Url_Backend + "SuspendPermissionsEdit?idFile=" + formElement.Id_Acta_Drive,
                    type: 'GET',
                    contentType: 'application/json',
                    headers: {
                        'Authorization': token_type + ' ' + access_token
                    },
                    async: false,
                    success: function (response) {
                    },
                    error: function (error) { },
                    timeout: 300000
                });

                $.ajax({
                    url: Url_Backend + "UpdateSuspendPermissions?idFile=" + formElement.Id_Acta_Drive,
                    type: "POST",
                    dataType: "json",
                    contentType: "application/x-www-form-urlencoded; charset=utf-8",
                    headers: {
                        'Authorization': token_type + ' ' + access_token
                    },
                    async: false,
                    beforeSend: function () { },
                    success: function (response) {
                    },
                    error: function (err) {
                        swal("Ey!", "Error al actualizar el Cargo: " + err, "error");
                    },
                    timeout: 300000,
                });
                
            });

        },
        error: function (error) { },
        timeout: 300000

    });
}

