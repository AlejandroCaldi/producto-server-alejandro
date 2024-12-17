package es.santander.ascender.individual.model;

import io.micrometer.common.lang.NonNull;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;

public class Producto {
    private long id;

    @Size(max = 30)
    private String nombre;
    
    @Size(max = 150)
    @NonNull
    private String descripcion;
    
    @Min(value = 0)
    private int cantidad;
    
    @Min(value = 0)
    private float precio;

    public Producto() {
    }

    public Producto(long id, @Size(max = 30) String nombre, @Size(max = 150) String descripcion, @Min(0) float precio, 
        @Min(0) int cantidad
            ) {
        this.id = id;
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.cantidad = cantidad;
        this.precio = precio;
    }

    public long getId() {
        return id;
    }
    public void setId(long id) {
        this.id = id;
    }
    public String getNombre() {
        return nombre;
    }
    public void setNombre(String nombre) {
        this.nombre = nombre;
    }
    public String getDescripcion() {
        return descripcion;
    }
    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }
    public int getCantidad() {
        return cantidad;
    }
    public void setCantidad(int cantidad) {
        this.cantidad = cantidad;
    }
    public float getPrecio() {
        return precio;
    }
    public void setPrecio(float precio) {
        this.precio = precio;
    }
}
