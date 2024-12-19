package es.santander.ascender.individual.controller;

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

import es.santander.ascender.individual.model.Producto;

import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.Arrays;

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
        private Producto producto3;
        private Producto producto4;

        @BeforeEach
        void setUp() {
                producto1 = new Producto(1, "Producto A", "Descripción A", 100.0f, 10);

                // Cfreado para testear falta de stock Producto sin stock
                producto2 = new Producto(2, "Producto B", "Descripción B", 150.0f, 0); 

                // creado para testear altas positivas. 
                producto3 = new Producto(3, "Producto C", "Descripción C", 150.0f, 20);

                 // Creado para testear duplicidad en alta
                producto4 = new Producto(3, "Producto C", "Descripción C", 150.0f, 20);

                productoController.getProductos().put(1l, producto1);
                productoController.getProductos().put(2l, producto2);
        }

        @Test
        void testCrearProducto() throws Exception {
                mockMvc.perform(MockMvcRequestBuilders.post("/productos/alta")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(producto3)))
                                .andExpect(status().isCreated());
        }

        @Test
        void testCrearProductoExistente() throws Exception {
                // Crear el producto y luego intentar crear uno con el mismo nombre
                mockMvc.perform(MockMvcRequestBuilders.post("/productos/alta")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(producto3)))
                                .andExpect(status().isCreated());

                // Intentar crear el mismo producto
                mockMvc.perform(MockMvcRequestBuilders.post("/productos/alta")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(producto4)))
                                .andExpect(status().isBadRequest());
        }

        @Test
        void testObtenerProductoLista() throws Exception {

                mockMvc.perform(MockMvcRequestBuilders.get("/productos")
                                .accept(MediaType.APPLICATION_JSON))
                                .andExpect(status().isOk())
                                .andExpect(content().json(
                                                objectMapper.writeValueAsString(Arrays.asList(producto1, producto2))));
        }


        @Test
        void testObtenerProductoIndividual() throws Exception {

                // Trae detalle de producto 1
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
        void testReponerStock() throws Exception {

                // Como el endpoint de reposición recibe un json nivelable con Producto, pero solo
                // con los datos necesarios para hacer la operación
                // entonces creo un objecto Producto ad-hoc para emular la situacion
                Producto reposicionRequest = new Producto(1, "Producto A", "", 0, 5);

                // Crear el producto
                mockMvc.perform(MockMvcRequestBuilders.post("/productos/reposicion")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(reposicionRequest)))
                                .andExpect(status().isOk());

                                 // Verificar que el stock se haya aumentado;
                mockMvc.perform(MockMvcRequestBuilders.get("/productos/1"))
                .andExpect(status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$.cantidad").value(15));

        }

        @Test
        void testReponerStockNoExisteItem() throws Exception {

                // Como el endpoint de reposición recibe un json nivelable con Producto, pero solo
                // con los datos necesarios para hacer la operación
                // entonces creo un objecto Producto ad-hoc para emular la situacion
               Producto reposicionRequest = new Producto(3, "Producto C", "", 0, 5);

                // Repone un producto no Existente
                mockMvc.perform(MockMvcRequestBuilders.post("/productos/reposicion")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(reposicionRequest)))
                                .andExpect(status().isNotFound());
        }
        

        @Test
        void testComprarProductoTesteaStock() throws Exception {

                // Como el endpoint de compra recibe un json nivelable con Producto, pero solo
                // con los datos necesarios para hacer la operación
                // entonvces creo un objecto Producto ad-hoc para emular la situacion
                Producto compraRequest = new Producto(2, "Producto B", "", 0, 5);

                // Intentar comprar el producto (debe devolver BadRequest debido a que no hay
                // stock)

                mockMvc.perform(MockMvcRequestBuilders.post("/productos/compra")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(compraRequest)))
                                .andExpect(status().isOk());

                compraRequest = new Producto(1, "Producto A", "", 0, 6);

                mockMvc.perform(MockMvcRequestBuilders.post("/productos/compra")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(compraRequest)))
                                .andExpect(status().isBadRequest());

                mockMvc.perform(MockMvcRequestBuilders.get("/productos/1"))
                                .andExpect(status().isOk())
                                .andExpect(MockMvcResultMatchers.jsonPath("$.cantidad").value(5));
        }

        @Test
        void testEditarProducto() throws Exception {

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
                mockMvc.perform(MockMvcRequestBuilders.post("/productos/alta")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(producto3)))
                                .andExpect(status().isCreated());

                // Eliminar el producto
                mockMvc.perform(MockMvcRequestBuilders.delete("/productos/3"))
                                .andExpect(status().isNoContent());

                // Verificar que el producto ya no existe
                mockMvc.perform(MockMvcRequestBuilders.get("/productos/3"))
                                .andExpect(status().isNotFound());
        }
}
