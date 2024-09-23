package com.example.projectPfe.controllers;

import com.example.projectPfe.Services.RapportDentisteImplm;
import com.example.projectPfe.dto.CombinedRapportDTO;
import com.example.projectPfe.models.RapportDentaireDTO;
import com.example.projectPfe.models.Rapport_C_V;
import com.example.projectPfe.models.Rapport_C_V_Dentaire;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/rapportcvdent")
@RequiredArgsConstructor
public class RapportDentisteController {

    private final RapportDentisteImplm rapportDentisteImplm;
    @PostMapping("/rapports")
    public List<String> addRapportDentaire(@RequestBody List<RapportDentaireDTO> dtos) {
        return rapportDentisteImplm.addRapportDentaire(dtos);
    }

    @GetMapping("/getCombinedRapports/{userId}")
    public List<CombinedRapportDTO> getCombinedRapports(@PathVariable Long userId) {
        return rapportDentisteImplm.getCombinedRapports(userId);
    }
}
