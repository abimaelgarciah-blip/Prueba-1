package com.gruporio.chequeomedico.model;

import java.time.LocalDateTime;

/** Equivalente a una fila de la tabla "doctors" (perfiles medicos + firma). */
public class Doctor {
    private String id;
    private String nombre;
    private String cedula;
    private String especialidad;
    private String clinica;
    private String telefono;
    private String email;
    private String direccion;
    private String signatureData;  // PNG base64 (firma dibujada a mano)
    private String signatureImage; // imagen base64 subida
    private LocalDateTime createdAt;

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    public String getCedula() { return cedula; }
    public void setCedula(String cedula) { this.cedula = cedula; }
    public String getEspecialidad() { return especialidad; }
    public void setEspecialidad(String especialidad) { this.especialidad = especialidad; }
    public String getClinica() { return clinica; }
    public void setClinica(String clinica) { this.clinica = clinica; }
    public String getTelefono() { return telefono; }
    public void setTelefono(String telefono) { this.telefono = telefono; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getDireccion() { return direccion; }
    public void setDireccion(String direccion) { this.direccion = direccion; }
    public String getSignatureData() { return signatureData; }
    public void setSignatureData(String signatureData) { this.signatureData = signatureData; }
    public String getSignatureImage() { return signatureImage; }
    public void setSignatureImage(String signatureImage) { this.signatureImage = signatureImage; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    /** La firma efectiva a usar en el PDF: imagen subida tiene prioridad sobre la dibujada, igual que el original. */
    public String effectiveSignature() {
        return (signatureImage != null && !signatureImage.isEmpty()) ? signatureImage : signatureData;
    }
}
