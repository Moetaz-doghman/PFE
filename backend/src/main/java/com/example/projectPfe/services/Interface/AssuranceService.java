package com.example.projectPfe.Services.Interface;

import com.example.projectPfe.models.Assurance;

import java.util.List;
import java.util.Optional;

public interface AssuranceService {

    Assurance ajouterAssurance(Assurance assurance);
    Optional<Assurance> getAssuranceById(int id);
    List<Assurance> getAllAssurances();
    Assurance modifierAssurance(int id, Assurance assurance);
    void supprimerAssurance(int id);
}
