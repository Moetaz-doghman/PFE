package com.example.projectPfe.models;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Data
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
@Entity
@DiscriminatorValue("Opticien")
@Table(name = "rapportOpticien")
public class Rapport_C_V_Optcien extends Rapport_C_V {

    private float sphereD;
    private float axeD;
    private float acuiteD;
    private float sphereG;
    private float axeG;
    private float acuiteG;
    private float valeurVerreMin;
    private float valeurVerreMax;
    private float valeurVerreBlancMin;
    private float valeurVerreBlancMax;
    private float prixMontureMin;
    private float prixMontureMax;
    private String natureVerre ;



}
