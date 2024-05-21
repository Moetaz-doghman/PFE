package com.example.projectPfe.Services;

import com.example.projectPfe.Services.Interface.PrestationService;
import com.example.projectPfe.dto.CalculationRequest;
import com.example.projectPfe.dto.CalculationResponse;
import com.example.projectPfe.models.*;
import com.example.projectPfe.repository.*;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@RequiredArgsConstructor
public class PrestationServiceImplm implements PrestationService {


    private final UserRepository utilisateurRepository ;

    private final AdherantRepository adherantRepo ;

    private final PrestationRepository prestationRepository ;

    private final UtilisateurRepository user_repo ;

    private final BeneficiairRepository bene_repo ;

    private final ActeDentaireRepository acteDentaireRepository ;

    private final BeneficiairRepository beneficiairRepository ;

    private final AssuranceRepository assuranceRepository;


    private final JavaMailSender emailSender;


    @Override
    public Prestation affecterContreVisite(int prestationId, int userId) {
        Prestation prestation = prestationRepository.findById(prestationId)
                .orElseThrow(() -> new EntityNotFoundException("Prestation not found with id: " + prestationId));

        Adherant adherant = prestation.getAdherant();

        Utilisateur user = user_repo.findById(userId)
                .orElseThrow (() ->  new EntityNotFoundException("Utilisateur not found with id: " + userId));

        if(prestation.isContreVisite()) {
            prestation.setIdUserControlleur(userId);
            sendContreVisiteEmail(user.getEmail(), prestation);
            sendPrestationDetailsEmailForAdherant(user.getEmail(), user);
            return prestationRepository.save(prestation);
        }
        return null;
    }

    public void sendPrestationDetailsEmailForAdherant(String recipientEmail, Utilisateur user) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("hbaieb.houssem999@gmail.com");
        message.setTo(recipientEmail);
        message.setSubject("Votre prestation nécessite une contre-visite");

        String messageText = "Cher(e) adhérant(e),\n\n" +
                "Vous avez une contre visite chez " + user.getNom() + " " + user.getPrenom() + "\n" +
                "Adresse: " + user.getAdresse() + "\n" +
                "Numéro de téléphone: " + user.getTel() + "\n" +
                "\nCordialement,\n" +
                "Équipe de I_way";
        message.setText(messageText);
        emailSender.send(message);
    }

    public void sendContreVisiteEmail(String recipientEmail, Prestation prestation) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("hbaieb.houssem999@gmail.com");
        message.setTo(recipientEmail);
        message.setSubject("Contre-visite requise");

        StringBuilder messageText = new StringBuilder();
        messageText.append("Cher professionnel de santé,\n\n")
                .append("Vous avez une nouvelle contre-visite.\n");

        Adherant adherant = prestation.getAdherant();
        if (adherant != null) {
            messageText.append("Informations de l'adhérant :\n")
                    .append("Nom: ").append(adherant.getNom()).append("\n")
                    .append("Prénom: ").append(adherant.getPrenom()).append("\n")
                    .append("Date de naissance: ").append(adherant.getDateNais()).append("\n");
        }

        String beneficiaireId = prestation.getBeneficiaireId();
        if (beneficiaireId != null) {
            Beneficiaire beneficiaire = beneficiairRepository.findById(Integer.parseInt(beneficiaireId))
                    .orElseThrow(() -> new EntityNotFoundException("Beneficiaire not found with id: " + beneficiaireId));

            messageText.append("Informations du bénéficiaire :\n")
                    .append("Nom: ").append(beneficiaire.getNom()).append("\n")
                    .append("Prénom: ").append(beneficiaire.getPrenom()).append("\n")
                    .append("Sexe: ").append(beneficiaire.getSexe()).append("\n")
                    .append("Date de naissance: ").append(beneficiaire.getDateNais()).append("\n")
                    .append("Qualité: ").append(beneficiaire.getQualite()).append("\n");
        }

        messageText.append("\nCordialement,\n")
                .append("Équipe de I_way");
        message.setText(messageText.toString());
        emailSender.send(message);
    }




    @Override
    public Prestation ajouterPrestationContreVisite(int idPrestationOrdinaire, int  adherantId , int userId , Efavore favore) {

        Prestation prestationOrdinaire = prestationRepository.findById(idPrestationOrdinaire)
                .orElseThrow(() -> new RuntimeException("Prestation ordinaire introuvable"));

        Adherant adherant = adherantRepo.findById(adherantId)
                .orElseThrow(() -> new RuntimeException("Adhérant introuvable"));

        Utilisateur user = utilisateurRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));

        if (user.getId() != prestationOrdinaire.getIdUserControlleur()) {
            throw new RuntimeException("Utilisateur non autorisé à ajouter une prestation contre visite.");
        }


        float prixPrestation = 15;
        float plafond = adherant.getPlafond();
        float nouveauPlafond = plafond - prixPrestation;

        if (nouveauPlafond < 0) {
            throw new RuntimeException("Plafond de l'adhérent insuffisant pour ajouter la prestation contre visite.");
        }

        if(prestationOrdinaire.getFavore()!= null)
        {
            throw new RuntimeException("vous fete déja la contre visite");

        }

        adherant.setPlafond(nouveauPlafond);
        adherantRepo.save(adherant);
        prestationOrdinaire.setFavore(favore);
        prestationRepository.save(prestationOrdinaire);
        Prestation prestationContreVisite = new Prestation();
        prestationContreVisite.setRef(genererRef());
        prestationContreVisite.setRefNumber(genererRefNumber());
        prestationContreVisite.setIdPrestation(String.valueOf(idPrestationOrdinaire));
        prestationContreVisite.setDescription("Prestation contre visite");
        prestationContreVisite.setDateCreation(new Date());
        prestationContreVisite.setEtat(false);
        prestationContreVisite.setStatut(true);
        prestationContreVisite.setMontantTotal(15);
        prestationContreVisite.setMontantRembourse(15);
        prestationContreVisite.setMontant_ticket_moderateur(0);
        prestationContreVisite.setAdherant(adherant);
        prestationContreVisite.setUser(user);
        prestationContreVisite.setType(EPrest.Contre_visite);
        return prestationRepository.save(prestationContreVisite);


    }

    @Override
    public Prestation ajouterPrestationContreVisitePourDentiste(int idPrestationOrdinaire, int  adherantId , int userId , Efavore favore) {

        Prestation prestationOrdinaire = prestationRepository.findById(idPrestationOrdinaire)
                .orElseThrow(() -> new RuntimeException("Prestation ordinaire introuvable"));

        Adherant adherant = adherantRepo.findById(adherantId)
                .orElseThrow(() -> new RuntimeException("Adhérant introuvable"));

        Utilisateur user = utilisateurRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));

        if (user.getId() != prestationOrdinaire.getIdUserControlleur()) {
            throw new RuntimeException("Utilisateur non autorisé à ajouter une prestation contre visite.");
        }


        float prixPrestation = 15;
        float plafond = adherant.getPlafond();
        float nouveauPlafond = plafond - prixPrestation;

        if (nouveauPlafond < 0) {
            throw new RuntimeException("Plafond de l'adhérent insuffisant pour ajouter la prestation contre visite.");
        }

        if(prestationOrdinaire.getFavore()!= null)
        {
            throw new RuntimeException("vous fete déja la contre visite");

        }

        adherant.setPlafond(nouveauPlafond);
        adherantRepo.save(adherant);
        prestationOrdinaire.setFavore(favore);
        prestationRepository.save(prestationOrdinaire);
        Prestation prestationContreVisite = new Prestation();
        prestationContreVisite.setRef(genererRef());
        prestationContreVisite.setRefNumber(genererRefNumber());
        prestationContreVisite.setIdPrestation(String.valueOf(idPrestationOrdinaire));
        prestationContreVisite.setDescription("Prestation contre visite");
        prestationContreVisite.setDateCreation(new Date());
        prestationContreVisite.setEtat(false);
        prestationContreVisite.setStatut(true);
        prestationContreVisite.setMontantTotal(15);
        prestationContreVisite.setMontantRembourse(15);
        prestationContreVisite.setMontant_ticket_moderateur(0);
        prestationContreVisite.setAdherant(adherant);
        prestationContreVisite.setUser(user);
        prestationContreVisite.setType(EPrest.Contre_visite);

        Set<ActeDentaire> actesOrdinaire = prestationOrdinaire.getActes();
        prestationContreVisite.setActes(new HashSet<>(actesOrdinaire));

        return prestationRepository.save(prestationContreVisite);


    }

    @Override
    public Prestation ajouterPrestationContreVisitePourBeneficiaire(int idPrestationOrdinaire, int beneficiaireID, int adherantId, int userId, Efavore favore) {
        Prestation prestationOrdinaire = prestationRepository.findById(idPrestationOrdinaire)
                .orElseThrow(() -> new RuntimeException("Prestation ordinaire introuvable"));

        Adherant adherant = adherantRepo.findById(adherantId)
                .orElseThrow(() -> new RuntimeException("Adhérant introuvable"));

        Beneficiaire beneficiaire = beneficiairRepository.findById(beneficiaireID)
                .orElseThrow(() -> new RuntimeException("bénéficiaire  introuvable"));

        Utilisateur user = utilisateurRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));

        if (user.getId() != prestationOrdinaire.getIdUserControlleur()) {
            throw new RuntimeException("Utilisateur non autorisé à ajouter une prestation contre visite.");
        }

        float prixPrestation = 15;
        float plafond = beneficiaire.getPlafond();
        float nouveauPlafond = plafond - prixPrestation;

        if (nouveauPlafond < 0) {
            throw new RuntimeException("Plafond de l'adhérent insuffisant pour ajouter la prestation contre visite.");
        }

        if(prestationOrdinaire.getBeneficiaireId()== null)
        {
            throw new RuntimeException("beneficiare introuvable");

        }

        if(prestationOrdinaire.getFavore()!= null)
        {
            throw new RuntimeException("vous fete déja la contre visite");

        }

        beneficiaire.setPlafond(nouveauPlafond);
        beneficiairRepository.save(beneficiaire);
        prestationOrdinaire.setFavore(favore);
        prestationRepository.save(prestationOrdinaire);
        Prestation prestationContreVisite = new Prestation();
        prestationContreVisite.setRef(genererRef());
        prestationContreVisite.setRefNumber(genererRefNumber());
        prestationContreVisite.setDescription("Prestation contre visite");
        prestationContreVisite.setDateCreation(new Date());
        prestationContreVisite.setEtat(false);
        prestationContreVisite.setBeneficiaireId(String.valueOf(beneficiaireID));
        prestationContreVisite.setIdPrestation(String.valueOf(idPrestationOrdinaire));
        prestationContreVisite.setStatut(true);
        prestationContreVisite.setMontantTotal(15);
        prestationContreVisite.setAdherant(adherant);
        prestationContreVisite.setUser(user);
        prestationContreVisite.setType(EPrest.Contre_visite);
        return prestationRepository.save(prestationContreVisite);
    }


    @Override
    public Prestation ajouterPrestationContreVisitePourBeneficiaireDentiste(int idPrestationOrdinaire, int beneficiaireID, int adherantId, int userId, Efavore favore) {
        Prestation prestationOrdinaire = prestationRepository.findById(idPrestationOrdinaire)
                .orElseThrow(() -> new RuntimeException("Prestation ordinaire introuvable"));

        Adherant adherant = adherantRepo.findById(adherantId)
                .orElseThrow(() -> new RuntimeException("Adhérant introuvable"));

        Beneficiaire beneficiaire = beneficiairRepository.findById(beneficiaireID)
                .orElseThrow(() -> new RuntimeException("bénéficiaire  introuvable"));

        Utilisateur user = utilisateurRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));

        if (user.getId() != prestationOrdinaire.getIdUserControlleur()) {
            throw new RuntimeException("Utilisateur non autorisé à ajouter une prestation contre visite.");
        }

        float prixPrestation = 15;
        float plafond = beneficiaire.getPlafond();
        float nouveauPlafond = plafond - prixPrestation;

        if (nouveauPlafond < 0) {
            throw new RuntimeException("Plafond de l'adhérent insuffisant pour ajouter la prestation contre visite.");
        }

        if(prestationOrdinaire.getBeneficiaireId()== null)
        {
            throw new RuntimeException("beneficiare introuvable");

        }

        if(prestationOrdinaire.getFavore()!= null)
        {
            throw new RuntimeException("vous fete déja la contre visite");

        }

        beneficiaire.setPlafond(nouveauPlafond);
        beneficiairRepository.save(beneficiaire);
        prestationOrdinaire.setFavore(favore);
        prestationRepository.save(prestationOrdinaire);
        Prestation prestationContreVisite = new Prestation();
        prestationContreVisite.setRef(genererRef());
        prestationContreVisite.setRefNumber(genererRefNumber());
        prestationContreVisite.setDescription("Prestation contre visite");
        prestationContreVisite.setDateCreation(new Date());
        prestationContreVisite.setEtat(false);
        prestationContreVisite.setBeneficiaireId(String.valueOf(beneficiaireID));
        prestationContreVisite.setIdPrestation(String.valueOf(idPrestationOrdinaire));
        prestationContreVisite.setStatut(true);
        prestationContreVisite.setMontantTotal(15);
        prestationContreVisite.setAdherant(adherant);
        prestationContreVisite.setUser(user);
        prestationContreVisite.setType(EPrest.Contre_visite);

        Set<ActeDentaire> actesOrdinaire = prestationOrdinaire.getActes();
        prestationContreVisite.setActes(new HashSet<>(actesOrdinaire));

        return prestationRepository.save(prestationContreVisite);
    }

    @Override
    public Prestation ajouterPrestationOrdinaireOpticien(int adherantId, int userId,
                                                         float sphereD, float axeD, float acuiteD,
                                                         float sphereG, float axeG, float acuiteG,
                                                         float valeurVerreOeilGauche, float valeurVerreOeilDroit,
                                                         float valeurMonture) {

        Utilisateur user = utilisateurRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("utilisateur introuvable"));

        Adherant adherant = adherantRepo.findById(adherantId)
                .orElseThrow(() -> new RuntimeException("adhérant  introuvable"));

        float montantTotal = calculerMontantTotal(valeurVerreOeilGauche, valeurVerreOeilDroit, valeurMonture);

        float montantRembourse = montantTotal - 40;

        Prestation prestationOrdinnaireOpt = new Prestation();
        prestationOrdinnaireOpt.setRef(genererRefOrdinaire());
        prestationOrdinnaireOpt.setRefNumber(genererRefNumberOrdinaire());
        prestationOrdinnaireOpt.setAdherant(adherant);
        prestationOrdinnaireOpt.setUser(user);
        prestationOrdinnaireOpt.setDescription("Prestation ordinnaire opticien");
        prestationOrdinnaireOpt.setDateCreation(new Date());
        prestationOrdinnaireOpt.setEtat(false);
        prestationOrdinnaireOpt.setStatut(true);
        prestationOrdinnaireOpt.setType(EPrest.Ordinaire);
        prestationOrdinnaireOpt.setSphereD(sphereD);
        prestationOrdinnaireOpt.setSphereG(sphereG);
        prestationOrdinnaireOpt.setAxeD(axeD);
        prestationOrdinnaireOpt.setAxeG(axeG);
        prestationOrdinnaireOpt.setAcuiteD(acuiteD);
        prestationOrdinnaireOpt.setAcuiteG(acuiteG);
        prestationOrdinnaireOpt.setValeurVerreOeilGauche(valeurVerreOeilGauche);
        prestationOrdinnaireOpt.setValeurVerreOeilDroit(valeurVerreOeilDroit);
        prestationOrdinnaireOpt.setValeurMonture(valeurMonture);
        prestationOrdinnaireOpt.setMontant_ticket_moderateur(40);
        prestationOrdinnaireOpt.setMontantTotal(montantTotal);
        prestationOrdinnaireOpt.setMontantRembourse(montantRembourse);
        prestationOrdinnaireOpt.setContreVisite(prestationOrdinnaireOpt.getMontantTotal()>200);


        Prestation prestationEnregistree = prestationRepository.save(prestationOrdinnaireOpt);

        return prestationEnregistree;
    }

    @Override
    public Prestation ajouterPrestationBenefOrdinaireOpticien(int adherantId, int userId, int beneficiaireId,
                                                              float sphereD, float axeD, float acuiteD,
                                                              float sphereG, float axeG, float acuiteG,
                                                              float valeurVerreOeilGauche, float valeurVerreOeilDroit,
                                                              float valeurMonture) {

        Beneficiaire beneficiaire = beneficiairRepository.findById(beneficiaireId)
                .orElseThrow(() -> new RuntimeException(" Benef introuvable")) ;

        Adherant adherant = adherantRepo.findById(adherantId)
                .orElseThrow(() -> new RuntimeException("adhérant  introuvable"));

        Utilisateur user = utilisateurRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));

        if (!beneficiaire.getAdherant().equals(adherant)) {
            throw new RuntimeException("Erreur: Le bénéficiaire n'est pas lié à cet adhérent");
        }

        float montantTotal = calculerMontantTotal(valeurVerreOeilGauche, valeurVerreOeilDroit, valeurMonture);
        float montantRembourse = montantTotal - 40;

        // Créer une nouvelle prestation
        Prestation prestation = new Prestation();
        prestation.setRef(genererRefOrdinaire());
        prestation.setRefNumber(genererRefNumberOrdinaire());
        prestation.setAdherant(adherant);
        prestation.setUser(user);
        prestation.setBeneficiaireId(String.valueOf(beneficiaireId));
        prestation.setDescription("Prestation ordinnaire opticien");
        prestation.setDateCreation(new Date());
        prestation.setEtat(false);
        prestation.setStatut(true);
        prestation.setType(EPrest.Ordinaire);
        prestation.setSphereD(sphereD);
        prestation.setSphereG(sphereG);
        prestation.setAxeD(axeD);
        prestation.setAxeG(axeG);
        prestation.setAcuiteD(acuiteD);
        prestation.setAcuiteG(acuiteG);
        prestation.setValeurVerreOeilGauche(valeurVerreOeilGauche);
        prestation.setValeurVerreOeilDroit(valeurVerreOeilDroit);
        prestation.setValeurMonture(valeurMonture);
        prestation.setMontant_ticket_moderateur(40);
        prestation.setMontantTotal(montantTotal);
        prestation.setMontantRembourse(montantRembourse);
        prestation.setContreVisite(prestation.getMontantTotal()>200);



        prestation.setContreVisite(prestation.getMontantTotal()>200);

        float plafond = beneficiaire.getPlafond();
        float nouveauPlafond = plafond - montantTotal;

        if (nouveauPlafond < 0) {
            throw new RuntimeException("Plafond du benéfiçaire insuffisant pour ajouter la prestation contre visite.");
        }

        beneficiaire.setPlafond(nouveauPlafond);

        Prestation prestationEnregistree = prestationRepository.save(prestation);
        return prestationEnregistree;

    }

    @Override
    public List<Prestation> getPrestationsByAdherantAssuranceAndUserController(String assuranceNom, String matricule, int userId) {
        return prestationRepository.findPrestationsByAdherantAssuranceAndUserController(assuranceNom, matricule, userId);
    }

    @Override
    public List<Prestation> getPrestationsContreVisiteByUserController(int userId) {
        return prestationRepository.findContreVisitePrestationsByUserController(userId);
    }

    @Override
    public Optional<Prestation> getPrestationwithid(int id) {
        return prestationRepository.findById(id);
    }

    @Override
    public void ajouterPrestationPourDentiste(int adherantId, float montantTotal, float montantRembourse, float montant_ticket_moderateur, Date dateCreation, String cle_cotation, Set<Eacte> actesDentaires,int userId , int totalCotation) {

        Adherant adherant = adherantRepo.findById(adherantId)
                .orElseThrow(() -> new RuntimeException("adhérant  introuvable"));

        Utilisateur user = utilisateurRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));

        // Créer une nouvelle prestation
        Prestation prestation = new Prestation();
        prestation.setMontantTotal(montantTotal);
        prestation.setMontantRembourse(montantRembourse);
        prestation.setMontant_ticket_moderateur(montant_ticket_moderateur);
        prestation.setDateCreation(dateCreation);
        prestation.setCle_cotation(cle_cotation);
        prestation.setUser(user);
        prestation.setAdherant(adherant);
        prestation.setRef(genererRefOrdinaire());
        prestation.setRefNumber(genererRefNumberOrdinaire());
        prestation.setTotalCotation(totalCotation);
        prestation.setType(EPrest.Ordinaire);
        prestation.setDescription("Prestation ordinnaire dentiste");
        prestation.setType(EPrest.Ordinaire);



        if(prestation.getMontantTotal() > 200){
            prestation.setContreVisite(true);

        }else {
            prestation.setFavore(Efavore.favore);

        }


        float plafond = adherant.getPlafond();
        float nouveauPlafond = plafond - montantTotal;

        if (nouveauPlafond < 0) {
            throw new RuntimeException("Plafond de l'adhérent insuffisant pour ajouter la prestation contre visite.");
        }

        adherant.setPlafond(nouveauPlafond);


        // Ajouter les actes dentaires à la prestation
        Set<ActeDentaire> actes = new HashSet<>();
        for (Eacte eacte : actesDentaires) {
            ActeDentaire acteDentaire = acteDentaireRepository.findByNom(eacte);
            if (acteDentaire == null) {
                acteDentaire = new ActeDentaire();
                acteDentaire.setNom(eacte);
                acteDentaireRepository.save(acteDentaire);
            }
            actes.add(acteDentaire);
        }
        prestation.setActes(actes);

        prestationRepository.save(prestation);
        adherantRepo.save(adherant);

    }


    @Override
    public void ajouterPrestationBenefPourDentiste(int adherantId, float montantTotal, float montantRembourse, float montant_ticket_moderateur, Date dateCreation, String cle_cotation, Set<Eacte> actesDentaires, int beneficiaireId ,int userId , int totalCotation) {

        Beneficiaire beneficiaire = beneficiairRepository.findById(beneficiaireId)
                .orElseThrow(() -> new RuntimeException(" Benef introuvable")) ;

        Adherant adherant = adherantRepo.findById(adherantId)
                .orElseThrow(() -> new RuntimeException("adhérant  introuvable"));

        Utilisateur user = utilisateurRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));

        if (!beneficiaire.getAdherant().equals(adherant)) {
            throw new RuntimeException("Erreur: Le bénéficiaire n'est pas lié à cet adhérent");
        }

        // Créer une nouvelle prestation
        Prestation prestation = new Prestation();
        prestation.setMontantTotal(montantTotal);
        prestation.setMontantRembourse(montantRembourse);
        prestation.setMontant_ticket_moderateur(montant_ticket_moderateur);
        prestation.setDateCreation(dateCreation);
        prestation.setCle_cotation(cle_cotation);
        prestation.setAdherant(adherant);
        prestation.setBeneficiaireId(String.valueOf(beneficiaireId));
        prestation.setUser(user);
        prestation.setRef(genererRefOrdinaire());
        prestation.setRefNumber(genererRefNumberOrdinaire());
        prestation.setTotalCotation(totalCotation);
        prestation.setDescription("Prestation ordinnaire dentiste");
        prestation.setType(EPrest.Ordinaire);



        if(prestation.getMontantTotal() > 200){
            prestation.setContreVisite(true);

        }else {
            prestation.setFavore(Efavore.favore);
        }

        float plafond = beneficiaire.getPlafond();
        float nouveauPlafond = plafond - montantTotal;

        if (nouveauPlafond < 0) {
            throw new RuntimeException("Plafond du benéfiçaire insuffisant pour ajouter la prestation contre visite.");
        }

        beneficiaire.setPlafond(nouveauPlafond);

        // Ajouter les actes dentaires à la prestation
        Set<ActeDentaire> actes = new HashSet<>();
        for (Eacte eacte : actesDentaires) {
            ActeDentaire acteDentaire = acteDentaireRepository.findByNom(eacte);
            if (acteDentaire == null) {
                acteDentaire = new ActeDentaire();
                acteDentaire.setNom(eacte);
                acteDentaireRepository.save(acteDentaire);
            }
            actes.add(acteDentaire);
        }
        prestation.setActes(actes);

        // Enregistrer la prestation
        prestationRepository.save(prestation);
    }

    @Override
    public List<Prestation> getPrestationsWithActes() {
        return prestationRepository.findAllWithActes();

    }

    @Override
    public List<PrestationWithBeneficiaireDTO> getPrestationsWithActesAndBenef() {
        List<Prestation> prestations = prestationRepository.findAllWithActes();
        List<PrestationWithBeneficiaireDTO> dtos = new ArrayList<>();

        for (Prestation prestation : prestations) {
            PrestationWithBeneficiaireDTO dto = new PrestationWithBeneficiaireDTO();
            dto.setId(prestation.getId());
            dto.setDateCreation(prestation.getDateCreation());
            dto.setEtat(prestation.isEtat());
            dto.setStatut(prestation.isStatut());
            dto.setMontantTotal(prestation.getMontantTotal());
            dto.setMontantRembourse(prestation.getMontantRembourse());
            dto.setMontant_ticket_moderateur(prestation.getMontant_ticket_moderateur());
            dto.setType(prestation.getType());
            dto.setCle_cotation(prestation.getCle_cotation());
            dto.setTotalCotation(prestation.getTotalCotation());
            dto.setIdUserControlleur(prestation.getIdUserControlleur());
            dto.setContreVisite(prestation.isContreVisite());
            dto.setAdherant(prestation.getAdherant());
            dto.setUser(prestation.getUser());

            // Si beneficiaireId est non null, rechercher le beneficiaire associé
            if (prestation.getBeneficiaireId() != null) {
                Beneficiaire beneficiaire = beneficiairRepository.findById(Integer.parseInt(prestation.getBeneficiaireId())).orElse(null);
                dto.setBeneficiaire(beneficiaire);
            }

            Set<ActeDentaire> actes = new HashSet<>(prestation.getActes());
            dto.setActes(actes);

            dtos.add(dto);
        }

        return dtos;
    }

    public Set<ActeDentaire> getActesByIdPrestation(String idPrestation) {
        Set<ActeDentaire> actes = acteDentaireRepository.findActesByIdPrestation(idPrestation);
        System.out.println("Les actes associés à la prestation " + idPrestation + " : " + actes);
        return actes;
    }

    @Override
    public List<PrestationWithBeneficiaireDTO> findAllWithActesAndContreVisite(int userId) {
        List<Prestation> prestations = prestationRepository.findAllWithActesAndContreVisite(userId);
        List<PrestationWithBeneficiaireDTO> dtos = new ArrayList<>();

        for (Prestation prestation : prestations) {
            PrestationWithBeneficiaireDTO dto = new PrestationWithBeneficiaireDTO();
            dto.setId(prestation.getId());
            dto.setDateCreation(prestation.getDateCreation());
            dto.setEtat(prestation.isEtat());
            dto.setStatut(prestation.isStatut());
            dto.setMontantTotal(prestation.getMontantTotal());
            dto.setMontantRembourse(prestation.getMontantRembourse());
            dto.setMontant_ticket_moderateur(prestation.getMontant_ticket_moderateur());
            dto.setType(prestation.getType());
            dto.setCle_cotation(prestation.getCle_cotation());
            dto.setTotalCotation(prestation.getTotalCotation());
            dto.setIdUserControlleur(prestation.getIdUserControlleur());
            dto.setContreVisite(prestation.isContreVisite());
            dto.setAdherant(prestation.getAdherant());
            dto.setUser(prestation.getUser());
            dto.setIdPrestation(prestation.getIdPrestation());

            // Si beneficiaireId est non null, rechercher le beneficiaire associé
            if (prestation.getBeneficiaireId() != null) {
                Beneficiaire beneficiaire = beneficiairRepository.findById(Integer.parseInt(prestation.getBeneficiaireId())).orElse(null);
                dto.setBeneficiaire(beneficiaire);
            }

            // Récupérer les actes en utilisant idPrestation
            Set<ActeDentaire> actes = getActesByIdPrestation(prestation.getIdPrestation());
            dto.setActes(actes);

            dtos.add(dto);
        }

        return dtos;
    }

    @Override
    public List<Prestation> findByUserIdAndEtatForcontrolleur(int userId, boolean etat, boolean archive) {
        return prestationRepository.findByUserIdAndEtatAndArchive(userId,  false , false);
    }

    @Override
    public CalculationResponse calculate(CalculationRequest request) {
        CalculationResponse response = new CalculationResponse();

        // Récupération des données de l'assurance
        double prixCotation = request.getTotalCotation();
        Assurance assurance = getAssuranceById(Math.toIntExact(request.getAssuranceId()));
        Adherant adherant = adherantRepo.findById(Math.toIntExact(request.getAdherantId()))
                .orElseThrow(() -> new RuntimeException("adhérant  introuvable"));
        double totalOrdonnance = 0;
        double montantTicketModerateur = 0;
        double montantRembourse = 0;

        // Logique de calcul en fonction des actes sélectionnés
        if (request.getActes().contains("Consultation")) {
            if (request.getActes().contains("Soins Dentaire")) {
                totalOrdonnance = prixCotation * assurance.getPrix_cotation();
            } else if (request.getActes().contains("ODF")) {
                totalOrdonnance = prixCotation * assurance.getPrix_cotationODF();
            } else if (request.getActes().contains("Prothese")) {
                totalOrdonnance = prixCotation * assurance.getPrix_cotationProthese();
            } else {
                totalOrdonnance = 40;
                montantTicketModerateur = 10;
                montantRembourse = 30;
            }
        } else {
            if (request.getActes().contains("Soins Dentaire")) {
                totalOrdonnance = prixCotation * assurance.getPrix_cotation();
            } else if (request.getActes().contains("ODF")) {
                totalOrdonnance = prixCotation * assurance.getPrix_cotationODF();
            } else if (request.getActes().contains("Prothese")) {
                totalOrdonnance = prixCotation * assurance.getPrix_cotationProthese();
            }
        }

        // Calcul par défaut
        if (totalOrdonnance == 0) {
            totalOrdonnance = prixCotation * assurance.getPrix_cotation();
        }
        if (montantTicketModerateur == 0) {
            montantTicketModerateur = 40;
        }
        if (montantRembourse == 0) {
            montantRembourse = totalOrdonnance - montantTicketModerateur;
        }

        // Vérification des plafonds et des valeurs négatives ou nulles
        if (totalOrdonnance > adherant.getPlafond()) {
            totalOrdonnance = adherant.getPlafond();
        }
        montantTicketModerateur = Math.max(0, montantTicketModerateur);
        montantRembourse = Math.max(0, montantRembourse);
        totalOrdonnance = Math.max(0, totalOrdonnance);

        response.setTotalOrdonnance(totalOrdonnance);
        response.setMontantTicketModerateur(montantTicketModerateur);
        response.setMontantRembourse(montantRembourse);

        return response;
    }

    private Assurance getAssuranceById(int assuranceId) {
         return  assuranceRepository.findByIddd(assuranceId);
    }

    @Override
    public PrestationWithBeneficiaireDTO getPrestationsWithActesAndBenefById(int id) {
        Prestation prestation = prestationRepository.findWithIdAndArchive(id);
        if (prestation == null) {
            return null; // Ou une gestion d'erreur appropriée si la prestation n'est pas trouvée
        }

        PrestationWithBeneficiaireDTO dto = new PrestationWithBeneficiaireDTO();
        dto.setId(prestation.getId());
        dto.setDateCreation(prestation.getDateCreation());
        dto.setEtat(prestation.isEtat());
        dto.setStatut(prestation.isStatut());
        dto.setMontantTotal(prestation.getMontantTotal());
        dto.setMontantRembourse(prestation.getMontantRembourse());
        dto.setMontant_ticket_moderateur(prestation.getMontant_ticket_moderateur());
        dto.setType(prestation.getType());
        dto.setCle_cotation(prestation.getCle_cotation());
        dto.setTotalCotation(prestation.getTotalCotation());
        dto.setIdUserControlleur(prestation.getIdUserControlleur());
        dto.setContreVisite(prestation.isContreVisite());
        dto.setAdherant(prestation.getAdherant());
        dto.setUser(prestation.getUser());

        // Si beneficiaireId est non null, rechercher le beneficiaire associé
        if (prestation.getBeneficiaireId() != null) {
            Beneficiaire beneficiaire = beneficiairRepository.findById(Integer.parseInt(prestation.getBeneficiaireId())).orElse(null);
            dto.setBeneficiaire(beneficiaire);
        }

        Set<ActeDentaire> actes = new HashSet<>(prestation.getActes());
        dto.setActes(actes);

        return dto;
    }

    @Override
    public void deletePrestation(int id,float montantTotale) {
    Prestation prestation = prestationRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Prestation not found with id: " + id));

    Adherant adherant = prestation.getAdherant() ;
    adherant.setPlafond(adherant.getPlafond()+montantTotale);
    prestation.setArchive(true);

    prestationRepository.save(prestation);
    adherantRepo.save(adherant);

    }

    @Override
    public void deletePrestationForBenef(int id, float montantTotale) {
    Prestation prestation = prestationRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Prestation not found with id: " + id));

    String beneficiaireId = prestation.getBeneficiaireId();
    Beneficiaire beneficiaire = beneficiairRepository.findById(Integer.valueOf(beneficiaireId))
            .orElseThrow(() -> new RuntimeException("Beneficiaire not found with id: " + id));

    beneficiaire.setPlafond(beneficiaire.getPlafond()+montantTotale);
    prestation.setArchive(true);

    prestationRepository.save(prestation);
    beneficiairRepository.save(beneficiaire);

    }


    @Override
    public void modifierPrestationPourDentiste(int prestationId, float montantTotal, float montantRembourse, float montantTicketModerateur, float totalCotation, String cleCotation, Set<Eacte> actesDentaires) {
        // Récupérer la prestation existante
        Prestation prestation = prestationRepository.findWithIdAndArchive(prestationId);

        if (prestation == null) {
            throw new RuntimeException("erreur appropriée si la prestation n'est pas trouvée.");

        }

        // Modifier les champs spécifiés
        prestation.setMontantTotal(montantTotal);
        prestation.setMontantRembourse(montantRembourse);
        prestation.setMontant_ticket_moderateur(montantTicketModerateur);
        prestation.setTotalCotation((int) totalCotation);
        prestation.setCle_cotation(cleCotation);

        Set <ActeDentaire> actes = new HashSet<>();
        for (Eacte eacte : actesDentaires) {
            ActeDentaire acteDentaire = acteDentaireRepository.findByNom(eacte);
            if (acteDentaire == null) {
                acteDentaire = new ActeDentaire();
                acteDentaire.setNom(eacte);
                acteDentaireRepository.save(acteDentaire);
            }
            actes.add(acteDentaire);
        }
        prestation.setActes(actes);

        prestationRepository.save(prestation);
    }

    @Override
    public boolean canAffectContreVisite(Prestation prestation) {
        if (prestation.getType() != EPrest.Ordinaire) {
            return false;
        }

        if (!prestation.isContreVisite()) {
            return false;
        }

        if (prestation.getIdUserControlleur() != 0) {
            return false;
        }

        return true;
    }

     public List<Prestation> findByUserId(int userId) {
        Utilisateur user = utilisateurRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));

    return  prestationRepository.findByUser(user);
     }

    @Override
    public List<Prestation> findByUserIdAndFavoreAndEtatAndArchive(int userId, Efavore efavore, boolean etat ,boolean archive) {
        return prestationRepository.findByUserIdAndFavoreAndEtatAndArchive(userId, Efavore.favore, false , false);

    }


    @Override
    public List<Prestation> getPrestationsByUserControlleur(int userId) {
        return prestationRepository.findByIdUserControlleur(userId);
    }

    @Override
    public List<Prestation> getPrestationsByUserAndAdherant(int userId,int adherantId) {
        return prestationRepository.findByUserIdAndAdherant_Id(userId,adherantId);
    }

    private String genererRef() {
        int compteur =  incrementCounterForAdherent();
        return "2024presC" +   "(" + compteur + ")";
    }

    private String genererRefOrdinaire() {
        int compteur =  incrementCounterForAdherentOrdinaire();
        return "2024presO" +   "(" + compteur + ")";
    }

    private String genererRefOrdinaireDentiste() {
        int compteur =  incrementCounterForAdherentOrdinaire();
        return "2024presD" +   "(" + compteur + ")";
    }

    private String genererRefNumberOrdinaire() {
        String compteur = String.valueOf(incrementCounterForAdherentOrdinaire());
        return compteur;
    }
    private String genererRefNumber() {
        String compteur = String.valueOf(incrementCounterForAdherent());
        return compteur;
    }

    private float calculerMontantTotal(float valeurVerreOeilGauche, float valeurVerreOeilDroit, float valeurMonture) {
        return valeurVerreOeilGauche + valeurVerreOeilDroit + valeurMonture;
    }


    @Transactional
    public int incrementCounterForAdherent() {
        Integer maxCounter = prestationRepository.findMaxCounterForAdherentContreVisite();
        int newCounter = (maxCounter != null) ? maxCounter + 1 : 1;
        return prestationRepository.updateCounterForAdherentContreVisite( newCounter);
    }

    @Transactional
    public int incrementCounterForAdherentOrdinaire() {
        Integer maxCounter = prestationRepository.findMaxCounterForAdherentOrdinaire();
        int newCounter = (maxCounter != null) ? maxCounter + 1 : 1;
        return prestationRepository.updateCounterForAdherentOrdinaire( newCounter);
    }





    
}
