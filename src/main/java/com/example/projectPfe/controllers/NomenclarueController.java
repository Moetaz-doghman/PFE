package com.example.projectPfe.controllers;


import com.example.projectPfe.Services.Interface.AssuranceService;
import com.example.projectPfe.Services.Interface.NomenclaturService;
import com.example.projectPfe.dto.NomenclatureDTO;
import com.example.projectPfe.models.Eacte;
import com.example.projectPfe.models.Nomenclature;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/nomenclature")
@RequiredArgsConstructor
public class NomenclarueController {

    private final NomenclaturService nomenclaturService;

    @GetMapping("/findByActeDentaire_Nom/{nomActe}")
    public List<Nomenclature> findByActeDentaire_Nom(@PathVariable Eacte nomActe) {
        return nomenclaturService.findNomenclatureByNomActes(nomActe);
    }

    @PostMapping
    public ResponseEntity<NomenclatureDTO> createNomenclature(@RequestBody Nomenclature nomenclature) {
        NomenclatureDTO createdNomenclatureDTO = nomenclaturService.createNomenclature(nomenclature);
        return new ResponseEntity<>(createdNomenclatureDTO, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<NomenclatureDTO> getNomenclatureById(@PathVariable int id) {
        NomenclatureDTO nomenclatureDTO = nomenclaturService.getNomenclatureById(id);
        return ResponseEntity.ok(nomenclatureDTO);
    }

    @GetMapping
    public ResponseEntity<List<NomenclatureDTO>> getAllNomenclatures() {
        List<NomenclatureDTO> nomenclatureDTOs = nomenclaturService.getAllNomenclatures();
        return ResponseEntity.ok(nomenclatureDTOs);
    }

    @PutMapping("/{id}")
    public ResponseEntity<NomenclatureDTO> updateNomenclature(@PathVariable int id, @RequestBody Nomenclature nomenclature) {
        NomenclatureDTO updatedNomenclatureDTO = nomenclaturService.updateNomenclature(id, nomenclature);
        return ResponseEntity.ok(updatedNomenclatureDTO);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteNomenclature(@PathVariable int id) {
        nomenclaturService.deleteNomenclature(id);
        return ResponseEntity.noContent().build();
    }
}
