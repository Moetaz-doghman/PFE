package com.example.projectPfe.models;

import jakarta.persistence.Column;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.HashSet;
import java.util.Set;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PrestationWithBeneficiaireDTO {
    private int id;
    private Date dateCreation;
    private boolean etat;
    private boolean statut;
    private float montantTotal;
    private float montantRembourse ;
    private float montant_ticket_moderateur ;
    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private EPrest type;
    private String cle_cotation;
    private int totalCotation;
    private int idUserControlleur;
    private boolean ContreVisite;
    private Beneficiaire beneficiaire;
    private Adherant adherant;
    private Set<ActeDentaire> actes = new HashSet<>();
    private Utilisateur user;
    private String idPrestation;







}
