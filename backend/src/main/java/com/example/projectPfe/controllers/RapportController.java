package com.example.projectPfe.controllers;

import com.example.projectPfe.Services.Interface.RapportService;
import com.example.projectPfe.models.Rapport_C_V_Optcien;
import com.example.projectPfe.models.Rapport_C_V_OpticienDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/rapport")
@RequiredArgsConstructor
public class RapportController {

    private final RapportService rapport_service;


    @PostMapping("/ajouterRapportopticien/{idPrestationOrdinaire}")
    public ResponseEntity<String> ajouterRapportOpticien(@RequestBody Rapport_C_V_Optcien rapportOpticien, @PathVariable int idPrestationOrdinaire) {
        rapport_service.ajouterRapportOpticien(rapportOpticien, idPrestationOrdinaire);
        return new ResponseEntity<>( HttpStatus.CREATED);
    }



    @GetMapping("/byPrestationId/{prestationId}")
    public ResponseEntity<Rapport_C_V_OpticienDTO> findRapportByPrestationId(@PathVariable int prestationId) {
        Rapport_C_V_OpticienDTO rapport = rapport_service.findRapportByPrestationId(prestationId);
        if (rapport != null) {
            return ResponseEntity.ok(rapport);
        } else {
            return ResponseEntity.notFound().build();
        }
    }


}














