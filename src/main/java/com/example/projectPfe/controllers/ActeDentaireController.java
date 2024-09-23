package com.example.projectPfe.controllers;


import com.example.projectPfe.Services.Interface.ActeDentaireService;
import com.example.projectPfe.models.ActeDentaire;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/actes")
public class ActeDentaireController {
    @Autowired
    private ActeDentaireService acteDentaireService;

    @PostMapping
    public ResponseEntity<ActeDentaire> createActeDentaire(@RequestBody ActeDentaire acteDentaire) {
        return ResponseEntity.ok(acteDentaireService.createActeDentaire(acteDentaire));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ActeDentaire> getActeDentaireById(@PathVariable int id) {
        return ResponseEntity.ok(acteDentaireService.getActeDentaireById(id));
    }

    @GetMapping
    public ResponseEntity<List<ActeDentaire>> getAllActeDentaires() {
        return ResponseEntity.ok(acteDentaireService.getAllActeDentaires());
    }

    @PutMapping("/{id}")
    public ResponseEntity<ActeDentaire> updateActeDentaire(@PathVariable int id, @RequestBody ActeDentaire acteDentaire) {
        return ResponseEntity.ok(acteDentaireService.updateActeDentaire(id, acteDentaire));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteActeDentaire(@PathVariable int id) {
        acteDentaireService.deleteActeDentaire(id);
        return ResponseEntity.noContent().build();
    }
}
