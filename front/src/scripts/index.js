
let articulos = [];

$(document).ready(function () {

    function refrescarListado() {

        $.get("http://my-json-server.typicode.com/desarrollo-seguro/dato/solicitudes",
            function (result) {

                $.get("http://localhost:1234/api/productos", function (data) {

                    console.log(data);

                    let $padre = $('#listado');
                    let $maestro = $("maestro");

                    $padre.empty();

                    data.forEach(x => {
                        console.log("Processing item:", x);
                        let $linea = $('<tr>');

                        articulos.push({ id: x.id, nombre: x.nombre });
                        $linea.append($('<td class="renglon mt-3 md-3" style=display:none>').text(x.id));
                        $linea.append($('<td class="renglon mt-3 md-3">').text(x.nombre));
                        $linea.append($('<td class="renglon mt-3md-3">').text(x.descripcion));
                        $linea.append($('<td class="renglon mt-3md-3 text-right">').text(x.cantidad));
                        $linea.append($('<td class="renglon mt-3md-3 text-right">').text( x.precio.toFixed(2)));
                        $linea.append($('<td>').append($(`<button class="btn btn-success btn-lg botonera boton_compra">Compra
                                                          </button><button class="btn btn-info btn-lg botonera boton_reposicion">Reposición</button>
                                                          </button><button class="btn btn-warning btn-lg botonera boton_edicion">Editar</button>
                                                          </button><button class="btn btn-danger btn-lg botonera boton_baja">Borrar</button>
                                                          `)));

                        $padre.append($linea);

                    });

                    $maestro.show();
                    $padre.show();
                    $("nuevo").hide();
                    $("cambioprecio").hide();
                    console.log("Refrescaso de tabla ejecutado");
                    console.log(articulos);

                }).fail(function () {

                    console.log("Error");
                });

            });

        window.refrescarListado = refrescarListado;


    };


    refrescarListado();

    $("#boton_lista").on("click", function (event) {
        event.preventDefault();
        refrescarListado();

    });

    // Registrar una compra
    $('#listado').on("click", ".boton_compra", function (event) {

        event.preventDefault() // Esto o si no, al menos en Brave, cuelga por razòn no informada en inspector y debugguer. 

        let $row = $(this).closest('tr');
        let solId = $row.find('td').eq(0).text();

        console.log("Id es: " + solId);

        $.ajax({
            url: 'http://localhost:1234/api/productos/' + solId + "/compra",
            method: "POST",
            contentType: "application/json",
            success: function (result) {

                console.log("resultado de la compra: " + result)

            },
            error: function (xhr, status, error) {

                console.log("resultado de la compra: " + error)

            }
        });

        refrescarListado();

    });

    $('#listado').on("click", ".boton_reposicion", function (event) {

        event.preventDefault() // Esto o si no, al menos en Brave, cuelga por razòn no informada en inspector y debugguer. 

        let $row = $(this).closest('tr');
        let solId = $row.find('td').eq(0).text();

        console.log("Id es: " + solId);

        $.ajax({
            url: 'http://localhost:1234/api/productos/' + solId + "/reposicion",
            method: "POST",
            contentType: "application/json",
            success: function (result) {

                console.log("resultado de la compra: " + result)

            },
            error: function (xhr, status, error) {

                console.log("resultado de la compra: " + error)

            }
        });

        refrescarListado();

    });

    // Habilita los controles para el cambio de precio
    $('#listado').on("click", ".boton_edicion", function (event) {
        event.preventDefault(); // Prevent default behavior

        let $row = $(this).closest('tr');
        let prodId = $row.find('td').eq(0).text();
        let prodNombre = $row.find('td').eq(1).text();
        let prodDescripcion = $row.find('td').eq(2).text();
        let prodCantidad = $row.find('td').eq(3).text();
        let prodPrecio = $row.find('td').eq(4).text();

        let $precio = $("#edicion");
        $precio.show();
        $("nuevo").hide();

        $("#id_edicion").val(prodId);
        $("#nombre_edicion").val(prodNombre);
        $("#descripcion_edicion").val(prodDescripcion);
        $("#cantidad_edicion").val(prodCantidad);
        $("#precio_edicion").val(prodPrecio);

    });

    // Graba el cambio de precio enviando petición al servidor.
    $("#boton_graba_edicion").on("click", function (event) {

        event.preventDefault(); // Prevent default behavior

        let $precio = $("#edicion");
        let prodId = Number($("#id_edicion").val());
        let prodNombre = $("#nombre_edicion").val();
        let prodDescripcion = $("#descripcion_edicion").val();
        let prodPrecio = Number($("#precio_edicion").val());
        let prodCantidad = Number($("#cantidad_edicion").val());

        if (prodNombre.length > 0 && 
            prodDescripcion.length > 0) {


            let envio = { id: prodId, precio: prodPrecio, nombre: prodNombre, descripcion: prodDescripcion, cantidad: prodCantidad };
            $.ajax({
                url: 'http://localhost:1234/api/productos/edicion',
                method: "PUT",
                contentType: "application/json",
                data: JSON.stringify(envio),
                success: function (result) {
                    console.log('Respuesta: ' + result);
                    $precio.hide();
                    refrescarListado();
                },
                error: function (xhr, status, error) {
                    console.log('Error: ' + error);
                }
            });
        } else {

            alert("Complete Todos los campos");

            $("#id_edicion").val();
            $("#nombre_edicion").val();
            $("#descripcion_edicion").val();
            $("#cantidad_edicion").val();
            $("#precio_edicion").val();

        }
    });

    // Cancela operación de cambio de precio. Borra el detalle y refresca el maestro. 
    $("#boton_cancela_edicion").on("click", function (event) {
        event.preventDefault();
        $edicion = $("#edicion")
        $edicion.hide();
    });


    // Dar de baja un producto. 
    $('#listado').on("click", ".boton_baja", function (event) {

        event.preventDefault()

        let $row = $(this).closest('tr');
        let solId = $row.find('td').eq(0).text();

        console.log("Id es: " + solId);

        if (confirm("Está seguro de que desea BORRAR este registro?")) {
            $.ajax({
                url: 'http://localhost:1234/api/productos/' + solId,
                method: "DELETE",
                contentType: "application/json",
                success: function (result) {

                    console.log("resultado de la compra: " + result)

                },
                error: function (xhr, status, error) {

                    console.log("resultado de la compra: " + error)

                }
            });
        } else {
            // If the user clicked "Cancel", do nothing
            console.log("Operación de borrado cancelada.");
        }

        refrescarListado();

    });


    // Muestra los controles de detalle para la carga de datos del registro a dar de alta. 
    $("#boton_nuevo").on("click", function (event) {
        event.preventDefault();
        let $nuevo = $("#nuevo")
        $nuevo.show();
        $("#cambioprecio").hide();
    });


    // Graba los datos del registro a dar de alta. 
    $("#boton_graba_nuevo").on("click", function (event) {
        event.preventDefault();

        let nombre_nuevo = $("#nombre_nuevo").val();
        let descripcion_nuevo = $('#descripcion_nuevo').val();
        let cantidad_nuevo = $('#cantidad_nuevo').val();
        let precio_nuevo = $("#precio_nuevo").val();

        if (nombre_nuevo != "" &&
            descripcion_nuevo != "" &&
            cantidad_nuevo != "" &&
            precio_nuevo != "") {

            let envio = {
                id: 0,
                nombre: nombre_nuevo,
                descripcion: descripcion_nuevo,
                cantidad: cantidad_nuevo,
                precio: precio_nuevo
            };

            console.log(JSON.stringify(envio));

            $.ajax({
                url: 'http://localhost:1234/api/productos/alta', // Adjusted by Parcel to remove "/api"
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(envio),
                success: function (result) {
                    console.log('Respuesta: ' + result);
                    refrescarListado();
                },
                error: function (xhr, status, error, envio) {
                    console.log('Error: ' + error + " . El envío era:" + JSON.stringify(envio));
                }
            });

        } else {

            alert("Tods los campos deben ser completados.");

        }
    });

    $("#boton_cancela_nuevo").on("click", function (event) {
        event.preventDefault();
        refrescarListado();
    });



});
