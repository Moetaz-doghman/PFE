package com.example.projectPfe.models;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UtilisateurDTO {
    private int id;
    private String email;
    private String matricule;
    private String nom;
    private String prenom;
    private String adresse;
    private String tel;
    private String identiteBancaire;
    private boolean active;

}
