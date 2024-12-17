package es.santander.ascender.individual.controller;

import es.santander.ascender.individual.model.Producto;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;
import com.fasterxml.jackson.databind.ObjectMapper;

import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
public class ProductoControllerIntegrationTest {

        @Autowired
        private MockMvc mockMvc;

        @Autowired
        private ObjectMapper objectMapper;

        @Autowired
        private ProductoController productoController;

        private Producto producto1;
        private Producto producto2;

        @BeforeEach
        void setUp() {
                producto1 = new Producto(1, "Producto A", "Descripción A", 100.0f, 10);
                producto2 = new Producto(2, "Producto B", "Descripción B", 150.0f, 0); // Producto sin stock

                productoController.getProductos().put(1l, producto1);
                productoController.getProductos().put(2l, producto2);
        }

        @Test
        void testCrearProducto() throws Exception {
                mockMvc.perform(MockMvcRequestBuilders.post("/productos")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(producto1)))
                                .andExpect(status().isCreated());
        }

        @Test
        void testCrearProductoExistente() throws Exception {
                // Crear el producto y luego intentar crear uno con el mismo nombre
                mockMvc.perform(MockMvcRequestBuilders.post("/productos")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(producto1)))
                                .andExpect(status().isCreated());

                // Intentar crear el mismo producto
                mockMvc.perform(MockMvcRequestBuilders.post("/productos")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(producto1)))
                                .andExpect(status().isBadRequest());
        }

        @Test
        void testObtenerProductoExistente() throws Exception {
                mockMvc.perform(MockMvcRequestBuilders.post("/productos")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(producto1)))
                                .andExpect(status().isCreated());

                mockMvc.perform(MockMvcRequestBuilders.get("/productos/1"))
                                .andExpect(status().isOk())
                                .andExpect(MockMvcResultMatchers.jsonPath("$.nombre").value("Producto A"));
        }

        @Test
        void testObtenerProductoNoExistente() throws Exception {
                mockMvc.perform(MockMvcRequestBuilders.get("/productos/999"))
                                .andExpect(status().isNotFound());
        }

        @Test
        void testComprarProductoConStock() throws Exception {
                // Crear el producto
                mockMvc.perform(MockMvcRequestBuilders.post("/productos")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(producto1)))
                                .andExpect(status().isCreated());

                // Comprar el producto (debe reducir el stock)
                mockMvc.perform(MockMvcRequestBuilders.post("/productos/1/compra"))
                                .andExpect(status().isOk())
                                .andExpect(MockMvcResultMatchers.content()
                                                .string("Compra realizada con éxito. Producto: Producto A"));

                // Verificar que el stock se haya reducido
                mockMvc.perform(MockMvcRequestBuilders.get("/productos/1"))
                                .andExpect(status().isOk())
                                .andExpect(MockMvcResultMatchers.jsonPath("$.cantidad").value(9));
        }

        @Test
        void testComprarProductoSinStock() throws Exception {
                // Crear el producto sin stock
                mockMvc.perform(MockMvcRequestBuilders.post("/productos")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(producto2)))
                                .andExpect(status().isCreated());

                // Intentar comprar el producto (debe devolver BadRequest debido a que no hay
                // stock)
                mockMvc.perform(MockMvcRequestBuilders.post("/productos/2/compra"))
                                .andExpect(status().isBadRequest())
                                .andExpect(MockMvcResultMatchers.content().string("Producto sin stock disponible."));
        }

        @Test
        void testActualizarProducto() throws Exception {
                // Crear el producto
                mockMvc.perform(MockMvcRequestBuilders.post("/productos")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(producto1)))
                                .andExpect(status().isCreated());

                // Crear el producto actualizado
                Producto productoActualizado = new Producto(1, "Producto A Actualizado", "Descripción Actualizada",
                                120.0f, 10);

                // Actualizar el producto
                mockMvc.perform(MockMvcRequestBuilders.put("/productos/1")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(productoActualizado)))
                                .andExpect(status().isOk())
                                .andExpect(MockMvcResultMatchers.jsonPath("$.nombre").value("Producto A Actualizado"))
                                .andExpect(MockMvcResultMatchers.jsonPath("$.descripcion")
                                                .value("Descripción Actualizada"))
                                .andExpect(MockMvcResultMatchers.jsonPath("$.precio").value(120.0));
        }

        @Test
        void testEliminarProducto() throws Exception {
                // Crear el producto
                mockMvc.perform(MockMvcRequestBuilders.post("/productos")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(producto1)))
                                .andExpect(status().isCreated());

                // Eliminar el producto
                mockMvc.perform(MockMvcRequestBuilders.delete("/productos/1"))
                                .andExpect(status().isNoContent());

                // Verificar que el producto ya no existe
                mockMvc.perform(MockMvcRequestBuilders.get("/productos/1"))
                                .andExpect(status().isNotFound());
        }
}
