var Url_Backend = "http://localhost:57737/";
//var Url_Backend = window.location.origin + '/inventario/Backend/';
var access_token;
var token_type;
var User;
var Seriales;
var Ciudades;
var InventarioSeleccionado;
var DatosInventario;
var CheckBoxSeleccionados;
var ProveedoresAll
var ActivosAll
var MarcasAll
var TipoCheck
var ProcesadorRAMDisco = false;
var PermisosAcciones;

$(document).ready(function () {
    Inicializadores();
});

//Inicializar
function Inicializadores() {
    User = localStorage.getItem("User_Inventarios");
    if (User) {
        User = JSON.parse(atob(User));
        User = User[0];
    } else {
        window.location.assign("index.html");
    };
    ObtenerToken(User.Identificacion_Usuario, User.Password);
    GetSeriales();
    GetPermisosAcciones();
    GetInventarios();
    GetProveedores();
    GetProcesadores();
    GetRAM();
    GetDiscos();
    GetCiudades();
    GetMarcas();
    GetTipoActivo();
    $('#demo-multiple-select').multiselect();

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

//Ampliar imagen al selecionarla
$('.image-popup').magnificPopup({
    type: 'image',
    zoom: {
        enabled: true, duration: 300, easing: 'ease-in-out', opener: function (openerElement) {
            return openerElement.is('img') ? openerElement : openerElement.find('img');
        }
    }
});

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

//Obtener permisos de las acciones
function GetPermisosAcciones(){
    $.ajax({
        type: "GET",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        headers: {
            Authorization: token_type + " " + access_token,
        },
        async: false,
        url: Url_Backend + "GetAcciones?Role=" + User.Id_Rol,
        beforeSend: function () { },
        success: function (response) {
            PermisosAcciones = response;
        },
        error: function (err) { },
        timeout: 300000,
    });
}

//Tabla de inventarios
function GetInventarios() {
    $("#divTablaInventario").empty();
    $("#divTablaInventario").append(`
        <table style="width:100%;" id="TablaInventario" class="table table-striped table-bordered compact">
        </table> `);
    $.ajax({
        url: Url_Backend + "Get_Inventario",
        type: 'GET',
        contentType: 'application/json',
        headers: {
            'Authorization': token_type + ' ' + access_token
        },
        async: false,
        success: function (response) {
            window.DatosInventario = response
            let SoporteB = PermisosAcciones.filter(item => item.Accion === 'Soporte').length > 0 ? true : false
            let HistorialB = PermisosAcciones.filter(item => item.Accion === 'Historial').length > 0 ? true : false
            let AsignarB = PermisosAcciones.filter(item => item.Accion === 'Asignar').length > 0 ? true : false
            let DesasignarB = PermisosAcciones.filter(item => item.Accion === 'Desasignar').length > 0 ? true : false
            let DevProveedorB = PermisosAcciones.filter(item => item.Accion === 'DevProveedor').length > 0 ? true : false
            let HomeOfficeB = PermisosAcciones.filter(item => item.Accion === 'HomeOffice').length > 0 ? true : false
            let ModificarB = PermisosAcciones.filter(item => item.Accion === 'Modificar').length > 0 ? true : false
            let DesactivarB = PermisosAcciones.filter(item => item.Accion === 'Desactivar').length > 0 ? true : false

            Tablecolumns = [{
                "title": '<label class="container"><input id="checkbox-select-all" type="checkbox" class="checkbox-select"><div class="checkmark1 checkbox-select"></div></label>',
                "data": null,
                "orderable": false,
                "className": "  dt-body-center",
                "render": function (data, type, row, meta) {
                    return '<label class="container"><input  type="checkbox" class="checkbox-select"><div class="checkmark1"></div></label>';
                }
            }, {
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
                "title": "Descripcion",
                "data": "Descripcion"
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
            },
            {
                "title": "Acciones",
                "defaultContent" : `
                    ${ModificarB ? `<a href="#" class="editar" title="Editar" data-toggle="tooltip" >
                        <span style="color:#00b341" class="material-symbols-outlined">stylus_note</span>
                    </a>` : ''}
                    
                    ${SoporteB ? `<a href="#" class="soporte" title="Ingresar a Soporte" data-toggle="tooltip">
                        <span style="color:#009988" class="material-symbols-outlined">build_circle</span>
                    </a>` : ``}
                    
                    ${HomeOfficeB ? `<a href="#" class="homeOffice" title="Enviar a Home Office" data-toggle="tooltip">
                        <span style="color:#6f32be" class="material-symbols-outlined">location_away</span>
                    </a>` : ``}
                    
                    ${DesasignarB ? `<a href="#" class="desasignar" title="Desasignar" data-toggle="tooltip">
                        <span style="color:#00abfb"class="material-symbols-outlined">person_remove</span>
                    </a>` : ``}
                    
                    ${AsignarB ? `<a href="#" class="asignar" title="Asignar" data-toggle="tooltip">
                        <span style="color:#c9de00" class="material-symbols-outlined">person_add</span>
                    </a>` : ``}
                    
                    ${DesactivarB ? `<a href="#" class="eliminar" title="Activar" data-toggle="tooltip">
                        <span style="color:#597e8d" class="material-symbols-outlined">task_alt</span>
                    </a>` : ``}
                    
                    ${DevProveedorB ? `<a href="#" class="devProveedor" title="Devolver a Proveedor" data-toggle="tooltip">
                        <span style="color:#7f5345" class="material-symbols-outlined">rv_hookup</span>
                    </a>` : ``}
                    
                    ${HistorialB ? `<a href="#" class="historial" title="Historial" data-toggle="tooltip" >
                        <span style="color:#ffbf00" class="material-symbols-outlined">history</span>
                    </a>` : ``}
                    `
            }];

            if ($.fn.dataTable.isDataTable('#TablaInventario')) {
                TablaInventario.destroy();
            }
            //Crear tabla
            TablaInventario = $("#TablaInventario").DataTable({
                select: true,
                pageLength: 15,
                lengthMenu: [
                    [5, 10, 15, 20, -1],
                    [5, 10, 15, 20, "Todos"]
                ],
                data: response,
                columns: Tablecolumns,

                columnDefs: [
                    { searchable: true, targets: [0, 1, 2] } // Habilitar búsqueda en las columnas 0, 1 y 2
                ],
                drawCallback: function () {
                    $('[data-toggle="tooltip"]').tooltip();
                    
                },
                dom: "<'row'<'col-sm-1'l><'col-sm-9'<'Boton-tabla'B>><'col-sm-2'f>>" +
                    "<'row'<'col-sm-12'tr>>" +
                    "<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>",
                buttons: [
                    'colvis',
                ],
                fnRowCallback: function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
                    if (aData.Nombre_Estado == "Inactivo") {
                        $('.asignar', nRow).hide();
                    }
                    if (aData.Identificacion_Usuario !== null) {
                        $('.editar', nRow).hide();
                        $('.devProveedor', nRow).hide();
                        $('.eliminar', nRow).hide();
                    }
                    if (aData.Soporte == "SI") {
                        $('td', nRow).css('background-color', '#FF5E5E');
                    };
                    if (!aData.Identificacion_Usuario) {
                        $('.desasignar', nRow).hide();
                    } else {
                        $('.asignar', nRow).hide();
                    };
                    if (aData.Id_Estado_Inventario == "True") {
                        var svg = $(nRow).find('.eliminar span');
                        var nuevoSVG = '\
                            <span style="color:#597e8d" class="material-symbols-outlined">cancel</span>';
                        svg.html(nuevoSVG);
                        $('.eliminar', nRow).attr('title', 'Inactivar');
                    };
                    if (aData.Soporte == "SI") {
                        var svg = $(nRow).find('.soporte span');
                        var nuevoSVG = '\
                            <span style="color:#009988" class="material-symbols-outlined">reset_wrench</span>';
                        svg.html(nuevoSVG);
                        $('.soporte', nRow).attr('title', 'Regresar de Soporte');
                    }
                    if (aData.Dev_Proveedor == "SI") {
                        var svg = $(nRow).find('.devProveedor span');
                        var nuevoSVG = '\
                            <span style="color:#7f5345" class="material-symbols-outlined">forklift</span>';
                        svg.html(nuevoSVG);
                        $('.devProveedor', nRow).attr('title', 'Recibir de Proveedor');
                    }
                    if (aData.Identificacion_Usuario == null) {
                        $('.homeOffice', nRow).hide();
                    } else {
                        if (aData.Home_Office == "SI" && aData.Identificacion_Usuario != null) {
                            $('.homeOffice', nRow).show();
                            var svg = $(nRow).find('.homeOffice span');
                            var nuevoSVG = '\
                            <span style="color:#6f32be" class="material-symbols-outlined">apartment</span>';
                            svg.html(nuevoSVG);
                            $('.homeOffice', nRow).attr('title', 'Regreso de Home Office');
                        }
                    }
                },
            }).columns.adjust().draw();

            // Crear un mapeo de nombre de columna a índice
            var nombreAIndice = {};
            TablaInventario.columns().every(function (index) {
                var data = this.dataSrc();
                nombreAIndice[data] = index;
            });

            //Buscadores en input o select
            $('#TablaInventario thead th').each(function (i) {
                var title = $(this).text();
                if (i !== 0 && i !== $('#TablaInventario thead th').length - 1) {
                    if (title === "Proveedor") {
                        $(this).html(title + '<select class="form-control form-control-sm" style="width: 100%" id="tablaProveedores"></select>');
                    } else if (title === "Activo") {
                        $(this).html(title + '<select class="form-control form-control-sm" style="width: 100%" id="tablaActivos"></select>');
                    } else if (title === "Procesador") {
                        $(this).html(title + '<select class="form-control form-control-sm" style="width: 100%" id="tablaProcesadores"></select>');
                    } else if (title === "RAM") {
                        $(this).html(title + '<select class="form-control form-control-sm" style="width: 100%" id="tablaRAM"></select>');
                    } else if (title === "Disco") {
                        $(this).html(title + '<select class="form-control form-control-sm" style="width: 100%" id="tablaDiscos"></select>');
                    } else if (title === "Marca") {
                        $(this).html(title + '<select class="form-control form-control-sm" style="width: 100%" id="tablaMarcas"></select>');
                    } else if (title === "Ciudad") {
                        $(this).html(title + '<select class="form-control form-control-sm" style="width: 100%" id="tablaCiudad"></select>');
                    } else if (title === "Soporte") {
                        $(this).html(title + '<select class="form-control form-control-sm" style="width: 100%"><option value="">Todos</option><option value="SI">Si</option><option value="NO">No</option></select>');
                    } else if (title === "Estado") {
                        $(this).html(title + '<select class="form-control form-control-sm" style="width: 100%"><option value="">Todos</option><option value="ACTIVO">Activo</option><option value="INACTIVO">Inactivo</option></select>');
                    } else if (title === "Home Office") {
                        $(this).html(title + '<select class="form-control form-control-sm" style="width: 100%"><option value="">Todos</option><option value="SI">SI</option><option value="NO">NO</option></select>');
                    } else if (title === "Dev. Proveedor") {
                        $(this).html(title + '<select class="form-control form-control-sm" style="width: 100%"><option value="">Todos</option><option value="SI">SI</option><option value="NO">NO</option></select>');
                    } else {
                        $(this).html(title + '<input type="text" class="form-control form-control-sm" placeholder="Buscar ' + title + '" />');
                    }
                }
            });

            //Ocultar Columnas segun usuario
            $.ajax({
                url: Url_Backend + "NoColumns?Identificacion_Usuario=" + User.Identificacion_Usuario,
                type: 'GET',
                contentType: 'application/json',
                headers: {
                    'Authorization': token_type + ' ' + access_token
                },
                async: false,
                success: function (response) {
                    response.forEach(element => {
                        TablaInventario.columns([nombreAIndice[element.Name_Column]]).visible(false);
                    });
                },
                error: function (error) {
                    swal("Upps!", "Error al obtener listado de columnas a ocultar: " + error, "error");
                },
                timeout: 300000
            });

            //Evento para el buscador de cada columna
            TablaInventario.columns().every(function () {
                var table = this;
                $('input, select', this.header()).not('#checkbox-select-all').on('keyup change', function () {
                    if (table.search() !== this.value) {
                        table.search(this.value).draw();
                    }
                });
            });

            //Actualizar columnas a ocultar
            TablaInventario.on('column-visibility.dt', function (e, settings, column, state) {
                var columnasOriginales = TablaInventario.settings().init().columns;
                var columnasVisibles = TablaInventario.columns().visible();
                var columnasNoVisibles = columnasOriginales.slice(1, -1).filter(function (columna, index) {
                    return !columnasVisibles[index + 1]; // Se suma 1 al índice para ajustarse al filtrado de la primera columna
                }).map(function (columna) {
                    return columna.data;
                }).join(',');
                var Param = {
                    Name_Column: columnasNoVisibles,
                    Identificacion_Usuario: User.Identificacion_Usuario,
                };
                $.ajax({
                    url: Url_Backend + "UpdateNoColumns",
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
                        //console.log(response);
                    },
                    error: function (err) {
                        swal("Upps!", "Error al Actualizar el listado de columnas a ocular: " + err, "error");
                    },
                    timeout: 300000,
                });
            });

            // ================================== BOTONES MASIVOS ================================== //
            //Seleccionar o deselecionar checkbox
            $(document).on('change', '#checkbox-select-all', function () {
                var isChecked = $(this).prop('checked');
                $('.checkbox-select').prop('checked', isChecked);
            });

            // ================================== BOTONES DE ACCIONES ================================== //
            //Obtener datos al darle click en editar
            $("#TablaInventario tbody").on("click", "a.editar", function () {
                var dataEditar = TablaInventario.row($(this).parents("tr")).data();
                EditarInventario(dataEditar);
            });

            //Obtener datos al darle click en soporte
            $("#TablaInventario tbody").on("click", "a.soporte", function () {
                var dataSoporte = TablaInventario.row($(this).parents("tr")).data();
                ActivarSoporte(dataSoporte);
            });

            //Obtener datos al darle click en eliminar
            $("#TablaInventario tbody").on("click", "a.eliminar", function () {
                var dataEliminar = TablaInventario.row($(this).parents("tr")).data();
                DesactivarInventario(dataEliminar);
            });

            //Obtener datos al darle click en desasignar
            $("#TablaInventario tbody").on("click", "a.desasignar", function () {
                var dataDevolucion = TablaInventario.row($(this).parents("tr")).data();
                const arraydataDevolucion = [dataDevolucion];
                DevolverInventario(arraydataDevolucion, User);
                FirmasModales("PlantillaDevolver", "DivFirmasDevolucion");
            });

            //Obtener datos al darle click en Asignar
            $("#TablaInventario tbody").on("click", "a.asignar", function () {
                var dataAsignacion = TablaInventario.row($(this).parents("tr")).data();
                if (dataAsignacion.Nombre_Estado == "Inactivo") {
                    swal("Alto! No se puede Asignar un dispositivo inactivo", { icon: "error" });
                    return
                }
                const arraydataAsignacion = [dataAsignacion];
                AsignarInventario(arraydataAsignacion, User);
                FirmasModales("PlantillaAsignar", "DivFirmasAsignacion");
                //FirmasModales("PlantillasHomeOffice", "DivFirmasAsignacion", true);
            });


            //Obtener datos al darle click en homeoffice
            $("#TablaInventario tbody").on("click", "a.homeOffice", function () {
                var dataHomeOffice = TablaInventario.row($(this).parents("tr")).data();
                const arraydataHomeOffice = [dataHomeOffice];
                HomeOffice(arraydataHomeOffice, User);
                FirmasModales("PlantillaHomeOffice", "DivFirmasHomeOffice");
            });

            //Obtener datos al darle click en devolver o recibir del proveedor
            $("#TablaInventario tbody").on("click", "a.devProveedor", function () {
                var dataDevProveedor = TablaInventario.row($(this).parents("tr")).data();
                DevProveedor(dataDevProveedor);
            });

            //Obtener datos al darle click en historial
            $("#TablaInventario tbody").on("click", "a.historial", function () {
                var dataHistorial = TablaInventario.row($(this).parents("tr")).data();
                HisorialInventario(dataHistorial);
            });

            function HisorialInventario(received) {
                $("#ModalHistorico").modal("show");
                $("#divTablaHistorico").empty();
                $("#tituloHistorico").empty();
                $("#tituloHistorico").text(`Historico del serial - ${received.Serial}`);
                $("#divTablaHistorico").append(`
                <table style="width:100%;" id="TablaHistorico" class="table table-striped table-bordered">
                </table> `);
                $.ajax({
                    url: Url_Backend + "GetHistorico?Serial=" + received.Serial,
                    type: 'GET',
                    contentType: 'application/json',
                    headers: {
                        'Authorization': token_type + ' ' + access_token
                    },
                    async: false,
                    success: function (response) {
                        Tablecolumns = [{
                            "title": "Motivo",
                            "data": "Motivo"
                        },
                        {
                            "title": "Usuario",
                            "data": "Usuario"
                        },
                        {
                            "title": "Fecha",
                            "data": "Fecha",
                            "render": function (data, type, row) {
                                if (type === 'display' || type === 'filter') {
                                    return moment(data).format('DD/MM/YYYY HH:mm:ss');
                                }
                                return data;
                            }
                        },
                        {
                            "title": "Id_Acta_Drive",
                            "data": "Id_Acta_Drive"
                        }, {
                            "title": "Acta",
                            "defaultContent": `
                            <a href="#" class="abrirActa" title="Abrir acta" data-toggle="tooltip" >
                                <span style="color:#029499" class="material-symbols-outlined">visibility</span>
                            </a>`
                        }];

                        if ($.fn.dataTable.isDataTable('#TablaHistorico')) {
                            TablaHistorial.destroy();
                        }
                        TablaHistorial = $("#TablaHistorico").DataTable({
                            select: true,
                            pageLength: 15,
                            lengthMenu: [
                                [5, 10, 15, 20, -1],
                                [5, 10, 15, 20, "Todos"]
                            ],
                            data: response,
                            columns: Tablecolumns,
                            drawCallback: function () {
                                $('[data-toggle="tooltip"]').tooltip();
                            },
                            fnRowCallback: function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
                                if (aData.Id_Acta_Drive == null) {
                                    $('.abrirActa', nRow).hide();
                                };
                            },
                            order: [
                                [2, 'desc']
                            ],
                            columnDefs: [
                                {
                                    targets: 3, // El índice de la columna.
                                    visible: false
                                }
                            ],
                        }).columns.adjust().draw();

                        $("#TablaHistorico tbody").on("click", "a.abrirActa", function () {
                            var dataHistorial = TablaHistorial.row($(this).parents("tr")).data();
                            PermissionsEdit(dataHistorial)
                        });

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
                                    window.open(nuevaStr, '_blank');
                                },
                                error: function (error) { },
                                timeout: 300000
                            });
                        }
                    },
                    error: function (error) {
                        swal("Upps!", "Error al obtener los datos del Historial: " + error, "error");
                    },
                    timeout: 300000
                });
            }

            function DevProveedor(received) {
                if (received.Identificacion_Usuario !== null) {
                    swal("Alto! No se puede Devolver a proveedor un dispositivo asignado", { icon: "error" });
                    return
                }
                $("#DevRecProveedorCheck").prop("hidden", true);
                if (received.Dev_Proveedor == "NO") {
                    $("#tituloMotivoDevolucion").text("Motivo de Devolución a Proveedor");
                    $("#parrafoMotivoDevolucion").text("Por favor digite el motivo el cual va a hacer la devolucion al proveedor");
                    $("#DevolucionProveedorUnica").removeAttr("hidden");
                    $("#RecibirProveedorUnica").prop("hidden", true);
                } else {
                    $("#tituloMotivoDevolucion").text("Motivo de Recibir a Proveedor");
                    $("#parrafoMotivoDevolucion").text("Por favor digite el motivo el cual va a recibir al proveedor");
                    $("#RecibirProveedorUnica").removeAttr("hidden");
                    $("#DevolucionProveedorUnica").prop("hidden", true);
                }
                $('#MotivoDevolucion').val('');
                $("#ModalDevolucionProveedor").modal("show");
                InventarioSeleccionado = received;
            };

            function EditarInventario(received) {
                if (received.Identificacion_Usuario !== null) {
                    swal("Alto! No se puede actualizar un dispositivo asignado", { icon: "error" });
                    return
                }
                IdInventarioSeleccionado = received.Id_Inventario;
                InventarioSeleccionado = received;
                GetProveedores("ProveedorEditar");
                GetTipoActivo("NombreActivoEditar");
                GetMarcas("MarcaEditar");
                GetDiscos("DiscoActu");
                GetRAM("RamActu");
                GetProcesadores("ProcesadorActu");
                GetFoto(received.Id_Inventario);
                $("#SerialEditar").val(received.Serial);
                $("#PlacaEditar").val(received.Placa);
                $("#DescripcionEditar").val(received.Descripcion);
                $("#ProveedorEditar option[value=" + received.Id_Proveedor + "]").attr("selected", true);
                $("#NombreActivoEditar option[value=" + received.Id_Tipo_Activo + "]").attr("selected", true);
                $("#MarcaEditar option[value=" + received.Id_Marca + "]").attr("selected", true);
                TraerUsuarioAsignado(received.Identificacion_Usuario);
                TraerUbicacion("CiudadElegirEditar", "SedeEditar", "PisoEditar", "PuestoEditar", received);
                const activosFiltrados = ActivosAll.filter(function (activo) {
                    return activo.Id_Tipo_Activo === received.Id_Tipo_Activo && activo.ProcesadorRamDisco == "True";
                });
                const DispoSeleccionado = DatosInventario.filter(function (datos) {
                    return datos.Id_Inventario == IdInventarioSeleccionado;
                });
                $("#ProcesadorActu option[value=" + DispoSeleccionado[0].Id_Procesador + "]").attr("selected", true);
                $("#RamActu option[value=" + DispoSeleccionado[0].Id_RAM + "]").attr("selected", true);
                $("#DiscoActu option[value=" + DispoSeleccionado[0].Id_Disco + "]").attr("selected", true);
                if (activosFiltrados.length > 0) {
                    $("#DivProcesadorAct, #DivRamAct, #DivDiscoAct").removeAttr("hidden");
                    $("#ProcesadorActu, #RamActu, #DiscoActu").attr("required", true);
                    ProcesadorRAMDisco = true;
                } else {
                    $("#DivProcesadorAct, #DivRamAct, #DivDiscoAct").attr("hidden", true);
                    $("#ProcesadorActu, #RamActu, #DiscoActu").removeAttr("required");
                    ProcesadorRAMDisco = false;
                }
                $("#ModalEditarInventario").modal("show");
            };

            //Valida si necesita procesador ram y disco
            $("#NombreActivoEditar").change(function () {
                $("#ProcesadorActu, #RamActu, #DiscoActu").val("");
                var valorSeleccionado = $(this).val();
                const activosFiltrados = ActivosAll.filter(function (activo) {
                    return activo.Id_Tipo_Activo === valorSeleccionado && activo.ProcesadorRamDisco == "True";
                });
                if (activosFiltrados.length > 0) {
                    $("#DivProcesadorAct, #DivRamAct, #DivDiscoAct").removeAttr("hidden");
                    $("#ProcesadorActu, #RamActu, #DiscoActu").attr("required", true);
                    ProcesadorRAMDisco = true;
                } else {
                    $("#DivProcesadorAct, #DivRamAct, #DivDiscoAct").attr("hidden", true);
                    $("#ProcesadorActu, #RamActu, #DiscoActu").removeAttr("required");
                    ProcesadorRAMDisco = false;
                }
            });

            function ActivarSoporte(received) {
                IdInventarioSeleccionado = received.Id_Inventario
                InventarioSeleccionado = received
                let mensaje = received.Soporte == null || received.Soporte == "SI" ? "¿Esta seguro de devolver de soporte el dispositivo?" : "¿Esta seguro de enviar a soporte el dispositivo?"
                let soporte = received.Soporte == null || received.Soporte == "SI" ? "0" : "1"
                swal({ title: mensaje, icon: "warning", buttons: true, dangerMode: false, }).then((opcion) => {
                    if (opcion) {
                        $('.preloader').show();
                        SoporteActivaInventario(2, "", soporte);
                    } else {
                        toastr.info('No se aplico ningún cambio.');
                    }
                });
            };

            function DesactivarInventario(received) {
                if (received.Identificacion_Usuario !== null) {
                    swal("Alto! No se puede inactivar un dispositivo asignado", { icon: "error" });
                    return
                }
                if (received.Identificacion_Usuario == null || received.Identificacion_Usuario == undefined || received.Identificacion_Usuario == "") {
                    IdInventarioSeleccionado = received.Id_Inventario
                    InventarioSeleccionado = received
                    let mensaje = received.Id_Estado_Inventario == null || received.Id_Estado_Inventario == "True" ? "¿Esta seguro de inactivar el dispositivo?" : "¿Esta seguro de activar el dispositivo?"
                    let desact = received.Id_Estado_Inventario == null || received.Id_Estado_Inventario == "True" ? "0" : "1"
                    swal({ title: mensaje, icon: "warning", buttons: true, dangerMode: false, }).then((opcion) => {
                        if (opcion) {
                            $('.preloader').show();
                            SoporteActivaInventario(1, desact);
                        } else {
                            toastr.info('No se aplico ningún cambio.');
                        }
                    });
                } else {
                    swal("Alto!", "El dispositivo no se puede desactivar por que tiene un usuario asignado.", "warning");
                }

            };

        },
        error: function (error) {
            swal("Upps!", "Error al obtener los datos del inventario: " + error, "error");
        },
        timeout: 300000
    });
};


//  =========================== Agregar al inventario uno a uno ===========================   //
//Obtener listado de seriales
function GetSeriales() {
    $.ajax({
        url: Url_Backend + "GetSeriales",
        type: 'GET',
        contentType: 'application/json',
        headers: {
            'Authorization': token_type + ' ' + access_token
        },
        async: false,
        success: function (response) {
            Seriales = response
        },
        error: function (error) {
            swal("Upps!", "Error al obtener listado de seriales: " + error, "error");
        },
        timeout: 300000
    });
}

//Alistar modal para agregar inventario uno a uno manual
function BotonAgregarInventarios(){
    GetProveedores("ProveedorAgregar");
    GetTipoActivo("NombreActivoAgregar");
    GetMarcas("MarcaAgregar");
    GetDiscos("DiscoAgregar");
    GetRAM("RamAgregar");
    GetProcesadores("ProcesadorAgregar");
    SelectUbicaciones("CiudadElegirAgregar", "SedeAgregar", "PisoAgregar", "PuestoAgregar");
    $("#imagenAgregar").prop("hidden", true);
    $("#ModalAgregarInventario").modal("show");
}


//Vaciar modal al cerrarlo
$('#ModalAgregarInventario').on('hidden.bs.modal', function () {
    $('#FormAgregarInventario').trigger('reset')
        .find('#fotoImgAgregar').attr("src", "").end()
        .find(".valid-feedback, .invalid-feedback").hide().end()
        .find(".form-control").removeClass("is-valid").removeClass("is-invalid");
});

//Valida si necesita procesador ram y disco
$("#NombreActivoAgregar").change(function () {
    $("#ProcesadorAgregar, #RamAgregar, #DiscoAgregar").val("");
    var valorSeleccionado = $(this).val();
    const activosFiltrados = ActivosAll.filter(function (activo) {
        return activo.Id_Tipo_Activo === valorSeleccionado && activo.ProcesadorRamDisco == "True";
    });
    if (activosFiltrados.length > 0) {
        $("#DivProcesador, #DivRam, #DivDisco").removeAttr("hidden");
        $("#ProcesadorAgregar, #RamAgregar, #DiscoAgregar").attr("required", true);
        ProcesadorRAMDisco = true;
    } else {
        $("#DivProcesador, #DivRam, #DivDisco").attr("hidden", true);
        $("#ProcesadorAgregar, #RamAgregar, #DiscoAgregar").removeAttr("required");
        ProcesadorRAMDisco = false;
    }
});

//Agregar Dispositivo al inventario uno a uno
function AgregarAlInventario() {
    
    var arrayIds = [];
    $("#FormAgregarInventario :input[required]:not(:file,:submit)").each(function () {
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
    // if (!imagen) {
    //     toastr.error('Por favor insertar una imagen.');
    //     return;
    // };
    $(".preloader").show();
    var Param = {
        Serial: $("#SerialAgregar").val().toUpperCase(),
        Placa: $("#PlacaAgregar").val().toUpperCase(),
        Id_Proveedor: $("#ProveedorAgregar").val(),
        Descripcion: $("#DescripcionAgregar").val(),
        Id_Tipo_Activo: $("#NombreActivoAgregar").val(),
        Id_Marca: $("#MarcaAgregar").val(),
        Id_Ciudad: $("#CiudadElegirAgregar").val(),
        Id_Sede: $("#SedeAgregar").val(),
        Id_Piso: $("#PisoAgregar").val(),
        Id_Puesto: $("#PuestoAgregar").val(),
        Foto: $("#fotoImgAgregar").attr("src"),
        Id_Procesador: ProcesadorRAMDisco ? $("#ProcesadorAgregar").val() : null,
        Id_RAM: ProcesadorRAMDisco ? $("#RamAgregar").val() : null,
        Id_Disco: ProcesadorRAMDisco ? $("#DiscoAgregar").val() : null,
        UserGeneral: User.Identificacion_Usuario
    };
    $.ajax({
        url: Url_Backend + "CreateInventario",
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
            swal("Bien! Se ha Agregado el dispositivo al inventario correctamente!", { icon: "success" });
            $("#ModalAgregarInventario").modal("hide");
            Inicializadores();
            $(".preloader").hide();
        },
        error: function (err) {
            $(".preloader").hide();
            swal("Upps!", "Error al Agregar inventario: " + err, "error");
        },
        timeout: 300000,
    });
    $(".preloader").hide();
};

//Alistar Select para escoger la ubicacion del dispositivo uno a uno
function SelectUbicaciones(IdSelect, IdSede, IdPiso, IdPuesto) {
    $.ajax({
        url: Url_Backend + "GetCiudades",
        type: 'GET',
        contentType: 'application/json',
        headers: {
            'Authorization': token_type + ' ' + access_token
        },
        async: false,
        success: function (response) {
            Ciudades = response;
            $(`#${IdSelect}`).empty();
            $(`#${IdSelect}`).append(`<option value="" disabled selected>Elegir...</option>`);
            response.forEach(element => {
                $(`#${IdSelect}`).append(`<option value="${element.Id_Ciudad}">${element.Ciudad}</option>`);
            });

            $(`#${IdSede}`).empty();
            $(`#${IdSede}`).append(`<option value="" disabled selected>Elige Ciudad</option>`);
            $(`#${IdPiso}`).empty();
            $(`#${IdPiso}`).append(`<option value="" disabled selected>Elige Sede</option>`);
            $(`#${IdPuesto}`).empty();
            $(`#${IdPuesto}`).append(`<option value="" disabled selected>Elige Piso</option>`);

            $(`#${IdSelect}`).change(function () {
                let IdCiudad = $(`#${IdSelect}>option:selected`).val();
                $(`#${IdPiso}`).empty();
                $(`#${IdPiso}`).append(`<option value="" disabled selected>Elige Sede</option>`);
                $(`#${IdPuesto}`).empty();
                $(`#${IdPuesto}`).append(`<option value="" disabled selected>Elige Piso</option>`);

                $.ajax({
                    url: Url_Backend + "GetFiltroSedes?Id_Ciudad=" + IdCiudad,
                    type: 'GET',
                    contentType: 'application/json',
                    headers: {
                        'Authorization': token_type + ' ' + access_token
                    },
                    async: false,
                    success: function (response) {
                        $(`#${IdSede}`).empty();
                        $(`#${IdSede}`).append(`<option value="" disabled selected>Elegir...</option>`);
                        response.forEach(element => {
                            $(`#${IdSede}`).append(`<option value="${element.Id_Sede}">${element.Id_Sede}</option>`);
                        });

                        $(`#${IdSede}`).change(function () {
                            let IdSedes = $(`#${IdSede}>option:selected`).val();
                            $(`#${IdPuesto}`).empty();
                            $(`#${IdPuesto}`).append(`<option value="" disabled selected>Elige Piso</option>`);
                            $.ajax({
                                url: Url_Backend + "GetFiltroPisos?Id_Sede=" + IdSedes,
                                type: 'GET',
                                contentType: 'application/json',
                                headers: {
                                    'Authorization': token_type + ' ' + access_token
                                },
                                async: false,
                                success: function (response) {
                                    $(`#${IdPiso}`).empty();
                                    $(`#${IdPiso}`).append(`<option value="" disabled selected>Elegir...</option>`);
                                    response.forEach(element => {
                                        $(`#${IdPiso}`).append(`<option value="${element.Id_Piso}">${element.Id_Piso}</option>`);
                                    });

                                    $(`#${IdPiso}`).change(function () {
                                        let IdSedes = $(`#${IdSede}>option:selected`).val();
                                        let IdPisos = $(`#${IdPiso}>option:selected`).val();
                                        $.ajax({
                                            url: Url_Backend + "GetFiltroPuestos?Id_Sede=" + IdSedes + "&Id_Piso=" + IdPisos,
                                            type: 'GET',
                                            contentType: 'application/json',
                                            headers: {
                                                'Authorization': token_type + ' ' + access_token
                                            },
                                            async: false,
                                            success: function (response) {
                                                $(`#${IdPuesto}`).empty();
                                                $(`#${IdPuesto}`).append(`<option value="" disabled selected>Elegir...</option>`);
                                                response.forEach(element => {
                                                    $(`#${IdPuesto}`).append(`<option value="${element.Id_Puesto}">${element.Id_Puesto}</option>`);
                                                });

                                            },
                                            error: function (error) {
                                                swal("Upps!", "Error al obtener filtro Pisos: " + error, "error");
                                            },
                                            timeout: 300000
                                        });
                                    });

                                },
                                error: function (error) {
                                    swal("Upps!", "Error al obtener filtro Pisos: " + error, "error");
                                },
                                timeout: 300000
                            });
                        });

                    },
                    error: function (error) {
                        swal("Upps!", "Error al obtener filtro Sedes: " + error, "error");
                    },
                    timeout: 300000
                });
            });


        },
        error: function (error) {
            swal("Upps!", "Error al obtener Ciudades: " + error, "error");
        },
        timeout: 300000
    });
}

//  =========================== Editar al inventario uno a uno ===========================   //
//Editar Dispositivo al inventario uno a uno
function UpdateInventario() {
    var arrayIds = [];
    $("#ModalFormInventario :input[required]:not(:file,:submit)").each(function () {
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
    // if (!imagen) {
    //     toastr.error('Por favor insertar una imagen.');
    //     return;
    // };
    var Param = {
        Id_Inventario: IdInventarioSeleccionado,
        Serial: $("#SerialEditar").val().toUpperCase(),
        Placa: $("#PlacaEditar").val().toUpperCase(),
        Descripcion: $("#DescripcionEditar").val().toUpperCase(),
        Id_Proveedor: $("#ProveedorEditar").val(),
        Id_Tipo_Activo: $("#NombreActivoEditar").val(),
        Id_Marca: $("#MarcaEditar").val(),
        Id_Ciudad: $("#CiudadElegirEditar").val(),
        Id_Sede: $("#SedeEditar").val(),
        Id_Piso: $("#PisoEditar").val(),
        Id_Puesto: $("#PuestoEditar").val(),
        Foto: $("#fotoImg").attr("src"),
        Id_Procesador: ProcesadorRAMDisco ? $("#ProcesadorActu").val() : null,
        Id_RAM: ProcesadorRAMDisco ? $("#RamActu").val() : null,
        Id_Disco: ProcesadorRAMDisco ? $("#DiscoActu").val() : null,
        UserGeneral: User.Identificacion_Usuario,
    };
    $.ajax({
        url: Url_Backend + "UpdateInventario",
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
            swal("Bien! Se ha Editado el dispositivo correctamente!", { icon: "success" });
            $("#ModalEditarInventario").modal("hide");
            Inicializadores();
        },
        error: function (err) {
            swal("Upps!", "Error al Editar inventario: " + err, "error");
        },
        timeout: 300000,
    });
};

//Traer la ubicacion del dispositivo para editar
function TraerUbicacion(IdSelect, IdSede, IdPiso, IdPuesto, received) {
    $.ajax({
        url: Url_Backend + "GetCiudades",
        type: 'GET',
        contentType: 'application/json',
        headers: {
            'Authorization': token_type + ' ' + access_token
        },
        async: false,
        success: function (response) {
            $(`#${IdSelect}`).empty();
            $(`#${IdSelect}`).append(`<option value="" disabled selected>Elegir...</option>`);
            response.forEach(element => {
                $(`#${IdSelect}`).append(`<option value="${element.Id_Ciudad}">${element.Ciudad}</option>`);
            });
            $(`#${IdSelect} option[value=` + received.Id_Ciudad + `]`).attr("selected", true);
        },
        error: function (error) {
            swal("Upps!", "Error al obtener Ciudades: " + error, "error");
        },
        timeout: 300000
    });
    $.ajax({
        url: Url_Backend + "GetFiltroSedes?Id_Ciudad=" + received.Id_Ciudad,
        type: 'GET',
        contentType: 'application/json',
        headers: {
            'Authorization': token_type + ' ' + access_token
        },
        async: false,
        success: function (responseSede) {
            responseSede.forEach(element => {
                $(`#${IdSede}`).append(`<option value="${element.Id_Sede}">${element.Id_Sede}</option>`);
            });
            $(`#${IdSede} option[value=` + received.Id_Sede + `]`).attr("selected", true);
        },
        error: function (error) {
            swal("Upps!", "Error al obtener filtro Sedes: " + error, "error");
        },
        timeout: 300000
    });
    //Obtener Pisos y setear select
    $.ajax({
        url: Url_Backend + "GetFiltroPisos?Id_Sede=" + received.Id_Sede,
        type: 'GET',
        contentType: 'application/json',
        headers: {
            'Authorization': token_type + ' ' + access_token
        },
        async: false,
        success: function (response) {
            response.forEach(element => {
                $(`#${IdPiso}`).append(`<option value="${element.Id_Piso}">${element.Id_Piso}</option>`);
            });
            $(`#${IdPiso} option[value=` + received.Id_Piso + `]`).attr("selected", true);
        },
        error: function (error) {
            swal("Upps!", "Error al obtener filtro Pisos: " + error, "error");
        },
        timeout: 300000
    });
    //Obtener puestos y setear select
    $.ajax({
        url: Url_Backend + "GetFiltroPuestos?Id_Sede=" + received.Id_Sede + "&Id_Piso=" + received.Id_Piso,
        type: 'GET',
        contentType: 'application/json',
        headers: {
            'Authorization': token_type + ' ' + access_token
        },
        async: false,
        success: function (response) {
            response.forEach(element => {
                $(`#${IdPuesto}`).append(`<option value="${element.Id_Puesto}">${element.Id_Puesto}</option>`);
            });
            $(`#${IdPuesto} option[value=` + received.Id_Puesto + `]`).attr("selected", true);
        },
        error: function (error) {
            swal("Upps!", "Error al obtener filtro Puestos: " + error, "error");
        },
        timeout: 300000
    });
    $(`#${IdSelect}`).change(function () {
        let IdCiudad = $(`#${IdSelect}>option:selected`).val();
        $(`#${IdSede}`).empty();
        $(`#${IdSede}`).append(`<option value="" disabled selected>Elige Ciudad</option>`);
        $(`#${IdPiso}`).empty();
        $(`#${IdPiso}`).append(`<option value="" disabled selected>Elige Sede</option>`);
        $(`#${IdPuesto}`).empty();
        $(`#${IdPuesto}`).append(`<option value="" disabled selected>Elige Piso</option>`);
        $.ajax({
            url: Url_Backend + "GetFiltroSedes?Id_Ciudad=" + IdCiudad,
            type: 'GET',
            contentType: 'application/json',
            headers: {
                'Authorization': token_type + ' ' + access_token
            },
            async: false,
            success: function (response) {
                $(`#${IdSede}`).empty();
                $(`#${IdSede}`).append(`<option value="" disabled selected>Elegir...</option>`);
                response.forEach(element => {
                    $(`#${IdSede}`).append(`<option value="${element.Id_Sede}">${element.Id_Sede}</option>`);
                });
            },
            error: function (error) {
                swal("Upps!", "Error al obtener filtro Sedes: " + error, "error");
            },
            timeout: 300000
        });
    });
    $(`#${IdSede}`).change(function () {
        let IdSedes = $(`#${IdSede}>option:selected`).val();
        $(`#${IdPiso}`).empty();
        $(`#${IdPiso}`).append(`<option value="" disabled selected>Elige Sede</option>`);
        $(`#${IdPuesto}`).empty();
        $(`#${IdPuesto}`).append(`<option value="" disabled selected>Elige Piso</option>`);
        $.ajax({
            url: Url_Backend + "GetFiltroPisos?Id_Sede=" + IdSedes,
            type: 'GET',
            contentType: 'application/json',
            headers: {
                'Authorization': token_type + ' ' + access_token
            },
            async: false,
            success: function (response) {
                $(`#${IdPiso}`).empty();
                $(`#${IdPiso}`).append(`<option value="" disabled selected>Elegir...</option>`);
                response.forEach(element => {
                    $(`#${IdPiso}`).append(`<option value="${element.Id_Piso}">${element.Id_Piso}</option>`);
                });
            },
            error: function (error) {
                swal("Upps!", "Error al obtener filtro Pisos: " + error, "error");
            },
            timeout: 300000
        });
    });
    $(`#${IdPiso}`).change(function () {
        $(`#${IdPuesto}`).empty();
        $(`#${IdPuesto}`).append(`<option value="" disabled selected>Elige Piso</option>`);
        let IdSedes = $(`#${IdSede}>option:selected`).val();
        let IdPisos = $(`#${IdPiso}>option:selected`).val();
        $.ajax({
            url: Url_Backend + "GetFiltroPuestos?Id_Sede=" + IdSedes + "&Id_Piso=" + IdPisos,
            type: 'GET',
            contentType: 'application/json',
            headers: {
                'Authorization': token_type + ' ' + access_token
            },
            async: false,
            success: function (response) {
                $(`#${IdPuesto}`).empty();
                $(`#${IdPuesto}`).append(`<option value="" disabled selected>Elegir...</option>`);
                response.forEach(element => {
                    $(`#${IdPuesto}`).append(`<option value="${element.Id_Puesto}">${element.Id_Puesto}</option>`);
                });
            },
            error: function (error) {
                swal("Upps!", "Error al obtener filtro Puestos: " + error, "error");
            },
            timeout: 300000
        });
    });
}

//Traer el usuario asignado para editar
function TraerUsuarioAsignado(received) {
    $.ajax({
        url: Url_Backend + "GetAsignacion?Usuario=" + received,
        type: 'GET',
        contentType: 'application/json',
        headers: {
            'Authorization': token_type + ' ' + access_token
        },
        async: false,
        success: function (response) {
            if (response.length >= 1) {
                $("#asignacionDiv").empty();
                $("#asignacionDiv").append(`
                <form id="ModalFormInventario" class="needs-validation" novalidate="">
                    <div id="formAsignacion" class="form-row">
                    </div>
                </form>
                `);
                $("#formAsignacion").empty();
                for (const key in response[0]) {
                    $("#formAsignacion").append(`
                    <div class="col-md-4 mb-3">
                        <label for="${key}">${key}</label>
                        <input type="text" class="form-control" id="${key}" value="${response[0][key]}" required disabled>
                    </div>
                    `);
                };
            } else {
                $("#asignacionDiv").empty();
                $("#asignacionDiv").append(`
                    <h4>No hay una asignación para este dispositivo</h4>
                `);
            };
        },
        error: function (error) {
            swal("Upps!", "Error al obtener la asignacion del dispositivo: " + error, "error");
        },
        timeout: 300000
    });
};

// ======================================================================================  //

//Obtener marcas y listarlos en un select
function GetMarcas(IdSelect) {
    $.ajax({
        url: Url_Backend + "GetMarcas",
        type: 'GET',
        contentType: 'application/json',
        headers: {
            'Authorization': token_type + ' ' + access_token
        },
        async: false,
        success: function (response) {
            console.log(response);
            $(`#${IdSelect}`).empty();
            $(`#${IdSelect}`).append(`<option value="" disabled selected>Elegir...</option>`);
            response.forEach(element => {
                $(`#${IdSelect}`).append(`<option value="${element.Id_Marca}">${element.Marca}</option>`);
            });

            $("#tablaMarcas").empty();
            $("#FiltroMarca").empty();
            $("#tablaMarcas").append(`<option value="" selected>Todos</option>`);
            $("#FiltroMarca").append(`<option value="" selected>Todos</option>`);
            response.forEach(element => {
                $("#tablaMarcas").append(`<option value="${element.Id_Marca}">${element.Marca}</option>`);
                $("#FiltroMarca").append(`<option value="${element.Id_Marca}">${element.Marca}</option>`);
            });
        },
        error: function (error) {
            swal("Upps!", "Error al obtener marcas: " + error, "error");
        },
        timeout: 300000
    });
}

//Obtener proveedores y listarlos en un select
function GetProveedores(IdSelect) {
    $.ajax({
        url: Url_Backend + "GetProveedores",
        type: 'GET',
        contentType: 'application/json',
        headers: {
            'Authorization': token_type + ' ' + access_token
        },
        async: false,
        success: function (response) {
            // Select's
            $(`#${IdSelect}`).empty();
            $(`#${IdSelect}`).append(`<option value="" disabled selected>Elegir...</option>`);
            response.forEach(element => {
                $(`#${IdSelect}`).append(`<option value="${element.Id_Proveedor}">${element.Proveedor}</option>`);
            });

            $("#tablaProveedores").empty();
            $("#FiltroProveedor").empty();
            $("#tablaProveedores").append(`<option value="" selected>Todos</option>`);
            $("#FiltroProveedor").append(`<option value="" selected>Todos</option>`);
            response.forEach(element => {
                $("#tablaProveedores").append(`<option value="${element.Id_Proveedor}">${element.Proveedor}</option>`);
                $("#FiltroProveedor").append(`<option value="${element.Id_Proveedor}">${element.Proveedor}</option>`);
            });
        },
        error: function (error) {
            swal("Upps!", "Error al obtener Proveedores: " + error, "error");
        },
        timeout: 300000
    });
}

//Obtener tipos de activo y listarlos en un select
function GetTipoActivo(IdSelect) {
    $.ajax({
        url: Url_Backend + "GetTipoActivo",
        type: 'GET',
        contentType: 'application/json',
        headers: {
            'Authorization': token_type + ' ' + access_token
        },
        async: false,
        success: function (response) {
            ActivosAll = response
            $(`#${IdSelect}`).empty();
            $(`#${IdSelect}`).append(`<option value="" disabled selected>Elegir...</option>`);
            response.forEach(element => {
                $(`#${IdSelect}`).append(`<option value="${element.Id_Tipo_Activo}">${element.Nombre_Activo}</option>`);
            });

            $("#tablaActivos").empty();
            $("#FiltroNombreActivo").empty();
            $("#tablaActivos").append(`<option value="" selected>Todos</option>`);
            $("#FiltroNombreActivo").append(`<option value="" selected>Todos</option>`);
            response.forEach(element => {
                $("#tablaActivos").append(`<option value="${element.Nombre_Activo}">${element.Nombre_Activo}</option>`);
                $("#FiltroNombreActivo").append(`<option value="${element.Id_Tipo_Activo}">${element.Nombre_Activo}</option>`);
            });
        },
        error: function (error) {
            swal("Upps!", "Error al obtener Tipos de activos: " + error, "error");
        },
        timeout: 300000
    });
}


//Obtener Procesadores y listarlos en un select
function GetProcesadores(IdSelect) {
    $.ajax({
        url: Url_Backend + "GetProcesadores",
        type: 'GET',
        contentType: 'application/json',
        headers: {
            'Authorization': token_type + ' ' + access_token
        },
        async: false,
        success: function (response) {

            const responseFiltrado = response.filter(function (estado) {
                return estado.Id_Estado == "True";
            });
            $(`#${IdSelect}`).empty();
            $(`#${IdSelect}`).append(`<option value="" disabled selected>Elegir...</option>`);
            responseFiltrado.forEach(element => {
                $(`#${IdSelect}`).append(`<option value="${element.Id}">${element.Procesador}</option>`);
            });

            $("#tablaProcesadores").empty();
            //$("#FiltroProcesadores").empty();
            $("#tablaProcesadores").append(`<option value="" selected>Todos</option>`);
            //$("#FiltroProcesadores").append(`<option value="" selected>Todos</option>`);
            response.forEach(element => {
                $("#tablaProcesadores").append(`<option value="${element.Procesador}">${element.Procesador}</option>`);
                //$("#FiltroProcesadores").append(`<option value="${element.Id_Proveedor}">${element.Proveedor}</option>`);
            });
        },
        error: function (error) {
            swal("Upps!", "Error al obtener Proveedores: " + error, "error");
        },
        timeout: 300000
    });
}

//Obtener RAM y listarlos en un select
function GetRAM(IdSelect) {
    $.ajax({
        url: Url_Backend + "GetRAM",
        type: 'GET',
        contentType: 'application/json',
        headers: {
            'Authorization': token_type + ' ' + access_token
        },
        async: false,
        success: function (response) {
            // Select's
            $(`#${IdSelect}`).empty();
            $(`#${IdSelect}`).append(`<option value="" disabled selected>Elegir...</option>`);
            response.forEach(element => {
                $(`#${IdSelect}`).append(`<option value="${element.Id}">${element.RAM}</option>`);
            });

            $("#tablaRAM").empty();
            // $("#FiltroProveedor").empty();
            $("#tablaRAM").append(`<option value="" selected>Todos</option>`);
            // $("#FiltroProveedor").append(`<option value="" selected>Todos</option>`);
            response.forEach(element => {
                $("#tablaRAM").append(`<option value="${element.RAM}">${element.RAM}</option>`);
                //$("#FiltroProveedor").append(`<option value="${element.Id_Proveedor}">${element.Proveedor}</option>`);
            });
        },
        error: function (error) {
            swal("Upps!", "Error al obtener Proveedores: " + error, "error");
        },
        timeout: 300000
    });
}

//Obtener Discos y listarlos en un select
function GetDiscos(IdSelect) {
    $.ajax({
        url: Url_Backend + "GetDisco",
        type: 'GET',
        contentType: 'application/json',
        headers: {
            'Authorization': token_type + ' ' + access_token
        },
        async: false,
        success: function (response) {
            // Select's
            $(`#${IdSelect}`).empty();
            $(`#${IdSelect}`).append(`<option value="" disabled selected>Elegir...</option>`);
            response.forEach(element => {
                $(`#${IdSelect}`).append(`<option value="${element.Id}">${element.Disco}</option>`);
            });

            $("#tablaDiscos").empty();
            //$("#FiltroProveedor").empty();
            $("#tablaDiscos").append(`<option value="" selected>Todos</option>`);
            //$("#FiltroProveedor").append(`<option value="" selected>Todos</option>`);
            response.forEach(element => {
                $("#tablaDiscos").append(`<option value="${element.Disco}">${element.Disco}</option>`);
                //$("#FiltroProveedor").append(`<option value="${element.Id_Proveedor}">${element.Proveedor}</option>`);
            });
        },
        error: function (error) {
            swal("Upps!", "Error al obtener Proveedores: " + error, "error");
        },
        timeout: 300000
    });
}

//Obtener ciudades
function GetCiudades() {
    $.ajax({
        url: Url_Backend + 'GetCiudad',
        type: 'GET',
        contentType: 'application/json',
        headers: {
            'Authorization': token_type + ' ' + access_token
        },
        async: false,
        success: function (response) {
            $("#tablaCiudad").empty();
            //$("#FiltroProveedor").empty();
            $("#tablaCiudad").append(`<option value="" selected>Todos</option>`);
            //$("#FiltroProveedor").append(`<option value="" selected>Todos</option>`);
            response.forEach(element => {
                $("#tablaCiudad").append(`<option value="${element.Ciudad}">${element.Ciudad}</option>`);
                //$("#FiltroProveedor").append(`<option value="${element.Id_Proveedor}">${element.Proveedor}</option>`);
            });
        },
        error: function (err) { },
        timeout: 300000
    });
}


//Obtener foto de dispositivo seleccionado
function GetFoto(received) {
    $.ajax({
        url: Url_Backend + "GetFoto?Id_Inventario=" + received,
        type: 'GET',
        contentType: 'application/json',
        headers: {
            'Authorization': token_type + ' ' + access_token
        },
        async: false,
        success: function (response) {
            if (response[0].Foto == null || response[0].Foto == "" || response[0].Foto == undefined) {
                $("#imagen1").prop("hidden", true);
                $("#ocultarImg").removeAttr("hidden");
            } else {
                $("#ocultarImg").prop("hidden", true);
                $("#imagen1").removeAttr("hidden");
                $("#fotoImg").attr("src", response[0].Foto);
                $("#fotoHref").attr("href", response[0].Foto);
            };

        },
        error: function (error) {
            swal("Upps!", "Error al obtener Foto: " + error, "error");
        },
        timeout: 300000
    });
}

//Crear Imagen al cargarla
$("#inputFoto, #inputFotoAgregar").change(function (event) {
    var idDelCambiado = $(this).prop('id');
    var fileInput = document.getElementById(idDelCambiado)
    var reader = new FileReader();
    reader.readAsDataURL(fileInput.files[0]);
    reader.onload = function () {
        $("#fotoImg, #fotoImgAgregar").attr("src", reader.result);
        $("#fotoHref, #fotoHrefAgregar").attr("href", reader.result);
    };
    $("#ocultarImg, #ocultarImgAgregar").prop("hidden", true);
    $("#imagen1, #imagenAgregar").removeAttr("hidden");
});

//Verifica que no exista el serial
$("#Serial, #SerialAgregar").on("keyup", function () {
    let serialNuevo = $(this).val().toUpperCase();
    Seriales.forEach(element => {
        if (element.Serial == serialNuevo) {
            swal("Upps!", "Este serial ya existe en la base de datos:" + serialNuevo, "error");
            $("#Serial, #SerialAgregar").val("");
        }
    });
});



// ================================  ===============================  //

//SoporteActivaInventario
function SoporteActivaInventario(tipo, desactivo, soporte) {
    $('.preloader').show();
    // (Tipo): 1. Activar-desactivar // : 2. Soporte
    let continuar = false;
    if (desactivo != undefined && desactivo != null && desactivo != "") {
        continuar = true;
    } else if (soporte != undefined && soporte != null && soporte != "") {
        continuar = true;
    }
    var Param = {
        Tipo: tipo,
        Id_Inventario: IdInventarioSeleccionado,
        Id_Estado_Inventario: desactivo,
        Soporte: soporte,
        Serial: InventarioSeleccionado.Serial,
        UserGeneral: User.Identificacion_Usuario
    };
    if (continuar) {
        $.ajax({
            url: Url_Backend + "SoporteActivaInventario",
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
                if (desactivo == "1" || desactivo == "0") {
                    desactivo == "1" ? swal("Bien! se ha activado correctamente!", { icon: "success" }) : swal("Bien! se ha inactivado correctamente!", { icon: "success" });
                    Inicializadores();
                } else if (soporte == "1" || soporte == "0") {
                    soporte == "1" ? swal("Bien! se ha enviado a soporte correctamente!", { icon: "success" }) : swal("Bien! se ha devuelto de soporte correctamente!", { icon: "success" });
                    Inicializadores();
                }
                $('.preloader').fadeOut(500);
            },
            error: function (err) {
                swal("Upps!", "ha ocurrido un error: " + err, "error");
            },
            timeout: 300000,
            
        });
    }
};

//Funcion para crear Excel
function tableToExcel() {
    //$(".spinner-border").show();
    //nombre del archivo
    var hoy = new Date();
    var fecha = hoy.getDate() + '-' + (hoy.getMonth() + 1) + '-' + hoy.getFullYear();
    var hora = hoy.getHours() + ':' + hoy.getMinutes() + ':' + hoy.getSeconds();
    var name = 'Inventario_[' + fecha + '_' + hora + ']';
    //nombre hoja
    var namehoja = 'Inventario';
    //se crea nuevo libro
    var wb = XLSX.utils.book_new();
    //el título, el tema, el autor y la fecha
    wb.Props = {
        Title: "Titulo",
        Subject: "Tema",
        Author: "Author",
        CreatedDate: new Date(2021, 11, 9)
    };
    //se crea una hoja de trabajo
    wb.SheetNames.push(namehoja);

    //matriz de datos
    //var ws_data = JSON.stringify(Datos)
    var ws_data = [['Id', 'Serial', 'Placa', 'Usuario', 'Proveedor', 'Nombre Activo', 'Marca', 'Soporte', 'Estado', 'Id Acta']];
    for (i = 0; i < DatosInventario.length; i++) {
        ws_data.push([DatosInventario[i].Id_Inventario, DatosInventario[i].Serial, DatosInventario[i].Placa, DatosInventario[i].Identificacion_Usuario, DatosInventario[i].Proveedor,
        DatosInventario[i].Nombre_Activo, DatosInventario[i].Marca, DatosInventario[i].Soporte, DatosInventario[i].Id_Estado_Inventario, DatosInventario[i].Id_Acta_Inventario])
    }

    //se asigna los datos a la hoja
    var ws = XLSX.utils.aoa_to_sheet(ws_data);
    wb.Sheets[namehoja] = ws;
    var wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });
    function s2ab(s) {
        var buf = new ArrayBuffer(s.length); //convert s to arrayBuffer
        var view = new Uint8Array(buf);  //create uint8array as viewer
        for (var i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xFF; //convert to octet
        return buf;
    }
    saveAs(new Blob([s2ab(wbout)], { type: "application/octet-stream" }), name + '.xlsx');
    //$(".spinner-border").fadeOut();
}
