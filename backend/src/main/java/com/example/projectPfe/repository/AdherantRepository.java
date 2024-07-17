package com.example.projectPfe.repository;

import com.example.projectPfe.models.Adherant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;


@Repository
public interface AdherantRepository extends JpaRepository<Adherant,Integer> {

    @Query("SELECT a FROM Adherant a WHERE a.assurance.nom = :assuranceNom AND a.matricule = :matricule AND a.active = true")
    Adherant findByAssuranceNomAndMatricule(String assuranceNom, String matricule);


    boolean existsByMatricule(String matricule);

    boolean existsByCin(String cin);


    @Query("SELECT a FROM Adherant a INNER JOIN a.prestations p WHERE p.id = :prestationId")
    Adherant findByPrestationId(int prestationId);


    @Query("SELECT MAX(CAST(a.matricule AS int)) FROM Adherant a")
    Integer findMaxMatricule();
}
