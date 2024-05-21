package com.example.projectPfe.repository;

import com.example.projectPfe.models.Assurance;
import com.example.projectPfe.models.ForgotPassword;
import com.example.projectPfe.models.Utilisateur;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AssuranceRepository extends JpaRepository<Assurance,Integer> {

    @Query("SELECT a.nom FROM Assurance a")
    List<String> findAllAssuranceNames();

    @Query("select a from Assurance a where a.id =?1")
    Assurance findByIddd(int assuarnceId);



}
