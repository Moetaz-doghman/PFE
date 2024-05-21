package com.example.projectPfe.Services;

import com.example.projectPfe.Services.Interface.AssuranceService;
import com.example.projectPfe.models.Assurance;
import com.example.projectPfe.repository.AssuranceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
@Service
@RequiredArgsConstructor
public class AssuranceServiceImplm implements AssuranceService {

    private  final AssuranceRepository assuranceRepository;



    @Override
    public Assurance ajouterAssurance(Assurance assurance) {
        return assuranceRepository.save(assurance);
    }

    @Override
    public Optional<Assurance> getAssuranceById(int id) {
        return assuranceRepository.findById(id);
    }

    @Override
    public List<Assurance> getAllAssurances() {
        return assuranceRepository.findAll();
    }

    @Override
    public Assurance modifierAssurance(int id, Assurance assurance) {
        if (assuranceRepository.existsById(id)) {
            assurance.setNom(assurance.getNom());
            return assuranceRepository.save(assurance);
        } else {
            throw new RuntimeException("Assurance not found with id: " + id);
        }
    }

    @Override
    public void supprimerAssurance(int id) {
        assuranceRepository.deleteById(id);
    }
}
