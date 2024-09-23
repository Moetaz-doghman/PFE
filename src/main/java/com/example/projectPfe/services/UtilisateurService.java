package com.example.projectPfe.Services;

import com.example.projectPfe.models.ERole;
import com.example.projectPfe.models.Role;
import com.example.projectPfe.models.Utilisateur;
import com.example.projectPfe.repository.RoleRepository;
import com.example.projectPfe.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UtilisateurService {

    private final UserRepository utilisateurRepository ;

    private final RoleRepository roleRepository;

    public UtilisateurService(UserRepository utilisateurRepository, RoleRepository roleRepository) {
        this.utilisateurRepository = utilisateurRepository;
        this.roleRepository = roleRepository;
    }

    public List<Utilisateur> findByRole(ERole role)
    {
        return utilisateurRepository.findByRoles(role);
    }

    public  List<Utilisateur> findbyMat(String mat)
    {
        return utilisateurRepository.findByMatricule(mat);
    }

    public List<Utilisateur> findByActive() {
        return utilisateurRepository.findByActive(true);
    }


    public void affecterRole(Utilisateur utilisateur, ERole role) {
        Role roleEntity = roleRepository.findName(role);
        if (roleEntity != null) {
            utilisateur.getRoles().add(roleEntity);
            utilisateurRepository.save(utilisateur);
        } else {
            throw new IllegalArgumentException("Le rôle spécifié n'existe pas.");
        }
    }

    public void limiterRole(Utilisateur utilisateur, ERole role) {
        Role roleEntity = roleRepository.findName(role);
        if (roleEntity != null) {
            utilisateur.getRoles().remove(roleEntity);
            utilisateurRepository.save(utilisateur);
        } else {
            throw new IllegalArgumentException("Le rôle spécifié n'existe pas.");
        }
    }
}
