package com.example.projectPfe.repository;

import com.example.projectPfe.models.ERole;
import com.example.projectPfe.models.Utilisateur;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<Utilisateur , Integer> {

    Optional<Utilisateur> findByEmail(String email);

    //Optional<Utilisateur> findByUsername(String username);

    @Query("SELECT u FROM Utilisateur u JOIN u.roles r WHERE r.name = :role")
    List<Utilisateur> findByRoles(@Param("role") ERole role);
    List<Utilisateur> findByMatricule(String matricule);


    @Transactional
    @Modifying
    @Query("update Utilisateur u set u.password = ?2 where u.email = ?1 ")
    void updatePassword(String email , String password);

    List<Utilisateur> findByActive(boolean active);

}
