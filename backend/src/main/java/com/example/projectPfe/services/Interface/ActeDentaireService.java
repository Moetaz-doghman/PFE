package com.example.projectPfe.Services.Interface;

import com.example.projectPfe.models.ActeDentaire;

import java.util.List;
import java.util.Optional;

public interface ActeDentaireService {

    ActeDentaire createActeDentaire(ActeDentaire acteDentaire);
    ActeDentaire updateActeDentaire(int id, ActeDentaire acteDentaire);
    void deleteActeDentaire(int id);
    ActeDentaire getActeDentaireById(int id);
    List<ActeDentaire> getAllActeDentaires();

}
