package com.example.projectPfe.controllers;

import com.example.projectPfe.Services.BeneficiaireServiceImp;
import com.example.projectPfe.Services.Interface.AdherantService;
import com.example.projectPfe.Services.Interface.BeneficiaireService;
import com.example.projectPfe.models.Adherant;
import com.example.projectPfe.models.Beneficiaire;
import com.example.projectPfe.repository.AdherantRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/beneficiaires")
@RequiredArgsConstructor

public class BeneficiaireController {

    private final BeneficiaireService beneficiaireService;
    private final AdherantService adherantService;

    private final AdherantRepository adherantRepository;

    @GetMapping("/adherant/{adherantId}")
    public ResponseEntity<List<Beneficiaire>> getBeneficiaireByAdherant(@PathVariable("adherantId") int adherantId) {
        Optional<Adherant> adherant = adherantService.getAdherantById(adherantId);
        if (adherant.isPresent()) {
            List<Beneficiaire> beneficiaires = beneficiaireService.getBeneficiaireByAdherant(adherant.get());
            return new ResponseEntity<>(beneficiaires, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping
    public ResponseEntity<List<Beneficiaire>> getAllBeneficiaires() {
        List<Beneficiaire> beneficiaires = beneficiaireService.getAllBeneficiaires();
        return new ResponseEntity<>(beneficiaires, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Beneficiaire> getBeneficiaireById(@PathVariable("id") int id) {
        Optional<Beneficiaire> beneficiaire = beneficiaireService.getBeneficiaireById(id);
        if (beneficiaire.isPresent()) {
            return new ResponseEntity<>(beneficiaire.get(), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBeneficiaire(@PathVariable("id") int id) {
        Optional<Beneficiaire> beneficiaire = beneficiaireService.getBeneficiaireById(id);
        if (beneficiaire.isPresent()) {
            beneficiaireService.deleteBeneficiaire(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping("/adherant/{adherantId}")
    public ResponseEntity<Beneficiaire> ajouterBeneficiaireToAdherant(@PathVariable("adherantId") int adherantId, @RequestBody Beneficiaire beneficiaire) {
        Optional<Adherant> adherant = adherantService.getAdherantById(adherantId);
        if (adherant.isPresent()) {
            Beneficiaire createdBeneficiaire = beneficiaireService.addBeneficiaireToAdherant(beneficiaire, adherant.get());
            return new ResponseEntity<>(createdBeneficiaire, HttpStatus.CREATED);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PutMapping("update/{id}/{benef}")
    public ResponseEntity<Beneficiaire> updateBeneficiaire(@PathVariable("id") int id, @RequestBody Beneficiaire beneficiaireDetails , @PathVariable("benef") int benef) {
        Optional<Beneficiaire> existingBeneficiaireOptional = beneficiaireService.getBeneficiaireById(id);

        if (existingBeneficiaireOptional.isPresent()) {
            Beneficiaire existingBeneficiaire = existingBeneficiaireOptional.get();

            System.out.println("Adhérent du bénéficiaire dans la requête : " + beneficiaireDetails.getAdherant());
            System.out.println("  bénéficiaire dans la requête : " + beneficiaireDetails);


            if (beneficiaireDetails.getNom() != null) {
                existingBeneficiaire.setNom(beneficiaireDetails.getNom());
            }

            if (beneficiaireDetails.getPrenom() != null) {
                existingBeneficiaire.setPrenom(beneficiaireDetails.getPrenom());
            }

            if (beneficiaireDetails.getSexe() != null) {
                existingBeneficiaire.setSexe(beneficiaireDetails.getSexe());
            }

            if (beneficiaireDetails.getDateNais() != null) {
                existingBeneficiaire.setDateNais(beneficiaireDetails.getDateNais());
            }

            if (beneficiaireDetails.getQualite() != null) {
                existingBeneficiaire.setQualite(beneficiaireDetails.getQualite());
            }

            if (beneficiaireDetails.getPlafond() != 0.0) {
                existingBeneficiaire.setPlafond(beneficiaireDetails.getPlafond());
            }

            Adherant adherant = adherantRepository.findById(benef)
                    .orElseThrow(() -> new EntityNotFoundException("adherant not found "));
            existingBeneficiaire.setAdherant(adherant);

            Beneficiaire updatedBeneficiaire = beneficiaireService.saveOrUpdateBeneficiaire(existingBeneficiaire);
            return new ResponseEntity<>(updatedBeneficiaire, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }


}
