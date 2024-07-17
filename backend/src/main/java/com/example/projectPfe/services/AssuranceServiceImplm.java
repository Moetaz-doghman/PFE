package com.example.projectPfe.Services;

import com.example.projectPfe.Services.Interface.AssuranceService;
import com.example.projectPfe.models.Assurance;
import com.example.projectPfe.repository.AssuranceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
@Service
public class AssuranceServiceImplm implements AssuranceService {

    @Autowired
    private AssuranceRepository assuranceRepository;

    @Override
    public List<Assurance> getAllAssurances() {
        return assuranceRepository.findAll();
    }

    @Override
    public Assurance getAssuranceById(int id) {
        return assuranceRepository.findById(id).orElse(null);
    }

    @Override
    public Assurance createAssurance(Assurance assurance) {
        return assuranceRepository.save(assurance);
    }

    @Override
    public Assurance updateAssurance(int id, Assurance assurance) {
        if (assuranceRepository.existsById(id)) {
            assurance.setId(id);
            return assuranceRepository.save(assurance);
        }
        return null;
    }

    @Override
    public void deleteAssurance(int id) {
        assuranceRepository.deleteById(id);
    }
}
