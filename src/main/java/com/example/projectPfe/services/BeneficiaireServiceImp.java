package com.example.projectPfe.Services;

import com.example.projectPfe.Services.Interface.BeneficiaireService;
import com.example.projectPfe.models.Adherant;
import com.example.projectPfe.models.Beneficiaire;
import com.example.projectPfe.repository.BeneficiairRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class BeneficiaireServiceImp implements BeneficiaireService {

    @Autowired
    private BeneficiairRepository beneficiaireRepository;
    @Override
    public List<Beneficiaire> getAllBeneficiaires() {
        return beneficiaireRepository.findAll();
    }

    @Override
    public Optional<Beneficiaire> getBeneficiaireById(int id) {
        return beneficiaireRepository.findById(id);
    }

    @Override
    public Beneficiaire saveOrUpdateBeneficiaire(Beneficiaire beneficiaire) {
        return beneficiaireRepository.save(beneficiaire);
    }

    @Override
    public List<Beneficiaire> getBeneficiaireByAdherant(Adherant adherant) {
        return beneficiaireRepository.findByAdherant(adherant);
    }

    @Override
    public void deleteBeneficiaire(int id) {
        beneficiaireRepository.deleteById(id);
    }

    @Override
    public Beneficiaire addBeneficiaireToAdherant(Beneficiaire beneficiaire, Adherant adherant) {
        beneficiaire.setAdherant(adherant);
        return beneficiaireRepository.save(beneficiaire);
    }
}
