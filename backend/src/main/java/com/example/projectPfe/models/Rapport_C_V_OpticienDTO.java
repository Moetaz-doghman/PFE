package com.example.projectPfe.models;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Rapport_C_V_OpticienDTO {

    private int id;
    private String ref;
    private String refNumber;
    private String observation;
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
    private String natureVerre;
    private Prestation prestation;

    public Rapport_C_V_OpticienDTO(Rapport_C_V_Optcien rapport) {
        this.id = rapport.getId();
        this.ref = rapport.getRef();
        this.refNumber = rapport.getRefNumber();
        this.observation = rapport.getObservation();
        this.prestation = rapport.getPrestation(); // Set prestationId
        this.sphereD = rapport.getSphereD();
        this.axeD = rapport.getAxeD();
        this.acuiteD = rapport.getAcuiteD();
        this.sphereG = rapport.getSphereG();
        this.axeG = rapport.getAxeG();
        this.acuiteG = rapport.getAcuiteG();
        this.valeurVerreMin = rapport.getValeurVerreMin();
        this.valeurVerreMax = rapport.getValeurVerreMax();
        this.valeurVerreBlancMin = rapport.getValeurVerreBlancMin();
        this.valeurVerreBlancMax = rapport.getValeurVerreBlancMax();
        this.prixMontureMax = rapport.getPrixMontureMax();
        this.natureVerre = rapport.getNatureVerre();
    }


}
