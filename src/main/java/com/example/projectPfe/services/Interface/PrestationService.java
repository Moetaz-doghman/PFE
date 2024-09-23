package com.example.projectPfe.Services.Interface;

import com.example.projectPfe.dto.CalculationRequest;
import com.example.projectPfe.dto.CalculationResponse;
import com.example.projectPfe.models.*;

import java.util.List;
import java.util.Date;
import java.util.Optional;
import java.util.Set;


public interface PrestationService {
    Prestation affecterContreVisite (int prestationId, int userId);

    Prestation ajouterPrestationContreVisite(int idPrestationOrdinaire, int  adherantId , int userId, Efavore favore);
    Prestation ajouterPrestationContreVisitePourBeneficiaire(int idPrestationOrdinaire, int  beneficiaireID , int adherantId , int userId, Efavore favore);
    public List<Prestation> getPrestationsByUserControlleur(int userId);

    public List<Prestation> getPrestationsByUserAndAdherant(int userId,int adherantId);
    Prestation ajouterPrestationOrdinaireOpticien(int adherantId , int userId,
                                                  float sphereD, float axeD, float acuiteD,
                                                  float sphereG, float axeG, float acuiteG,
                                                  float valeurVerreOeilGauche, float valeurVerreOeilDroit,
                                                  float valeurMonture);

    Prestation ajouterPrestationBenefOrdinaireOpticien(int adherantId , int userId, int beneficiaireId,
                                                  float sphereD, float axeD, float acuiteD,
                                                  float sphereG, float axeG, float acuiteG,
                                                  float valeurVerreOeilGauche, float valeurVerreOeilDroit,
                                                  float valeurMonture);

    public List<Prestation> getPrestationsByAdherantAssuranceAndUserController(String assuranceNom, String matricule, int userId);
    public List<Prestation> getPrestationsContreVisiteByUserController(int userId);


    Optional<Prestation> getPrestationwithid(int id);



    public void ajouterPrestationPourDentiste(int adherantId, float montantTotal, float montantRembourse,
                                        float montant_ticket_moderateur, Date dateCreation,
                                        String cle_cotation, Set<Eacte> actesDentaires ,int userId , int totalCotation );

    public void ajouterPrestationBenefPourDentiste(int adherantId, float montantTotal, float montantRembourse,
                                              float montant_ticket_moderateur, Date dateCreation,
                                              String cle_cotation, Set<Eacte> actesDentaires , int beneficiaireId,
                                                   int userId, int totalCotation );

    public List<Prestation> getPrestationsWithActes() ;

    public List<PrestationWithBeneficiaireDTO> getPrestationsWithActesAndBenef() ;

    public List<PrestationWithBeneficiaireDTO> getPrestationsWithActesAndBenefAndTypeContreVisite() ;

    public PrestationWithBeneficiaireDTO getPrestationsWithActesAndBenefById(int id) ;

    public void deletePrestation(int id,float montantTotale) ;

    public void deletePrestationForBenef(int id,float montantTotale) ;


    public void modifierPrestationPourDentiste(int prestationId, float montantTotal, float montantRembourse, float montantTicketModerateur, float totalCotation, String cleCotation, Set<Eacte> actesDentaires) ;

    public boolean canAffectContreVisite(Prestation prestation);
    public List<Prestation> findByUserId(int userId);

    List<Prestation> findByUserIdAndFavoreAndEtatAndArchive(int userId , Efavore efavore , boolean etat , boolean archive);

    public List<PrestationWithBeneficiaireDTO> findAllWithActesAndContreVisite(int userId) ;


    List<Prestation> findByUserIdAndEtatForcontrolleur(int userId , boolean etat , boolean archive);

    public CalculationResponse calculate(CalculationRequest request) ;

    public Prestation ajouterPrestationContreVisitePourBeneficiaireDentiste(int idPrestationOrdinaire, int beneficiaireID, int adherantId, int userId, Efavore favore) ;

    public Prestation ajouterPrestationContreVisitePourDentiste(int idPrestationOrdinaire, int  adherantId , int userId , Efavore favore);





}
