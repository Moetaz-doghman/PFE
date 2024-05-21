package com.example.projectPfe.controllers;

import com.example.projectPfe.Exceptions.BordereauNotFoundException;
import com.example.projectPfe.Services.BordereauServiceImpm;
import com.example.projectPfe.models.Bordereaux;
import com.example.projectPfe.models.EstatusBord;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bordereaux")
@RequiredArgsConstructor
public class BordereauController {

    private final BordereauServiceImpm bordereau_service;

    @PostMapping("/genererBorderau")
    public ResponseEntity<String> genererBordereau(@RequestBody List<Integer> prestationsIds) {
        try {
            Bordereaux bordereau = bordereau_service.genererBordereau(prestationsIds);
            return new ResponseEntity<String>( HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>( e.getMessage() ,HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/getByID/{id}")
    public Bordereaux findByUserId(@PathVariable int id) {
        return bordereau_service.findById(id);

    }

    @GetMapping("/findAll")
    public List<Bordereaux> findAll() {
        return bordereau_service.findAll();

    }

    @GetMapping("/getBordereauxByUserId/{userId}")
    public List<Bordereaux> getBordereauxByUserId(@PathVariable int userId) {
        List<Bordereaux> bordereaux = bordereau_service.getBordereauxByUserId(userId);
        return ResponseEntity.ok().body(bordereaux).getBody();
    }


    @DeleteMapping("/{bordereauId}")
    public ResponseEntity<String> deleteBordereau(@PathVariable int bordereauId) {
        try {
            bordereau_service.deleteBordereauById(bordereauId);
            return ResponseEntity.ok("");
        } catch (BordereauNotFoundException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
        }
    }

    @PutMapping("/{id}/changerStatut")
    public void changerStatutBordereau(@PathVariable int id, @RequestParam EstatusBord nouveauStatut) {
        bordereau_service.changerStatutBordereau(id, nouveauStatut);
    }











}
