package com.alejandroiglesias.service.ai;

import com.alejandroiglesias.dto.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Service
public class AIService {

    @Value("${ai.api.key:demo_key}")
    private String apiKey;

    @Value("${ai.api.url:https://api.groq.com/openai/v1/chat/completions}")
    private String apiUrl;

    private final RestTemplate restTemplate;

    public AIService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    /**
     * Genera una rutina de entrenamiento basada en los parámetros proporcionados
     */
    public AIResponseDTO generarRutina(PromptRequestDTO request) {
        try {
            Map<String, Object> payload = new HashMap<>();
            payload.put("model", "llama3-8b-8192");

            StringBuilder systemPrompt = new StringBuilder();
            systemPrompt.append("Eres un entrenador personal experto. Genera una rutina de entrenamiento completa y segura. ");
            systemPrompt.append("Nivel: ").append(request.getNivel()).append(". ");
            systemPrompt.append("Objetivo: ").append(request.getObjetivo()).append(". ");

            if (request.getPeso() != null && request.getAltura() != null) {
                systemPrompt.append("Peso: ").append(request.getPeso()).append("kg, Altura: ").append(request.getAltura()).append("m. ");
            }
            if (request.getEdad() != null) {
                systemPrompt.append("Edad: ").append(request.getEdad()).append(". ");
            }

            systemPrompt.append("Responde en formato JSON con los siguientes campos: nombre_rutina, descripcion, ejercicios (array con nombre, series, repeticiones, descanso).");

            Map<String, Object> messages = new HashMap<>();
            messages.put("role", "system");
            messages.put("content", systemPrompt.toString());

            Map<String, Object> userMessage = new HashMap<>();
            userMessage.put("role", "user");
            userMessage.put("content", request.getPrompt());

            Map<String, Object>[] messageArray = new Map[]{messages, userMessage};
            payload.put("messages", messageArray);
            payload.put("temperature", 0.7);
            payload.put("max_tokens", 1000);

            String response = restTemplate.postForObject(apiUrl, payload, String.class);

            AIResponseDTO result = new AIResponseDTO();
            result.setRespuesta(response);
            result.setTipo("generar_rutina");
            result.setExitosa(true);

            // Intentar parsear la respuesta JSON para extraer la rutina
            // (En un caso completo agregaríamos un JSON parser aquí)
            result.setRutinaGenerada(response);

            return result;

        } catch (Exception e) {
            AIResponseDTO result = new AIResponseDTO();
            result.setExitosa(false);
            result.setMensajeError(e.getMessage());
            return result;
        }
    }

    /**
     * Chat con el entrenador virtual - respuesta interactiva
     */
    public AIResponseDTO chatEntrenador(PromptRequestDTO request) {
        try {
            Map<String, Object> payload = new HashMap<>();
            payload.put("model", "llama3-8b-8192");

            Map<String, Object> systemMessage = new HashMap<>();
            systemMessage.put("role", "system");
            systemMessage.put("content", "Eres un entrenador virtual motivador y conocedor de fitness y salud. Brinda consejos útiles, seguros y personalizados. Siempre motiva al usuario a mantenerse activo de manera saludable.");

            Map<String, Object> userMessage = new HashMap<>();
            userMessage.put("role", "user");
            userMessage.put("content", request.getPrompt());

            Map<String, Object>[] messageArray = new Map[]{systemMessage, userMessage};
            payload.put("messages", new Object[]{systemMessage, userMessage});
            payload.put("temperature", 0.8);
            payload.put("max_tokens", 500);

            String response = restTemplate.postForObject(apiUrl, payload, String.class);

            AIResponseDTO result = new AIResponseDTO();
            result.setRespuesta(response);
            result.setTipo("chat_entrenador");
            result.setExitosa(true);
            result.setMensajeEntrenador(response);

            return result;

        } catch (Exception e) {
            AIResponseDTO result = new AIResponseDTO();
            result.setExitosa(false);
            result.setMensajeError(e.getMessage());
            return result;
        }
    }

    /**
     * Validación de progreso y sugerencias basadas en datos
     */
    public AIResponseDTO validarProgreso(PromptRequestDTO request) {
        try {
            Map<String, Object> payload = new HashMap<>();
            payload.put("model", "llama3-8b-8192");

            StringBuilder systemPrompt = new StringBuilder();
            systemPrompt.append("Eres un analista de datos de fitness. Analiza los siguientes datos de progreso y brinda ");
            systemPrompt.append("sugerencias concretas para mejorar. Datos: ").append(request.getPrompt());

            Map<String, Object> messages = new HashMap<>();
            messages.put("role", "system");
            messages.put("content", systemPrompt.toString());

            Map<String, Object> userMessage = new HashMap<>();
            userMessage.put("role", "user");
            userMessage.put("content", request.getPrompt());

            Map<String, Object>[] messageArray = new Map[]{messages, userMessage};
            payload.put("messages", messageArray);
            payload.put("temperature", 0.5);
            payload.put("max_tokens", 800);

            String response = restTemplate.postForObject(apiUrl, payload, String.class);

            AIResponseDTO result = new AIResponseDTO();
            result.setRespuesta(response);
            result.setTipo("validar_progreso");
            result.setExitosa(true);

            return result;

        } catch (Exception e) {
            AIResponseDTO result = new AIResponseDTO();
            result.setExitosa(false);
            result.setMensajeError(e.getMessage());
            return result;
        }
    }
}