package com.example.projectPfe.repository;

import com.example.projectPfe.models.Eacte;
import com.example.projectPfe.models.Nomenclature;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface NomenclatureRepository extends JpaRepository<Nomenclature, Integer> {

    public List<Nomenclature> findByActeDentaire_Nom(Eacte nomActe);




}
