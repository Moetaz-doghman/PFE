package com.example.projectPfe.Services;

import com.example.projectPfe.Services.Interface.AdherantService;
import com.example.projectPfe.models.Adherant;
import com.example.projectPfe.models.Assurance;
import com.example.projectPfe.models.Beneficiaire;
import com.example.projectPfe.repository.AdherantRepository;
import com.example.projectPfe.repository.AssuranceRepository;
import com.example.projectPfe.repository.BeneficiairRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AdherantServiceImp implements AdherantService {

    private final AdherantRepository adherantRepository;

    private final BeneficiairRepository beneficiaire_repo;

    private  final AssuranceRepository assuranceRepository;


    @Override
    public Adherant findAdherantByAssuranceNomAndMatricule(String assuranceNom, String matricule) {

        return adherantRepository.findByAssuranceNomAndMatricule(assuranceNom, matricule);

    }

    @Override
    public List<String> getAllAssuranceNames() {
        return assuranceRepository.findAllAssuranceNames();
    }

    @Override
    public Adherant ajouterAdherant(Adherant adherant, int assurance) {

        if (adherantRepository.existsByMatricule(adherant.getMatricule())) {
            throw new RuntimeException("Une adhérent avec la même matricule existe déjà");
        }

        if (adherantRepository.existsByCin(adherant.getCin())) {
            throw new RuntimeException("Une adhérent avec le même CIN existe déjà");
        }

        Assurance assur = assuranceRepository.findById(assurance)
                .orElseThrow(() -> new RuntimeException("assurance introuvable"));
        adherant.setAssurance(assur);
        return adherantRepository.save(adherant);
    }

    @Override
    public Optional<Adherant> getAdherantById(int id) {
        return adherantRepository.findById(id);
    }

    @Override
    public Optional<Beneficiaire> getBeneficiaireById(int id) {
        return beneficiaire_repo.findById(id);
    }

    @Override
    public List<Adherant> getAllAdherants() {
        return adherantRepository.findAll();
    }



    @Override
    public void supprimerAdherant(int id) {
        adherantRepository.deleteById(id);
    }

    @Override
    public Adherant modifierAdherent(int id, Adherant nouvelAdherent, int idAssurance) {
        Optional<Adherant> adherantOptional = adherantRepository.findById(id);
        if (adherantOptional.isPresent()) {
            Adherant adherant = adherantOptional.get();

            // Vérification si le nouveau matricule existe déjà pour un autre adhérent
            if (!adherant.getMatricule().equals(nouvelAdherent.getMatricule()) && adherantRepository.existsByMatricule(nouvelAdherent.getMatricule())) {
                throw new RuntimeException("Un adhérent avec le même matricule existe déjà");
            }

            // Vérification si le nouveau CIN existe déjà pour un autre adhérent
            if (!adherant.getCin().equals(nouvelAdherent.getCin()) && adherantRepository.existsByCin(nouvelAdherent.getCin())) {
                throw new RuntimeException("Un adhérent avec le même CIN existe déjà");
            }

            // Récupération de l'assurance
            Assurance assurance = assuranceRepository.findById(idAssurance)
                    .orElseThrow(() -> new RuntimeException("Assurance introuvable"));

            // Mise à jour des informations de l'adhérent
            adherant.setNom(nouvelAdherent.getNom());
            adherant.setPrenom(nouvelAdherent.getPrenom());
            adherant.setMatricule(nouvelAdherent.getMatricule());
            adherant.setCin(nouvelAdherent.getCin());
            adherant.setSexe(nouvelAdherent.getSexe());
            adherant.setDateNais(nouvelAdherent.getDateNais());
            adherant.setGouvNais(nouvelAdherent.getGouvNais());
            adherant.setPaysNais(nouvelAdherent.getPaysNais());
            adherant.setNumtel(nouvelAdherent.getNumtel());
            adherant.setPlafond(nouvelAdherent.getPlafond());
            adherant.setAssurance(assurance);

            return adherantRepository.save(adherant);
        } else {
            throw new RuntimeException("Adhérent introuvable");
        }
    }

}
