package com.example.projectPfe.repository;

import com.example.projectPfe.models.ActeDentaire;
import com.example.projectPfe.models.Efavore;
import com.example.projectPfe.models.Prestation;
import com.example.projectPfe.models.Utilisateur;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Set;

@Repository
public interface PrestationRepository extends JpaRepository<Prestation,Integer> {

    @Query("SELECT MAX(p.refNumber) FROM Prestation p WHERE  p.type = 'Contre_visite'")
    Integer findMaxCounterForAdherentContreVisite();

    @Query("SELECT MAX(p.refNumber) FROM Prestation p WHERE  p.type = 'Ordinaire'")
    Integer findMaxCounterForAdherentOrdinaire();


    @Transactional
    @Modifying
    @Query("UPDATE Prestation p SET p.refNumber = :newCounter WHERE  p.type = 'Contre_visite' ")
    int updateCounterForAdherentContreVisite( @Param("newCounter") int newCounter);

    @Transactional
    @Modifying
    @Query("UPDATE Prestation p SET p.refNumber = :newCounter WHERE  p.type = 'Ordinaire' ")
    int updateCounterForAdherentOrdinaire( @Param("newCounter") int newCounter);


    @Query("SELECT p FROM Prestation p JOIN p.adherant a WHERE a.assurance.nom = :assuranceNom AND a.matricule = :matricule AND p.idUserControlleur = :userId AND p.type = 'Ordinaire' AND p.favore IS NULL")
    List<Prestation> findPrestationsByAdherantAssuranceAndUserController(String assuranceNom, String matricule, int userId);

    @Query("SELECT p FROM Prestation p  WHERE  p.user.id = :userId AND p.type = 'Contre_visite'")
    List<Prestation> findContreVisitePrestationsByUserController(int userId);




    List<Prestation> findByIdUserControlleur(int userId);

    List<Prestation> findByUserIdAndAdherant_Id(int userId, int AdherantId);


    @Query("SELECT DISTINCT p FROM Prestation p LEFT JOIN FETCH p.actes where p.archive = false ")
    List<Prestation> findAllWithActes();

    @Query("SELECT DISTINCT p FROM Prestation p LEFT JOIN FETCH p.actes where p.archive = false and p.type = 'Ordinaire' ")
    List<Prestation> findAllWithActesAndTypeOrdinare();

    @Query("SELECT DISTINCT p FROM Prestation p LEFT JOIN FETCH p.actes where p.archive = false and p.type = 'Contre_visite' ")
    List<Prestation> findAllWithActesAndTypeContreVisite();

    @Query("SELECT DISTINCT p FROM Prestation p LEFT JOIN FETCH p.actes WHERE p.user.id = :userId AND p.type = 'Contre_visite' AND p.archive = false AND p.rapportcontreVisite = false ")
    List<Prestation> findAllWithActesAndContreVisite(@Param("userId") int userId);

    Prestation findByIdPrestation(String idPrestation);

    @Query("SELECT DISTINCT p FROM Prestation p LEFT JOIN FETCH p.actes where p.id =:idPrest")
    List<Prestation> findWithActes(int idPrest);

    @Query("SELECT p FROM Prestation p where p.id =:idPrest and p.archive = false ")
    Prestation findWithIdAndArchive(int idPrest);

    List<Prestation> findByUser(Utilisateur utilisateur);

    List<Prestation> findAllByIdIn(List<Integer> ids);

    List<Prestation> findByUserIdAndFavoreAndEtatAndArchive(int userId , Efavore efavore , boolean etat , boolean archive);

    List<Prestation> findByUserIdAndEtatAndArchive(int userId  , boolean etat , boolean archive);


}
