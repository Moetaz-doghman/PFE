package com.example.projectPfe.repository;

import com.example.projectPfe.dto.CombinedRapportDTO;
import com.example.projectPfe.models.Rapport_C_V;
import com.example.projectPfe.models.Rapport_C_V_Dentaire;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RapportDentisteRepo extends JpaRepository<Rapport_C_V_Dentaire, Integer> {

    Optional<Rapport_C_V_Dentaire> findByRefAndRefNumber(String ref, String refNumber);

    @Query("SELECT MAX(ro.refNumber) FROM Rapport_C_V_Dentaire ro")
    Integer getMaxReference();

    @Query("SELECT r FROM Rapport_C_V r WHERE r.prestation.rapportcontreVisite = true AND EXISTS " +
            "(SELECT r2 FROM Rapport_C_V r2 WHERE r2.ref = r.ref AND r2.refNumber = r.refNumber)")
    List<Rapport_C_V> findRapportsWithContreVisiteAndSameRef();

    @Query("SELECT r FROM Rapport_C_V_Dentaire r WHERE r.prestation.rapportcontreVisite = true AND r.utilisateur.id = :userId")
    List<Rapport_C_V_Dentaire> findDentaireByPrestationRapportcontreVisiteTrueAndUserId(@Param("userId") Long userId);



}
