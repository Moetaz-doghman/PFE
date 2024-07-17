package com.example.projectPfe.Services.Interface;

import com.example.projectPfe.models.ChangePasswordRequest;
import com.example.projectPfe.models.ERole;
import com.example.projectPfe.models.Utilisateur;

import java.util.List;
import java.util.Optional;

public interface UserService {

    Utilisateur ajouterCompte (Utilisateur user , ERole roleName ) ;
    Utilisateur desactiverCompte(int userId);

    Utilisateur activerCompte(int userId );

    boolean SupprimerUser (int  userId );
     List<Utilisateur> getAllUsers() ;

     List<Utilisateur> getAllusersNotAdmin();

     Optional<Utilisateur> findUserById(int userId);


    Utilisateur modifierUtilisateur(int id, Utilisateur user);
     void changePassword(int userId, String newPassword);

    public boolean changePassword(int userId, ChangePasswordRequest request);


}
