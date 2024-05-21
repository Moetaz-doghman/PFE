package com.example.projectPfe.repository;

import com.example.projectPfe.models.Bordereaux;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
@Repository
public interface BordereauxRepository extends JpaRepository<Bordereaux,Integer> {


    @Query("SELECT b FROM Bordereaux b INNER JOIN b.prestations p WHERE p.user.id = :userId")
    List<Bordereaux> findByUserId(@Param("userId") int userId);

    @Query("SELECT MAX(b.refNumber) FROM Bordereaux b WHERE  b.type = 'Contre_visite'")
    Integer findMaxCounterForAdherentContreVisite();


    @Query("SELECT MAX(b.refNumber) FROM Bordereaux b  WHERE  b.type = 'Ordinaire'")
    Integer findMaxCounterForAdherentOrdinaire();


    @Transactional
    @Modifying
    @Query("UPDATE Bordereaux b SET b.refNumber = :newCounter WHERE  b.type = 'Contre_visite' ")
    int updateCounterForAdherentContreVisite( @Param("newCounter") int newCounter);

    @Transactional
    @Modifying
    @Query("UPDATE Bordereaux b SET b.refNumber = :newCounter WHERE  b.type = 'Ordinaire' ")
    int updateCounterForAdherentOrdinaire( @Param("newCounter") int newCounter);





}
