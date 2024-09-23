package com.example.projectPfe.Services.Interface;

import com.example.projectPfe.models.Rapport_C_V_Optcien;
import com.example.projectPfe.models.Rapport_C_V_OpticienDTO;

public interface RapportService  {
    void ajouterRapportOpticien(Rapport_C_V_Optcien rapport_opt , int idPrestationOrdinaire);
    Rapport_C_V_OpticienDTO findRapportByPrestationId(int prestationId);
}
