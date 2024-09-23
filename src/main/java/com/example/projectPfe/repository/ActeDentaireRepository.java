package com.example.projectPfe.repository;

import com.example.projectPfe.models.ActeDentaire;
import com.example.projectPfe.models.Eacte;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Set;

@Repository
public interface ActeDentaireRepository extends JpaRepository<ActeDentaire, Integer> {

    ActeDentaire findByNom(Eacte nom);


    @Query(value = "SELECT a.* FROM acte a " +
            "JOIN pres_actes pa ON a.id = pa.acte_id " +
            "JOIN prestation p ON p.id_prestation = pa.pres_id " +
            "WHERE p.id_prestation = :idPrestation", nativeQuery = true)
    Set<ActeDentaire> findActesByIdPrestation(@Param("idPrestation") String idPrestation);




}
