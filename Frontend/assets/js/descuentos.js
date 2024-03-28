var Url_Backend = "http://localhost:57737/";
//var Url_Backend = window.location.origin + '/inventario/Backend/';
var access_token;
var token_type;
var User;
var EstadoDescuento;
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
    GetDescuentos();
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

//Tabla de Tokens
function GetDescuentos() {
    ObtenerToken(User.Identificacion_Usuario, User.Password)
    $.ajax({
        url: Url_Backend + "GetDescuentos",
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
                    data-toggle="modal" data-target=".bd-example-modal-lg">Agregar</button>
                `);
            }
            Tablecolumns = [
                {
                    "title": "Id",
                    "data": "Id"
                },
                {
                    "title": "Descripción",
                    "data": "Descripcion_Descuento"
                }
                ,
                {
                    "title": "Valor",
                    "data": "Valor_Descuento"
                },
                {
                    "title": "Estado",
                    "data": "Id_Estado"
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
                    `
                }];

            if ($.fn.dataTable.isDataTable('#TablaDescuentos')) {
                TablaDescuentos.destroy();
            }
            TablaDescuentos = $("#TablaDescuentos").DataTable({
                pageLength: 10,
                lengthMenu: [
                    [10, 20, 30, -1],
                    [10, 20, 30, "Todos"]
                ],
                data: response,
                columns: Tablecolumns,
                select: true,
                fnRowCallback: function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
                    if (aData.Id_Estado == "Activo") {
                        var svg = $(nRow).find('.eliminar span');
                        var nuevoSVG = '\
                            <span style="color:#597e8d" class="material-symbols-outlined">cancel</span>';
                        svg.html(nuevoSVG);
                        $('.eliminar', nRow).attr('title', 'Inactivar');
                    };
                },
            });

            //Obtener datos al darle click en editar
            $("#TablaDescuentos tbody").on("click", "a.editar", function () {
                var dataEditar = TablaDescuentos.row($(this).parents("tr")).data();
                EditDescuento(dataEditar);
            });

            //Obtener datos al darle click en eliminar
            $("#TablaDescuentos tbody").on("click", "a.eliminar", function () {
                var dataEliminar = TablaDescuentos.row($(this).parents("tr")).data();
                desactivarDescuento(dataEliminar);

            });

            //Funcion desactivar
            function desactivarDescuento(data) {
                // Validar que las plantillas no usen este token OJO
                var mensaje = data.Id_Estado === "Activo" ? "¿Está seguro de Desactivar el Descuento?" : "¿Está seguro de Activar el Descuento?"
                var mensajeSuccess = data.Id_Estado === "Activo" ? "Se ha desactivado con exito" : "Se ha activado con exito"
                var Param = {
                    Id: data.Id,
                    Descripcion_Descuento: data.Descripcion_Descuento,
                    Valor_Descuento: data.Valor_Descuento,
                    Id_Estado : data.Id_Estado == "Activo" ? 0 : 1
                };
                swal({
                    title: mensaje,
                    icon: "warning",
                    buttons: true,
                    dangerMode: true,
                })
                    .then((willDelete) => {
                        if (willDelete) {
                            $.ajax({
                                url: Url_Backend + "ActualizarDescuento",
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
                                    swal('Listo!', mensajeSuccess, 'success')
                                    Inicializador();
                                },
                                error: function (err) {
                                    swal("Ey!", "Error al actualizar el Descuento: " + err, "error");
                                },
                                timeout: 300000,
                            });
                        } else {
                            return false;
                        }
                    });
            }

            //Funcion editar
            function EditDescuento(data) {
                EstadoDescuento = data.Id_Estado
                $("#IdActu").val(data.Id)
                $("#DescripcionActu").val(data.Descripcion_Descuento)
                $("#ValorActu").val(data.Valor_Descuento)
                $("#GSCCModal2").modal("show");
            };
        },
        error: function (error) {
            swal("Upps!", "Error al obtener los datos de las plantillas: " + error, "error");
        },
        timeout: 300000
    });

};

//Agregar Descuento
function GuardarDescuento() {
    ObtenerToken(User.Identificacion_Usuario, User.Password);
    var DescripcionAgre = $("#DescripcionAgre").val();
    var ValorAgre = $("#ValorAgre").val();
    var arrayIds = [];

    $("#FormAgregarDescuento :input[required]:not(:file,:submit)").each(function () {
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
    $(".preloader").show();
    var Param = {
        Descripcion_Descuento: DescripcionAgre,
        Valor_Descuento: ValorAgre
    };
    $.ajax({
        url: Url_Backend + "GuardarDescuento",
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
            $(".preloader").hide();
            swal("Bien!", "El Descuento fue agregado correctamente", "success");
            $("#GSCCModal").modal("hide");
            GetDescuentos();
        },
        error: function (err) {
            $(".preloader").hide();
            swal("Ey!", "Error al agregar el Descuento: " + err, "error");
        },
        timeout: 300000,
    });
};

//Actualizar token
function ActualizarDescuento() {
    ObtenerToken(User.Identificacion_Usuario, User.Password);
    var IdActu = $("#IdActu").val();
    var DescripcionActu = $("#DescripcionActu").val();
    var ValorActu = $("#ValorActu").val();
    var arrayIds = [];

    $("#FormActualizarDescuento :input[required]:not(:file,:submit)").each(function () {
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
    $(".preloader").show();
    var Param = {
        Id: IdActu,
        Descripcion_Descuento: DescripcionActu,
        Valor_Descuento: ValorActu,
        Id_Estado : EstadoDescuento == "Activo" ? 1 : 0
    };
    $.ajax({
        url: Url_Backend + "ActualizarDescuento",
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
            $(".preloader").hide();
            swal("Bien!", "El Descuento fue actualizado correctamente", "success");
            $("#GSCCModal2").modal("hide");
            Inicializador();
        },
        error: function (err) {
            $(".preloader").hide();
            swal("Ey!", "Error al actualizar el Descuento: " + err, "error");
        },
        timeout: 300000,
    });
};
