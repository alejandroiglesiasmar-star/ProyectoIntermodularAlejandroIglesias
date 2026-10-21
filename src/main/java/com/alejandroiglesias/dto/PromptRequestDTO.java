package com.alejandroiglesias.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.util.List;

public class PromptRequestDTO {

    @NotBlank(message = "El prompt no puede estar vacío")
    @Size(max = 500, message = "El prompt no puede exceder 500 caracteres")
    private String prompt;

    @NotBlank(message = "El tipo de solicitud no puede estar vacío")
    @Size(max = 100, message = "El tipo no puede exceder 100 caracteres")
    private String tipo;

    // Datos opcionales para generación de rutinas
    private String nivel;
    private String objetivo;
    private Double peso;
    private Double altura;
    private Integer edad;

    // Getters y Setters
    public String getPrompt() { return prompt; }
    public void setPrompt(String prompt) { this.prompt = prompt; }

    public String getTipo() { return tipo; }
    public void setTipo(String tipo) { this.tipo = tipo; }

    public String getNivel() { return nivel; }
    public void setNivel(String nivel) { this.nivel = nivel; }

    public String getObjetivo() { return objetivo; }
    public void setObjetivo(String objetivo) { this.objetivo = objetivo; }

    public Double getPeso() { return peso; }
    public void setPeso(Double peso) { this.peso = peso; }

    public Double getAltura() { return altura; }
    public void setAltura(Double altura) { this.altura = altura; }

    public Integer getEdad() { return edad; }
    public void setEdad(Integer edad) { this.edad = edad; }
}