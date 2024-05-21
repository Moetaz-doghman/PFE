package com.example.projectPfe.repository;

import com.example.projectPfe.models.ActeDentaire;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ActeRepository extends JpaRepository<ActeDentaire,Integer> {


}
