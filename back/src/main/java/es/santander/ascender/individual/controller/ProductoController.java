package es.santander.ascender.individual.controller;

import java.util.Collection;
import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import es.santander.ascender.individual.model.Producto;
import jakarta.validation.Valid;

@RestController
@RequestMapping(path = "/productos")
public class ProductoController {

    private Map<Long, Producto> productos = new HashMap<>();

    public ProductoController() {
        productos.put(1l, new Producto(1, "Producto A", "Descripción A", 100.0f, 10));
        productos.put(2l, new Producto(2, "Producto B", "Descripción B", 150.0f, 0));
    }


    @GetMapping("/{id}")
    public HttpEntity<Producto> get(@PathVariable("id") long id) {
        if (!productos.containsKey(id)) {
            return ResponseEntity.notFound().build();
        } else {
            return ResponseEntity.ok().body(productos.get(id));
        }
    }

    @GetMapping
    public HttpEntity<Collection<Producto>> get() {
        return ResponseEntity.ok().body(productos.values());
    }

    @PostMapping("/alta")
    public ResponseEntity<Producto> create(@RequestBody Producto producto) {
        long cuenta = productos.values().size();
        
        long maxId = 0;
        if (cuenta != 0) {
            maxId = productos.values().stream()
                                .map(p -> p.getId())
                                .mapToLong(id -> id)
                                .max()
                                .orElse(0);
        }
        producto.setId(maxId + 1);

        productos.put(producto.getId(), producto);

        return ResponseEntity.status(HttpStatus.CREATED).body(producto);
    }


    @PutMapping("/{id}")
    public ResponseEntity<Producto> update(@PathVariable Long id, @Valid @RequestBody Producto productoActualizado) {
        Producto productoExistente = productos.get(id);
        
        if (productoExistente == null) {
            return ResponseEntity.notFound().build();
        }
    
        productoExistente.setNombre(productoActualizado.getNombre());
        productoExistente.setDescripcion(productoActualizado.getDescripcion());
        productoExistente.setPrecio(productoActualizado.getPrecio());
        productoExistente.setCantidad(productoActualizado.getCantidad());
        
        return ResponseEntity.ok(productoExistente);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        Producto productoExistente = productos.get(id);

        if (productoExistente == null) {
            return ResponseEntity.notFound().build();
        }

        productos.remove(id);

        return ResponseEntity.noContent().build();
    }

    @PostMapping("/compra")
    public ResponseEntity<String> comprarProducto(@RequestBody Producto comprado) {
        long id = comprado.getId();
        int cantidadComprada = comprado.getCantidad();
        
        Producto producto = productos.get(id);

        if (producto == null) {
            return ResponseEntity.notFound().build();
        }

        if (cantidadComprada > producto.getCantidad()) {

            return ResponseEntity.badRequest().body("Producto sin stock disponible.");
        }

        producto.setCantidad(producto.getCantidad() - cantidadComprada);

        return ResponseEntity.ok("Compra realizada con éxito. Producto: " + producto.getNombre());
    }

    @PostMapping("/reposicion")
    public ResponseEntity<String> reponerProducto(@RequestBody Producto comprado) {
        long id = comprado.getId();
        int cantidadRepuesta = comprado.getCantidad();
        
        Producto producto = productos.get(id);

        if (producto == null) {
            return ResponseEntity.notFound().build();
        }


        producto.setCantidad(producto.getCantidad() + cantidadRepuesta);

        return ResponseEntity.ok("Reposición realizada con éxito. Producto: " + producto.getNombre());

    }


    @PutMapping("/edicion")
    public ResponseEntity<String> cambiarPrecio(@RequestBody Producto productoEditado) {
        long id = productoEditado.getId();
        float nuevoPrecio = productoEditado.getPrecio();
        String nuevoNombre = productoEditado.getNombre();
        String nuevoDescripcion = productoEditado.getDescripcion();
        int nuevoCantidad = productoEditado.getCantidad();

        Producto productoEditar = productos.get(id);

        if (productoEditar == null) {
            return ResponseEntity.notFound().build();
        }

        productoEditar.setPrecio(nuevoPrecio);
        productoEditar.setNombre(nuevoNombre);
        productoEditar.setDescripcion(nuevoDescripcion);
        productoEditar.setCantidad(nuevoCantidad);

        return ResponseEntity.ok("Edición de datos de registro terminada con éxito para el id " + id);
    }


    public Map<Long, Producto> getProductos() {
        return productos;
    }

    public void setProductos(Map<Long, Producto> productos) {
        this.productos = productos;
    }    
}
