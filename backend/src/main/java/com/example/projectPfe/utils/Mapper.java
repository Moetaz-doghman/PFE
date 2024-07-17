package com.example.projectPfe.utils;

import com.example.projectPfe.dto.ActeDentaireDTO;
import com.example.projectPfe.dto.NomenclatureDTO;
import com.example.projectPfe.models.*;

import java.util.List;
import java.util.stream.Collectors;

public class Mapper {
    public static ActeDentaireDTO toActeDentaireDTO(ActeDentaire acteDentaire) {
        ActeDentaireDTO dto = new ActeDentaireDTO();
        dto.setId(acteDentaire.getId());
        dto.setNom(acteDentaire.getNom());
        return dto;
    }

    public static NomenclatureDTO toNomenclatureDTO(Nomenclature nomenclature) {
        NomenclatureDTO dto = new NomenclatureDTO();
        dto.setId(nomenclature.getId());
        dto.setCodeActe(nomenclature.getCodeActe());
        dto.setCotation(nomenclature.getCotation());
        dto.setAvisMedical(nomenclature.getAvisMedical());
        dto.setActeDentaire(toActeDentaireDTO(nomenclature.getActeDentaire()));
        return dto;
    }

    public static List<NomenclatureDTO> toNomenclatureDTOList(List<Nomenclature> nomenclatures) {
        return nomenclatures.stream()
                .map(Mapper::toNomenclatureDTO)
                .collect(Collectors.toList());
    }

    public static UtilisateurDTO toUtilisateurDTO(Utilisateur utilisateur) {
        UtilisateurDTO dto = new UtilisateurDTO();
        dto.setId(utilisateur.getId());
        dto.setNom(utilisateur.getNom());
        dto.setPrenom(utilisateur.getPrenom());
        dto.setEmail(utilisateur.getEmail());
        return dto;
    }

    public static ReclamationDTO toReclamationDTO(Reclamation reclamation) {
        ReclamationDTO dto = new ReclamationDTO();
        dto.setId(reclamation.getId());
        dto.setTitre(reclamation.getTitre());
        dto.setType(reclamation.getType());
        dto.setConvention(reclamation.getConvention());
        dto.setQualifications(reclamation.getQualifications());
        dto.setDescription(reclamation.getDescription());
        dto.setDateCreation(reclamation.getDateCreation());
        dto.setStatut(reclamation.getStatut());
        dto.setUser(toUtilisateurDTO(reclamation.getUser()));
        return dto;
    }

    public static List<ReclamationDTO> toReclamationDTOList(List<Reclamation> reclamations) {
        return reclamations.stream()
                .map(Mapper::toReclamationDTO)
                .collect(Collectors.toList());
    }
}
