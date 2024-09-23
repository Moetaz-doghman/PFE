package com.example.projectPfe.Services;

import com.example.projectPfe.Exceptions.BordereauNotFoundException;
import com.example.projectPfe.Services.Interface.BordereauService;
import com.example.projectPfe.models.Bordereaux;
import com.example.projectPfe.models.EPrest;
import com.example.projectPfe.models.EstatusBord;
import com.example.projectPfe.models.Prestation;
import com.example.projectPfe.repository.BordereauxRepository;
import com.example.projectPfe.repository.PrestationRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class BordereauServiceImpm implements BordereauService {

    private final PrestationRepository prestationRepository ;

    private final BordereauxRepository bordereauxRepository ;

    @Override
    public Bordereaux genererBordereau(List<Integer> prestationsIds) {
        List<Prestation> prestations = prestationRepository.findAllById(prestationsIds);
        int nbPrestations = prestations.size();
        float montantTotal = 0;
        float montantRemboursable = 0;
        float montantTicketModerateur = 0;
        Date dateCreation = new Date();
        EPrest type = EPrest.Ordinaire;
        EstatusBord status = EstatusBord.EN_ATTENTE;


        for (Prestation prestation : prestations) {
            montantTotal += prestation.getMontantTotal();
            montantRemboursable += prestation.getMontantRembourse();
            montantTicketModerateur += prestation.getMontant_ticket_moderateur();
            prestation.setEtat(true);
            if (prestation.getType() == EPrest.Contre_visite) {
                type = EPrest.Contre_visite;
            }
        }

        Bordereaux bordereau = Bordereaux.builder()
                .ref("Référence")
                .refNumber("Numéro de référence")
                .numFacture("Numéro de facture")
                .dateCreationF(dateCreation)
                .nbPrestation(nbPrestations)
                .montant_total(montantTotal)
                .montant_total_Remboursable(montantRemboursable)
                .montant_ticket_moderateur(montantTicketModerateur)
                .status(status)
                .type(type)
                .prestations(new HashSet<>(prestations))
                .build();

        if(bordereau.getType() == EPrest.Contre_visite)

        {

            bordereau.setRef(genererRef());
            bordereau.setRefNumber(genererRefNumber());
            bordereau.setNumFacture(genererRefNumber());

        }

        if(bordereau.getType() == EPrest.Ordinaire)

        {

            bordereau.setRef(genererRefOrdinaire());
            bordereau.setRefNumber(genererRefNumberOrdinaire());
            bordereau.setNumFacture(genererRefNumberOrdinaire());

        }


        Bordereaux savedBordereau = bordereauxRepository.save(bordereau);

        for (Prestation prestation : prestations)

        {   prestation.setBordereau(savedBordereau);  }

        prestationRepository.saveAll(prestations);

        return savedBordereau;
    }


    @Override
    public Bordereaux findById(int id) {
        Bordereaux bordereaux =  bordereauxRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("bordereaux not found "));
        return bordereaux;
    }

    @Override
    public List<Bordereaux> findAll() {
        return bordereauxRepository.findAll();
    }

    @Override
    public List<Bordereaux> getBordereauxByUserId(int userId) {
        return bordereauxRepository.findByUserId(userId);
    }

    @Override
    public void deleteBordereauById(int bordereauId) {

        Optional<Bordereaux> optionalBordereau = bordereauxRepository.findById(bordereauId);

        if (optionalBordereau.isPresent()) {
            Bordereaux bordereau = optionalBordereau.get();

            for (Prestation prestation : bordereau.getPrestations()) {
                prestation.setEtat(false);
                prestation.setBordereau(null);
            }

            prestationRepository.saveAll(bordereau.getPrestations());
            bordereau.setPrestations(null);

            bordereauxRepository.delete(bordereau);
        } else {
            throw new BordereauNotFoundException("Bordereau not found with id: " + bordereauId);
        }


    }

    @Override
    public void changerStatutBordereau(int id, EstatusBord nouveauStatut) {
    Optional<Bordereaux> optionalBordereau = bordereauxRepository.findById(id);
    if (optionalBordereau.isPresent()) {
        Bordereaux bordereau = optionalBordereau.get();
        bordereau.setStatus(nouveauStatut);
        bordereauxRepository.save(bordereau);
    } else {
        throw new RuntimeException("Aucun bordereau trouvé avec l'ID : " + id);
    }
    }

    private String genererRef() {
        int compteur =  incrementCounterForAdherent();
        return "2024FactC" +   "(" + compteur + ")";
    }

    private String genererRefOrdinaire() {
        int compteur =  incrementCounterForAdherentOrdinaire();
        return "2024FactO" +   "(" + compteur + ")";
    }

    private String genererRefNumberOrdinaire() {
        String compteur = String.valueOf(incrementCounterForAdherentOrdinaire());
        return compteur;
    }
    private String genererRefNumber() {
        String compteur = String.valueOf(incrementCounterForAdherent());
        return compteur;
    }

    @Transactional
    public int incrementCounterForAdherent() {
        Integer maxCounter = bordereauxRepository.findMaxCounterForAdherentContreVisite();
        int newCounter = (maxCounter != null) ? maxCounter + 1 : 1;
        return bordereauxRepository.updateCounterForAdherentContreVisite( newCounter);
    }

    @Transactional
    public int incrementCounterForAdherentOrdinaire() {
        Integer maxCounter = bordereauxRepository.findMaxCounterForAdherentOrdinaire();
        int newCounter = (maxCounter != null) ? maxCounter + 1 : 1;
        return bordereauxRepository.updateCounterForAdherentOrdinaire( newCounter);
    }




}
