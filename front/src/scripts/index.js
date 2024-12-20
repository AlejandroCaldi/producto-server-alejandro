
let articulos = [];

let operacion_compraventa = 0; // 0 equivale a compra, 1 a reposición

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
                        $linea.append($('<td class="renglon mt-3md-3 text-right">').text(x.precio.toFixed(2)));
                        $linea.append($('<td class="text-center">').append($(`<button class="btn btn-success btn-lg botonera text-center boton_compra">Compra
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
                    $("compraventa").hide();
                    $("compraventa").hide();
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

    $(document).ready(function() {
        $('#listado').on("click", ".boton_compra", function(event) {
            event.preventDefault(); // Prevent default action
    
            let $row = $(this).closest('tr');
            let prodId = $row.find('td').eq(0).text();
            let prodNombre = $row.find('td').eq(1).text();
            let prodCantidad = $row.find('td').eq(3).text();
    
            operacion_compraventa = 0;
    
            $("#legend_compraventa").text("Compra");
            $("#id_compraventa").val(prodId);
            $("#nombre_compraventa").val(prodNombre);
            $("#nombre_compraventa").prop('disabled', true);
            $("#cantidad_compraventa").val(prodCantidad);
            $("#nuevo").hide();
            $("#edicion").hide();
            $("#compraventa").show(); // Corrected selector
        });
    
        $('#listado').on("click", ".boton_reposicion", function(event) {
            event.preventDefault(); // Prevent default action
    
            let $row = $(this).closest('tr');
            let prodId = $row.find('td').eq(0).text();
            let prodNombre = $row.find('td').eq(1).text();
            let prodCantidad = $row.find('td').eq(3).text();
    
            operacion_compraventa = 1;
    
            $("#legend_compraventa").text("Reposición");
            $("#id_compraventa").val(prodId);
            $("#nombre_compraventa").val(prodNombre);
            $("#nombre_compraventa").prop('disabled', true);
            $("#cantidad_compraventa").val(prodCantidad);
            $("#nuevo").hide();
            $("#edicion").hide();
            $("#compraventa").show(); // Corrected selector
        });
    
        $("#boton_graba_compraventa").on("click", function(event) {
            event.preventDefault(); // Prevent default action
            
            let prodId = $("#id_compraventa").val();
            let prodCantidad = $("#cantidad_compraventa").val(); // Corrected variable name
    
            let envio = { id: prodId, precio: 0, nombre: "", descripcion: "", cantidad: prodCantidad };
    
            if (operacion_compraventa == 0) {
                $.ajax({
                    url: 'http://localhost:1234/api/productos/compra',
                    method: "POST",
                    contentType: "application/json",
                    data: JSON.stringify(envio),
                    success: function(result) {
                        console.log("resultado de la compra: " + result);
                    },
                    error: function(xhr, status, error) {
                        console.log("resultado de la compra: " + error);
                        alert("La compra excedería la cantidad en inventario");
                    }
                });
            }
    
            if (operacion_compraventa == 1) {
                $.ajax({
                    url: 'http://localhost:1234/api/productos/reposicion',
                    method: "POST",
                    contentType: "application/json",
                    data: JSON.stringify(envio),
                    success: function(result) {
                        console.log("resultado de la reposición: " + result);
                    },
                    error: function(xhr, status, error) {
                        console.log("resultado de la reposición: " + error);
                    }
                });
            }
    
            refrescarListado(); // Make sure this function doesn't cause a page reload
        });
    });

    // Cancela operación de cambio de precio. Borra el detalle y refresca el maestro. 
    $("#boton_cancela_compraventa").on("click", function (event) {
        event.preventDefault();
        $("#edicion").hide();
        $("#nuevo").hide();
        $("#compraventa").hide();
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
        $("#edicion").hide();
        $("compraventa").hide();
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
        $("#edicion").hide();
        $("compraventa").hide();
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
                    alert(xhr.responseText);
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

    //Para el fintrado de la tabla. 
    $("#filtrado").on("keyup", function() {
        var value = $(this).val().toLowerCase();
        $("#listado tr").filter(function() {
          $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
      });


});
