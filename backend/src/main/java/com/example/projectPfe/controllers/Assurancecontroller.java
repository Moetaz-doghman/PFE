package com.example.projectPfe.controllers;

import com.example.projectPfe.Services.Interface.AssuranceService;
import com.example.projectPfe.models.Adherant;
import com.example.projectPfe.models.Assurance;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/assurance")
@RequiredArgsConstructor
public class Assurancecontroller {

    private final AssuranceService assurance_service;


    @GetMapping("/{id}")
    public ResponseEntity<Assurance> getAssuranceById(@PathVariable int id) {
        Optional<Assurance> assurance = assurance_service.getAssuranceById(id);
        return assurance.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @GetMapping("/")
    public ResponseEntity<List<Assurance>> getAllAssurances() {
        List<Assurance> assurances = assurance_service.getAllAssurances();
        return new ResponseEntity<>(assurances, HttpStatus.OK);
    }

    @PostMapping("/")
    public ResponseEntity<Assurance> ajouterAssurance(@RequestBody Assurance assurance) {
        Assurance assuranceAjoute = assurance_service.ajouterAssurance(assurance);
        return ResponseEntity.ok().body(assuranceAjoute);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Assurance> modifierAssurance(@PathVariable int id, @RequestBody Assurance assurance) {
        Assurance updatedAssurance = assurance_service.modifierAssurance(id, assurance);
        return new ResponseEntity<>(updatedAssurance, HttpStatus.OK);
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<Void> supprimerAssurance(@PathVariable int id) {
        assurance_service.supprimerAssurance(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }


}
