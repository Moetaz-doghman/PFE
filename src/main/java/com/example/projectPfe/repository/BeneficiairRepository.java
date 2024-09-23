package com.example.projectPfe.repository;

import com.example.projectPfe.models.Adherant;
import com.example.projectPfe.models.Beneficiaire;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
@Repository
public interface BeneficiairRepository extends JpaRepository<Beneficiaire,Integer> {
    List<Beneficiaire> findByAdherant(Adherant adherant);
}
