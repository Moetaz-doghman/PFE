package com.example.projectPfe.Services.Interface;

import com.example.projectPfe.models.Assurance;

import java.util.List;
import java.util.Optional;

public interface AssuranceService {

    List<Assurance> getAllAssurances();
    Assurance getAssuranceById(int id);
    Assurance createAssurance(Assurance assurance);
    Assurance updateAssurance(int id, Assurance assurance);
    void deleteAssurance(int id);

}
