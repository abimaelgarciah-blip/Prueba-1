package com.rio.chequeo.model;

/**
 * POJO que representa a un Doctor en el sistema de chequeo médico.
 * El campo firmaImagen almacena la firma escaneada como BLOB de Oracle.
 */
public class Doctor {

    private Long id;
    private String nombre;
    private String cedula;
    private String especialidad;
    private String clinica;
    private String telefono;
    private String email;
    private String direccion;
    /** Firma del doctor almacenada como BLOB en Oracle. */
    private byte[] firmaImagen;

    // -------------------------------------------------------------------------
    // Constructores
    // -------------------------------------------------------------------------

    public Doctor() {
    }

    public Doctor(Long id, String nombre, String cedula, String especialidad,
                  String clinica, String telefono, String email,
                  String direccion, byte[] firmaImagen) {
        this.id = id;
        this.nombre = nombre;
        this.cedula = cedula;
        this.especialidad = especialidad;
        this.clinica = clinica;
        this.telefono = telefono;
        this.email = email;
        this.direccion = direccion;
        this.firmaImagen = firmaImagen;
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

    public String getCedula() {
        return cedula;
    }

    public void setCedula(String cedula) {
        this.cedula = cedula;
    }

    public String getEspecialidad() {
        return especialidad;
    }

    public void setEspecialidad(String especialidad) {
        this.especialidad = especialidad;
    }

    public String getClinica() {
        return clinica;
    }

    public void setClinica(String clinica) {
        this.clinica = clinica;
    }

    public String getTelefono() {
        return telefono;
    }

    public void setTelefono(String telefono) {
        this.telefono = telefono;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getDireccion() {
        return direccion;
    }

    public void setDireccion(String direccion) {
        this.direccion = direccion;
    }

    public byte[] getFirmaImagen() {
        return firmaImagen;
    }

    public void setFirmaImagen(byte[] firmaImagen) {
        this.firmaImagen = firmaImagen;
    }

    // -------------------------------------------------------------------------
    // toString
    // -------------------------------------------------------------------------

    @Override
    public String toString() {
        return "Doctor{" +
                "id=" + id +
                ", nombre='" + nombre + '\'' +
                ", cedula='" + cedula + '\'' +
                ", especialidad='" + especialidad + '\'' +
                ", clinica='" + clinica + '\'' +
                ", direccion='" + direccion + '\'' +
                '}';
    }
}
