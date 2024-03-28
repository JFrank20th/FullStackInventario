var Url_Backend = "http://localhost:57737/";
//var Url_Backend = window.location.origin + '/inventario/Backend/';
var XL_row_object1 = "";
var json_object1 = "";
var jsonOutput1 = "";
var allUsuarios;
var allTipoIdentificaciones;
var allCentroCostos;
var allCargos;
var allRoles;
var allIdentificacionJefes;
var usuarioExiste = [];
var usuarioJefeExiste = [];
var tipoIdentificacionExiste = [];
var centroCostoExiste = [];
var cargoExiste = [];
var rolExiste = [];
var IdentificaionesDuplicadas = [];



//upload change event  
$("#FileData").change(function (evt) {
    //$(".spinner-border").show();
    var file1 = evt.target.files[0] //retrieve the uploaded file  
    var bool = checkfile($("#FileData").val()); // Verifica que el archivo sea xlsx.
    ObtenerDatosBase();
    if (bool) {
        fnConvertExcelToJSON1(file1);
    };
});

//verificar archivo a cargar sea excel
function checkfile(sender) {
    var validExts = new Array(".xlsx");
    sender = sender.substring(sender.lastIndexOf('.'));
    if (validExts.indexOf(sender) < 0) {
        swal("Alto", "Archivo seleccionado invalido, archivos validos tipo: " + validExts.toString(), "error").then((result) => {
            if (result.value === true) {
                $("#FileData").val("");
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


//method to convert excel to json 
function fnConvertExcelToJSON1(file) {
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
        var EncabezadosORMOnBase = JSON.stringify(XL_row_object1[0]);
        EncabezadosORMOnBase = EncabezadosORMOnBase.replace(/ /g, "");
        EncabezadosORMOnBase = EncabezadosORMOnBase.replace(/\./g, "");
        XL_row_object1[0] = JSON.parse(EncabezadosORMOnBase);
        var ValidaeEncabezados = true;
        for (let j = 0; j < 1; j++) {
            if (XL_row_object1[j][0] != "Identificacion_Usuario" || XL_row_object1[j][1] != "Id_Tipo_Identificacion" || XL_row_object1[j][2] != "Nombres" || XL_row_object1[j][3] != "Apellidos"
                || XL_row_object1[j][4] != "Direccion_Domicilio" || XL_row_object1[j][5] != "Id_Centro_Costos" || XL_row_object1[j][6] != "Id_Cargo"
                || XL_row_object1[j][7] != "Email" || XL_row_object1[j][8] != "Id_Rol" || XL_row_object1[j][9] != "Id_Estado" || XL_row_object1[j][10] != "Identificacion_Jefe") {
                ValidaeEncabezados = false;
                MensajeAlertaValidacionExcel("Plantilla Incorrecta, valide el archivo.");
            };
        };
        if (ValidaeEncabezados) {
            for (let i = 1; i < XL_row_object1.length; i++) {
                XL_row_object1[i][0] = (XL_row_object1[i][0]).trim();//Identificacion_Usuario
                XL_row_object1[i][1] = (XL_row_object1[i][1]).trim(); //Id_Tipo_Identificacion 
                XL_row_object1[i][2] = (XL_row_object1[i][2]).toLowerCase().trim().replace(/\b\w/g, l => l.toUpperCase()); //Nombres
                XL_row_object1[i][3] = (XL_row_object1[i][3]).toLowerCase().trim().replace(/\b\w/g, l => l.toUpperCase()); //Apellidos
                XL_row_object1[i][4] = (XL_row_object1[i][4]).toLowerCase().trim().replace(/\b\w/g, l => l.toUpperCase()); //Direccion_Domicilio
                XL_row_object1[i][5] = (XL_row_object1[i][5]).trim(); //Id_Centro_Costos
                XL_row_object1[i][6] = (XL_row_object1[i][6]).trim(); //Id_Cargo
                XL_row_object1[i][7] = (XL_row_object1[i][7]).toLowerCase().trim().replace(/\b\w/g, l => l.toUpperCase()); //Email
                XL_row_object1[i][8] = (XL_row_object1[i][8]).trim(); //Id_Rol
                if ((XL_row_object1[i][9]).trim() == "1") {
                    XL_row_object1[i][9] = "True";
                } else if ((XL_row_object1[i][9]).trim() == "0") {
                    XL_row_object1[i][9] = "False";
                }; // Id_Estado
                XL_row_object1[i][10] = (XL_row_object1[i][10]).trim(); //Identificacion_Jefe
            };
            console.log(XL_row_object1);
            ValidacionesExcel();
            json_object1 = JSON.stringify(XL_row_object1);

            jsonOutput1 = JSON.stringify(JSON.parse(json_object1), undefined, 4);
        };
    };
    reader1.onerror = function (event) {
    }
    reader1.readAsBinaryString(file);
    $('.spinner-border').fadeOut(500);
}

//hacer todas las validaciones en el excel Recorre el excel.
function ValidacionesExcel() {
    for (let l = 1; l < XL_row_object1.length; l++) {
        let Identificacion_Usuario = XL_row_object1[l][0];
        let Id_Tipo_Identificacion = XL_row_object1[l][1];
        let Id_Centro_Costos = XL_row_object1[l][5];
        let Id_Cargo = XL_row_object1[l][6];
        let Id_Rol = XL_row_object1[l][8];
        let Identificacion_Jefe = XL_row_object1[l][10];

        //Valida si existen identificaciones de usuarios duplicados
        for (let j = 1; j < l; j++) {
            let UserDupli = XL_row_object1[j][0];
            if ((Identificacion_Usuario == UserDupli) && (!IdentificaionesDuplicadas.includes(UserDupli))) {
                IdentificaionesDuplicadas.push(UserDupli);
            };
        };

        //Valida usuario existente o ya grabado en la bd
        var existeUsuario = allUsuarios.filter(function (el) { return (el.Identificacion_Usuario == Identificacion_Usuario) });
        (existeUsuario.length > 0) && (!usuarioExiste.includes(Identificacion_Usuario)) ? usuarioExiste.push(Identificacion_Usuario) : '';

        //Valida si existe tipo de identificacion
        var existeTipoIdentificacion = allTipoIdentificaciones.filter(function (el) { return (el.Id_Tipo_Identificacion == Id_Tipo_Identificacion) });
        (existeTipoIdentificacion.length == 0) && (!tipoIdentificacionExiste.includes(Id_Tipo_Identificacion)) ? tipoIdentificacionExiste.push(Id_Tipo_Identificacion) : '';

        //Valida si existe centro de costos
        var existeCentroCosto = allCentroCostos.filter(function (el) { return (el.Id_Centro_Costos == Id_Centro_Costos) });
        (existeCentroCosto.length == 0) && (!centroCostoExiste.includes(Id_Centro_Costos)) ? centroCostoExiste.push(Id_Centro_Costos) : '';

        //Valida si existe cargo
        var existeCargo = allCargos.filter(function (el) { return (el.Id_Cargo == Id_Cargo && el.Id_Estado == "Activo") });
        (existeCargo.length == 0) && (!cargoExiste.includes(Id_Cargo)) ? cargoExiste.push(Id_Cargo) : '';

        //Valida si existe rol
        var existeRol = allRoles.filter(function (el) { return (el.Id_Rol == Id_Rol) });
        (existeRol.length == 0) && (!rolExiste.includes(Id_Rol)) ? rolExiste.push(Id_Rol) : '';

        //Valida si usuario jefe existe
        var existeUsuarioJefe = allIdentificacionJefes.filter(function (el) { return (el.Identificacion_Usuario == Identificacion_Jefe) });
        (existeUsuarioJefe.length == 0) && (!usuarioJefeExiste.includes(Identificacion_Jefe)) ? usuarioJefeExiste.push(Identificacion_Jefe) : '';

    };
};

//Mensajes de validacion para el excel
function MensajeAlertaValidacionExcel(mensaje) {
    swal("Alto!", "" + mensaje + "", "error").then((result) => {
        jsonOutput1 = "";
        XL_row_object1 = "";
        json_object1 = "";
        $("#FileData").val("");
    });
};

//Validar archivo de excel
function MensajevalidacionesExcel() {
    var retorno = true;
    const isNumber = n => $.isNumeric(n);
    console.log();
    if (XL_row_object1.length <= 1) {
        retorno = false;
        MensajeAlertaValidacionExcel("El documento esta vacio, valide el archivo.");
        return false;
    }
    for (let i = 1; i < XL_row_object1.length; i++) {
        let Identificacion_Usuario = XL_row_object1[i][0];
        let Id_Tipo_Identificacion = XL_row_object1[i][1];
        let Nombres = XL_row_object1[i][2];
        let Apellidos = XL_row_object1[i][3];
        let Direccion_Domicilio = XL_row_object1[i][4];
        let Id_Centro_Costos = XL_row_object1[i][5];
        let Id_Cargo = XL_row_object1[i][6];
        let Email = XL_row_object1[i][7];
        let Id_Rol = XL_row_object1[i][8];
        let Id_Estado = XL_row_object1[i][9];
        let Identificacion_Jefe = XL_row_object1[i][10];

        

        if (Identificacion_Usuario.length > 50 || Identificacion_Usuario.length <= 0) {
            retorno = false;
            MensajeAlertaValidacionExcel("La identificación de un usuario contiene mas de 50 caracteres o esta en blanco, valide el archivo.");
            return false;
        } else if (Id_Tipo_Identificacion.length > 5 || Id_Tipo_Identificacion.length <= 0) {
            retorno = false;
            MensajeAlertaValidacionExcel("El Tipo de identificacion de un usuario contiene mas de 5 caracteres o esta en blanco, valide el archivo.");
            return false;
        } else if (Nombres.length > 100 || Nombres.length <= 0) {
            retorno = false;
            MensajeAlertaValidacionExcel("El nombre de un usuario contiene mas de 100 caracteres o esta en blanco, valide el archivo.");
            return false;
        } else if (Apellidos.length > 100 || Apellidos.length <= 0) {
            retorno = false;
            MensajeAlertaValidacionExcel("El apellido de un usuario contiene mas de 100 caracteres o esta en blanco, valide el archivo.");
            return false;
        } else if (Direccion_Domicilio.length > 200 || Direccion_Domicilio.length <= 0) {
            retorno = false;
            MensajeAlertaValidacionExcel("La dirección de un usuario contiene mas de 200 caracteres o esta en blanco, valide el archivo.");
            return false;
        } else if ((isNumber(Id_Centro_Costos) !== true || Id_Centro_Costos.length > 4 || Id_Centro_Costos.length <= 0)) {
            retorno = false;
            MensajeAlertaValidacionExcel("El id de un centro de costo no es numerico o esta en blanco, valide el archivo.");
            return false;
        } else if ((isNumber(Id_Cargo) !== true || Id_Cargo.length > 4 || Id_Cargo.length <= 0)) {
            retorno = false;
            MensajeAlertaValidacionExcel("El id de un cargo no es numerico o esta en blanco, valide el archivo.");
            return false;
        } else if (Email.length > 50 || Email.length <= 0) {
            retorno = false;
            MensajeAlertaValidacionExcel("El email de un usuario contiene mas de 200 caracteres o esta en blanco, valide el archivo.");
            return false;
        } else if ((isNumber(Id_Rol) !== true || Id_Rol.length > 4 || Id_Rol.length <= 0)) {
            retorno = false;
            MensajeAlertaValidacionExcel("El id de un rol no es numerico o esta en blanco, valide el archivo.");
            return false;
        } else if ((Id_Estado != "True" && Id_Estado != "False")) {
            retorno = false;
            MensajeAlertaValidacionExcel("El Estado de un dispositivo no es 1 ni 0, valide el archivo.");
            return false;
        } else if (Identificacion_Jefe.length > 50 || Identificacion_Jefe.length <= 0) {
            retorno = false;
            MensajeAlertaValidacionExcel("La identificación de un jefe contiene mas de 50 caracteres o esta en blanco, valide el archivo.");
            return false;
        } else if (usuarioExiste.length > 0) {
            retorno = false;
            MensajeAlertaValidacionExcel("El archivo contiene Usuarios que ya existen en el sistema: " + usuarioExiste.join(' - '));
            usuarioExiste = [];
            return false;
        } else if (usuarioJefeExiste.length > 0) {
            retorno = false;
            MensajeAlertaValidacionExcel("El archivo contiene identificaciones de jefes que no existen en el sistema: " + usuarioJefeExiste.join(' - '));
            usuarioJefeExiste = [];
            return false;
        } else if (tipoIdentificacionExiste.length > 0) {
            retorno = false;
            MensajeAlertaValidacionExcel("El archivo contiene tipos de identificaciones que no existen en el sistema: " + tipoIdentificacionExiste.join(' - '));
            tipoIdentificacionExiste = [];
            return false;
        } else if (centroCostoExiste.length > 0) {
            retorno = false;
            MensajeAlertaValidacionExcel("El archivo contiene centros de costos que no existen en el sistema: " + centroCostoExiste.join(' - '));
            centroCostoExiste = [];
            return false;
        } else if (cargoExiste.length > 0) {
            retorno = false;
            MensajeAlertaValidacionExcel("El archivo contiene cargos que no existen en el sistema: " + cargoExiste.join(' - '));
            cargoExiste = [];
            return false;
        } else if (rolExiste.length > 0) {
            retorno = false;
            MensajeAlertaValidacionExcel("El archivo contiene Roles que no existen en el sistema: " + rolExiste.join(' - '));
            rolExiste = [];
            return false;
        } else if (IdentificaionesDuplicadas.length > 0) {
            retorno = false;
            MensajeAlertaValidacionExcel("El archivo contiene Identificaciones de usuarios duplicados: " + IdentificaionesDuplicadas.join(' - '));
            IdentificaionesDuplicadas = [];
            return false;
        };
    };

    if (retorno) {
        return true;
    }
}

//Funcion para agregar y actualizar masivamento usuarios mediante excel
async function AgregarMasivoUsuarios() {
    try {
        let validacionExcel = await MensajevalidacionesExcel();
        if (validacionExcel) {
            enviarExcel();
        } else {
            reiniciarExcel();
        };
    } catch (error) {
        console.log("Error");
        swal("Upps!", "Por favor seleccione un archivo valido.", "error");
    }
}

//Funcion para agregar masivamento usuarios mediante excel
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
        $(".preloader").show();
        $.ajax({
            type: 'POST',
            url: Url_Backend + "DebuggDataUsuarios?UserGeneral=" + User.Identificacion_Usuario,
            dataType: 'json',
            contentType: "application/json",
            headers: {
                Authorization: token_type + " " + access_token,
            },
            async: true,
            data: data1,
            beforeSend: function () { },
            success: function (response) {
                $(".preloader").hide();
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
                $(".preloader").hide();
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

};

//Obtener los datos necesarios para hacer la validacion del excel
function ObtenerDatosBase() {
    GetAjaxAll("GetIdentificacionesUsuarios", "allUsuarios"); // 
    GetAjaxAll("GetTipoIdentificacion", "allTipoIdentificaciones"); //
    GetAjaxAll("GetCentroCostos", "allCentroCostos"); //
    GetAjaxAll("GetCargos", "allCargos"); // quitar los inactivos
    GetAjaxAll("GetRol", "allRoles"); //
    GetAjaxAll("GetIdentificacionJefes", "allIdentificacionJefes"); //
};

//Consumo de apis
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
        },
        error: function (error) {
            swal("Upps!", "Error al obtener listado de usuarios: " + error, "error");
        },
        timeout: 300000
    });
}

function reiniciarExcel() {
    //$(".spinner-border").fadeOut();
    jsonOutput1 = "";
    XL_row_object1 = "";
    json_object1 = "";
    $(`#FileData`).val("");
}