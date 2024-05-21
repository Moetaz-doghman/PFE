package com.example.projectPfe.controllers;


import com.example.projectPfe.Services.Interface.UserService;
import com.example.projectPfe.Services.UtilisateurService;
import com.example.projectPfe.models.ERole;
import com.example.projectPfe.models.Utilisateur;
import com.example.projectPfe.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/utilisateurs")

public class UtilisateurController {

    private final UserRepository userRepository ;

    private final UserService userService;


    private final UtilisateurService utilisateurService;


    public UtilisateurController(UserRepository userRepository, UserService userService, UtilisateurService utilisateurService) {
        this.userRepository = userRepository;
        this.userService = userService;
        this.utilisateurService = utilisateurService;
    }

    @GetMapping("/byRole/{role}")
    public List<Utilisateur> getUtilisateursByRole(@PathVariable ERole role) {
        return utilisateurService.findByRole(role);
    }


    @GetMapping("/byMat/{mat}")
    public List<Utilisateur> getUtilisateursByRole(@PathVariable String mat) {
        return utilisateurService.findbyMat(mat);
    }

    @PostMapping("ajouterRole")
    public void ajouterRoleAUtilisateur(@RequestParam Integer utilisateurId, @RequestParam ERole role) {
        Utilisateur utilisateur = userRepository.findById(utilisateurId).orElse(null);
        if (utilisateur != null) {
            utilisateurService.affecterRole(utilisateur, role);
        }
    }

    @DeleteMapping("/{utilisateurId}/roles/{role}")
    public void supprimerRoleUtilisateur(@PathVariable Integer utilisateurId, @PathVariable ERole role) {
        Utilisateur utilisateur = userRepository.findById(utilisateurId)
                .orElseThrow(() -> new UsernameNotFoundException("Aucun utilisateur trouvé avec cet ID : " + utilisateurId));

        utilisateurService.limiterRole(utilisateur, role);
    }

    @PostMapping("/{roleName}")
    public ResponseEntity<Utilisateur> ajouterUtilisateur(
            @RequestBody Utilisateur utilisateur,
            @PathVariable("roleName") String roleNameString) {

        Utilisateur newUser = userService.ajouterCompte(utilisateur, ERole.valueOf(roleNameString));
        return new ResponseEntity<>(newUser, HttpStatus.CREATED);
    }
    @PutMapping("/disable/{userId}")
    public ResponseEntity<String> desactiverCompte(@PathVariable int userId) {
        Utilisateur user = userService.desactiverCompte(userId);
        return ResponseEntity.status(HttpStatus.OK).body("Compte utilisateur désactivé avec succès");
    }

    @PutMapping("/able/{userId}")
    public ResponseEntity<String> activerCompte(@PathVariable int userId) {
        Utilisateur user = userService.activerCompte(userId);
        return ResponseEntity.status(HttpStatus.OK).body("Compte utilisateur activé avec succès");
    }

    @DeleteMapping("/{id}")
    public void deleteAdhrent(@PathVariable int id) {
        userService.SupprimerUser(id);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Utilisateur> modifierUtilisateur(@PathVariable int id, @RequestBody Utilisateur user) {
        Utilisateur user1 = userService.findUserById(id).orElse(null);
        if (user1 != null) {
            userService.modifierUtilisateur(id,user);
        return new ResponseEntity<>(user1, HttpStatus.OK);
    }


        return null;
    }

    @GetMapping("/{id}")
    public ResponseEntity<Utilisateur> getUserById(@PathVariable int id) {
        Optional<Utilisateur> userOptional = userService.findUserById(id);
        return userOptional.map(user -> ResponseEntity.ok().body(user))
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/")
    public ResponseEntity<List<Utilisateur>> getAllUsers() {
        List<Utilisateur> users = userService.getAllUsers();
        return ResponseEntity.status(HttpStatus.OK).body(users);
    }

    @GetMapping("/Notadmin")
    public ResponseEntity<List<Utilisateur>> Notadmin() {
        List<Utilisateur> users = userService.getAllusersNotAdmin();
        return ResponseEntity.status(HttpStatus.OK).body(users);
    }
    @GetMapping("/byActive")
    public List<Utilisateur> getUtilisateursByActive() {
        return utilisateurService.findByActive();
    }

    @PutMapping("/change-password/{userId}")
    public ResponseEntity<String> changePassword(@PathVariable int userId, @RequestParam String newPassword) {
        try {
            userService.changePassword(userId, newPassword);
            return ResponseEntity.ok("Password changed successfully");
        } catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }







}
