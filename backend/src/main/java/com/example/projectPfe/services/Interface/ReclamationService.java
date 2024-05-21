package com.example.projectPfe.Services.Interface;

import com.example.projectPfe.models.EStatusReclamation;
import com.example.projectPfe.models.Reclamation;
import com.example.projectPfe.models.ReclamationDTO;
import io.jsonwebtoken.io.IOException;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;

public interface ReclamationService {

    Reclamation ajouterReclamation(Reclamation reclamation, int userId);
    List<ReclamationDTO> getAllReclamation();

    Optional<Reclamation> getReclamationById(int id);
    List<Reclamation> getReclamationsByUserId(int utilisateurId);

    Reclamation updateStatus(int reclamationId, EStatusReclamation newStatus);

    void deleteReclamation(int reclamationId);


}
