package com.alejandroiglesias.controller;

import com.alejandroiglesias.dto.AIResponseDTO;
import com.alejandroiglesias.dto.PromptRequestDTO;
import com.alejandroiglesias.service.ai.AIService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ai")
public class AIController {

    @Autowired
    private AIService aiService;

    // POST - Generar rutina de entrenamiento
    @PostMapping("/generar-rutina")
    public ResponseEntity<AIResponseDTO> generarRutina(@RequestBody PromptRequestDTO request) {
        AIResponseDTO response = aiService.generarRutina(request);
        if (response.isExitosa()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    // POST - Chat con entrenador virtual
    @PostMapping("/chat")
    public ResponseEntity<AIResponseDTO> chat(@RequestBody PromptRequestDTO request) {
        AIResponseDTO response = aiService.chatEntrenador(request);
        if (response.isExitosa()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    // POST - Validar progreso y obtener sugerencias
    @PostMapping("/validar-progreso")
    public ResponseEntity<AIResponseDTO> validarProgreso(@RequestBody PromptRequestDTO request) {
        AIResponseDTO response = aiService.validarProgreso(request);
        if (response.isExitosa()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
}