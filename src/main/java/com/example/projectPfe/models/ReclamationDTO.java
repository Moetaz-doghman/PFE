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
    private String type ;
    private String convention ;
    private String qualifications;
    @JsonFormat(pattern="yyyy-MM-dd")
    private Date dateCreation;
    private EStatusReclamation statut;
    private UtilisateurDTO user;
}
