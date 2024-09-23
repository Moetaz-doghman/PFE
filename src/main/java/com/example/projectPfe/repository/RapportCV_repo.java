package com.example.projectPfe.repository;

import com.example.projectPfe.dto.CombinedRapportDTO;
import com.example.projectPfe.models.Rapport_C_V;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RapportCV_repo extends JpaRepository<Rapport_C_V, Integer> {

    @Query("SELECT new com.example.projectPfe.dto.CombinedRapportDTO(r.ref, r.refNumber, " +
            "GROUP_CONCAT(r.id, r.dateRapport, r.observation)) " +
            "FROM Rapport_C_V r WHERE r.prestation.rapportcontreVisite = true " +
            "GROUP BY r.ref, r.refNumber")
    List<CombinedRapportDTO> findCombinedRapports();

    List<Rapport_C_V> findByPrestationRapportcontreVisiteTrue();



}
