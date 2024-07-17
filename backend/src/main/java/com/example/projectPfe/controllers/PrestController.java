package com.example.projectPfe.controllers;

import com.example.projectPfe.Exceptions.ErrorResponse;
import com.example.projectPfe.Services.PrestationServiceImplm;
import com.example.projectPfe.dto.CalculationRequest;
import com.example.projectPfe.dto.CalculationResponse;
import com.example.projectPfe.models.*;
import com.example.projectPfe.repository.PrestationRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.text.SimpleDateFormat;
import java.util.*;
import java.util.logging.Level;
import java.util.logging.Logger;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/prest")
@RequiredArgsConstructor
public class PrestController {

    private final PrestationServiceImplm prestationServices;

    private final PrestationRepository prestation_repo;

    @PutMapping("/affecter-contre-visite/{prestationId}/{userId}")
    public ResponseEntity<String> affecterContreVisite(
            @PathVariable int prestationId,
            @PathVariable int userId
    ) {
        try {
            Prestation prestation = prestationServices.affecterContreVisite(prestationId, userId);
            return new ResponseEntity<>( HttpStatus.OK);
        } catch (EntityNotFoundException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<String>( e.getMessage() ,HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/contre-visite/{userId}")
    public ResponseEntity<String> ajouterPrestationContreVisite(
            @RequestParam int idPrestationOrdinaire,
            @RequestParam int adherantId,
                @PathVariable int userId,
            @RequestParam Efavore favore
    ) {
        try {
            Prestation prestation = prestationServices.ajouterPrestationContreVisite(idPrestationOrdinaire, adherantId, userId, favore);
            return new ResponseEntity<>("",  HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>("" + e.getMessage() ,HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/contre-visitePourDentiste/{userId}")
    public ResponseEntity<String> ajouterPrestationContreVisitePourDentiste(
            @RequestParam int idPrestationOrdinaire,
            @RequestParam int adherantId,
            @PathVariable int userId,
            @RequestParam Efavore favore
    ) {
        try {
            Prestation prestation = prestationServices.ajouterPrestationContreVisitePourDentiste(idPrestationOrdinaire, adherantId, userId, favore);
            return new ResponseEntity<>("",  HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>("" + e.getMessage() ,HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/contre-visitePourBénéficiare/{userId}/beneficiaire")
    public ResponseEntity<Prestation> ajouterPrestationContreVisitePourBeneficiaire(
            @PathVariable int userId,
            @RequestParam int beneficiaireId,
            @RequestParam int idPrestationOrdinaire,
            @RequestParam int adherantId,
            @RequestParam Efavore favore) {
        try {
            Prestation prestation = prestationServices.ajouterPrestationContreVisitePourBeneficiaire(
                    idPrestationOrdinaire,
                    beneficiaireId,
                    adherantId,
                    userId,
                    favore
            );
            return new ResponseEntity<>(prestation, HttpStatus.CREATED);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/contre-visitePourBénéficiareDentiste/{userId}/beneficiaire")
    public ResponseEntity<Prestation> ajouterPrestationContreVisitePourBeneficiaireDentiste(
            @PathVariable int userId,
            @RequestParam int beneficiaireId,
            @RequestParam int idPrestationOrdinaire,
            @RequestParam int adherantId,
            @RequestParam Efavore favore) {
        try {
            Prestation prestation = prestationServices.ajouterPrestationContreVisitePourBeneficiaireDentiste(
                    idPrestationOrdinaire,
                    beneficiaireId,
                    adherantId,
                    userId,
                    favore
            );
            return new ResponseEntity<>(prestation, HttpStatus.CREATED);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    @GetMapping("/contre-visite/prestations/{userId}")
    public ResponseEntity<List<Prestation>> getPrestationsByUserControlleur(@PathVariable int userId) {
        try {
            List<Prestation> prestations = prestationServices.getPrestationsContreVisiteByUserController(userId);
            return new ResponseEntity<>(prestations, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/prestationOrdOpt")
    public Prestation ajouterPrestation(@RequestParam int adherantId,
                                        @RequestParam int userId,
                                        @RequestParam float sphereD,
                                        @RequestParam float axeD,
                                        @RequestParam float acuiteD,
                                        @RequestParam float sphereG,
                                        @RequestParam float axeG,
                                        @RequestParam float acuiteG,
                                        @RequestParam float valeurVerreOeilGauche,
                                        @RequestParam float valeurVerreOeilDroit,
                                        @RequestParam float valeurMonture) {
        return prestationServices.ajouterPrestationOrdinaireOpticien(adherantId, userId,
                sphereD, axeD, acuiteD,
                sphereG, axeG, acuiteG,
                valeurVerreOeilGauche, valeurVerreOeilDroit,
                valeurMonture);
    }
    @PostMapping("/prestationBenfOrdOpt")
    public Prestation ajouterPrestationBenf(@RequestParam int adherantId,
                                        @RequestParam int userId,
                                        @RequestParam int beneficiaireId,
                                        @RequestParam float sphereD,
                                        @RequestParam float axeD,
                                        @RequestParam float acuiteD,
                                        @RequestParam float sphereG,
                                        @RequestParam float axeG,
                                        @RequestParam float acuiteG,
                                        @RequestParam float valeurVerreOeilGauche,
                                        @RequestParam float valeurVerreOeilDroit,
                                        @RequestParam float valeurMonture) {
        return prestationServices.ajouterPrestationBenefOrdinaireOpticien(adherantId, userId,
                beneficiaireId,
                sphereD, axeD, acuiteD,
                sphereG, axeG, acuiteG,
                valeurVerreOeilGauche, valeurVerreOeilDroit,
                valeurMonture);
    }


    @GetMapping("/prestationsContrevistebyUserController")
    public ResponseEntity<List<Prestation>> getPrestationsByAdherantAssuranceAndUserController(
            @RequestParam String assuranceNom,
            @RequestParam String matricule,
            @RequestParam int userId) {

        List<Prestation> prestations = prestationServices.getPrestationsByAdherantAssuranceAndUserController(assuranceNom, matricule, userId);
        return new ResponseEntity<>(prestations, HttpStatus.OK);
    }




    @PostMapping("/prestationDentiste")
    public ResponseEntity<String> ajouterPrestationPourDentiste(
            @RequestParam int adherantId,
            @RequestParam float montantTotal,
            @RequestParam float montantRembourse,
            @RequestParam float montant_ticket_moderateur,
            @RequestParam String dateCreation,
            @RequestParam String cle_cotation,
            @RequestParam Set<Eacte> actesDentaires,
            @RequestParam int userId,
            @RequestParam int totalCotation) {
        try {
            // Convertir la date de création de String à Date
            SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
            Date dateCreationParsed = dateFormat.parse(dateCreation);

            List<String> actesDentairesList = actesDentaires.stream()
                    .map(Eacte::name) // Supposons que le nom de l'acte soit accessible via la méthode name()
                    .collect(Collectors.toList());

                String actesDentairesStr = String.join(",", actesDentairesList);

            List<String> actesDentairesListSplitted = Arrays.asList(actesDentairesStr.split(","));

            Set<Eacte> actesDentairesSet = actesDentairesListSplitted.stream()
                    .map(Eacte::valueOf) // Supposons que vous ayez une méthode valueOf() dans la classe Eacte pour convertir une chaîne en Eacte
                    .collect(Collectors.toSet());


            prestationServices.ajouterPrestationPourDentiste(
                    adherantId,
                    montantTotal,
                    montantRembourse,
                    montant_ticket_moderateur,
                    dateCreationParsed,
                    cle_cotation,
                    actesDentairesSet,
                    userId,
                    totalCotation
            );

            return new ResponseEntity<>("", HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>("" + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/adherantBenef/prestationDentiste")
    public ResponseEntity<String> ajouterPrestationBenefPourDentiste(
            @RequestParam int adherantId,
            @RequestParam float montantTotal,
            @RequestParam float montantRembourse,
            @RequestParam float montant_ticket_moderateur,
            @RequestParam String dateCreation,
            @RequestParam String cle_cotation,
            @RequestParam Set<Eacte> actesDentaires,
            @RequestParam int beneficiaireId,
            @RequestParam int userId,
            @RequestParam int totalCotation) {
        try {
            SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
            Date dateCreationParsed = dateFormat.parse(dateCreation);
            List<String> actesDentairesList = actesDentaires.stream()
                    .map(Eacte::name)
                    .collect(Collectors.toList());
            String actesDentairesStr = String.join(",", actesDentairesList);
            List<String> actesDentairesListSplitted = Arrays.asList(actesDentairesStr.split(","));
            Set<Eacte> actesDentairesSet = actesDentairesListSplitted.stream()
                    .map(Eacte::valueOf)
                    .collect(Collectors.toSet());
            prestationServices.ajouterPrestationBenefPourDentiste(
                    adherantId,
                    montantTotal,
                    montantRembourse,
                    montant_ticket_moderateur,
                    dateCreationParsed,
                    cle_cotation,
                    actesDentairesSet,
                    beneficiaireId,
                    userId,
                    totalCotation
            );
            return new ResponseEntity<>( HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>("" + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/prestations-with-actes")
    public List<Prestation> getPrestationsWithActes() {
        return prestationServices.getPrestationsWithActes();
    }


    @GetMapping("/findAllWithActesAndContreVisite/{userId}")
    public List<PrestationWithBeneficiaireDTO> findAllWithActesAndContreVisite(@PathVariable int userId) {
        return prestationServices.findAllWithActesAndContreVisite(userId);
    }

    @GetMapping("/withActesAndBenef")
    public List<PrestationWithBeneficiaireDTO> getPrestationsWithActesAndBenef() {
        return prestationServices.getPrestationsWithActesAndBenef();
    }

    @GetMapping("/withActesAndBenefAndTypeContreVisite")
    public List<PrestationWithBeneficiaireDTO> getPrestationsWithActesAndBenefAndTypeContreVisite() {
        return prestationServices.getPrestationsWithActesAndBenefAndTypeContreVisite();
    }

    @GetMapping("/withActesAndBenef/{id}")
    public PrestationWithBeneficiaireDTO getPrestationsWithActesAndBenefById(@PathVariable int id) {
        return prestationServices.getPrestationsWithActesAndBenefById(id);

    }

    @DeleteMapping("deletePrestation/{id}/{montantTotale}")
    public void deletePrestation(@PathVariable int id,@PathVariable float montantTotale )
    {
        prestationServices.deletePrestation(id,montantTotale);
    }

    @DeleteMapping("deletePrestationForBenef/{id}/{montantTotale}")
    public void deletePrestationForBenef(@PathVariable int id,@PathVariable float montantTotale)
    {
        prestationServices.deletePrestationForBenef(id,montantTotale);
    }

    @PostMapping("/adherant/modifierPrestationDentiste")
    public ResponseEntity<String> modifierPrestationPourDentiste(
            @RequestParam int prestationId,
            @RequestParam float montantTotal,
            @RequestParam float montantRembourse,
            @RequestParam float montantTicketModerateur,
            @RequestParam float totalCotation,
            @RequestParam String cleCotation,
            @RequestParam Set<Eacte> actesDentaires) {

        List<String> actesDentairesList = actesDentaires.stream()
                .map(Eacte::name)
                .collect(Collectors.toList());
        String actesDentairesStr = String.join(",", actesDentairesList);
        List<String> actesDentairesListSplitted = Arrays.asList(actesDentairesStr.split(","));
        Set<Eacte> actesDentairesSet = actesDentairesListSplitted.stream()
                .map(Eacte::valueOf)
                .collect(Collectors.toSet());
        try {
            prestationServices.modifierPrestationPourDentiste(
                    prestationId,
                    montantTotal,
                    montantRembourse,
                    montantTicketModerateur,
                    totalCotation,
                    cleCotation,
                    actesDentairesSet
            );

            return new ResponseEntity<>("", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("" + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    @GetMapping("/findByUserIdAndFavoreAndEtat/{userId}")
    public List<Prestation> findByUserIdAndFavoreAndEtat(@PathVariable int userId) {
        return prestationServices.findByUserIdAndFavoreAndEtatAndArchive(userId ,Efavore.favore ,false , false);

    }


    @GetMapping("/findByUserIdAndEtat/{userId}")
    public List<Prestation> findByUserIdAndEtat(@PathVariable int userId) {
        return prestationServices.findByUserIdAndEtatForcontrolleur(userId ,false , false);

    }

    @GetMapping("/findByUserId/{userId}")
    public List<Prestation> findByUserId(@PathVariable int userId) {
        return prestationServices.findByUserId(userId);

    }

    @GetMapping("/findByUserIdAndAdherant/{userId}/{adherantId}")
    public List<Prestation> findByUserId(@PathVariable int userId , @PathVariable int adherantId) {
        return prestationServices.getPrestationsByUserAndAdherant(userId,adherantId);

    }

    @GetMapping("/can-affect-contre-visite/{prestationId}")
    public Boolean canAffectContreVisite(@PathVariable int prestationId) {
        try {
            Prestation prestation = prestation_repo.findById(prestationId).orElse(null);
            boolean result = prestationServices.canAffectContreVisite(prestation);
            return result;

    } catch (Exception e) {
            throw new RuntimeException(e);
        }  }


    @GetMapping("byId/{id}")
    public ResponseEntity<Prestation> getPrestationwitid(@PathVariable int id) {
        Optional<Prestation> prestationOptional = prestationServices.getPrestationwithid(id);
        if (prestationOptional.isPresent()) {
            return ResponseEntity.ok().body(prestationOptional.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/calculate")
    public ResponseEntity<?> calculate(@RequestBody CalculationRequest request) {
        try {
            CalculationResponse response = prestationServices.calculate(request);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            // Log the exception for debugging
            Logger.getLogger(PrestController.class.getName()).log(Level.SEVERE, null, e);
            // Return a more descriptive error response to the client
            ErrorResponse errorResponse = new ErrorResponse(e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }





}
