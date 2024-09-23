package com.example.projectPfe.Services.Interface;

import com.example.projectPfe.models.Adherant;
import com.example.projectPfe.models.Beneficiaire;
import com.example.projectPfe.models.Utilisateur;

import java.util.List;
import java.util.Optional;

public interface AdherantService {

    Adherant findAdherantByAssuranceNomAndMatricule(String assuranceNom, String matricule);

    List<String> getAllAssuranceNames();

    Adherant ajouterAdherant(Adherant adherant, int assurance);

    Optional<Adherant> getAdherantById(int id);

    Optional<Beneficiaire> getBeneficiaireById(int id);
    List<Adherant> getAllAdherants();
    Adherant modifierAdherent(int id, Adherant nouvelAdherent, int idAssurance);
    void supprimerAdherant(int id);

    Adherant desactiverAdherant(int adherantId);

    Adherant activerAdherant(int adherantId );
}
