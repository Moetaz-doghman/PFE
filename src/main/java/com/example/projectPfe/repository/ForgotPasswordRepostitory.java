package com.example.projectPfe.repository;

import com.example.projectPfe.models.ForgotPassword;
import com.example.projectPfe.models.Utilisateur;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;
@Repository
public interface ForgotPasswordRepostitory  extends JpaRepository<ForgotPassword,Integer> {

    @Query("select fp from ForgotPassword fp where fp.otp =?1 and fp.user = ?2")
    Optional<ForgotPassword> findByOtpAndUser(Integer otp, Utilisateur user);

    ForgotPassword findByUser(Utilisateur user);

}