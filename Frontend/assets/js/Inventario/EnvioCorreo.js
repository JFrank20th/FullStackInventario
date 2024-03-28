var Url_Backend = "http://localhost:57737/";
//var Url_Backend = window.location.origin + '/inventario/Backend/';
var Emails;
var User;

//Envio de Correo
function EnviarCorreo(Id_Acta_Drive, UsuarioEmail) {
    $(".preloader").show();
    User = localStorage.getItem("User_Inventarios");
    if (User) {
        User = JSON.parse(atob(User));
        User = User[0];
    } else {
        window.location.assign("index.html");
    };
    $.ajax({
        url: Url_Backend + "GetEmailUsaurio?Identificacion=" + UsuarioEmail,
        type: 'GET',
        contentType: 'application/json',
        headers: {
            'Authorization': token_type + ' ' + access_token
        },
        async: false,
        success: function (response) {
            Emails = response[0].Email + ";" + User.Email;
        },
        error: function (error) {
            swal("Upps!", "Error al obtener email de usuario: " + error, "error");
        },
        timeout: 300000
    });

    //Obtener el link // VALIDAR PORQUE YA NO SE NECESITA EL LINK YA QUE SE VA A ENVIAR EL ADJUNTO EN PDF
    $.ajax({
        url: Url_Backend + "PermissionsEdit?idFile=" + Id_Acta_Drive,
        type: 'GET',
        contentType: 'application/json',
        headers: {
            'Authorization': token_type + ' ' + access_token
        },
        async: false,
        success: function (response) {
            var regex = /"/g
            const LINK = response.replace(regex, '');
            const nuevaVentana = window.open(LINK, '_blank', 'width=800,height=600');
            nuevaVentana.document.title = "Nueva Ventana";
            //Obtener la plantilla
            $.ajax({
                url: Url_Backend + "GetTemplateMail",
                type: 'GET',
                contentType: 'application/json',
                headers: {
                    'Authorization': token_type + ' ' + access_token
                },
                async: false,
                success: function (response) {
                    var TemplateActive = response.filter(function (activo) {
                        return activo.Id_Estado === true;
                    });
                    var Body = (TemplateActive[0].Body).replace(/\[\[LINK\]\]/g, LINK);

                    //Enviar Correo
                    $.ajax({
                        url: Url_Backend
                            + "EnviarCorreo?destinatario=" + Emails
                            + "&asunto=" + TemplateActive[0].Asunto
                            + "&cuerpo=" + encodeURIComponent(Body)
                            + "&cc=" + TemplateActive[0].CC
                            + "&cco=" + TemplateActive[0].CCO
                            + "&Id_Acta_Drive=" + Id_Acta_Drive,
                        type: 'GET',
                        contentType: 'application/json',
                        headers: {
                            'Authorization': token_type + ' ' + access_token
                        },
                        async: false,
                        success: function (response) {
                            toastr.info('Se ha enviado correctamente el correo');
                        },
                        error: function (error) {
                            //debugger;
                            toastr.warning('Error al enviar correo.');
                        },
                        timeout: 300000
                    });
                },
                error: function (error) {
                    toastr.warning('Error al obtener plantilla para enviar correo.');
                },
                timeout: 300000
            });
        },
        error: function (error) {
            toastr.warning('Error al obtener link para enviar correo.');
        },
        timeout: 300000
    });
    $('.preloader').fadeOut(500);
}
