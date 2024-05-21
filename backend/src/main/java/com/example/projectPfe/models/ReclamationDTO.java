package com.example.projectPfe.models;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ReclamationDTO {
    private int id;
    private String titre;
    private String description;
    @JsonFormat(pattern="yyyy-MM-dd")
    private Date dateCreation;
    private EStatusReclamation statut;
    private UtilisateurDTO user;
}
