package com.example.projectPfe.repository;

import com.example.projectPfe.models.Utilisateur;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
@Repository
public interface UtilisateurRepository extends JpaRepository<Utilisateur, Integer> {
    Utilisateur findByEmail(String email);

    Boolean existsByEmail(String email);

    @Query("SELECT u FROM Utilisateur u JOIN u.roles r WHERE r.name <> 'ROLE_ADMIN '")
    List<Utilisateur> findAllExceptAdmins();

}
