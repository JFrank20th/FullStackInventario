var Url_Backend = "http://localhost:57737/";
//var Url_Backend = window.location.origin + '/inventario/Backend/';
var access_token;
var token_type;
var User;
var AllRoles;
var AllUsuarios;
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
    GetUsuarios();
    TraerRol();
    TraerTipoIdentificacion();
    TraerCentroCostos();
    ListarJefes();
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

//Tabla de Usuarios
function GetUsuarios() {
    ObtenerToken(User.Identificacion_Usuario, User.Password)
    $.ajax({
        url: Url_Backend + "GetUsuarios",
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
                $("#divBotonesAdmin").append(`
                <div class="child2 child-2"
                    style="margin-top: -15px; margin-right: -5px; margin-bottom: -10px; ">
                    <button id="CargarUsuario" class="button2 btn-2 "
                        onclick="AbrirModalCargar()"
                        title="Cargar Usuarios" data-toggle="tooltip">
                        <span style="color:#de0025; margin-top: 10px;"
                            class="material-symbols-outlined">group_add</span>
                    </button>
                </div>
                <div class="child2 child-2"
                    style="margin-top: -15px; margin-right: -5px; margin-bottom: -10px; ">
                    <button id="AgregarUsuario" class="button2 btn-2 " onclick="AbrirModalAgregar()"
                        title="Agregar Usuario" data-toggle="tooltip"
                        data-toggle="modal" data-target="#GSCCModal">
                        <span style="color:#00de4a; margin-top: 10px;"
                            class="material-symbols-outlined">person_add</span>
                    </button>
                </div>
                `);
            }

            AllUsuarios = response;
            //console.log(response);
            Tablecolumns = [
                {
                    "title": "Id",
                    "data": "Id"
                },
                {
                    "title": "Tipo Identificacion",
                    "data": "Id_Tipo_Identificacion"
                },
                {
                    "title": "Identificacion",
                    "data": "Identificacion_Usuario"
                },
                {
                    "title": "Nombres",
                    "data": "Nombres"
                },
                {
                    "title": "Apellidos",
                    "data": "Apellidos"
                },
                {
                    "title": "Direccion Domicilio",
                    "data": "Direccion_Domicilio"
                },
                {
                    "title": "Email",
                    "data": "Email"
                },
                {
                    "title": "Rol",
                    "data": "Nombre_Rol"
                },
                {
                    "title": "Centro de Costos",
                    "data": "Centro_Costo"
                },
                {
                    "title": "¿Es Jefe?",
                    "data": "Jefe"
                },
                {
                    "title": "Nombre Jefe",
                    "data": "Nombre_Jefe"
                },
                {
                    "title": "Estado",
                    "data": "Nombre_Estado"
                },
                {
                    "title": "Acciones",
                    "defaultContent": `
                    ${ModificarMain ? `<a href="#" class="editar" title="Editar" data-toggle="tooltip">
                    <span style="color:#00b341" class="material-symbols-outlined">stylus_note</span>
                    </a> ` : ''}
                    ${DesactivarMain ? `<a href="#" class="eliminar" title="Activar" data-toggle="tooltip">
                    <span style="color:#597e8d" class="material-symbols-outlined">task_alt</span>
                    </a>` : ''}
                    
                    <a href="#" class="asignados" title="Equipos Asignados" data-toggle="tooltip">
                        <span class="material-symbols-outlined">sync_saved_locally</span>
                    </a>
                    `
                }];

            if ($.fn.dataTable.isDataTable('#TablaUsuario')) {
                TablaUsuario.destroy();
            }

            TablaUsuario = $("#TablaUsuario").DataTable({
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
                dom: "<'row' <'col-sm-1' l><'col-sm-9'<'Boton-tabla'B>><'col-sm-2'f>>" +
                    "<'row'<'col-sm-12'tr>>" +
                    "<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>",
                buttons: [
                    'colvis',
                ],
            }).columns.adjust().draw();

            $('#TablaUsuario thead th').each(function (i) {
                var title = $(this).text();
                if (i !== $('#TablaUsuario thead th').length - 1) {
                    if (title === "Estado") {
                        $(this).html(title + '<select class="form-control form-control-sm" style="width: 100%"><option value="">Todos</option><option value="Activo">Activo</option><option value="Inactivo">Inactivo</option></select>');
                    } else if (title === "¿Es Jefe?") {
                        $(this).html(title + '<select class="form-control form-control-sm" style="width: 100%"><option value="">Todos</option><option value="SI">SI</option><option value="NO">NO</option></select>');
                    } else {
                        $(this).html(title + '<input type="text" class="form-control form-control-sm" placeholder="Buscar ' + title + '" />');
                    }
                }
            });

            //Evento para el buscador de cada columna
            TablaUsuario.columns().every(function () {
                var table = this;
                $('input, select', this.header()).not('#checkbox-select-all').on('keyup change', function () {
                    if (table.search() !== this.value) {
                        table.search(this.value).draw();
                    }
                });
            });

            //Obtener datos al darle click en editar
            $("#TablaUsuario tbody").on("click", "a.editar", function () {
                var dataEditar = TablaUsuario.row($(this).parents("tr")).data();
                EditUsuario(dataEditar);

            });

            //Obtener datos al darle click en eliminar
            $("#TablaUsuario tbody").on("click", "a.eliminar", function () {
                var dataEliminar = TablaUsuario.row($(this).parents("tr")).data();
                desactivarUsuarios(dataEliminar);
            });

            //Obtener datos al darle click en equipos asignados
            $("#TablaUsuario tbody").on("click", "a.asignados", function () {
                var dataEliminar = TablaUsuario.row($(this).parents("tr")).data();
                EquiposAsignados(dataEliminar);
            });

            //Funcion equipos asignados
            function EquiposAsignados(dataE) {
                $("#GSCCModal4").modal("show");
                var Identificacion = dataE.Identificacion_Usuario;
                $.ajax({
                    url: Url_Backend + 'GetInventarioXUsuarios?Identificacion=' + Identificacion,
                    type: 'GET',
                    contentType: 'application/json',
                    headers: {
                        'Authorization': token_type + ' ' + access_token
                    },
                    async: false,
                    success: function (response) {
                        datos = response;
                        Tablecolumns = [{
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
                            "title": "Usuario",
                            "data": "Identificacion_Usuario"
                        },
                        {
                            "title": "Proveedor",
                            "data": "Proveedor"
                        },
                        {
                            "title": "Activo",
                            "data": "Nombre_Activo"
                        },
                        {
                            "title": "Procesador",
                            "data": "Procesador"
                        },

                        {
                            "title": "RAM",
                            "data": "RAM"
                        },

                        {
                            "title": "Disco",
                            "data": "Disco"
                        },
                        {
                            "title": "Marca",
                            "data": "Marca"
                        },
                        {
                            "title": "Soporte",
                            "data": "Soporte"
                        },
                        {
                            "title": "Estado",
                            "data": "Nombre_Estado"
                        },
                        {
                            "title": "Ciudad",
                            "data": "Ciudad"
                        },
                        {
                            "title": "Sede",
                            "data": "Id_Sede"
                        },
                        {
                            "title": "Piso",
                            "data": "Id_Piso"
                        },
                        {
                            "title": "Puesto",
                            "data": "Id_Puesto"
                        },
                        {
                            "title": "C. Costo",
                            "data": "Centro_Costo"
                        },
                        {
                            "title": "Home Office",
                            "data": "Home_Office"
                        },
                        {
                            "title": "Dev. Proveedor",
                            "data": "Dev_Proveedor"
                        }];

                        if ($.fn.dataTable.isDataTable('#TablaAsignados')) {
                            TablaReportProve.destroy();
                        }
                        TablaReportProve = $("#TablaAsignados").DataTable({
                            orderCellsTop: top,
                            fixedHeader: true,
                            pageLength: 10,
                            lengthMenu: [
                                [10, 20, 30, -1],
                                [10, 20, 30, "Todos"]
                            ],
                            data: response,
                            columns: Tablecolumns,
                            select: true,
                            dom: "<'row'<'col-sm-1'l><'col-sm-9'<'Boton-tabla'B>><'col-sm-2'f>>" +
                                "<'row'<'col-sm-12'tr>>" +
                                "<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>",
                            buttons: [
                                'colvis',
                            ],
                        });

                    },
                    error: function (error) {
                        swal("Upps!", "Error al obtener los datos del inventario: " + error, "error");
                    },
                    timeout: 300000
                });
            }

            //Funcion desactivar
            function desactivarUsuarios(dataE) {
                var mensaje = dataE.Nombre_Estado === "Activo" ? "¿Está seguro de desactivar el Usuario?" : "¿Está seguro de Activar el Usuario?"
                var mensajeSuccess = dataE.Nombre_Estado === "Activo" ? "Se ha desactivado con exito" : "Se ha activado con exito"
                var Param = {
                    Id: dataE.Id,
                    Identificacion_Usuario: dataE.Identificacion_Usuario,
                    Id_Estado: dataE.Nombre_Estado == "Activo" ? 0 : 1
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
                                url: Url_Backend + 'InactivarUsuarios',
                                headers: {
                                    'Authorization': token_type + ' ' + access_token
                                },
                                async: false,
                                data: Param,
                                beforeSend: function () { },
                                success: function (response) {
                                    swal('Listo!', mensajeSuccess, 'success').then((result) => {
                                        Inicializador();
                                    });
                                },
                                error: function (err) {
                                    swal("Error!", "Ha ocurrido un error al activar/inactivar el usuario", "error");
                                },
                                timeout: 300000
                            });
                        } else {
                            return false;
                        }
                    });
            }

            //Funcion editar
            function EditUsuario(data) {
                $("#GSCCModal2").modal("show");
                document.getElementById("IdActu").value = data.Id;
                document.getElementById("Tipo_IdentificaionActu").value = data.Id_Tipo_Identificacion;
                document.getElementById("IdentificacionActu").value = data.Identificacion_Usuario;
                document.getElementById("NombresActu").value = data.Nombres;
                document.getElementById("ApellidosActu").value = data.Apellidos;
                document.getElementById("DireccionActu").value = data.Direccion_Domicilio;
                document.getElementById("CentroActu").value = data.Id_Centro_Costos;
                document.getElementById("EmailActu").value = data.Email;
                document.getElementById("ContrasenaActu").value = data.Password;
                document.getElementById("RolActu").value = data.Id_Rol;
                document.getElementById("JefeActu").value = data.Identificacion_Jefe;
            }

        },
        error: function (error) {
            swal("Upps!", "Error al obtener los datos de los Usuarios: " + error, "error");
        },
        timeout: 300000
    });

};



// Funcion para guardar usuarios
function GuardarUsuarios() {
    ObtenerToken(User.Identificacion_Usuario, User.Password);
    var IdentificacionAgre = $("#IdentificacionAgre").val();
    var Tipo_IdentificaionAgre = $("#Tipo_IdentificaionAgre").val();
    var NombresAgre = $("#NombresAgre").val();
    var ApellidosAgre = $("#ApellidosAgre").val();
    var DireccionAgre = $("#DireccionAgre").val();
    var CentroAgre = $("#CentroAgre").val();
    var EmailAgre = $("#EmailAgre").val();
    var ContrasenaAgre = $("#ContrasenaAgre").val();
    var RolAgre = $("#RolAgre").val();
    var JefeAgre = $("#JefeAgre").val();

    if (IdentificacionAgre == "" || Tipo_IdentificaionAgre == "" || NombresAgre == "" || ApellidosAgre == "" || DireccionAgre == "" ||
        CentroAgre == "" || EmailAgre == "" || ContrasenaAgre == "" || RolAgre == "" || JefeAgre == "") {
        swal("Ey!", "Es obligatorio llenar los campos", "error");
        return false;
    }

    var Param = {
        Identificacion_Usuario: IdentificacionAgre,
        Id_Tipo_Identificacion: Tipo_IdentificaionAgre,
        Nombres: NombresAgre,
        Apellidos: ApellidosAgre,
        Direccion_Domicilio: DireccionAgre,
        Id_Centro_Costos: CentroAgre,
        Email: EmailAgre,
        Password: ContrasenaAgre,
        Id_Rol: RolAgre,
        Identificacion_Jefe: JefeAgre
    };


    $.ajax({
        url: Url_Backend + "GuardarUsuarios",
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
            swal("Bien!", "El Usuario fue agregado correctamente", "success").then((result) => {
                Inicializador();
                $("#GSCCModal").modal("hide");
            });
        },
        error: function (err) {
            swal("Ey!", "Error al agregar el Usuario: " + err, "error");
        },
        timeout: 300000,
    });
};

function AsignarEquipo() {
    $("#GSCCModal4").modal("show");
}

function UpdateUsuarios() {
    ObtenerToken(User.Identificacion_Usuario, User.Password);
    var IdActu = $("#IdActu").val();
    var IdentificacionActu = $("#IdentificacionActu").val();
    var Tipo_IdentificaionActu = $("#Tipo_IdentificaionActu").val();
    var NombresActu = $("#NombresActu").val();
    var ApellidosActu = $("#ApellidosActu").val();
    var DireccionActu = $("#DireccionActu").val();
    var CentroActu = $("#CentroActu").val();
    var EmailActu = $("#EmailActu").val();
    var ContrasenaActu = $("#ContrasenaActu").val();
    var RolActu = $("#RolActu").val();
    var JefeActu = $("#JefeActu").val();


    if (IdentificacionActu == "" || Tipo_IdentificaionActu == "" || NombresActu == "" || ApellidosActu == "" || DireccionActu == "" ||
        CentroActu == "" || EmailActu == "" || ContrasenaActu == "" || RolActu == "" || JefeActu == "") {
        swal("Ey!", "Es obligatorio llenar los campos", "error");
        return false;
    }

    var Param = {
        Id: IdActu,
        Identificacion_Usuario: IdentificacionActu,
        Id_Tipo_Identificacion: Tipo_IdentificaionActu,
        Nombres: NombresActu,
        Apellidos: ApellidosActu,
        Direccion_Domicilio: DireccionActu,
        Id_Centro_Costos: CentroActu,
        Email: EmailActu,
        Password: ContrasenaActu,
        Id_Rol: RolActu,
        Identificacion_Jefe: JefeActu
    };
    $.ajax({
        url: Url_Backend + "ActualizarUsuarios",
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
            swal("Bien!", "El Usuario fue actualizado correctamente", "success").then((result) => {
                Inicializador();
                $("#GSCCModal2").modal("hide");
            });
        },
        error: function (err) {
            swal("Ey!", "Error al actualizar el Usuario: " + err, "error");
        },
        timeout: 300000,
    });
};

function TraerTipoIdentificacion() {
    ObtenerToken(User.Identificacion_Usuario, User.Password)
    $.ajax({
        url: Url_Backend + 'GetTipoIdentificacion',
        type: 'GET',
        contentType: 'application/json',
        headers: {
            'Authorization': token_type + ' ' + access_token
        },
        async: false,
        success: function (response) {
            $("#Tipo_IdentificaionAgre").empty();
            $("#Tipo_IdentificaionAgre").append("<option value='' selected disabled>Elegir...</option>");
            for (var i = 0; i < response.length; i++) {
                $("#Tipo_IdentificaionAgre").append("<option value='" + response[i].Id_Tipo_Identificacion + "'>" + response[i].Identificacion + " </option>");
            }

            $("#Tipo_IdentificaionActu").empty();
            $("#Tipo_IdentificaionActu").append("<option value='' selected disabled>Elegir...</option>");
            for (var i = 0; i < response.length; i++) {
                $("#Tipo_IdentificaionActu").append("<option value='" + response[i].Id_Tipo_Identificacion + "'>" + response[i].Identificacion + " </option>");
            }
        },
        error: function (err) { },
        timeout: 300000
    });
}

function TraerCentroCostos() {
    ObtenerToken(User.Identificacion_Usuario, User.Password)
    $.ajax({
        url: Url_Backend + 'GetCeCo',
        type: 'GET',
        contentType: 'application/json',
        headers: {
            'Authorization': token_type + ' ' + access_token
        },
        async: false,
        success: function (response) {
            $("#CentroAgre").empty();
            $("#CentroAgre").append("<option value='' selected disablesd >Elegir...</option>");
            for (var i = 0; i < response.length; i++) {
                $("#CentroAgre").append("<option value='" + response[i].id_ceco + "'>" + response[i].name_ceco + " </option>");
            }

            $("#CentroActu").empty();
            $("#CentroActu").append("<option value='' selected disabled >Elegir...</option>");
            for (var i = 0; i < response.length; i++) {
                $("#CentroActu").append("<option value='" + response[i].id_ceco + "'>" + response[i].name_ceco + " </option>");
            }
        },
        error: function (err) { },
        timeout: 300000
    });
};

function TraerRol() {
    ObtenerToken(User.Identificacion_Usuario, User.Password)
    $.ajax({
        url: Url_Backend + 'GetRol',
        type: 'GET',
        contentType: 'application/json',
        headers: {
            'Authorization': token_type + ' ' + access_token
        },
        async: false,
        success: function (response) {
            AllRoles = response
            //console.log(response);
            $("#RolAgre").empty();
            $("#RolAgre").append("<option value='' selected disabled >Elegir...</option>");
            for (var i = 0; i < response.length; i++) {
                $("#RolAgre").append("<option value='" + response[i].Id_Rol + "'>" + response[i].Nombre_Rol + " </option>");
            }

            $("#RolActu").empty();
            $("#RolActu").append("<option value='' selected disabled >Elegir...</option>");
            for (var i = 0; i < response.length; i++) {
                $("#RolActu").append("<option value='" + response[i].Id_Rol + "'>" + response[i].Nombre_Rol + " </option>");
            }
        },
        error: function (err) { },
        timeout: 300000
    });
};

function ListarJefes() {
    var Jefes = AllUsuarios.filter(
        (Module) => Module.Jefe == "Si"
    );
    //console.log(Jefes);
    $("#JefeAgre").empty();
    $("#JefeAgre").append("<option value='' selected disabled>Elegir...</option>");
    Jefes.forEach(element => {
        $("#JefeAgre").append(`
            "<option value="${element.Identificacion_Usuario}">${element.Identificacion_Usuario + " - " + element.Nombres + " " + element.Apellidos}</option>
        `);
    });

    $("#JefeActu").empty();
    $("#JefeActu").append("<option value='' selected disabled>Elegir...</option>");
    Jefes.forEach(element => {
        $("#JefeActu").append(`
            <option value="${element.Identificacion_Usuario}">${element.Identificacion_Usuario + " - " + element.Nombres + " " + element.Apellidos}</option>
        `);
    });
}


function AbrirModalAgregar(){
    $("#GSCCModal").modal("show");
}

function AbrirModalCargar(){
    $("#ModalCargueUsuarios").modal("show");
}
