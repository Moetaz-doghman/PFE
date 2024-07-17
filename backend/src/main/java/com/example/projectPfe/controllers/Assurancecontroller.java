package com.example.projectPfe.controllers;

import com.example.projectPfe.Services.Interface.AssuranceService;
import com.example.projectPfe.models.Adherant;
import com.example.projectPfe.models.Assurance;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
    @RequestMapping("/api/assurance")
public class Assurancecontroller {

    @Autowired
    private AssuranceService assuranceService;

    @GetMapping
    public List<Assurance> getAllAssurances() {
        return assuranceService.getAllAssurances();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Assurance> getAssuranceById(@PathVariable int id) {
        Assurance assurance = assuranceService.getAssuranceById(id);
        return assurance != null ? ResponseEntity.ok(assurance) : ResponseEntity.notFound().build();
    }

    @PostMapping
    public Assurance createAssurance(@RequestBody Assurance assurance) {
        return assuranceService.createAssurance(assurance);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Assurance> updateAssurance(@PathVariable int id, @RequestBody Assurance assurance) {
        Assurance updatedAssurance = assuranceService.updateAssurance(id, assurance);
        return updatedAssurance != null ? ResponseEntity.ok(updatedAssurance) : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAssurance(@PathVariable int id) {
        assuranceService.deleteAssurance(id);
        return ResponseEntity.noContent().build();
    }


}
