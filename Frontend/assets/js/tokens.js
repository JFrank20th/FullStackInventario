var Url_Backend = "http://localhost:57737/";
//var Url_Backend = window.location.origin + '/inventario/Backend/';
var access_token;
var token_type;
var User;
var AllTokens;
var DataSelectEditar;
var OperacionesMain;

var modalAsignarOriginal = $('#GSCCModal2').clone();

$('#GSCCModal2').on('hidden.bs.modal', function () {
    $('#GSCCModal2').replaceWith(modalAsignarOriginal);
});

//Inicializa
function Inicializador() {
    User = localStorage.getItem("User_Inventarios");
    if (User) {
        User = JSON.parse(atob(User));
        User = User[0];
    } else {
        window.location.assign("index.html");
    };

    ObtenerToken(User.Identificacion_Usuario, User.Password);
    GetTokens();
    toastr.options = {
        positionClass: "toast-top-center",
        timeOut: 3000,
        progressBar: true,
        showMethod: "slideDown",
        hideMethod: "slideUp",
        showDuration: 200,
        hideDuration: 200,
    };
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
        url: Url_Backend + "Get_Modulo_Operaciones?Role=" + User.Id_Rol + "&Modulo=" + NombreModuloMain.split("/").pop(),
        beforeSend: function () { },
        success: function (response) {
            OperacionesMain = response;
        },
        error: function (err) { },
        timeout: 300000,
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
            AllTokens = AllTokens.concat(response);
        },
        error: function (error) { },
        timeout: 300000
    });
};

//Tabla de Tokens
function GetTokens() {
    ObtenerToken(User.Identificacion_Usuario, User.Password)
    $.ajax({
        url: Url_Backend + "GetTokens",
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
                    data-toggle="modal" data-target=".bd-example-modal-lg"
                    onclick="GetPlantillas()">Agregar</button>
                `);
            }

            AllTokens = response
            GetTokensFijos();
            $("#TokenPass").empty();
            $("#TokenPass").append(`<option value="" selected disabled>Seleccione...</option>`);
            for (let i = 0; i < response.length; i++) {
                if (response[i].Tipo_Campo == "number") {
                    $("#TokenPass").append(`
                        <option value="${response[i].Token}">${response[i].Token}</option>
                    `);
                };
            };
            Tablecolumns = [
                {
                    "title": "Id",
                    "data": "Id"
                },
                {
                    "title": "Nombre",
                    "data": "Nombre"
                }
                ,
                {
                    "title": "Tipo de campo",
                    "data": "Tipo_Campo"
                },
                {
                    "title": "Descripcion",
                    "data": "Descripcion"
                },
                {
                    "title": "Token",
                    "data": "Token"
                },
                {
                    "title": "Id Plantilla",
                    "data": "Id_Template"
                },
                {
                    "title": "Nombre Plantilla",
                    "data": "Nombre_Template"
                },
                {
                    "title": "Acciones",
                    "defaultContent": `
                    ${ModificarMain ? `<a href="#" class="editar" title="Editar" data-toggle="tooltip">
                    <span style="color:#00b341" class="material-symbols-outlined">stylus_note</span>
                    </a> ` : ''}
                    ${DesactivarMain ? `<a href="#" class="eliminar" title="Activar" data-toggle="tooltip">
                    <span style="color:#0532fa" class="material-symbols-outlined">task_alt</span>
                    </a>` : ''}
                    `
                }];

            if ($.fn.dataTable.isDataTable('#TablaTokens')) {
                TablaTokens.destroy();
            }
            TablaTokens = $("#TablaTokens").DataTable({
                pageLength: 10,
                lengthMenu: [
                    [10, 20, 30, -1],
                    [10, 20, 30, "Todos"]
                ],
                data: response,
                columns: Tablecolumns,
                select: true,
                fnRowCallback: function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
                    if (aData.Estado == "True") {
                        var svg = $(nRow).find('.eliminar span');
                        var nuevoSVG = '\
                            <span style="color:#597e8d" class="material-symbols-outlined">cancel</span>';
                        svg.html(nuevoSVG);
                        $('.eliminar', nRow).attr('title', 'Inactivar');
                    };
                    aData.Tipo_Campo == "date" ? $(nRow).find('td:eq(2)').text('Fecha') : "";
                    aData.Tipo_Campo == "text" ? $(nRow).find('td:eq(2)').text('Texto') : "";
                    aData.Tipo_Campo == "select" ? $(nRow).find('td:eq(2)').text('Selección') : "";
                    aData.Tipo_Campo == "number" ? $(nRow).find('td:eq(2)').text('Número') : "";
                    aData.Tipo_Campo == "firma" ? $(nRow).find('td:eq(2)').text('Firma') : "";
                },
            });

            //Obtener datos al darle click en editar
            $("#TablaTokens tbody").on("click", "a.editar", function () {
                var dataEditar = TablaTokens.row($(this).parents("tr")).data();
                DataSelectEditar = dataEditar;
                EditToken(dataEditar);
            });

            //Obtener datos al darle click en eliminar
            $("#TablaTokens tbody").on("click", "a.eliminar", function () {
                var dataEliminar = TablaTokens.row($(this).parents("tr")).data();
                desactivarToken(dataEliminar);

            });

            //Funcion desactivar
            function desactivarToken(data) {
                // Validar que las plantillas no usen este token OJO
                var mensaje = data.Estado === "True" ? "¿Está seguro de Desactivar el Token?" : "¿Está seguro de Activar el Token?"
                var mensajeSuccess = data.Estado === "True" ? "Se ha desactivado con exito" : "Se ha activado con exito"
                var estado = data.Estado == "True" ? 0 : 1
                swal({
                    title: mensaje,
                    icon: "warning",
                    buttons: true,
                    dangerMode: true,
                })
                    .then((willDelete) => {
                        if (willDelete) {
                            $.ajax({
                                url: Url_Backend + "ChangeStateToken?Id=" + data.Id + "&Estado=" + estado,
                                type: 'GET',
                                contentType: 'application/json',
                                headers: {
                                    'Authorization': token_type + ' ' + access_token
                                },
                                async: false,
                                success: function (response) {
                                    swal('Listo!', mensajeSuccess, 'success')
                                    GetTokens();
                                },
                                error: function (error) { },
                                timeout: 300000
                            });

                        } else {
                            return false;
                        }
                    });
            }

            //Funcion editar
            function EditToken(data) {
                $("#TokenPassAct").empty();
                $("#TokenPassAct").append(`<option value="" selected disabled>Seleccione...</option>`);
                for (let i = 0; i < response.length; i++) {
                    if (response[i].Tipo_Campo == "number") {
                        $("#TokenPassAct").append(`
                        <option value="${response[i].Token}">${response[i].Token}</option>
                    `);
                    };
                };
                GetPlantillas(data.Id_Template);
                $("#IdToken").val(data.Id)
                $("#NombreAct").val(data.Nombre)
                $("#DescripcionAct").val(data.Descripcion)
                $("#TokenAct").val(data.Token)
                // $("#PlantillaAct").val(data.Id_Template)
                $("#TipoCampoAct").val(data.Tipo_Campo);

                $("#divNumLetrasAct, #divTokenPassAct, #divCaracterMaxAct, #divOpcionSeleccionAct, #divTipoFechaAct, #divListaEmpleadoAct, #divDatoEmpleadoAct").css("display", "none");
                $("#numeroLetrasAct, #TokenPassAct, #CaracterMaxAct, #OpcionSeleccionAct, #TipoFechaAct, #ListaEmpleadoAct, #DatoEmpleadoAct").prop("required", false);
                $("#numeroLetrasAct, #TokenPassAct, #CaracterMaxAct, #OpcionSeleccionAct, #TipoFechaAct, #ListaEmpleadoAct, #DatoEmpleadoAct").val(null);

                switch (data.Tipo_Campo) {
                    case "text":
                        if (data.Numeros_A_Letras != null) {
                            $("#divNumLetrasAct").css("display", "block");
                            $("#numeroLetrasAct").prop("required", true);
                            $("#numeroLetrasAct").val(1);
                            $("#divTokenPassAct").css("display", "block");
                            $("#TokenPassAct").prop("required", true);
                            $("#TokenPassAct").val(data.Numeros_A_Letras);
                        } else if (data.Dato_Empleado != null) {
                            $("#divNumLetrasAct").css("display", "block");
                            $("#numeroLetrasAct").prop("required", true);
                            $("#numeroLetrasAct").val(0);
                            $("#divTokenPassAct").css("display", "none");
                            $("#TokenPassAct").prop("required", false);
                            $("#TokenPassAct").val("");
                            $("#divListaEmpleadoAct").css("display", "block");
                            $("#ListaEmpleadoAct").prop("required", true);
                            $("#ListaEmpleadoAct").val(1);
                            $("#divDatoEmpleadoAct").css("display", "block");
                            $("#DatoEmpleadoAct").prop("required", true);
                            $("#DatoEmpleadoAct").val(data.Dato_Empleado);
                        } else {
                            $("#divNumLetrasAct").css("display", "block");
                            $("#numeroLetrasAct").prop("required", true);
                            $("#numeroLetrasAct").val(0);
                            $("#divTokenPassAct").css("display", "none");
                            $("#TokenPassAct").prop("required", false);
                            $("#TokenPassAct").val("");
                            $("#divListaEmpleadoAct").css("display", "block");
                            $("#ListaEmpleadoAct").prop("required", true);
                            $("#ListaEmpleadoAct").val(0);
                        }
                        break;
                    case "number":
                        $("#divCaracterMaxAct").css("display", "block");
                        $("#CaracterMaxAct").prop("required", true);
                        $("#CaracterMaxAct").val(data.Caracter_Maximo)

                        break;
                    case "select":
                        $("#divOpcionSeleccionAct").css("display", "block");
                        $("#OpcionSeleccionAct").prop("required", true);
                        $("#OpcionSeleccionAct").val(data.Opciones_Seleccion)
                        break;
                    case "date":
                        $("#divTipoFechaAct").css("display", "block");
                        $("#TipoFechaAct").prop("required", true);
                        $("#TipoFechaAct").val(data.Id_Tipo_Fecha)
                        break;
                }
                $("#GSCCModal2").modal("show");

                $("#TipoCampoAct").on("change", function () {
                    var selectedValue = $(this).val();
                    $("#divNumLetrasAct, #divTokenPassAct, #divCaracterMaxAct, #divOpcionSeleccionAct, #divTipoFechaAct, #divListaEmpleadoAct, #divDatoEmpleadoAct").css("display", "none");
                    $("#numeroLetrasAct, #TokenPassAct, #CaracterMaxAct, #OpcionSeleccionAct, #TipoFechaAct, #ListaEmpleadoAct, #DatoEmpleadoAct").prop("required", false);
                    $("#numeroLetrasAct, #TokenPassAct, #CaracterMaxAct, #OpcionSeleccionAct, #TipoFechaAct, #ListaEmpleadoAct, #DatoEmpleadoAct").val(null);
                    switch (selectedValue) {
                        case "text":
                            $("#divNumLetrasAct").css("display", "block");
                            $("#numeroLetrasAct").prop("required", true);
                            break;
                        case "number":
                            $("#divCaracterMaxAct").css("display", "block");
                            $("#CaracterMaxAct").prop("required", true);
                            break;
                        case "select":
                            $("#divOpcionSeleccionAct").css("display", "block");
                            $("#OpcionSeleccionAct").prop("required", true);
                            break;
                        case "date":
                            $("#divTipoFechaAct").css("display", "block");
                            $("#TipoFechaAct").prop("required", true);
                            break;
                    }
                    $("#CaracterMaxAct").on("input", function () {
                        let value = $(this).val();
                        value = value.replace(/e/g, ''); // Eliminar todas las letras 'e'
                        $(this).val(value);
                        if (value.length > 2) {
                            $(this).val(value.slice(0, 2));
                        }
                    });
                });

                $("#numeroLetrasAct").on("change", function () {
                    $("#TokenPassAct, #CaracterMaxAct, #OpcionSeleccionAct, #TipoFechaAct, #ListaEmpleadoAct, #DatoEmpleadoAct").val(null);
                    var selectedValue = $(this).val();
                    if (selectedValue == "1") {
                        $("#divTokenPassAct").css("display", "block");
                        $("#TokenPassAct").prop("required", true);
                        $("#divListaEmpleadoAct").css("display", "none");
                        $("#ListaEmpleadoAct").prop("required", false);
                        $("#divDatoEmpleadoAct").css("display", "none");
                        $("#DatoEmpleadoAct").prop("required", false);
                    } else if (selectedValue == "0") {
                        $("#divTokenPassAct").css("display", "none");
                        $("#TokenPassAct").prop("required", false);
                        $("#divListaEmpleadoAct").css("display", "block");
                        $("#ListaEmpleadoAct").prop("required", true);
                    };
                });

                $("#ListaEmpleadoAct").on("change", function () {
                    $("#TokenPassAct, #CaracterMaxAct, #OpcionSeleccionAct, #TipoFechaAct, #DatoEmpleadoAct").val(null);
                    var selectedValue = $(this).val();
                    if (selectedValue == "1") {
                        $("#divDatoEmpleadoAct").css("display", "block");
                        $("#DatoEmpleadoAct").prop("required", true);
                    } else if (selectedValue == "0") {
                        $("#divDatoEmpleadoAct").css("display", "none");
                        $("#DatoEmpleadoAct").prop("required", false);
                    };
                });

                $("#TokenAct").on("input", function () {
                    var selectedValue = (DataSelectEditar.Token).toLowerCase();
                    var All = AllTokens;
                    All = AllTokens.filter(function (token) {
                        return token.Token.toLowerCase() !== selectedValue;
                    });
                    var bool = All.some(function (token) {
                        return token.Token.toLowerCase() === $("#TokenAct").val().toLowerCase();
                    });
                    if (bool) {
                        // $("#Token").val("");
                        $("#TokenAct").val(data.Token);
                        toastr.warning("El token ya existe");
                    }
                });
            };
        },
        error: function (error) {
            swal("Upps!", "Error al obtener los datos de las plantillas: " + error, "error");
        },
        timeout: 300000
    });

};

//Agregar token
function GuardarToken() {
    ObtenerToken(User.Identificacion_Usuario, User.Password);
    var PlantillaAgre = $("#Plantilla").val().join(',');
    var NombreAgre = $("#Nombre").val();
    var TipoCampoAgre = $("#TipoCampo").val();
    var TokenPassAgre = $("#TokenPass").val();
    var CaracterMaxAgre = $("#CaracterMax").val();
    var OpcionSeleccionAgre = $("#OpcionSeleccion").val();
    var TokenAgre = $("#Token").val();
    var DescripcionAgre = $("#Descripcion").val();
    var expresionRegular = /^\[\[([A-Za-z0-9_]+)\]\]$/; // Expresión regular para comprobar el token [[palabra]]
    var NumeroLetras = $("#numeroLetras").val();
    var TipoFechaAgre = $("#TipoFecha").val();
    var ListaEmpleadoAgre = $("#ListaEmpleado").val();
    var DatoEmpleadoAgre = $("#DatoEmpleado").val();

    var arrayIds = [];
    $("#FormAgregarToken :input[required]:not(:file,:submit)").each(function () {
        var id = $(this).attr("id");
        if (id !== undefined) {
            arrayIds.push(id);
        }
    });
    for (let campo of arrayIds) {
        let valor = $("#" + campo).val();
        if (!valor || valor === "") {
            toastr.error('Por favor completar todos los campos.');
            return;
        }
    }
    if (!expresionRegular.test(TokenAgre)) {
        swal("Ey!", "El token no cumple los requisitos validos: [[Ejemplo]]", "error");
        return false;
    }
    $(".preloader").show();
    var Param = {
        Id_Template: PlantillaAgre,
        Nombre: NombreAgre,
        Tipo_Campo: TipoCampoAgre,
        Opciones_Seleccion: OpcionSeleccionAgre == "" ? null : OpcionSeleccionAgre,
        Caracter_Maximo: CaracterMaxAgre == "" ? null : CaracterMaxAgre,
        Numeros_A_Letras: NumeroLetras == "0" ? null : TokenPassAgre,
        Id_Tipo_Fecha: TipoFechaAgre == "" ? null : TipoFechaAgre,
        Descripcion: DescripcionAgre,
        Token: TokenAgre,
        Dato_Empleado: ListaEmpleadoAgre == "0" || NumeroLetras == "1" ? null : DatoEmpleadoAgre
    };
    $.ajax({
        url: Url_Backend + "InsertToken",
        type: "POST",
        dataType: "json",
        contentType: "application/x-www-form-urlencoded; charset=utf-8",
        headers: {
            'Authorization': token_type + ' ' + access_token
        },
        data: Param,
        //async: false,
        beforeSend: function () { },
        success: function (response) {
            swal("Bien!", "El Token fue agregado correctamente", "success");
            $("#GSCCModal").modal("hide");
            GetTokens();
            $(".preloader").hide();
        },
        error: function (err) {
            $(".preloader").hide();
            swal("Ey!", "Error al agregar el Token: " + err, "error");
        },
        timeout: 300000,
    });
};

//Actualizar token
function ActualizarToken() {
    ObtenerToken(User.Identificacion_Usuario, User.Password);
    var IdToken = $("#IdToken").val();
    // var PlantillaAgre = $("#PlantillaAct option[data-seleccionado='seleccionado']").map(function () {
    //     return $(this).val();
    // }).get().join(',');
    var PlantillaAgre = $("#PlantillaAct").val().join(',');
    var NombreAgre = $("#NombreAct").val();
    var TipoCampoAgre = $("#TipoCampoAct").val();
    var TokenPassAgre = $("#TokenPassAct").val();
    var CaracterMaxAgre = $("#CaracterMaxAct").val();
    var OpcionSeleccionAgre = $("#OpcionSeleccionAct").val();
    var TokenAgre = $("#TokenAct").val();
    var DescripcionAgre = $("#DescripcionAct").val();
    var expresionRegular = /^\[\[([A-Za-z0-9_]+)\]\]$/;// Expresión regular para [[palabra]]
    var NumeroLetrasAct = $("#numeroLetrasAct").val();
    var TipoFechaAct = $("#TipoFechaAct").val();
    var ListaEmpleadoAct = $("#ListaEmpleadoAct").val();
    var DatoEmpleadoAct = $("#DatoEmpleadoAct").val();

    var arrayIds = [];
    $("#FormActualizarToken :input[required]:not(:file,:submit)").each(function () {
        var id = $(this).attr("id");
        if (id !== undefined) {
            arrayIds.push(id);
        }
    });
    for (let campo of arrayIds) {
        let valor = $("#" + campo).val();
        if (!valor || valor === "") {
            toastr.error('Por favor completar todos los campos.');
            return;
        }
    }
    if (!expresionRegular.test(TokenAgre)) {
        swal("Ey!", "El token no cumple los requisitos validos: [Ejemplo]", "error");
        return false;
    }
    var Param = {
        IdToken: IdToken,
        Id_Template: PlantillaAgre,
        Nombre: NombreAgre,
        Tipo_Campo: TipoCampoAgre,
        Opciones_Seleccion: OpcionSeleccionAgre == "" ? null : OpcionSeleccionAgre,
        Caracter_Maximo: CaracterMaxAgre == "" ? null : CaracterMaxAgre,
        Numeros_A_Letras: TokenPassAgre == "" || NumeroLetrasAct == 0 ? null : TokenPassAgre,
        Id_Tipo_Fecha: TipoFechaAct == "" ? null : TipoFechaAct,
        Descripcion: DescripcionAgre,
        Token: TokenAgre,
        Dato_Empleado: ListaEmpleadoAct == "0" || NumeroLetrasAct == "1" ? null : DatoEmpleadoAct
    };
    // validar si hay plantillas que usan este token antes de actualizar OJO
    $(".preloader").show();
    $.ajax({
        url: Url_Backend + "UpdateToken",
        type: "POST",
        dataType: "json",
        contentType: "application/x-www-form-urlencoded; charset=utf-8",
        headers: {
            'Authorization': token_type + ' ' + access_token
        },
        data: Param,
        //async: false,
        beforeSend: function () { },
        success: function (response) {
            swal("Bien!", "El Token fue actualizado correctamente", "success");
            $("#GSCCModal2").modal("hide");
            Inicializador();
            $(".preloader").hide();
        },
        error: function (err) {
            $(".preloader").hide();
            swal("Ey!", "Error al actualizar el Token: " + err, "error");
        },
        timeout: 300000,
    });
};

//Obtener listado de plantillas
function GetPlantillas(Id_Template) {
    $.ajax({
        url: Url_Backend + "GetTemplateActive",
        type: 'GET',
        contentType: 'application/json',
        headers: {
            'Authorization': token_type + ' ' + access_token
        },
        async: false,
        success: function (response) {
            if (Id_Template != undefined && Id_Template != "" && Id_Template != null) {
                $("#PlantillaAct").empty();
                for (let i = 0; i < response.length; i++) {
                    $("#PlantillaAct").append(`
                    <option value="${response[i].Id_Plantilla}">${response[i].Id_Plantilla + " - " + response[i].Nombre}</option>
                `);
                }

                var valores = Id_Template.split(",");
                for (var i = 0; i < valores.length; i++) {
                    var opcion = $("#PlantillaAct option[value='" + valores[i] + "']");
                    opcion.prop('selected', true);
                    opcion.attr('data-seleccionado', 'seleccionado');
                }
                $("#PlantillaAct").select2({ placeholder: "Select" });
            } else {
                $("#Plantilla").empty();
                for (let i = 0; i < response.length; i++) {
                    $("#Plantilla").append(`
                        <option value="${response[i].Id_Plantilla}">${response[i].Id_Plantilla + " - " + response[i].Nombre}</option>
                    `);
                }
                $("#Plantilla").select2({ placeholder: "Select" });
            }
            GetTipoFecha();
        },
        error: function (error) {
            swal("Upps!", "Error al obtener el listado de plantillas: " + error, "error");
        },
        timeout: 300000
    });
}

//Obtener el listado de tipos de fecha
function GetTipoFecha() {
    $.ajax({
        url: Url_Backend + "GetTipoFecha",
        type: 'GET',
        contentType: 'application/json',
        headers: {
            'Authorization': token_type + ' ' + access_token
        },
        async: false,
        success: function (response) {
            $("#TipoFecha").empty();
            $("#TipoFechaAct").empty();
            $("#TipoFecha").append(`<option value="" selected disabled>Elegir...</option>`);
            $("#TipoFechaAct").append(`<option value="" selected disabled>Elegir...</option>`);
            for (let i = 0; i < response.length; i++) {
                $("#TipoFecha").append(`
                    <option value="${response[i].Id}">${response[i].Tipo_Fecha}</option>
                `);
                $("#TipoFechaAct").append(`
                    <option value="${response[i].Id}">${response[i].Tipo_Fecha}</option>
                `);
            }
        },
        error: function (error) {
            swal("Upps!", "Error al obtener el listado de tipos de fechas: " + error, "error");
        },
        timeout: 300000
    });
}

$("#TipoCampo").on("change", function () {
    var selectedValue = $(this).val();
    $("#divNumLetras, #divTokenPass, #divCaracterMax, #divOpcionSeleccion, #divTipoFecha, #divListaEmpleado, #divDatoEmpleado").css("display", "none");
    $("#numeroLetras, #TokenPass, #CaracterMax, #OpcionSeleccion, #TipoFecha, #ListaEmpleado, #DatoEmpleado").prop("required", false);
    $("#numeroLetras, #TokenPass, #CaracterMax, #OpcionSeleccion, #TipoFecha, #ListaEmpleado, #DatoEmpleado").val(null);
    switch (selectedValue) {
        case "text":
            $("#divNumLetras").css("display", "block");
            $("#numeroLetras").prop("required", true);
            break;
        case "number":
            $("#divCaracterMax").css("display", "block");
            $("#CaracterMax").prop("required", true);
            break;
        case "select":
            $("#divOpcionSeleccion").css("display", "block");
            $("#OpcionSeleccion").prop("required", true);
            break;
        case "date":
            $("#divTipoFecha").css("display", "block");
            $("#TipoFecha").prop("required", true);
            break;
    }
    $("#CaracterMax").on("input", function () {
        let value = $(this).val();
        value = value.replace(/e/g, ''); // Eliminar todas las letras 'e'
        $(this).val(value);
        if (value.length > 2) {
            $(this).val(value.slice(0, 2));
        }
    });
});


$("#numeroLetras").on("change", function () {
    $("#TokenPass, #CaracterMax, #OpcionSeleccion, #TipoFecha, #ListaEmpleado, #DatoEmplead").val(null);
    var selectedValue = $(this).val();
    if (selectedValue == "1") {
        $("#divTokenPass").css("display", "block");
        $("#TokenPass").prop("required", true);
        $("#divListaEmpleado").css("display", "none");
        $("#ListaEmpleado").prop("required", false);
        $("#divDatoEmpleado").css("display", "none");
        $("#DatoEmpleado").prop("required", false);
    } else if (selectedValue == "0") {
        $("#divTokenPass").css("display", "none");
        $("#TokenPass").prop("required", false);
        $("#divListaEmpleado").css("display", "block");
        $("#ListaEmpleado").prop("required", true);
    };
});


$("#ListaEmpleado").on("change", function () {
    $("#TokenPass, #CaracterMax, #OpcionSeleccion, #TipoFecha, #DatoEmpleado").val(null);
    var selectedValue = $(this).val();
    if (selectedValue == "1") {
        $("#divDatoEmpleado").css("display", "block");
        $("#DatoEmpleado").prop("required", true);
    } else if (selectedValue == "0") {
        $("#divDatoEmpleado").css("display", "none");
        $("#DatoEmpleado").prop("required", false);
    };
});



$("#Token").on("input", function () {
    var selectedValue = $(this).val().toLowerCase();
    var bool = AllTokens.some(function (token) {
        return token.Token.toLowerCase() === selectedValue;
    });
    if (bool) {
        $("#Token").val("");
        toastr.warning("El token ya existe");
    }
});
