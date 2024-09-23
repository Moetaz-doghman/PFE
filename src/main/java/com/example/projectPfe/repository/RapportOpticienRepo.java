package com.example.projectPfe.repository;

import com.example.projectPfe.models.Rapport_C_V_Optcien;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface RapportOpticienRepo extends JpaRepository<Rapport_C_V_Optcien, Integer> {

    @Query("SELECT MAX(ro.refNumber) FROM Rapport_C_V ro")
    Integer getMaxReference();

    Rapport_C_V_Optcien findByPrestationId(int prestationId);

}
