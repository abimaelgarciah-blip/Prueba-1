package com.rio.chequeo.model;

/**
 * POJO que representa a un Paciente en el sistema de chequeo médico.
 */
public class Patient {

    private Long id;
    private String nombre;
    private String fechaCreacion;
    private String ultimaModificacion;
    private MedicalRecord expediente;

    // -------------------------------------------------------------------------
    // Constructores
    // -------------------------------------------------------------------------

    public Patient() {
    }

    public Patient(Long id, String nombre, String fechaCreacion, String ultimaModificacion, MedicalRecord expediente) {
        this.id = id;
        this.nombre = nombre;
        this.fechaCreacion = fechaCreacion;
        this.ultimaModificacion = ultimaModificacion;
        this.expediente = expediente;
    }

    // -------------------------------------------------------------------------
    // Getters y Setters
    // -------------------------------------------------------------------------

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getFechaCreacion() {
        return fechaCreacion;
    }

    public void setFechaCreacion(String fechaCreacion) {
        this.fechaCreacion = fechaCreacion;
    }

    public String getUltimaModificacion() {
        return ultimaModificacion;
    }

    public void setUltimaModificacion(String ultimaModificacion) {
        this.ultimaModificacion = ultimaModificacion;
    }

    public MedicalRecord getExpediente() {
        return expediente;
    }

    public void setExpediente(MedicalRecord expediente) {
        this.expediente = expediente;
    }

    // -------------------------------------------------------------------------
    // toString
    // -------------------------------------------------------------------------

    @Override
    public String toString() {
        return "Patient{" +
                "id=" + id +
                ", nombre='" + nombre + '\'' +
                ", fechaCreacion='" + fechaCreacion + '\'' +
                ", ultimaModificacion='" + ultimaModificacion + '\'' +
                '}';
    }
}
