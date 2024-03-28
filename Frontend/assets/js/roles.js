var Url_Backend = "http://localhost:57737/";
//var Url_Backend = window.location.origin + '/inventario/Backend/';
var access_token;
var token_type;
var User;
var GlobalModulos;
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
    GetRoles();

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

//Tabla de Usuarios
function GetRoles() {
    ObtenerToken(User.Identificacion_Usuario, User.Password);
    $.ajax({
        url: Url_Backend + "GetRoles",
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
                    data-toggle="modal" data-target="#GSCCModal" onclick="CrearModalAgregar()">Agregar</button>
                `);
            }

            Tablecolumns = [
                {
                    "title": "Rol",
                    "data": "Nombre_Rol"
                },
                {
                    "title": "Descripcion",
                    "data": "Descripcion"
                },
                {
                    "title": "Jefe",
                    "data": "Jefe"
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
                    </a>  ` : ''}
                    ${DesactivarMain ? `<a href="#" class="eliminar" title="Activar" data-toggle="tooltip">
                    <span style="color:#597e8d" class="material-symbols-outlined">task_alt</span>
                    </a>` : ''}
                    `
                }];

            if ($.fn.dataTable.isDataTable('#TablaRoles')) {
                TablaRoles.destroy();
            }
            TablaRoles = $("#TablaRoles").DataTable({
                pageLength: 10,
                lengthMenu: [
                    [10, 20, 30, -1],
                    [10, 20, 30, "Todos"]
                ],
                data: response,
                columns: Tablecolumns,
                select: true,
                fnRowCallback: function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
                    if (aData.Nombre_Estado == "Activo") {
                        var svg = $(nRow).find('.eliminar span');
                        var nuevoSVG = '\
                            <span style="color:#597e8d" class="material-symbols-outlined">cancel</span>';
                        svg.html(nuevoSVG);
                        $('.eliminar', nRow).attr('title', 'Inactivar');
                    };
                    aData.Jefe == "True" ? $(nRow).find('td:eq(2)').text('Si') : $(nRow).find('td:eq(2)').text('No');
                },
            });

            //Obtener datos al darle click en editar
            $("#TablaRoles tbody").on("click", "a.editar", function () {
                var dataEditar = TablaRoles.row($(this).parents("tr")).data();
                EditRol(dataEditar);

            });

            //Obtener datos al darle click en eliminar
            $("#TablaRoles tbody").on("click", "a.eliminar", function () {
                var dataEliminar = TablaRoles.row($(this).parents("tr")).data();
                desactivarRol(dataEliminar);
            });

            //Funcion desactivar
            function desactivarRol(dataE) {
                var mensaje = dataE.Nombre_Estado === "Activo" ? "¿Está seguro de desactivar el Rol?" : "¿Está seguro de Activar el Rol?"
                var mensajeSuccess = dataE.Nombre_Estado === "Activo" ? "Se ha desactivado con exito" : "Se ha activado con exito"
                var Param = {
                    Id_Rol: dataE.Id_Rol,
                    Nombre_Rol: dataE.Nombre_Rol,
                    Descripcion: dataE.Descripcion,
                    Nombre_Estado: dataE.Nombre_Estado == "Activo" ? "0" : "1"
                }
              //  console.log(Param);
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
                                url: Url_Backend + 'InactivarRoles',
                                headers: {
                                    'Authorization': token_type + ' ' + access_token
                                },
                                async: false,
                                data: Param,
                                beforeSend: function () { },
                                success: function (response) {
            //                        console.log(response);
                                    swal('Listo!', mensajeSuccess, 'success').then((result) => {
                                        Inicializador();
                                    });
                                },
                                error: function (err) {
                                    swal("Error!", "Ha ocurrido un error al activar/inactivar el rol", "error");
                                },
                                timeout: 300000
                            });
                        } else {
                            return false;
                        }
                    });
            }

            //Funcion editar
            function EditRol(data) {
                //console.log(data);
                ObtenerToken(User.Identificacion_Usuario, User.Password)
                $.ajax({
                    url: Url_Backend + 'GetPermisosRol?Id_Rol=' + data.Id_Rol,
                    type: 'GET',
                    contentType: 'application/json',
                    headers: {
                        'Authorization': token_type + ' ' + access_token
                    },
                    async: false,
                    success: function (GetPermisosRol) {
                        $("#GSCCModal2").modal("show");
                        //console.log(GetPermisosRol);

                        $.ajax({
                            type: "GET",
                            dataType: "json",
                            contentType: "application/json; charset=utf-8",
                            headers: {
                                Authorization: token_type + " " + access_token,
                            },
                            async: false,
                            url: Url_Backend + "GetModulos",
                            beforeSend: function () { },
                            success: function (response) {
                                GlobalModulos = response
                                if (response != "") {
                                    //console.log(response);
                                    $("#FormEditRol").empty();
                                    $("#FormEditRol").append(`
                                    <div class="form-group col-md-2 mb-3">
                                        <label for="IdRolActu">Id</label>
                                        <input disabled type="text" class="form-control" id="IdRolActu" required>
                                        <div class="valid-feedback"> Correcto! </div>
                                        <div class="invalid-feedback"> Completar! </div>
                                    </div>
                                    <div class="form-group col-md-4 mb-3">
                                        <label for="NombreRolActu">Nombre del Rol</label>
                                        <input type="text" class="form-control" id="NombreRolActu" required>
                                        <div class="valid-feedback"> Correcto! </div>
                                        <div class="invalid-feedback"> Completar! </div>
                                    </div>
                                    <div class="form-group col-md-4 mb-3">
                                        <label for="DescripcionRolActu">Descripcion del Rol</label>
                                        <input type="text" class="form-control" id="DescripcionRolActu" required>
                                        <div class="valid-feedback"> Correcto! </div>
                                        <div class="invalid-feedback"> Completar! </div>
                                    </div>
                                    <div class="form-group col-md-2 mb-3">
                                        <label for="JefeActu">¿El rol es Jefe?</label>
                                        <select id="JefeActu" class="form-control" required>
                                            <option value="" disabled selected>Elegir...</option>
                                            <option value="1">Si</option>
                                            <option value="0">No</option>
                                        </select>
                                        <div class="valid-feedback"> Correcto! </div>
                                        <div class="invalid-feedback"> Completar! </div>
                                    </div>`);
                                    //Nombre padre Modulos
                                    var ModulosPadre = response.filter(
                                        (Module) => Module.Id_Menu === "0"
                                    );
                                    //console.log(ModulosPadre);
                                    ModulosPadre.forEach((Modulo) => {
                                        $("#FormEditRol").append(`
                                        <div class="col-md-12 mb-3 " >
                                            <h5 style="text-align: center;"><b>${Modulo.Nombre_Modulo}</b></h5>
                                            <br>
                                            <div class="form-row d-flex align-items-center justify-content-center" id="${Modulo.Id_Modulo}">
                                            </div>
                                        </div>`);
                                    });
                                    //Nombre Modulos hijos
                                    var ModulosHijo = response.filter(
                                        (Module) => Module.Id_Menu !== "0"
                                    )

                                    //console.log(ModulosHijo);
                                    ModulosHijo.forEach((Modulo) => {
                                        let Id_Menu = Modulo.Id_Menu
                                        let Nombre_Modulo = Modulo.Nombre_Modulo

                                        if (Nombre_Modulo == 'Inventario') {
                                            $(`#${Id_Menu}`).append(`
                                            <div class="col-md-12 mb-3 text-center">
                                                <button type="button" class="btn btn-primary btn-sm"
                                                    id="MarcarActualizar${Modulo.Id_Modulo}">${Modulo.Nombre_Modulo}</button>
                                                <br><br>
                    
                                                <h6><b>Acciones</b></h6>
                                                <div class="custom-control custom-switch custom-control-inline">
                                                    <input type="checkbox" class="custom-control-input" id="VerActualizar${Modulo.Id_Modulo}"><label
                                                        class="custom-control-label" for="VerActualizar${Modulo.Id_Modulo}">Ver</label>
                                                </div>
                                                <div class="custom-control custom-switch custom-control-inline">
                                                    <input type="checkbox" class="custom-control-input"
                                                        id="DesactivarActualizar${Modulo.Id_Modulo}"><label class="custom-control-label"
                                                        for="DesactivarActualizar${Modulo.Id_Modulo}">Desactivar</label>
                                                </div>
                                                <div class="custom-control custom-switch custom-control-inline">
                                                    <input type="checkbox" class="custom-control-input"
                                                        id="DescargarActualizar"><label class="custom-control-label"
                                                        for="DescargarActualizar">Descargar</label>
                                                </div>
                                                <div class="custom-control custom-switch custom-control-inline">
                                                    <input type="checkbox" class="custom-control-input"
                                                        id="SoporteActualizar"><label class="custom-control-label"
                                                        for="SoporteActualizar">Soporte</label>
                                                </div>
                                                <div class="custom-control custom-switch custom-control-inline">
                                                    <input type="checkbox" class="custom-control-input"
                                                        id="HistorialActualizar"><label class="custom-control-label"
                                                        for="HistorialActualizar">Historial</label>
                                                </div>
                    
                                                <hr>
                                                <h6><b>Acciones Uno a Uno</b></h6>
                                                <div class="custom-control custom-switch custom-control-inline">
                                                    <input type="checkbox" class="custom-control-input"
                                                        id="AgregarActualizar${Modulo.Id_Modulo}"><label class="custom-control-label"
                                                        for="AgregarActualizar${Modulo.Id_Modulo}">Aregar</label>
                                                </div>
                                                <div class="custom-control custom-switch custom-control-inline">
                                                    <input type="checkbox" class="custom-control-input"
                                                        id="ModificarActualizar${Modulo.Id_Modulo}"><label class="custom-control-label"
                                                        for="ModificarActualizar${Modulo.Id_Modulo}">Modificar</label>
                                                </div>
                                                <div class="custom-control custom-switch custom-control-inline">
                                                    <input type="checkbox" class="custom-control-input" id="AsignarActualizar">
                                                    <label class="custom-control-label" for="AsignarActualizar">Asignar</label>
                                                </div>
                    
                                                <div class="custom-control custom-switch custom-control-inline">
                                                    <input type="checkbox" class="custom-control-input" id="DesasignarActualizar">
                                                    <label class="custom-control-label" for="DesasignarActualizar">Desasignar</label>
                                                </div>
                    
                                                <div class="custom-control custom-switch custom-control-inline">
                                                    <input type="checkbox" class="custom-control-input" id="DevProveedorActualizar">
                                                    <label class="custom-control-label" for="DevProveedorActualizar">Dev. Proveedor</label>
                                                </div>
                    
                                                <div class="custom-control custom-switch custom-control-inline">
                                                    <input type="checkbox" class="custom-control-input" id="HomeOfficeActualizar">
                                                    <label class="custom-control-label" for="HomeOfficeActualizar">HomeOffice</label>
                                                </div>
                    
                                                <hr>
                                                <h6><b>Acciones Masivas</b></h6>
                                                <div class="custom-control custom-switch custom-control-inline">
                                                    <input type="checkbox" class="custom-control-input"
                                                        id="AgregarMasivoActualizar"><label class="custom-control-label"
                                                        for="AgregarMasivoActualizar">Aregar **</label>
                                                </div>
                                                <div class="custom-control custom-switch custom-control-inline">
                                                    <input type="checkbox" class="custom-control-input"
                                                        id="ModificarmasivoActualizar"><label class="custom-control-label"
                                                        for="ModificarmasivoActualizar">Modificar **</label>
                                                </div>
                                                <div class="custom-control custom-switch custom-control-inline">
                                                    <input type="checkbox" class="custom-control-input" id="AsignarMasivoActualizar">
                                                    <label class="custom-control-label" for="AsignarMasivoActualizar">Asignar **</label>
                                                </div>
                    
                                                <div class="custom-control custom-switch custom-control-inline">
                                                    <input type="checkbox" class="custom-control-input" id="DesasignarMasivoActualizar">
                                                    <label class="custom-control-label" for="DesasignarMasivoActualizar">Desasignar **</label>
                                                </div>
                    
                                                <div class="custom-control custom-switch custom-control-inline">
                                                    <input type="checkbox" class="custom-control-input" id="DevProveedorMasivoActualizar">
                                                    <label class="custom-control-label" for="DevProveedorMasivoActualizar">Dev. Proveedor **</label>
                                                </div>
                    
                                                <div class="custom-control custom-switch custom-control-inline">
                                                    <input type="checkbox" class="custom-control-input" id="HomeOfficeMasivoActualizar">
                                                    <label class="custom-control-label" for="HomeOfficeMasivoActualizar">HomeOffice **</label>
                                                </div>
                                                <hr>
                                            </div>
                                            <br><br>`);

                                        } else {
                                            $(`#${Id_Menu}`).append(`
                                            <div class="col-md-3 mb-3 text-center">
                                                <button type="button" class="btn btn-primary btn-sm"
                                                    id="MarcarActualizar${Modulo.Id_Modulo}">${Modulo.Nombre_Modulo}</button>
                                                <br><br>
                                                <div class="custom-control custom-switch">
                                                    <input type="checkbox" class="custom-control-input" 
                                                        id="VerActualizar${Modulo.Id_Modulo}"><label class="custom-control-label" 
                                                        for="VerActualizar${Modulo.Id_Modulo}">Ver</label>
                                                </div>
                                                <div class="custom-control custom-switch">
                                                    <input type="checkbox" class="custom-control-input"
                                                        id="AgregarActualizar${Modulo.Id_Modulo}"><label class="custom-control-label"
                                                        for="AgregarActualizar${Modulo.Id_Modulo}">Aregar</label>
                                                </div>
                                                <div class="custom-control custom-switch">
                                                    <input type="checkbox" class="custom-control-input"
                                                        id="ModificarActualizar${Modulo.Id_Modulo}"><label class="custom-control-label"
                                                        for="ModificarActualizar${Modulo.Id_Modulo}">Modificar</label>
                                                </div>
                                                <div class="custom-control custom-switch">
                                                    <input type="checkbox" class="custom-control-input"
                                                        id="DesactivarActualizar${Modulo.Id_Modulo}"><label class="custom-control-label"
                                                        for="DesactivarActualizar${Modulo.Id_Modulo}">Desactivar</label>
                                                </div>
                                                <hr>
                                            </div>`);
                                        }

                                        if (Nombre_Modulo == 'Inventario') {
                                            $(`#MarcarActualizar${Modulo.Id_Modulo}`).click(function () {
                                                let isAnyChecked = (
                                                    !$(`#VerActualizar${Modulo.Id_Modulo}`).prop("checked") ||
                                                    !$(`#AgregarActualizar${Modulo.Id_Modulo}`).prop("checked") ||
                                                    !$(`#ModificarActualizar${Modulo.Id_Modulo}`).prop("checked") ||
                                                    !$(`#DesactivarActualizar${Modulo.Id_Modulo}`).prop("checked") ||
                                                    !$(`#DescargarActualizar`).prop("checked") ||
                                                    !$(`#SoporteActualizar`).prop("checked") ||
                                                    !$(`#HistorialActualizar`).prop("checked") ||
                                                    !$(`#AsignarActualizar`).prop("checked") ||
                                                    !$(`#DesasignarActualizar`).prop("checked") ||
                                                    !$(`#DevProveedorActualizar`).prop("checked") ||
                                                    !$(`#HomeOfficeActualizar`).prop("checked") ||
                                                    !$(`#AgregarMasivoActualizar`).prop("checked") ||
                                                    !$(`#ModificarmasivoActualizar`).prop("checked") ||
                                                    !$(`#AsignarMasivoActualizar`).prop("checked") ||
                                                    !$(`#DesasignarMasivoActualizar`).prop("checked") ||
                                                    !$(`#DevProveedorMasivoActualizar`).prop("checked") ||
                                                    !$(`#HomeOfficeMasivoActualizar`).prop("checked")
                                                );
                                                $(`#VerActualizar${Modulo.Id_Modulo}`).prop("checked", isAnyChecked);
                                                $(`#AgregarActualizar${Modulo.Id_Modulo}`).prop("checked", isAnyChecked);
                                                $(`#ModificarActualizar${Modulo.Id_Modulo}`).prop("checked", isAnyChecked);
                                                $(`#DesactivarActualizar${Modulo.Id_Modulo}`).prop("checked", isAnyChecked);
                                                $(`#DescargarActualizar`).prop("checked", isAnyChecked);
                                                $(`#SoporteActualizar`).prop("checked", isAnyChecked);
                                                $(`#HistorialActualizar`).prop("checked", isAnyChecked);
                                                $(`#AsignarActualizar`).prop("checked", isAnyChecked);
                                                $(`#DesasignarActualizar`).prop("checked", isAnyChecked);
                                                $(`#DevProveedorActualizar`).prop("checked", isAnyChecked);
                                                $(`#HomeOfficeActualizar`).prop("checked", isAnyChecked);
                                                $(`#AgregarMasivoActualizar`).prop("checked", isAnyChecked);
                                                $(`#ModificarmasivoActualizar`).prop("checked", isAnyChecked);
                                                $(`#AsignarMasivoActualizar`).prop("checked", isAnyChecked);
                                                $(`#DesasignarMasivoActualizar`).prop("checked", isAnyChecked);
                                                $(`#DevProveedorMasivoActualizar`).prop("checked", isAnyChecked);
                                                $(`#HomeOfficeMasivoActualizar`).prop("checked", isAnyChecked);
                                            });
                                        } else {
                                            $(`#MarcarActualizar${Modulo.Id_Modulo}`).click(function () {
                                                let isAnyChecked = (
                                                    !$(`#VerActualizar${Modulo.Id_Modulo}`).prop("checked") ||
                                                    !$(`#AgregarActualizar${Modulo.Id_Modulo}`).prop("checked") ||
                                                    !$(`#ModificarActualizar${Modulo.Id_Modulo}`).prop("checked") ||
                                                    !$(`#DesactivarActualizar${Modulo.Id_Modulo}`).prop("checked")
                                                );
                                                $(`#VerActualizar${Modulo.Id_Modulo}`).prop("checked", isAnyChecked);
                                                $(`#AgregarActualizar${Modulo.Id_Modulo}`).prop("checked", isAnyChecked);
                                                $(`#ModificarActualizar${Modulo.Id_Modulo}`).prop("checked", isAnyChecked);
                                                $(`#DesactivarActualizar${Modulo.Id_Modulo}`).prop("checked", isAnyChecked);
                                            });
                                        }



                                    });
                                } else {
                                    //window.location.assign("index.html");
                                };

                                let jefe = data.Jefe == "True" ? 1 : 0
                                $("#IdRolActu").val(data.Id_Rol);
                                $("#NombreRolActu").val(data.Nombre_Rol);
                                $("#DescripcionRolActu").val(data.Descripcion);
                                $("#JefeActu").val(jefe);

                                GetPermisosRol.forEach((Modulo) => {
                                    let Id_Operacion = Modulo.Id_Operacion;
                                    let Estado = Modulo.Id_Estado == "True" ? true : false;
                                    if (Id_Operacion == 1) {
                                        $(`#VerActualizar${Modulo.Id_Modulo}`).prop("checked", Estado);
                                    } else if (Id_Operacion == 2) {
                                        $(`#AgregarActualizar${Modulo.Id_Modulo}`).prop("checked", Estado);
                                    } else if (Id_Operacion == 3) {
                                        $(`#ModificarActualizar${Modulo.Id_Modulo}`).prop("checked", Estado);
                                    } else if (Id_Operacion == 4) {
                                        $(`#DesactivarActualizar${Modulo.Id_Modulo}`).prop("checked", Estado);
                                    };
                                });

                                $.ajax({
                                    type: "GET",
                                    dataType: "json",
                                    contentType: "application/json; charset=utf-8",
                                    headers: {
                                        Authorization: token_type + " " + access_token,
                                    },
                                    async: false,
                                    url: Url_Backend + "GetAccesoAcciones?Role=" + data.Id_Rol,
                                    beforeSend: function () { },
                                    success: function (GetPermisosAcciones) {
                                        const acciones = {
                                            Descargar: 'DescargarActualizar',
                                            Soporte: 'SoporteActualizar',
                                            Historial: 'HistorialActualizar',
                                            Asignar: 'AsignarActualizar',
                                            Desasignar: 'DesasignarActualizar',
                                            DevProveedor: 'DevProveedorActualizar',
                                            HomeOffice: 'HomeOfficeActualizar',
                                            Agregar_Masivo: 'AgregarMasivoActualizar',
                                            Modificar_Masivo: 'ModificarmasivoActualizar',
                                            Asignar_Masivo: 'AsignarMasivoActualizar',
                                            Desasignar_Masivo: 'DesasignarMasivoActualizar',
                                            DevProveedor_Masivo: 'DevProveedorMasivoActualizar',
                                            HomeOffice_Masivo: 'HomeOfficeMasivoActualizar',
                                        };
                                        Object.entries(acciones).forEach(([accion, idElemento]) => {
                                            const tienePermiso = GetPermisosAcciones.some(item => item.Accion === accion);
                                            $(`#${idElemento}`).prop("checked", tienePermiso);
                                        });
                                    },
                                    error: function (err) { },
                                    timeout: 300000,
                                });

                            },
                            error: function (err) { },
                            timeout: 300000,
                        });

                    },
                    error: function (err) { },
                    timeout: 300000
                });
            }

        },
        error: function (error) {
            swal("Upps!", "Error al obtener los datos de los Roles: " + error, "error");
        },
        timeout: 300000
    });

};

function CrearModalAgregar() {
    $.ajax({
        type: "GET",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        headers: {
            Authorization: token_type + " " + access_token,
        },
        async: false,
        url: Url_Backend + "GetModulos",
        beforeSend: function () { },
        success: function (response) {
            if (response != "") {
                //console.log(response);
                GlobalModulos = response
                $("#FormAgregarRol").empty();
                $("#FormAgregarRol").append(`
                <div class="form-group col-md-4 mb-3">
                    <label for="NombreRolAgre">Nombre del Rol</label>
                    <input type="text" class="form-control" id="NombreRolAgre" required>
                    <div class="valid-feedback"> Correcto! </div>
                    <div class="invalid-feedback"> Completar! </div>
                </div>
                <div class="form-group col-md-6 mb-3">
                    <label for="DescripcionRolAgre">Descripcion del Rol</label>
                    <input type="text" class="form-control" id="DescripcionRolAgre" required>
                    <div class="valid-feedback"> Correcto! </div>
                    <div class="invalid-feedback"> Completar! </div>
                </div>
                <div class="form-group col-md-2 mb-3">
                    <label for="JefeAgre">¿El rol es Jefe?</label>
                    <select id="JefeAgre" class="form-control" required>
                        <option value="" disabled selected>Elegir...</option>
                        <option value="1">Si</option>
                        <option value="0">No</option>
                    </select>
                    <div class="valid-feedback"> Correcto! </div>
                    <div class="invalid-feedback"> Completar! </div>
                </div>`);
                //Nombre padre Modulos
                var ModulosPadre = response.filter(
                    (Module) => Module.Id_Menu === "0"
                );
                //console.log(ModulosPadre);
                ModulosPadre.forEach((Modulo) => {
                    $("#FormAgregarRol").append(`
                    <div class="col-md-12 mb-3 " >
                        <h5 style="text-align: center;"><b>${Modulo.Nombre_Modulo}</b></h5>
                        <br>
                        <div class="form-row d-flex align-items-center justify-content-center" id="${Modulo.Id_Modulo}">
                        </div>
                    </div>`);
                });
                //Nombre Modulos hijos
                var ModulosHijo = response.filter(
                    (Module) => Module.Id_Menu !== "0"
                )

                console.log(ModulosHijo);
                ModulosHijo.forEach((Modulo) => {
                    let Id_Menu = Modulo.Id_Menu
                    let Nombre_Modulo = Modulo.Nombre_Modulo

                    if (Nombre_Modulo == 'Inventario') {
                        $(`#${Id_Menu}`).append(`
                        <div class="col-md-12 mb-3 text-center">
                            <button type="button" class="btn btn-primary btn-sm"
                                id="MarcarAgregar${Modulo.Id_Modulo}">${Modulo.Nombre_Modulo}</button>
                            <br><br>

                            <h6><b>Acciones</b></h6>
                            <div class="custom-control custom-switch custom-control-inline">
                                <input type="checkbox" class="custom-control-input" id="VerAgregar${Modulo.Id_Modulo}"><label
                                    class="custom-control-label" for="VerAgregar${Modulo.Id_Modulo}">Ver</label>
                            </div>
                            <div class="custom-control custom-switch custom-control-inline">
                                <input type="checkbox" class="custom-control-input"
                                    id="DesactivarAgregar${Modulo.Id_Modulo}"><label class="custom-control-label"
                                    for="DesactivarAgregar${Modulo.Id_Modulo}">Desactivar</label>
                            </div>
                            <div class="custom-control custom-switch custom-control-inline">
                                <input type="checkbox" class="custom-control-input"
                                    id="DescargarAgregar"><label class="custom-control-label"
                                    for="DescargarAgregar">Descargar</label>
                            </div>
                            <div class="custom-control custom-switch custom-control-inline">
                                <input type="checkbox" class="custom-control-input"
                                    id="SoporteAgregar"><label class="custom-control-label"
                                    for="SoporteAgregar">Soporte</label>
                            </div>
                            <div class="custom-control custom-switch custom-control-inline">
                                <input type="checkbox" class="custom-control-input"
                                    id="HistorialAgregar"><label class="custom-control-label"
                                    for="HistorialAgregar">Historial</label>
                            </div>

                            <hr>
                            <h6><b>Acciones Uno a Uno</b></h6>
                            <div class="custom-control custom-switch custom-control-inline">
                                <input type="checkbox" class="custom-control-input"
                                    id="AgregarAgregar${Modulo.Id_Modulo}"><label class="custom-control-label"
                                    for="AgregarAgregar${Modulo.Id_Modulo}">Aregar</label>
                            </div>
                            <div class="custom-control custom-switch custom-control-inline">
                                <input type="checkbox" class="custom-control-input"
                                    id="ModificarAgregar${Modulo.Id_Modulo}"><label class="custom-control-label"
                                    for="ModificarAgregar${Modulo.Id_Modulo}">Modificar</label>
                            </div>
                            <div class="custom-control custom-switch custom-control-inline">
                                <input type="checkbox" class="custom-control-input" id="AsignarAgregar">
                                <label class="custom-control-label" for="AsignarAgregar">Asignar</label>
                            </div>

                            <div class="custom-control custom-switch custom-control-inline">
                                <input type="checkbox" class="custom-control-input" id="DesasignarAgregar">
                                <label class="custom-control-label" for="DesasignarAgregar">Desasignar</label>
                            </div>

                            <div class="custom-control custom-switch custom-control-inline">
                                <input type="checkbox" class="custom-control-input" id="DevProveedorAgregar">
                                <label class="custom-control-label" for="DevProveedorAgregar">Dev. Proveedor</label>
                            </div>

                            <div class="custom-control custom-switch custom-control-inline">
                                <input type="checkbox" class="custom-control-input" id="HomeOfficeAgregar">
                                <label class="custom-control-label" for="HomeOfficeAgregar">HomeOffice</label>
                            </div>

                            <hr>
                            <h6><b>Acciones Masivas</b></h6>
                            <div class="custom-control custom-switch custom-control-inline">
                                <input type="checkbox" class="custom-control-input"
                                    id="AgregarMasivoAgregar"><label class="custom-control-label"
                                    for="AgregarMasivoAgregar">Aregar **</label>
                            </div>
                            <div class="custom-control custom-switch custom-control-inline">
                                <input type="checkbox" class="custom-control-input"
                                    id="ModificarmasivoAgregar"><label class="custom-control-label"
                                    for="ModificarmasivoAgregar">Modificar **</label>
                            </div>
                            <div class="custom-control custom-switch custom-control-inline">
                                <input type="checkbox" class="custom-control-input" id="AsignarMasivoAgregar">
                                <label class="custom-control-label" for="AsignarMasivoAgregar">Asignar **</label>
                            </div>

                            <div class="custom-control custom-switch custom-control-inline">
                                <input type="checkbox" class="custom-control-input" id="DesasignarMasivoAgregar">
                                <label class="custom-control-label" for="DesasignarMasivoAgregar">Desasignar **</label>
                            </div>

                            <div class="custom-control custom-switch custom-control-inline">
                                <input type="checkbox" class="custom-control-input" id="DevProveedorMasivoAgregar">
                                <label class="custom-control-label" for="DevProveedorMasivoAgregar">Dev. Proveedor **</label>
                            </div>

                            <div class="custom-control custom-switch custom-control-inline">
                                <input type="checkbox" class="custom-control-input" id="HomeOfficeMasivoAgregar">
                                <label class="custom-control-label" for="HomeOfficeMasivoAgregar">HomeOffice **</label>
                            </div>
                        </div>
                        <br><br>`);
                    } else {
                        $(`#${Id_Menu}`).append(`
                        <div class="col-md-3 mb-3 text-center">
                            <button type="button" class="btn btn-primary btn-sm"
                                id="MarcarAgregar${Modulo.Id_Modulo}">${Modulo.Nombre_Modulo}</button>
                            <br><br>
                            <div class="custom-control custom-switch">
                                <input type="checkbox" class="custom-control-input" id="VerAgregar${Modulo.Id_Modulo}"><label
                                    class="custom-control-label" for="VerAgregar${Modulo.Id_Modulo}">Ver</label>
                            </div>
                            <div class="custom-control custom-switch">
                                <input type="checkbox" class="custom-control-input"
                                    id="AgregarAgregar${Modulo.Id_Modulo}"><label class="custom-control-label"
                                    for="AgregarAgregar${Modulo.Id_Modulo}">Aregar</label>
                            </div>
                            <div class="custom-control custom-switch">
                                <input type="checkbox" class="custom-control-input"
                                    id="ModificarAgregar${Modulo.Id_Modulo}"><label class="custom-control-label"
                                    for="ModificarAgregar${Modulo.Id_Modulo}">Modificar</label>
                            </div>
                            <div class="custom-control custom-switch">
                                <input type="checkbox" class="custom-control-input"
                                    id="DesactivarAgregar${Modulo.Id_Modulo}"><label class="custom-control-label"
                                    for="DesactivarAgregar${Modulo.Id_Modulo}">Desactivar</label>
                            </div>
                            <hr>
                        </div>`);
                    }

                    if (Nombre_Modulo == 'Inventario') {
                        $(`#MarcarAgregar${Modulo.Id_Modulo}`).click(function () {
                            let isAnyChecked = (
                                !$(`#VerAgregar${Modulo.Id_Modulo}`).prop("checked") ||
                                !$(`#AgregarAgregar${Modulo.Id_Modulo}`).prop("checked") ||
                                !$(`#ModificarAgregar${Modulo.Id_Modulo}`).prop("checked") ||
                                !$(`#DesactivarAgregar${Modulo.Id_Modulo}`).prop("checked") ||
                                !$(`#DescargarAgregar`).prop("checked") ||
                                !$(`#SoporteAgregar`).prop("checked") ||
                                !$(`#HistorialAgregar`).prop("checked") ||
                                !$(`#AsignarAgregar`).prop("checked") ||
                                !$(`#DesasignarAgregar`).prop("checked") ||
                                !$(`#DevProveedorAgregar`).prop("checked") ||
                                !$(`#HomeOfficeAgregar`).prop("checked") ||
                                !$(`#AgregarMasivoAgregar`).prop("checked") ||
                                !$(`#ModificarmasivoAgregar`).prop("checked") ||
                                !$(`#AsignarMasivoAgregar`).prop("checked") ||
                                !$(`#DesasignarMasivoAgregar`).prop("checked") ||
                                !$(`#DevProveedorMasivoAgregar`).prop("checked") ||
                                !$(`#HomeOfficeMasivoAgregar`).prop("checked")
                            );
                            $(`#VerAgregar${Modulo.Id_Modulo}`).prop("checked", isAnyChecked);
                            $(`#AgregarAgregar${Modulo.Id_Modulo}`).prop("checked", isAnyChecked);
                            $(`#ModificarAgregar${Modulo.Id_Modulo}`).prop("checked", isAnyChecked);
                            $(`#DesactivarAgregar${Modulo.Id_Modulo}`).prop("checked", isAnyChecked);
                            $(`#DescargarAgregar`).prop("checked", isAnyChecked);
                            $(`#SoporteAgregar`).prop("checked", isAnyChecked);
                            $(`#HistorialAgregar`).prop("checked", isAnyChecked);
                            $(`#AsignarAgregar`).prop("checked", isAnyChecked);
                            $(`#DesasignarAgregar`).prop("checked", isAnyChecked);
                            $(`#DevProveedorAgregar`).prop("checked", isAnyChecked);
                            $(`#HomeOfficeAgregar`).prop("checked", isAnyChecked);
                            $(`#AgregarMasivoAgregar`).prop("checked", isAnyChecked);
                            $(`#ModificarmasivoAgregar`).prop("checked", isAnyChecked);
                            $(`#AsignarMasivoAgregar`).prop("checked", isAnyChecked);
                            $(`#DesasignarMasivoAgregar`).prop("checked", isAnyChecked);
                            $(`#DevProveedorMasivoAgregar`).prop("checked", isAnyChecked);
                            $(`#HomeOfficeMasivoAgregar`).prop("checked", isAnyChecked);
                        });
                    } else {
                        $(`#MarcarAgregar${Modulo.Id_Modulo}`).click(function () {
                            let isAnyChecked = (
                                !$(`#VerAgregar${Modulo.Id_Modulo}`).prop("checked") ||
                                !$(`#AgregarAgregar${Modulo.Id_Modulo}`).prop("checked") ||
                                !$(`#ModificarAgregar${Modulo.Id_Modulo}`).prop("checked") ||
                                !$(`#DesactivarAgregar${Modulo.Id_Modulo}`).prop("checked")
                            );
                            $(`#VerAgregar${Modulo.Id_Modulo}`).prop("checked", isAnyChecked);
                            $(`#AgregarAgregar${Modulo.Id_Modulo}`).prop("checked", isAnyChecked);
                            $(`#ModificarAgregar${Modulo.Id_Modulo}`).prop("checked", isAnyChecked);
                            $(`#DesactivarAgregar${Modulo.Id_Modulo}`).prop("checked", isAnyChecked);
                        });
                    }
                });
            } else {
                //window.location.assign("index.html");
            };

        },
        error: function (err) { },
        timeout: 300000,
    });
}

//Guardar rol y crear permisos a los modulos
function GuardarRoles() {
    ObtenerToken(User.Identificacion_Usuario, User.Password);
    var NombreRolAgre = $("#NombreRolAgre").val();
    var DescripcionRolAgre = $("#DescripcionRolAgre").val();
    var JefeRolAgre = $("#JefeAgre").val();
    let arrayDePermisosXRol = [];
    if (NombreRolAgre == "" || DescripcionRolAgre == "" || JefeRolAgre == "" || JefeRolAgre == null) {
        swal("Ey!", "Es obligatorio llenar los campos", "error");
        return false;
    }
    $(".preloader").show();
    $.ajax({
        url: Url_Backend + 'CreateRol?Nombre_Rol=' + NombreRolAgre + "&Descripcion=" + DescripcionRolAgre + "&Jefe=" + JefeRolAgre,
        type: 'GET',
        contentType: 'application/json',
        headers: {
            'Authorization': token_type + ' ' + access_token
        },
        //async: false,
        success: function (response) {
            let IdRol = response[0].IdRol

            //Crear array de permisos
            GlobalModulos.forEach((Modulo) => {
                let verValue = $(`#VerAgregar${Modulo.Id_Modulo}`).prop('checked');
                let agregarValue = $(`#AgregarAgregar${Modulo.Id_Modulo}`).prop('checked');
                let modificarValue = $(`#ModificarAgregar${Modulo.Id_Modulo}`).prop('checked');
                let desactivarValue = $(`#DesactivarAgregar${Modulo.Id_Modulo}`).prop('checked');
                let PadreEstado = false;

                if (Modulo.Id_Menu == "0") {
                    var ModulosHijo = GlobalModulos.filter(function (el) {
                        return (el.Id_Menu == Modulo.Id_Modulo);
                    });
                    ModulosHijo.forEach((Module) => {
                        let verValuePadre = $(`#VerAgregar${Module.Id_Modulo}`).prop('checked');
                        if (verValuePadre) {
                            PadreEstado = true;
                        }
                    });
                }

                let valores = {
                    Id_Rol: IdRol,
                    Id_Modulo: Modulo.Id_Modulo,
                    Ver: verValue ? 1 : 0,
                    Agregar: agregarValue ? 1 : 0,
                    Modificar: modificarValue ? 1 : 0,
                    Desactivar: desactivarValue ? 1 : 0,
                    Modulo_Padre: Modulo.Id_Menu == "0" ? 1 : 0,
                    Padre_Estado: PadreEstado == true ? 1 : 0
                };
                arrayDePermisosXRol.push(valores);
            });

            let AccionesXRol = {
                Id_Rol: IdRol,
                Descargar: $(`#DescargarAgregar`).prop('checked') ? 1 : 0,
                Soporte: $(`#SoporteAgregar`).prop('checked') ? 1 : 0,
                Historial: $(`#HistorialAgregar`).prop('checked') ? 1 : 0,
                Asignar: $(`#AsignarAgregar`).prop('checked') ? 1 : 0,
                Desasignar: $(`#DesasignarAgregar`).prop('checked') ? 1 : 0,
                DevProveedor: $(`#DevProveedorAgregar`).prop('checked') ? 1 : 0,
                HomeOffice: $(`#HomeOfficeAgregar`).prop('checked') ? 1 : 0,
                AgregarMasivo: $(`#AgregarMasivoAgregar`).prop('checked') ? 1 : 0,
                ModificarMasivo: $(`#ModificarmasivoAgregar`).prop('checked') ? 1 : 0,
                AsignarMasivo: $(`#AsignarMasivoAgregar`).prop('checked') ? 1 : 0,
                DesasignarMasivo: $(`#DesasignarMasivoAgregar`).prop('checked') ? 1 : 0,
                DevProveedorMasivo: $(`#DevProveedorMasivoAgregar`).prop('checked') ? 1 : 0,
                HomeOfficeMasivo: $(`#HomeOfficeMasivoAgregar`).prop('checked') ? 1 : 0
            }

            $.ajax({
                url: Url_Backend + "CreatePermisosAcciones",
                type: "POST",
                dataType: "json",
                contentType: "application/x-www-form-urlencoded; charset=utf-8",
                headers: {
                    'Authorization': token_type + ' ' + access_token
                },
                data: AccionesXRol,
                //async: false,
                beforeSend: function () { },
                success: function (response) {

                },
                error: function (err) {
                    $(".preloader").hide();
                    swal("Ey!", "Error al agregar el Permisos de las acciones del modulo de inventario: " + err, "error");
                },
                timeout: 300000,
            });

            //Recorrer array para grabarlos en la bd
            var totalElementos = arrayDePermisosXRol.length;
            var elementosProcesados = 0;
            arrayDePermisosXRol.forEach((valores) => {
                //console.log(valores);
                $.ajax({
                    url: Url_Backend + "CreatePermisosModulos",
                    type: "POST",
                    dataType: "json",
                    contentType: "application/x-www-form-urlencoded; charset=utf-8",
                    headers: {
                        'Authorization': token_type + ' ' + access_token
                    },
                    data: valores,
                    //async: false,
                    beforeSend: function () { },
                    success: function (response) {
                        elementosProcesados++;
                        if (elementosProcesados === totalElementos) {
                            swal("Bien!", "El Rol fue agregado correctamente", "success");
                            Inicializador();
                            $("#GSCCModal").modal("hide");
                            $(".preloader").hide();
                        }

                    },
                    error: function (err) {
                        $(".preloader").hide();
                        swal("Ey!", "Error al agregar el Rol: " + err, "error");
                    },
                    timeout: 300000,
                });

            });
        },
        error: function (err) { 
            $(".preloader").hide();
        },
        timeout: 300000
    });
};

function ActualizarRol() {
    ObtenerToken(User.Identificacion_Usuario, User.Password);
    let arrayDeValores = [];
    var Id_Rol = $("#IdRolActu").val();
    var NombreRolActu = $("#NombreRolActu").val();
    var DescripcionRolActu = $("#DescripcionRolActu").val();
    var JefeActu = $("#JefeActu").val();
    if (NombreRolActu == "" || DescripcionRolActu == "" || JefeActu == "" || JefeActu == null) {
        swal("Ey!", "Es obligatorio llenar los campos", "error");
        return false;
    }
    $(".preloader").show();
    //Crear array de permisos
    GlobalModulos.forEach((Modulo) => {
        let verValue = $(`#VerActualizar${Modulo.Id_Modulo}`).prop('checked');
        let agregarValue = $(`#AgregarActualizar${Modulo.Id_Modulo}`).prop('checked');
        let modificarValue = $(`#ModificarActualizar${Modulo.Id_Modulo}`).prop('checked');
        let desactivarValue = $(`#DesactivarActualizar${Modulo.Id_Modulo}`).prop('checked');
        let PadreEstado = false;

        if (Modulo.Id_Menu == "0") {
            var ModulosHijo = GlobalModulos.filter(function (el) {
                return (el.Id_Menu == Modulo.Id_Modulo);
            });
            ModulosHijo.forEach((Module) => {
                let verValuePadre = $(`#VerActualizar${Module.Id_Modulo}`).prop('checked');
                if (verValuePadre) {
                    PadreEstado = true;
                }
            });
        }

        let valores = {
            Id_Rol: Id_Rol,
            Id_Modulo: Modulo.Id_Modulo,
            Ver: verValue ? 1 : 0,
            Agregar: agregarValue ? 1 : 0,
            Modificar: modificarValue ? 1 : 0,
            Desactivar: desactivarValue ? 1 : 0,
            Modulo_Padre: Modulo.Id_Menu == "0" ? 1 : 0,
            Padre_Estado: PadreEstado == true ? 1 : 0
        };
        arrayDeValores.push(valores);
    });

    //Recorrer array para actualizarlos en la bd
    arrayDeValores.forEach((valores) => {
        //console.log(valores);
        $.ajax({
            url: Url_Backend + "UpdatePermisosModulos",
            type: "POST",
            dataType: "json",
            contentType: "application/x-www-form-urlencoded; charset=utf-8",
            headers: {
                'Authorization': token_type + ' ' + access_token
            },
            data: valores,
            //async: false,
            beforeSend: function () { },
            success: function (response) {
            },
            error: function (err) {
                $(".preloader").hide();
                swal("Ey!", "Error al agregar el Rol: " + err, "error");
            },
            timeout: 300000,
        });

    });

    Param = {
        Id_Rol: Id_Rol,
        Nombre_Rol: NombreRolActu,
        DescripcionRol: DescripcionRolActu,
        Jefe: JefeActu
    }

    $.ajax({
        url: Url_Backend + "ActualizarRoles",
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
            swal("Bien!", "El Rol fue actualizado correctamente", "success");
            Inicializador();
            $("#GSCCModal2").modal("hide");
        },
        error: function (err) {
            $(".preloader").hide();
            swal("Ey!", "Error al agregar el Rol: " + err, "error");
        },
        timeout: 300000,
    });

    let AccionesXRol = {
        Id_Rol: Id_Rol,
        Descargar: $(`#DescargarActualizar`).prop('checked') ? 1 : 0,
        Soporte: $(`#SoporteActualizar`).prop('checked') ? 1 : 0,
        Historial: $(`#HistorialActualizar`).prop('checked') ? 1 : 0,
        Asignar: $(`#AsignarActualizar`).prop('checked') ? 1 : 0,
        Desasignar: $(`#DesasignarActualizar`).prop('checked') ? 1 : 0,
        DevProveedor: $(`#DevProveedorActualizar`).prop('checked') ? 1 : 0,
        HomeOffice: $(`#HomeOfficeActualizar`).prop('checked') ? 1 : 0,
        AgregarMasivo: $(`#AgregarMasivoActualizar`).prop('checked') ? 1 : 0,
        ModificarMasivo: $(`#ModificarmasivoActualizar`).prop('checked') ? 1 : 0,
        AsignarMasivo: $(`#AsignarMasivoActualizar`).prop('checked') ? 1 : 0,
        DesasignarMasivo: $(`#DesasignarMasivoActualizar`).prop('checked') ? 1 : 0,
        DevProveedorMasivo: $(`#DevProveedorMasivoActualizar`).prop('checked') ? 1 : 0,
        HomeOfficeMasivo: $(`#HomeOfficeMasivoActualizar`).prop('checked') ? 1 : 0
    }

    $.ajax({
        url: Url_Backend + "UpdatePermisosAcciones",
        type: "POST",
        dataType: "json",
        contentType: "application/x-www-form-urlencoded; charset=utf-8",
        headers: {
            'Authorization': token_type + ' ' + access_token
        },
        data: AccionesXRol,
        //async: false,
        beforeSend: function () { },
        success: function (response) {
            $(".preloader").hide();
        },
        error: function (err) {
            $(".preloader").hide();
            swal("Ey!", "Error al actualizar los Permisos de las acciones del modulo de inventario: " + err, "error");
        },
        timeout: 300000,
    });
    
};
