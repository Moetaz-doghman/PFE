package com.example.projectPfe.Services;

import com.example.projectPfe.dto.CombinedRapportDTO;
import com.example.projectPfe.models.*;
import com.example.projectPfe.repository.PrestationRepository;
import com.example.projectPfe.repository.RapportCV_repo;
import com.example.projectPfe.repository.RapportDentisteRepo;
import com.example.projectPfe.repository.UtilisateurRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class RapportDentisteImplm  {

    @Autowired
    private RapportDentisteRepo rapportCVDentaireRepository;

    @Autowired
    private RapportCV_repo rapportCV_repo ;

    @Autowired
    private PrestationRepository prestationRepository;

    @Autowired
    private UtilisateurRepository utilisateurRepository;

    public List<Rapport_C_V_Dentaire> addRapportDentaire(List<RapportDentaireDTO> dtos) {
        Integer maxReference = rapportCVDentaireRepository.getMaxReference();
        int nouvelleReference = (maxReference != null) ? maxReference + 1 : 1;
        String ref = genererRef(nouvelleReference);
        String refNumber = String.valueOf(nouvelleReference);

        return dtos.stream().map(dto -> {
            Prestation prestation = prestationRepository.findById(dto.getPrestationId())
                    .orElseThrow(() -> new RuntimeException("Prestation not found"));
            Utilisateur utilisateur = utilisateurRepository.findById(dto.getUserId())
                    .orElseThrow(() -> new RuntimeException("Utilisateur not found"));


            Rapport_C_V_Dentaire rapport = Rapport_C_V_Dentaire.builder()
                    .ref(ref)
                    .refNumber(refNumber)
                    .dateRapport(dto.getDateRapport())
                    .observation(dto.getObservation())
                    .prestation(prestation)
                    .date(dto.getDate())
                    .dent(dto.getDent())
                    .codeActe(dto.getCodeActe())
                    .adherantNom(dto.getAdherantNom())
                    .cotation(dto.getCotation())
                    .avis(dto.getAvisMedical())
                    .acte(dto.getActe())
                    .utilisateur(utilisateur)
                    .build();

            prestation.setRapportcontreVisite(true);
            prestationRepository.save(prestation);
            return rapportCVDentaireRepository.save(rapport);
        }).collect(Collectors.toList());
    }

    private String genererRef(int ref) {

        return "2024rapportD" +ref ;
    }

    public List<Rapport_C_V> getRapportsWithContreVisiteAndSameRef() {
        return rapportCVDentaireRepository.findRapportsWithContreVisiteAndSameRef();
    }

    public List<CombinedRapportDTO> getCombinedRapports() {
        List<Rapport_C_V> rapports = rapportCV_repo.findByPrestationRapportcontreVisiteTrue();
        Map<String, CombinedRapportDTO> combinedMap = new HashMap<>();

        for (Rapport_C_V rapport : rapports) {
            String key = rapport.getRef() + "-" + rapport.getRefNumber();
            CombinedRapportDTO combinedRapportDTO = combinedMap.getOrDefault(key, new CombinedRapportDTO());
            combinedRapportDTO.setRef(rapport.getRef());
            combinedRapportDTO.setRefNumber(rapport.getRefNumber());

            CombinedRapportDTO.RapportDetailDTO detail;
            if (rapport instanceof Rapport_C_V_Dentaire) {
                CombinedRapportDTO.RapportDentaireDetailDTO dentaireDetail = new CombinedRapportDTO.RapportDentaireDetailDTO();
                Rapport_C_V_Dentaire dentaire = (Rapport_C_V_Dentaire) rapport;
                dentaireDetail.setDate(dentaire.getDate());
                dentaireDetail.setDent(dentaire.getDent());
                dentaireDetail.setCodeActe(dentaire.getCodeActe());
                dentaireDetail.setCotation(dentaire.getCotation());
                dentaireDetail.setAvis(dentaire.getAvis());
                dentaireDetail.setActe(dentaire.getActe());
                dentaireDetail.setAdherantNom(dentaire.getAdherantNom());


                CombinedRapportDTO.UtilisateurDTO utilisateurDTO = new CombinedRapportDTO.UtilisateurDTO();
                utilisateurDTO.setId(dentaire.getUtilisateur().getId());
                utilisateurDTO.setNom(dentaire.getUtilisateur().getNom());
                utilisateurDTO.setPrenom(dentaire.getUtilisateur().getPrenom());
                utilisateurDTO.setMatricule(dentaire.getUtilisateur().getMatricule());

                // Ajoutez d'autres champs nécessaires de l'entité Utilisateur

                dentaireDetail.setUtilisateur(utilisateurDTO);
                detail = dentaireDetail;
            } else {
                detail = new CombinedRapportDTO.RapportDetailDTO();
            }

            detail.setId(rapport.getId());
            detail.setDateRapport(rapport.getDateRapport());
            detail.setObservation(rapport.getObservation());

            if (combinedRapportDTO.getDetails() == null) {
                combinedRapportDTO.setDetails(new ArrayList<>());
            }
            combinedRapportDTO.getDetails().add(detail);
            combinedMap.put(key, combinedRapportDTO);
        }

        return new ArrayList<>(combinedMap.values());
    }
}



