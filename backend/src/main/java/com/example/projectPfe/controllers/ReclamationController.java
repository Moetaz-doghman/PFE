package com.example.projectPfe.controllers;

import com.example.projectPfe.Services.Interface.ReclamationService;
import com.example.projectPfe.models.EStatusReclamation;
import com.example.projectPfe.models.Reclamation;
import com.example.projectPfe.models.ReclamationDTO;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;


import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/reclamation")
public class ReclamationController {
    @Autowired
    private ReclamationService reclamationService;

    @PostMapping
    public ResponseEntity<Reclamation> creerReclamation(
            @Valid @RequestBody Reclamation reclamation,
            @RequestParam("utilisateurId") int userId) {
        Reclamation createdReclamation = reclamationService.ajouterReclamation(reclamation, userId);
        return ResponseEntity.ok(createdReclamation);
    }

    @GetMapping
    public ResponseEntity<List<ReclamationDTO>> getAllReclamations() {
        List<ReclamationDTO> reclamationsDTO = reclamationService.getAllReclamation();
        return new ResponseEntity<>(reclamationsDTO, HttpStatus.OK);
    }

    @GetMapping("/getAll")
    public ResponseEntity<List<Reclamation>> getAllReclamationss() {
        List<Reclamation> reclamationsDTO = reclamationService.getAllReclamations();
        return new ResponseEntity<>(reclamationsDTO, HttpStatus.OK);
    }


    @GetMapping("/{id}")
    public ResponseEntity<Reclamation> getReclamationById(@PathVariable int id) {
        Optional<Reclamation> reclamation = reclamationService.getReclamationById(id);
        return reclamation.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @GetMapping("/utilisateur/{utilisateurId}")
    public ResponseEntity<List<Reclamation>> getReclamationsByUtilisateurId(@PathVariable int utilisateurId) {
        List<Reclamation> reclamations = reclamationService.getReclamationsByUserId(utilisateurId);
        return new ResponseEntity<>(reclamations, HttpStatus.OK);
    }

    @PutMapping("/{id}/updateStatus")
    public ResponseEntity<Reclamation> updateStatus(
            @PathVariable int id,
            @RequestParam("newStatus") EStatusReclamation newStatus) {
        Reclamation updatedReclamation = reclamationService.updateStatus(id, newStatus);
        return ResponseEntity.ok(updatedReclamation);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReclamation(@PathVariable int id) {
        reclamationService.deleteReclamation(id);
        return ResponseEntity.noContent().build();
    }
}
