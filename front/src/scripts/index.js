console.log("Empieza la página...")

let articulos = [];

$.get("http://localhost:1234/api/productos")

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

                        articulos.push({id: x.id, nombre: x.nombre});
                        $linea.append($('<td class="renglon mt-3 md-3" style=display:none>').text(x.id));
                        $linea.append($('<td class="renglon mt-3 md-3">').text(x.nombre));
                        $linea.append($('<td class="renglon mt-3md-3">').text(x.descripcion));
                        $linea.append($('<td class="renglon mt-3md-3">').text(x.cantidad));
                        $linea.append($('<td class="renglon mt-3md-3">').text(x.precio));
                        //$linea.append($('<button id="boton_detalle" class="btn btn-info btn-lg botonera">Detalle</button>'));
                        $linea.append($('<td>').append($('<button class="btn btn-success btn-lg botonera boton_compra">Compra</button><button class="btn btn-warning btn-lg botonera boton_reposicion">Reposicion</button>')));
                        //$linea.append($('<button id="baja" class="btn btn-danger btn-lg botonera"> Baja </button>'));
                        $padre.append($linea);

                    });

                    $maestro.show();
                    $padre.show();
                    console.log("Refrescaso de tabla ejecutado");
                    console.log(articulos);

                }).fail(function () {

                    console.log("Error");
                });

            });

        window.refrescarListado = refrescarListado;


    };


    function detalleVenta() {

        
        articulos.forEach(x => {
            console.log(x.id);
            let $select = $("#productos_venta");
            let $option = $("<option>");
            $option.append($('<select>').text(x.nombre));
            $select.append($option);

        });

        $padre_venta = $("#venta");
        $padre_venta.show();

    }

    window.detalleVenta = detalleVenta

    $("#boton_venta").on("click", function () {

        detalleVenta();

    });

    refrescarListado();


    // $('#listado').on("click", "#boton_baja", function (event) {

    //     event.preventDefault() // Esto o si no, al menos en Brave, cuelga por razòn no informada en inspector y debugguer. 

    //     let $row = $(this).closest('tr');
    //     let solId = $row.find('td').eq(0).text();

    //     $.ajax({url: 'http://localhost:1234/api/productos' + solId,
    //         method: "PUT",
    //         contentType: "application/json",
    //         success: function(result){
                
    //             console.log('Respuesta: ' + result)
    //             let $padre = $('<respuesta></respuesta')
    //             let $parrafo = $('<p class="Roboto"></p>').text("Respuesta del Servidor tras DELETE: " + JSON.stringify(result) + ". Para solID: " + solId);
    //             $padre.append($parrafo);
    
    //             $('body').append($padre);
    //         },
    //         error: function(xhr, status, error) { 
    //             let $parrafo0 = $('<p class="Roboto></p>').text("Respuesta del Servidor");
    //             let $parrafo = $('<p class="Roboto></p>').text('Error: ' + error);
    //         } 
    //     });

    //     refrescarListado();

    // });


    // Registrar una compra
    $('#listado').on("click", ".boton_compra", function (event) {

        event.preventDefault() // Esto o si no, al menos en Brave, cuelga por razòn no informada en inspector y debugguer. 

        let $row = $(this).closest('tr');
        let solId = $row.find('td').eq(0).text();

        console.log("Id es: "+ solId);

        $.ajax({url: 'http://localhost:1234/api/productos/' + solId + "/compra",
            method: "POST",
            contentType: "application/json",
            success: function(result){
                
                console.log("resultado de la compra: " + result)
    
            },
            error: function(xhr, status, error) { 
        
                console.log("resultado de la compra: " + error)

            } 
        });

        refrescarListado();

    });

    $('#listado').on("click", ".boton_reposicion", function (event) {

        event.preventDefault() // Esto o si no, al menos en Brave, cuelga por razòn no informada en inspector y debugguer. 

        let $row = $(this).closest('tr');
        let solId = $row.find('td').eq(0).text();

        console.log("Id es: "+ solId);

        $.ajax({url: 'http://localhost:1234/api/productos/' + solId + "/reposicion",
            method: "POST",
            contentType: "application/json",
            success: function(result){
                
                console.log("resultado de la compra: " + result)
    
            },
            error: function(xhr, status, error) { 
        
                console.log("resultado de la compra: " + error)

            } 
        });

        refrescarListado();

    });
});
