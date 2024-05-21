package com.example.projectPfe.repository;

import com.example.projectPfe.models.Reclamation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReclamationRepository extends JpaRepository<Reclamation, Integer> {
    List<Reclamation> findByUserId(int utilisateurId);
}
