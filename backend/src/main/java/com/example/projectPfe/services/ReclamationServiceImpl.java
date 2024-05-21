package com.example.projectPfe.Services;

import com.example.projectPfe.Services.Interface.ReclamationService;
import com.example.projectPfe.models.*;
import com.example.projectPfe.repository.ReclamationRepository;
import com.example.projectPfe.repository.UtilisateurRepository;
import com.example.projectPfe.utils.Mapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class ReclamationServiceImpl implements ReclamationService {

    @Autowired
    private ReclamationRepository reclamationRepository;

    @Autowired
    private UtilisateurRepository utilisateurRepository;


    @Override
    public Reclamation ajouterReclamation(Reclamation reclamation, int userId) {
        Utilisateur user = utilisateurRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        reclamation.setUser(user);
        reclamation.setStatut(EStatusReclamation.EN_ATTENTE);
        reclamation.setDateCreation(new Date());
        return reclamationRepository.save(reclamation);
    }

    @Override
    public List<ReclamationDTO> getAllReclamation() {
        List<Reclamation> reclamations = reclamationRepository.findAll();
        return Mapper.toReclamationDTOList(reclamations);
    }

    @Override
    public Optional<Reclamation> getReclamationById(int id) {
        return reclamationRepository.findById(id);
    }

    @Override
    public List<Reclamation> getReclamationsByUserId(int utilisateurId) {
        return reclamationRepository.findByUserId(utilisateurId);
    }

    @Override
    public Reclamation updateStatus(int reclamationId, EStatusReclamation newStatus) {
        Reclamation reclamation = reclamationRepository.findById(reclamationId)
                .orElseThrow(() -> new RuntimeException("Reclamation not found for ID: " + reclamationId));
        reclamation.setStatut(newStatus);
        return reclamationRepository.save(reclamation);
    }

    @Override
    public void deleteReclamation(int reclamationId) {
        Reclamation reclamation = reclamationRepository.findById(reclamationId)
                .orElseThrow(() -> new RuntimeException("Reclamation not found for ID: " + reclamationId));
        reclamationRepository.delete(reclamation);
    }
}