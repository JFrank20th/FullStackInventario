var Url_Backend = "http://localhost:57737/";
//var Url_Backend = window.location.origin + '/inventario/Backend/';
var access_token;
var token_type;
var User;
var datos;
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

    TraerCentroCostos();
    GetProveedores();
    GetEstadoActivo();
    TraerCentroCostos();

} ;

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

// function EjecutarConsultas() {
//     TraerDatos();
//   }


  $("#TipoReporte").change(function () {

    //si es value es vacio
    if($("#TipoReporte").val() == ""){
        $("#divTablareport").prop("hidden", true);
        $("#divTablareportes").prop("hidden", true);
        $("#divTablaReportProve").prop("hidden", true);
        $("#divProveedor").prop("hidden", true);
    };

    //si es el reporte completo
    if($("#TipoReporte").val() == "Reporte_completo"){

        $.ajax({
            url: Url_Backend + "GetReporteCompleto",
            type: 'GET',
            contentType: 'application/json',
            headers: {
                'Authorization': token_type + ' ' + access_token
            },
            async: false,
            success: function (response) {
                datos = response;

                if ($.fn.dataTable.isDataTable('#TablaReport')) {
                    TablaReportes.destroy();
                }
                if ($.fn.dataTable.isDataTable('#TablaReportProve')) {
                    TablaReportProve.destroy();
                }
                if ($.fn.dataTable.isDataTable('#TablaReportEstado')) {
                    TablaReportProve.destroy();
                }
                if ($.fn.dataTable.isDataTable('#TablaReportCosto')) {
                    TablaReportProve.destroy();
                }
                if ($.fn.dataTable.isDataTable('#TablaReportDispo')) {
                    TablaReportDispo.destroy();
                }
                $("#divTablareport").prop("hidden", true);
                $("#divTablaReportProve").prop("hidden", true);                
                $("#divTablaReportDispo").prop("hidden", true);
                $("#divTablaReportCosto").prop("hidden", true);    
                $("#divTablaReportEstado").prop("hidden", true);             
                $("#divTablareportes").removeAttr("hidden");
                $("#divEstadoActivo").css("display","none");
                $("#divProveedor").css("display","none");
                $("#divCentro").css("display","none");
                $("#BotonGenerarReportes").empty();

                if (response.length > 0) {
                    $("#BotonGenerarReportes").append("<button class='btn btn-primary' type='submit' id='export_button'\
                    onclick='tableToExcel()'>Descargar Reporte</button><br>");
                };
    
                Tablecolumns = [
                // {
                //     "title": "Id",
                //     "data": "Id_Inventario"
                // },
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
                    "title": "Nombre Activo",
                    "data": "Nombre_Activo"
                },
                {
                    "title": "Estado Activo",
                    "data": "Estado_Activo"
                },
                {
                    "title": "Marca",
                    "data": "Marca"
                },
                {
                    "title": "Soporte",
                    "data": "Soporte"
                },
                // {
                //     "title": "Estado",
                //     "data": "Nombre_Estado"
                // },
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
                    "title": "Puesto ",
                    "data": "Id_Puesto"
                },
                // {
                //     "title": "Id Acta",
                //     "data": "Id_Acta_Inventario"
                // },
               
                {
                    "title": "Centro de Costo",
                    "data": "Centro_Costo"
                },
                {
                    "title": "Estado",
                    "data": "Nombre_Estado"
                }];
    
                if ($.fn.dataTable.isDataTable('#TablaReportes')) {
                    TablaReportes.destroy();
                }
                TablaReportes = $("#TablaReportes").DataTable({
                    pageLength: 10,
                    lengthMenu: [
                        [10, 20, 30, -1],
                        [10, 20, 30, "Todos"]
                    ],
                    data: response,
                    columns: Tablecolumns,
                    select: true
                });
    
            },
            error: function (error) {
                swal("Upps!", "Error al obtener los datos del inventario: " + error, "error");
            },
            timeout: 300000
        });
    };
    
    //si es el reporte por asignacion
    if($("#TipoReporte").val() == "Reporte_asignacion"){
        
        $.ajax({
            url: Url_Backend + "GetReporteAsignacion",
            type: 'GET',
            contentType: 'application/json',
            headers: {
                'Authorization': token_type + ' ' + access_token
            },
            async: false,
            success: function (response) {
                datos = response;
            
                if ($.fn.dataTable.isDataTable('#TablaReportes')) {
                    TablaReportes.destroy();
                }
                if ($.fn.dataTable.isDataTable('#TablaReportProve')) {
                    TablaReportProve.destroy();
                }
                if ($.fn.dataTable.isDataTable('#TablaReportEstado')) {
                    TablaReportProve.destroy();
                }
                if ($.fn.dataTable.isDataTable('#TablaReportCosto')) {
                    TablaReportProve.destroy();
                }
                if ($.fn.dataTable.isDataTable('#TablaReportDispo')) {
                    TablaReportDispo.destroy();
                }

                $("#BotonGenerarReport").empty();
                $("#divTablareportes").prop("hidden", true);
                $("#divTablaReportProve").prop("hidden", true);
                $("#divTablaReportDispo").prop("hidden", true);
                $("#divTablaReportCosto").prop("hidden", true);
                $("#divTablaReportEstado").prop("hidden", true);
                $("#divTablareport").removeAttr("hidden");
                $("#divEstadoActivo").css("display","none");
                $("#divProveedor").css("display","none");
                $("#divCentro").css("display","none");
                $("#BotonGenerarReportes").empty();

                if (response.length > 0) {
                    $("#BotonGenerarReport").append("<button class='btn btn-primary' type='submit' id='export_button'\
                    onclick='tableToExcel()'>Descargar Reporte</button><br>");
                };
    
                Tablecolumns = [
                    // {
                    //     "title": "Id",
                    //     "data": "Id_Inventario"
                    // },
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
                        "title": "Nombre Activo",
                        "data": "Nombre_Activo"
                    },
                    {
                        "title": "Estado Activo",
                        "data": "Estado_Activo"
                    },
                    {
                        "title": "Marca",
                        "data": "Marca"
                    },
                    {
                        "title": "Soporte",
                        "data": "Soporte"
                    },
                    // {
                    //     "title": "Estado",
                    //     "data": "Nombre_Estado"
                    // },
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
                        "title": "Puesto ",
                        "data": "Id_Puesto"
                    },
                    // {
                    //     "title": "Id Acta",
                    //     "data": "Id_Acta_Inventario"
                    // },
                   
                    {
                        "title": "Centro de Costo",
                        "data": "Centro_Costo"
                    },
                    {
                        "title": "Estado",
                        "data": "Nombre_Estado"
                    }];
    
                if ($.fn.dataTable.isDataTable('#TablaReport')) {
                    TablaReportes.destroy();
                }
                TablaReportes = $("#TablaReport").DataTable({
                    pageLength: 10,
                    lengthMenu: [
                        [10, 20, 30, -1],
                        [10, 20, 30, "Todos"]
                    ],
                    data: response,
                    columns: Tablecolumns,
                    select: true
                });
    
            },
            error: function (error) {
                swal("Upps!", "Error al obtener los datos del inventario: " + error, "error");
            },
            timeout: 300000
        });
    
    };

    if($("#TipoReporte").val() == "Reporte_Proveedor"){
        
       // $("#divProveedor").removeAttr("hidden");
       $("#divProveedor").css('display','block');
       $("#divEstadoActivo").css('display','none');
       $("#divCentro").css('display','none');
    };

    if($("#TipoReporte").val() == "Reporte_Estado"){
        
        //$("#divEstadoActivo").removeAttr("hidden");
        $("#divEstadoActivo").css("display","block");
        $("#divProveedor").css('display','none');
        $("#divCentro").css("display","none");
    };

    if($("#TipoReporte").val() == "Reporte_Centro_Costo"){
        
       // $("#divCentro").removeAttr("hidden");
       $("#divCentro").css("display","block");
       $("#divProveedor").css("display","none");
       $("#divEstadoActivo").css('display','none');

    };

    if($("#TipoReporte").val() == "Reporte_Disponibilidad"){
       
        $.ajax({
            url: Url_Backend + "GetReporteDisponibilidad",
            type: 'GET',
            contentType: 'application/json',
            headers: {
                'Authorization': token_type + ' ' + access_token
            },
            async: false,
            success: function (response) {
                datos = response;
                $("#divTablareportes").prop("hidden", true);
                $("#divTablaReportProve").prop("hidden", true);
                $("#divTablareport").prop("hidden", true);
                $("#divTablaReportEstado").prop("hidden", true);
                $("#divTablaReportCosto").prop("hidden", true);
                $("#divTablaReportDispo").removeAttr("hidden");
        
                
                $("#divEstadoActivo").css("display","none");
                $("#divProveedor").css("display","none");
                $("#divCentro").css("display","none");

                $("#BotonGenerarReportesDispo").empty();
                if (response.length > 0) {
                    $("#BotonGenerarReportesDispo").append("<button class='btn btn-primary' type='submit' id='export_button'\
                    onclick='tableToExcel()'>Descargar Reporte</button><br>");
                };
    
                Tablecolumns = [
                   // {
                //     "title": "Id",
                //     "data": "Id_Inventario"
                // },
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
                    "title": "Nombre Activo",
                    "data": "Nombre_Activo"
                },
                {
                    "title": "Estado Activo",
                    "data": "Estado_Activo"
                },
                {
                    "title": "Marca",
                    "data": "Marca"
                },
                {
                    "title": "Soporte",
                    "data": "Soporte"
                },
                // {
                //     "title": "Estado",
                //     "data": "Nombre_Estado"
                // },
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
                    "title": "Puesto ",
                    "data": "Id_Puesto"
                },
                // {
                //     "title": "Id Acta",
                //     "data": "Id_Acta_Inventario"
                // },
               
                {
                    "title": "Centro de Costo",
                    "data": "Centro_Costo"
                },
                {
                    "title": "Estado",
                    "data": "Nombre_Estado"
                }];
    
                if ($.fn.dataTable.isDataTable('#TablaReportDispo')) {
                    TablaReportDispo.destroy();
                }
                TablaReportDispo = $("#TablaReportDispo").DataTable({
                    pageLength: 10,
                    lengthMenu: [
                        [10, 20, 30, -1],
                        [10, 20, 30, "Todos"]
                    ],
                    data: response,
                    columns: Tablecolumns,
                    select: true
                });
    
            },
            error: function (error) {
                swal("Upps!", "Error al obtener los datos del inventario: " + error, "error");
            },
            timeout: 300000
        });

    };


  });

 

  $("#Proveedor").change(function () {  
    var Id_Proveedor = $("#Proveedor").val();
    $.ajax({
        url: Url_Backend + 'GetReporteProveedores?Id_Proveedor=' + Id_Proveedor,
        type: 'GET',
        contentType: 'application/json',
        headers: {
            'Authorization': token_type + ' ' + access_token
        },
        async: false,
        success: function (response) {
            datos = response;
            if ($.fn.dataTable.isDataTable('#TablaReport')) {
                TablaReportes.destroy();
            }
            if ($.fn.dataTable.isDataTable('#TablaReportes')) {
                TablaReportes.destroy();
            }
            if ($.fn.dataTable.isDataTable('#TablaReportEstado')) {
                TablaReportProve.destroy();
            }
            if ($.fn.dataTable.isDataTable('#TablaReportCosto')) {
                TablaReportProve.destroy();
            }
            if ($.fn.dataTable.isDataTable('#TablaReportDispo')) {
                TablaReportDispo.destroy();
            }
           
            $("#divTablareportes").prop("hidden", true);
            $("#divTablareport").prop("hidden", true);
            $("#divTablaReportDispo").prop("hidden", true);
            $("#divTablaReportEstado").prop("hidden", true);
            $("#divTablaReportCosto").prop("hidden", true);
            $("#divTablaReportProve").removeAttr("hidden");
            
            

            $("#BotonGenerarReportesprove").empty();
            if (response.length > 0) {
                $("#BotonGenerarReportesprove").append("<button class='btn btn-primary' type='submit' id='export_button'\
                onclick='tableToExcel()'>Descargar Reporte</button><br>");
            };

            Tablecolumns = [
           // {
                //     "title": "Id",
                //     "data": "Id_Inventario"
                // },
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
                    "title": "Nombre Activo",
                    "data": "Nombre_Activo"
                },
                {
                    "title": "Estado Activo",
                    "data": "Estado_Activo"
                },
                {
                    "title": "Marca",
                    "data": "Marca"
                },
                {
                    "title": "Soporte",
                    "data": "Soporte"
                },
                // {
                //     "title": "Estado",
                //     "data": "Nombre_Estado"
                // },
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
                    "title": "Puesto ",
                    "data": "Id_Puesto"
                },
                // {
                //     "title": "Id Acta",
                //     "data": "Id_Acta_Inventario"
                // },
               
                {
                    "title": "Centro de Costo",
                    "data": "Centro_Costo"
                },
                {
                    "title": "Estado",
                    "data": "Nombre_Estado"
                }];

            if ($.fn.dataTable.isDataTable('#TablaReportProve')) {
                TablaReportProve.destroy();
            }
            TablaReportProve = $("#TablaReportProve").DataTable({
                pageLength: 10,
                lengthMenu: [
                    [10, 20, 30, -1],
                    [10, 20, 30, "Todos"]
                ],
                data: response,
                columns: Tablecolumns,
                select: true
            });

        },
        error: function (error) {
            swal("Upps!", "Error al obtener los datos del inventario: " + error, "error");
        },
        timeout: 300000
    });


  });


  $("#EstadoActivo").change(function () { 
    var Id_Estado_Activo = $("#EstadoActivo").val();
    $.ajax({
        url: Url_Backend + 'GetReporteEstadosActivo?Id_Estado_Activo=' + Id_Estado_Activo,
        type: 'GET',
        contentType: 'application/json',
        headers: {
            'Authorization': token_type + ' ' + access_token
        },
        async: false,
        success: function (response) {
            datos = response;
            if ($.fn.dataTable.isDataTable('#TablaReport')) {
                TablaReportes.destroy();
            }
            if ($.fn.dataTable.isDataTable('#TablaReportes')) {
                TablaReportes.destroy();
            }
            if ($.fn.dataTable.isDataTable('#TablaReportProve')) {
                TablaReportProve.destroy();
            }
            if ($.fn.dataTable.isDataTable('#TablaReportCosto')) {
                TablaReportProve.destroy();
            }
            if ($.fn.dataTable.isDataTable('#TablaReportDispo')) {
                TablaReportDispo.destroy();
            }

            $("#divTablareportes").prop("hidden", true);
            $("#divTablareport").prop("hidden", true);
            $("#divTablaReportProve").prop("hidden", true);
            $("#divTablaReportEstado").removeAttr("hidden");
            $("#divTablaReportDispo").prop("hidden", true);
            $("#divTablaReportCosto").prop("hidden", true);


            $("#BotonGenerarReportesEstado").empty();
            if (response.length > 0) {
                $("#BotonGenerarReportesEstado").append("<button class='btn btn-primary' type='submit' id='export_button'\
                onclick='tableToExcel()'>Descargar Reporte</button><br>");
            };

            Tablecolumns = [
           // {
                //     "title": "Id",
                //     "data": "Id_Inventario"
                // },
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
                    "title": "Nombre Activo",
                    "data": "Nombre_Activo"
                },
                {
                    "title": "Estado Activo",
                    "data": "Estado_Activo"
                },
                {
                    "title": "Marca",
                    "data": "Marca"
                },
                {
                    "title": "Soporte",
                    "data": "Soporte"
                },
                // {
                //     "title": "Estado",
                //     "data": "Nombre_Estado"
                // },
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
                    "title": "Puesto ",
                    "data": "Id_Puesto"
                },
                // {
                //     "title": "Id Acta",
                //     "data": "Id_Acta_Inventario"
                // },
               
                {
                    "title": "Centro de Costo",
                    "data": "Centro_Costo"
                },
                {
                    "title": "Estado",
                    "data": "Nombre_Estado"
                }];

            if ($.fn.dataTable.isDataTable('#TablaReportEstado')) {
                TablaReportProve.destroy();
            }
            TablaReportProve = $("#TablaReportEstado").DataTable({
                pageLength: 10,
                lengthMenu: [
                    [10, 20, 30, -1],
                    [10, 20, 30, "Todos"]
                ],
                data: response,
                columns: Tablecolumns,
                select: true
            });

        },
        error: function (error) {
            swal("Upps!", "Error al obtener los datos del inventario: " + error, "error");
        },
        timeout: 300000
    });


  });


  $("#Centro").change(function () { 
    var Id_Centro_Costo = $("#Centro").val();
    $.ajax({
        url: Url_Backend + 'GetReporteCentroCosto?Id_Centro_Costo=' + Id_Centro_Costo,
        type: 'GET',
        contentType: 'application/json',
        headers: {
            'Authorization': token_type + ' ' + access_token
        },
        async: false,
        success: function (response) {
            datos = response;

            if ($.fn.dataTable.isDataTable('#TablaReport')) {
                TablaReportes.destroy();
            }
            if ($.fn.dataTable.isDataTable('#TablaReportes')) {
                TablaReportes.destroy();
            }
            if ($.fn.dataTable.isDataTable('#TablaReportProve')) {
                TablaReportProve.destroy();
            }
            if ($.fn.dataTable.isDataTable('#TablaReportEstado')) {
                TablaReportProve.destroy();
            }
            if ($.fn.dataTable.isDataTable('#TablaReportDispo')) {
                TablaReportDispo.destroy();
            }

            $("#divTablareportes").prop("hidden", true);
            $("#divTablareport").prop("hidden", true);
            $("#divTablaReportProve").prop("hidden", true);
            $("#divTablaReportEstado").prop("hidden", true);
            $("#divTablaReportCosto").removeAttr("hidden");
            $("#divTablaReportDispo").prop("hidden", true);


            $("#BotonGenerarReportesCosto").empty();
            if (response.length > 0) {
                $("#BotonGenerarReportesCosto").append("<button class='btn btn-primary' type='submit' id='export_button'\
                onclick='tableToExcel()'>Descargar Reporte</button><br>");
            };

            Tablecolumns = [
           // {
                //     "title": "Id",
                //     "data": "Id_Inventario"
                // },
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
                    "title": "Nombre Activo",
                    "data": "Nombre_Activo"
                },
                {
                    "title": "Estado Activo",
                    "data": "Estado_Activo"
                },
                {
                    "title": "Marca",
                    "data": "Marca"
                },
                {
                    "title": "Soporte",
                    "data": "Soporte"
                },
                // {
                //     "title": "Estado",
                //     "data": "Nombre_Estado"
                // },
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
                    "title": "Puesto ",
                    "data": "Id_Puesto"
                },
                // {
                //     "title": "Id Acta",
                //     "data": "Id_Acta_Inventario"
                // },
               
                {
                    "title": "Centro de Costo",
                    "data": "Centro_Costo"
                },
                {
                    "title": "Estado",
                    "data": "Nombre_Estado"
                }];

            if ($.fn.dataTable.isDataTable('#TablaReportCosto')) {
                TablaReportProve.destroy();
            }
            TablaReportProve = $("#TablaReportCosto").DataTable({
                pageLength: 10,
                lengthMenu: [
                    [10, 20, 30, -1],
                    [10, 20, 30, "Todos"]
                ],
                data: response,
                columns: Tablecolumns,
                select: true
            });

        },
        error: function (error) {
            swal("Upps!", "Error al obtener los datos del inventario: " + error, "error");
        },
        timeout: 300000
    });

    

  });



  

  function GetEstadoActivo() {
    $.ajax({
        url: Url_Backend + "GetEstadoEquipoActi",
        type: 'GET',
        contentType: 'application/json',
        headers: {
            'Authorization': token_type + ' ' + access_token
        },
        async: false,
        success: function (response) {
            response.forEach(element => {
                $("#EstadoActivo").append(`<option value="${element.Id_Estado_Activo}">${element.Estado_Activo}</option>`);
            });
        },
        error: function (error) {
            swal("Upps!", "Error al obtener Estado del Activo: " + error, "error");
        },
        timeout: 300000
    });
}


function TraerCentroCostos() {
    ObtenerToken(User.Identificacion_Usuario, User.Password)
    $.ajax({
        url: Url_Backend + 'GetCentroCostos',
        type: 'GET',
        contentType: 'application/json',
        headers: {
            'Authorization': token_type + ' ' + access_token
        },
        async: false,
        success: function (response) {
            $("#Centro").empty();
            $("#Centro").append("<option value='' selected disable hidden>Elegir...</option>");
            for (var i = 0; i < response.length; i++) {
                $("#Centro").append("<option value='" + response[i].Id_Centro_Costos + "'>" + response[i].Centro_Costo + " </option>");
            }
        },
        error: function (err) { },
        timeout: 300000
    });
};


  function GetProveedores() {
    $.ajax({
        url: Url_Backend + "GetProveedores",
        type: 'GET',
        contentType: 'application/json',
        headers: {
            'Authorization': token_type + ' ' + access_token
        },
        async: false,
        success: function (response) {
            response.forEach(element => {
                $("#Proveedor").append(`<option value="${element.Id_Proveedor}">${element.Proveedor}</option>`);
            });
        },
        error: function (error) {
            swal("Upps!", "Error al obtener Proveedores: " + error, "error");
        },
        timeout: 300000
    });
}


//Funcion para crear Excel
function tableToExcel() {
    $(".spinner-border").show();
    var TipoReporte = $("#TipoReporte").val();
    if (TipoReporte == "Reporte_completo") {
        //nombre del archivo
        var hoy = new Date();
        var fecha = hoy.getDate() + '-' + (hoy.getMonth() + 1) + '-' + hoy.getFullYear();
        var hora = hoy.getHours() + ':' + hoy.getMinutes() + ':' + hoy.getSeconds();
        var name = 'Reporte_Completo_[' + fecha + '_' + hora + ']';
        //nombre hoja
        var namehoja = 'Reporte_Completo';
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
        var ws_data = [['Id Inventario', 'Serial', 'Placa', 'Identificacion Usuario', 'Proveedor', 'Activo','Estado Activo','Marca','Soporte','Estado','Ciudad','Sede','Piso','Puesto','Id Acta','Centro de Costo']];
        for (i = 0; i < datos.length; i++) {
            ws_data.push([datos[i].Id_Inventario, datos[i].Serial, datos[i].Placa, datos[i].Identificacion_Usuario, datos[i].Proveedor, datos[i].Nombre_Activo, datos[i].Estado_Activo, datos[i].Marca, datos[i].Soporte, datos[i].Nombre_Estado, datos[i].Ciudad, datos[i].Id_Sede, datos[i].Id_Piso, datos[i].Id_Puesto, datos[i].Id_Acta_Inventario ,datos[i].Centro_Costo ])
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
        $(".spinner-border").fadeOut();
    }

    if (TipoReporte == "Reporte_asignacion") {
        //nombre del archivo
        var hoy = new Date();
        var fecha = hoy.getDate() + '-' + (hoy.getMonth() + 1) + '-' + hoy.getFullYear();
        var hora = hoy.getHours() + ':' + hoy.getMinutes() + ':' + hoy.getSeconds();
        var name = 'Reporte_Asignacion_[' + fecha + '_' + hora + ']';
        //nombre hoja
        var namehoja = 'Reporte_Asignacion';
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
        var ws_data = [['Id Inventario', 'Serial', 'Placa', 'Identificacion Usuario', 'Proveedor', 'Activo','Estado Activo','Marca','Soporte','Estado','Ciudad','Sede','Piso','Puesto','Id Acta','Centro de Costo']];
        for (i = 0; i < datos.length; i++) {
            ws_data.push([datos[i].Id_Inventario, datos[i].Serial, datos[i].Placa, datos[i].Identificacion_Usuario, datos[i].Proveedor, datos[i].Nombre_Activo, datos[i].Estado_Activo, datos[i].Marca, datos[i].Soporte, datos[i].Nombre_Estado, datos[i].Ciudad, datos[i].Id_Sede, datos[i].Id_Piso, datos[i].Id_Puesto, datos[i].Id_Acta_Inventario ,datos[i].Centro_Costo ])
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
        $(".spinner-border").fadeOut();
    }
   
    if (TipoReporte == "Reporte_Proveedor") {
        //nombre del archivo
        var hoy = new Date();
        var fecha = hoy.getDate() + '-' + (hoy.getMonth() + 1) + '-' + hoy.getFullYear();
        var hora = hoy.getHours() + ':' + hoy.getMinutes() + ':' + hoy.getSeconds();
        var name = 'Reporte_Proveedor[' + fecha + '_' + hora + ']';
        //nombre hoja
        var namehoja = 'Reporte_Proveedor';
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
        var ws_data = [['Id Inventario', 'Serial', 'Placa', 'Identificacion Usuario', 'Proveedor', 'Activo','Estado Activo','Marca','Soporte','Estado','Ciudad','Sede','Piso','Puesto','Id Acta','Centro de Costo']];
        for (i = 0; i < datos.length; i++) {
            ws_data.push([datos[i].Id_Inventario, datos[i].Serial, datos[i].Placa, datos[i].Identificacion_Usuario, datos[i].Proveedor, datos[i].Nombre_Activo, datos[i].Estado_Activo, datos[i].Marca, datos[i].Soporte, datos[i].Nombre_Estado, datos[i].Ciudad, datos[i].Id_Sede, datos[i].Id_Piso, datos[i].Id_Puesto, datos[i].Id_Acta_Inventario ,datos[i].Centro_Costo ])
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
        $(".spinner-border").fadeOut();
    }

    if (TipoReporte == "Reporte_Disponibilidad") {
        //nombre del archivo
        var hoy = new Date();
        var fecha = hoy.getDate() + '-' + (hoy.getMonth() + 1) + '-' + hoy.getFullYear();
        var hora = hoy.getHours() + ':' + hoy.getMinutes() + ':' + hoy.getSeconds();
        var name = 'Reporte_Disponibilidad[' + fecha + '_' + hora + ']';
        //nombre hoja
        var namehoja = 'Reporte_Disponibilidad';
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
        var ws_data = [['Id Inventario', 'Serial', 'Placa', 'Identificacion Usuario', 'Proveedor', 'Activo','Estado Activo','Marca','Soporte','Estado','Ciudad','Sede','Piso','Puesto','Id Acta','Centro de Costo']];
        for (i = 0; i < datos.length; i++) {
            ws_data.push([datos[i].Id_Inventario, datos[i].Serial, datos[i].Placa, datos[i].Identificacion_Usuario, datos[i].Proveedor, datos[i].Nombre_Activo, datos[i].Estado_Activo, datos[i].Marca, datos[i].Soporte, datos[i].Nombre_Estado, datos[i].Ciudad, datos[i].Id_Sede, datos[i].Id_Piso, datos[i].Id_Puesto, datos[i].Id_Acta_Inventario ,datos[i].Centro_Costo ])
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
        $(".spinner-border").fadeOut();
    }

    
    if (TipoReporte == "Reporte_Estado") {
        //nombre del archivo
        var hoy = new Date();
        var fecha = hoy.getDate() + '-' + (hoy.getMonth() + 1) + '-' + hoy.getFullYear();
        var hora = hoy.getHours() + ':' + hoy.getMinutes() + ':' + hoy.getSeconds();
        var name = 'Reporte_Estado[' + fecha + '_' + hora + ']';
        //nombre hoja
        var namehoja = 'Reporte_Estado';
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
        var ws_data = [['Id Inventario', 'Serial', 'Placa', 'Identificacion Usuario', 'Proveedor', 'Activo','Estado Activo','Marca','Soporte','Estado','Ciudad','Sede','Piso','Puesto','Id Acta','Centro de Costo']];
        for (i = 0; i < datos.length; i++) {
            ws_data.push([datos[i].Id_Inventario, datos[i].Serial, datos[i].Placa, datos[i].Identificacion_Usuario, datos[i].Proveedor, datos[i].Nombre_Activo, datos[i].Estado_Activo, datos[i].Marca, datos[i].Soporte, datos[i].Nombre_Estado, datos[i].Ciudad, datos[i].Id_Sede, datos[i].Id_Piso, datos[i].Id_Puesto, datos[i].Id_Acta_Inventario ,datos[i].Centro_Costo ])
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
        $(".spinner-border").fadeOut();
    }

    if (TipoReporte == "Reporte_Centro_Costo") {
        //nombre del archivo
        var hoy = new Date();
        var fecha = hoy.getDate() + '-' + (hoy.getMonth() + 1) + '-' + hoy.getFullYear();
        var hora = hoy.getHours() + ':' + hoy.getMinutes() + ':' + hoy.getSeconds();
        var name = 'Reporte_Estado[' + fecha + '_' + hora + ']';
        //nombre hoja
        var namehoja = 'Reporte_Estado';
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
        var ws_data = [['Id Inventario', 'Serial', 'Placa', 'Identificacion Usuario', 'Proveedor', 'Activo','Estado Activo','Marca','Soporte','Estado','Ciudad','Sede','Piso','Puesto','Id Acta','Centro de Costo']];
        for (i = 0; i < datos.length; i++) {
            ws_data.push([datos[i].Id_Inventario, datos[i].Serial, datos[i].Placa, datos[i].Identificacion_Usuario, datos[i].Proveedor, datos[i].Nombre_Activo, datos[i].Estado_Activo, datos[i].Marca, datos[i].Soporte, datos[i].Nombre_Estado, datos[i].Ciudad, datos[i].Id_Sede, datos[i].Id_Piso, datos[i].Id_Puesto, datos[i].Id_Acta_Inventario ,datos[i].Centro_Costo ])
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
        $(".spinner-border").fadeOut();
    }

}