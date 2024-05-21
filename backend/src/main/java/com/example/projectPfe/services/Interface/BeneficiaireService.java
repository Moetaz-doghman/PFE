package com.example.projectPfe.Services.Interface;

import com.example.projectPfe.models.Adherant;
import com.example.projectPfe.models.Beneficiaire;

import java.util.List;
import java.util.Optional;

public interface BeneficiaireService {

    List<Beneficiaire> getAllBeneficiaires();
    Optional<Beneficiaire> getBeneficiaireById(int id);
    Beneficiaire saveOrUpdateBeneficiaire(Beneficiaire beneficiaire);
    List<Beneficiaire> getBeneficiaireByAdherant(Adherant adherant);
    void deleteBeneficiaire(int id);
    Beneficiaire addBeneficiaireToAdherant(Beneficiaire beneficiaire, Adherant adherant);
}
