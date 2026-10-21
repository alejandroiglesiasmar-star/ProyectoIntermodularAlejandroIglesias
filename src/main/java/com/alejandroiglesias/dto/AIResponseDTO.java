package com.alejandroiglesias.dto;

public class AIResponseDTO {

    private String respuesta;
    private String tipo;
    private boolean exitosa;
    private String mensajeError;

    // Para respuesta de generación de rutinas
    private String rutinaGenerada;
    private String nivelSugerido;

    // Para respuesta de chat de entrenamiento
    private String mensajeEntrenador;

    // Constructores
    public AIResponseDTO() {
        this.exitosa = false;
    }

    public AIResponseDTO(String respuesta, String tipo, boolean exitosa) {
        this();
        this.respuesta = respuesta;
        this.tipo = tipo;
        this.exitosa = exitosa;
    }

    // Getters y Setters
    public String getRespuesta() { return respuesta; }
    public void setRespuesta(String respuesta) { this.respuesta = respuesta; }

    public String getTipo() { return tipo; }
    public void setTipo(String tipo) { this.tipo = tipo; }

    public boolean isExitosa() { return exitosa; }
    public void setExitosa(boolean exitosa) { this.exitosa = exitosa; }

    public String getMensajeError() { return mensajeError; }
    public void setMensajeError(String mensajeError) { this.mensajeError = mensajeError; }

    public String getRutinaGenerada() { return rutinaGenerada; }
    public void setRutinaGenerada(String rutinaGenerada) { this.rutinaGenerada = rutinaGenerada; }

    public String getNivelSugerido() { return nivelSugerido; }
    public void setNivelSugerido(String nivelSugerido) { this.nivelSugerido = nivelSugerido; }

    public String getMensajeEntrenador() { return mensajeEntrenador; }
    public void setMensajeEntrenador(String mensajeEntrenador) { this.mensajeEntrenador = mensajeEntrenador; }
}