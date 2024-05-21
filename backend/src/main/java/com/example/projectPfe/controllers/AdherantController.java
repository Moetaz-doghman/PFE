package com.example.projectPfe.controllers;

import com.example.projectPfe.Services.Interface.AdherantService;
import com.example.projectPfe.models.Adherant;
import com.example.projectPfe.models.Beneficiaire;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/adherant")
@RequiredArgsConstructor
public class AdherantController {

    private final AdherantService adherantService;


    @GetMapping("/findbyAssuranceandMAtricule/{assuranceNom}/{matricule}")
    public ResponseEntity<Adherant> getAdherantByAssuranceNomAndMatricule(@PathVariable String assuranceNom, @PathVariable String matricule) {
        Adherant adherant = adherantService.findAdherantByAssuranceNomAndMatricule(assuranceNom, matricule);
        if (adherant != null) {
            return new ResponseEntity<>(adherant, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/getAllAssuranceNames")
    public List<String> getAllAssuranceNames() {
       return adherantService.getAllAssuranceNames();
    }

    @PostMapping("/{idAssurance}")
    public ResponseEntity<Adherant> ajouterAdherant(@RequestBody Adherant adherant,
                                                    @PathVariable("idAssurance") int id) {
        Adherant adherantAjoute = adherantService.ajouterAdherant(adherant,id);
        return ResponseEntity.ok().body(adherantAjoute);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Adherant> getAdherantById(@PathVariable int id) {
        Optional<Adherant> adherantOptional = adherantService.getAdherantById(id);
        if (adherantOptional.isPresent()) {
            return ResponseEntity.ok().body(adherantOptional.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }


    @GetMapping("/beneficiaire/{id}")
    public ResponseEntity<Beneficiaire> getBeneficiaireById(@PathVariable int id) {
        Optional<Beneficiaire> BeneficiareOptional = adherantService.getBeneficiaireById(id);
        if (BeneficiareOptional.isPresent()) {
            return ResponseEntity.ok().body(BeneficiareOptional.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/")
    public ResponseEntity<List<Adherant>> getAllAdherants() {
        List<Adherant> adherants = adherantService.getAllAdherants();
        return ResponseEntity.ok().body(adherants);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Adherant> modifierAdherent(@PathVariable("id") int id,
                                                     @RequestBody Adherant nouvelAdherent,
                                                     @RequestParam("assuranceId") int assuranceId) {
        try {
            Adherant modifiedAdherant = adherantService.modifierAdherent(id, nouvelAdherent, assuranceId);
            return new ResponseEntity<>(modifiedAdherant, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> supprimerAdherant(@PathVariable int id) {
        adherantService.supprimerAdherant(id);
        return ResponseEntity.noContent().build();
    }




}
