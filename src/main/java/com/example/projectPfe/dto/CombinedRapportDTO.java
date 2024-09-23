package com.example.projectPfe.dto;

import com.example.projectPfe.models.ActeDentaire;
import com.example.projectPfe.models.Utilisateur;
import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.Data;

import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Data
public class CombinedRapportDTO {
    private String ref;
    private String refNumber;
    private List<RapportDetailDTO> details;

    @Data
    public static class RapportDetailDTO {
        private int id;
        @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd MMM yyyy")
        private Date dateRapport;
        private String observation;
    }

    @Data
    public static class RapportDentaireDetailDTO extends RapportDetailDTO {
        @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd MMM yyyy")
        private Date date;
        private String dent;
        private String codeActe;
        private String cotation;
        private String avis;
        private String acte;
        private String adherantNom;
        private UtilisateurDTO utilisateur;
    }

    @Data
    public static class UtilisateurDTO {
        private int id;
        private String nom;
        private String prenom;
        private String matricule ;
    }


}

