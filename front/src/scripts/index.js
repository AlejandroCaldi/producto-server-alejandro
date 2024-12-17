console.log("Empieza la página...")
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
                        $linea.append($('<td class="renglon mt-3 md-3" style=display:none>').text(x.id));
                        $linea.append($('<td class="renglon mt-3 md-3">').text(x.nombre));
                        $linea.append($('<td class="renglon mt-3md-3">').text(x.descripcion));
                        $linea.append($('<td class="renglon mt-3md-3">').text(x.cantidad));
                        $linea.append($('<td class="renglon mt-3md-3">').text(x.precio));;
                        $padre.append($linea);
                        
                    });
                    
                    $maestro.show();
                    $padre.show();
                    console.log("Refrescaso de tabla ejecutado");

                }).fail(function () {

                    console.log("Error");
                });

            });

        window.refrescarListado = refrescarListado;

       
    };

    $("#boton_lista").on("click", function () {

        refrescarListado();

    });


});
