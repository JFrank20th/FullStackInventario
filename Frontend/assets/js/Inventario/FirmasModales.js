function FirmasModales(Modal, DivFirmas, empty) {

    var User = localStorage.getItem("User_Inventarios");
    if (User) {
        User = JSON.parse(atob(User));
        User = User[0];
    } else {
        window.location.assign("index.html");
    };
    $(`#${Modal}`).on('change', function () {
        var valorSeleccionado = $(this).val();
        $.ajax({
            url: Url_Backend + "GetTokensFirmasById?Id_Template=" + valorSeleccionado,
            type: 'GET',
            contentType: 'application/json',
            headers: {
                'Authorization': token_type + ' ' + access_token
            },
            async: false,
            success: function (response) {
                !empty ? $(`#${DivFirmas}`).empty() : '';
                // Colocar la firma de los tokens
                for (let i = 0; i < response.length; i++) {
                    var selectorId = (response[i].Token).replace(/\[|\]/g, '') + "UnicoId";
                    var ButonId = response[i].Id + selectorId;
                    $(`#${DivFirmas}`).append(`
                    <div class="col-md-6 mb-3">
                        <div class="canvas-container" style="display: flex; flex-direction: column; align-items: center; text-align: center;">
                            <label for="${selectorId}" style="margin-bottom: 10px;">${response[i].Nombre}</label>
                            <canvas id="${selectorId}" style="background-color: #f1f2f7; border: none;"></canvas>
                            <button id="${ButonId}" class="btn btn-info btn-rounded btn-sm" style="margin-top: 10px;">Borrar</button>
                        </div>
                    </div>
                    `);
                    // Configura los eventos para el canvas y el botón recién creado
                    configurarCanvasYBoton(selectorId, ButonId);
                }

                //Colocar la firma del usuario
                if (!empty) {
                    $.ajax({
                        url: Url_Backend + "GetFirmaImagen?Identificacion_Usuario=" + User.Identificacion_Usuario,
                        type: 'GET',
                        contentType: 'application/json',
                        headers: {
                            'Authorization': token_type + ' ' + access_token
                        },
                        async: false,
                        success: function (responseFirmaImagen) {
                            if (responseFirmaImagen[0].Firma_Imagen == null) {
                                for (let i = 0; i < responseFirmaImagen.length; i++) {
                                    var ButonId = User.Identificacion_Usuario + User.Nombres;
                                    $(`#${DivFirmas}`).append(`
                                    <div class="col-md-6 mb-3">
                                        <div class="canvas-container" style="display: flex; flex-direction: column; align-items: center; text-align: center;">
                                            <label for="${User.Identificacion_Usuario}" style="margin-bottom: 10px;">Usuario ${User.Nombres + ' ' + User.Apellidos}</label>
                                            <canvas id="${User.Identificacion_Usuario}" style="background-color: #f1f2f7; border: none;"></canvas>
                                            <button id="${ButonId}" class="btn btn-info btn-rounded btn-sm" style="margin-top: 10px;">Borrar</button>
                                        </div>
                                    </div>
                                    `);
                                    // Configura los eventos para el canvas y el botón recién creado
                                    configurarCanvasYBoton(User.Identificacion_Usuario, ButonId);
                                }
                            } else {
                                // Colocar la firma.
                                const firmaImagenBase64 = responseFirmaImagen[0].Firma_Imagen;
                                var ButonId = User.Identificacion_Usuario + User.Nombres;
                                $(`#${DivFirmas}`).append(`
                                <div class="col-md-6 mb-3">
                                    <div class="canvas-container" style="display: flex; flex-direction: column; align-items: center; text-align: center;">
                                        <label for="${User.Identificacion_Usuario}" style="margin-bottom: 10px;">Usuario ${User.Nombres + ' ' + User.Apellidos}</label>
                                        <canvas id="${User.Identificacion_Usuario}" style="background-color: #f1f2f7; border: none;"></canvas>
                                        <button id="${ButonId}" class="btn btn-info btn-rounded btn-sm" style="margin-top: 10px;">Borrar</button>
                                    </div>
                                </div>
                                `);
                                configurarCanvasYBoton(User.Identificacion_Usuario, ButonId);

                                // Obtener el canvas y el contexto
                                const lienzo = document.getElementById(User.Identificacion_Usuario);
                                const ctx = lienzo.getContext("2d");

                                // Crear una nueva imagen
                                const img = new Image();

                                // Establecer la fuente de la imagen como el base64
                                img.src = firmaImagenBase64;

                                // Esperar a que la imagen se cargue antes de dibujarla en el canvas
                                img.onload = function () {
                                    // Limpiar el canvas antes de dibujar la nueva imagen
                                    ctx.clearRect(0, 0, lienzo.width, lienzo.height);

                                    // Dibujar la imagen en el canvas
                                    ctx.drawImage(img, 0, 0, lienzo.width, lienzo.height);
                                };
                            }


                        },
                        error: function (error) {
                            swal("Upps!", "Error al obtener las Firma de usuario logueado: " + error, "error");
                        },
                        timeout: 300000
                    });
                }





                // Esta función configura los eventos de dibujo para un canvas y su botón asociado
                function configurarCanvasYBoton(canvasId, botonId) {
                    const lienzo = document.getElementById(canvasId);
                    const ctx = lienzo.getContext("2d");
                    let dibujando = false;
                    lienzo.addEventListener("mousedown", () => {
                        dibujando = true;
                        ctx.beginPath();
                    });
                    lienzo.addEventListener("mouseup", () => {
                        dibujando = false;
                        ctx.closePath();
                    });
                    lienzo.addEventListener("mousemove", dibujar);
                    function dibujar(e) {
                        if (!dibujando) return;
                        ctx.lineWidth = 2;
                        ctx.lineCap = "round";
                        ctx.strokeStyle = "black";
                        ctx.lineTo(e.clientX - lienzo.getBoundingClientRect().left, e.clientY - lienzo.getBoundingClientRect().top);
                        ctx.stroke();
                    }
                    document.getElementById(botonId).addEventListener("click", () => {
                        ctx.clearRect(0, 0, lienzo.width, lienzo.height);
                    });
                }

            },
            error: function (error) {
                swal("Upps!", "Error al obtener las Firmas: " + error, "error");
            },
            timeout: 300000
        });
    });
}

