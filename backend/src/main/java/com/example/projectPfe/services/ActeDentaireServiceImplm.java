package com.example.projectPfe.Services;


import com.example.projectPfe.Services.Interface.ActeDentaireService;
import com.example.projectPfe.models.ActeDentaire;
import com.example.projectPfe.repository.ActeDentaireRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ActeDentaireServiceImplm implements ActeDentaireService {
    @Autowired
    private ActeDentaireRepository acteDentaireRepository;

    @Override
    public ActeDentaire createActeDentaire(ActeDentaire acteDentaire) {
        return acteDentaireRepository.save(acteDentaire);
    }

    @Override
    public ActeDentaire updateActeDentaire(int id, ActeDentaire acteDentaire) {
        ActeDentaire existingActeDentaire = acteDentaireRepository.findById(id).orElseThrow(() -> new RuntimeException("ActeDentaire not found"));
        existingActeDentaire.setNom(acteDentaire.getNom());
        existingActeDentaire.setNomenclatures(acteDentaire.getNomenclatures());
        return acteDentaireRepository.save(existingActeDentaire);
    }

    @Override
    public void deleteActeDentaire(int id) {
        acteDentaireRepository.deleteById(id);
    }

    @Override
    public ActeDentaire getActeDentaireById(int id) {
        return acteDentaireRepository.findById(id).orElseThrow(() -> new RuntimeException("ActeDentaire not found"));
    }

    @Override
    public List<ActeDentaire> getAllActeDentaires() {
        return acteDentaireRepository.findAll();
    }

}
