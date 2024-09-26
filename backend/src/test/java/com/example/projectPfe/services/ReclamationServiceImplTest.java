package com.example.projectPfe.services;

import org.junit.jupiter.api.Test;
import com.example.projectPfe.models.*;
import com.example.projectPfe.repository.ReclamationRepository;
import com.example.projectPfe.repository.UtilisateurRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Arrays;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;


class ReclamationServiceImplTest {

    @Mock
    private ReclamationRepository reclamationRepository;

    @Mock
    private UtilisateurRepository utilisateurRepository;

    @InjectMocks
    private com.example.projectPfe.Services.ReclamationServiceImpl reclamationService;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void ajouterReclamation() {
        Utilisateur utilisateur = new Utilisateur();
        utilisateur.setId(1);

        Reclamation reclamation = new Reclamation();
        reclamation.setTitre("Problème");
        reclamation.setDescription("Description du problème");

        when(utilisateurRepository.findById(1)).thenReturn(Optional.of(utilisateur));
        when(reclamationRepository.save(any(Reclamation.class))).thenReturn(reclamation);

        Reclamation result = reclamationService.ajouterReclamation(reclamation, 1);

        assertNotNull(result);
        assertEquals("Problème", result.getTitre());
        assertEquals(EStatusReclamation.EN_ATTENTE, result.getStatut());
        verify(reclamationRepository, times(1)).save(reclamation);
    }

    @Test
    public void testGetAllReclamation() {
        Reclamation reclamation1 = new Reclamation();
        Reclamation reclamation2 = new Reclamation();
        List<Reclamation> reclamations = Arrays.asList(reclamation1, reclamation2);

        when(reclamationRepository.findAll()).thenReturn(reclamations);

        List<Reclamation> result = reclamationService.getAllReclamations();

        assertEquals(2, result.size());
        verify(reclamationRepository, times(1)).findAll();
    }

    // Test pour getReclamationById
    @Test
    public void testGetReclamationById() {
        Reclamation reclamation = new Reclamation();
        reclamation.setId(1);

        when(reclamationRepository.findById(1)).thenReturn(Optional.of(reclamation));

        Optional<Reclamation> result = reclamationService.getReclamationById(1);

        assertTrue(result.isPresent());
        assertEquals(1, result.get().getId());
        verify(reclamationRepository, times(1)).findById(1);
    }

    // Test pour getReclamationsByUserId
    @Test
    public void testGetReclamationsByUserId() {
        Reclamation reclamation1 = new Reclamation();
        Reclamation reclamation2 = new Reclamation();
        List<Reclamation> reclamations = Arrays.asList(reclamation1, reclamation2);

        when(reclamationRepository.findByUserId(1)).thenReturn(reclamations);

        List<Reclamation> result = reclamationService.getReclamationsByUserId(1);

        assertEquals(2, result.size());
        verify(reclamationRepository, times(1)).findByUserId(1);
    }

    // Test pour updateStatus
    @Test
    public void testUpdateStatus() {
        Reclamation reclamation = new Reclamation();
        reclamation.setId(1);
        reclamation.setStatut(EStatusReclamation.EN_ATTENTE);

        when(reclamationRepository.findById(1)).thenReturn(Optional.of(reclamation));
        when(reclamationRepository.save(any(Reclamation.class))).thenReturn(reclamation);

        Reclamation updatedReclamation = reclamationService.updateStatus(1, EStatusReclamation.REGLEE);

        assertEquals(EStatusReclamation.REGLEE, updatedReclamation.getStatut());
        verify(reclamationRepository, times(1)).save(reclamation);
    }

    // Test pour deleteReclamation
    @Test
    public void testDeleteReclamation() {
        Reclamation reclamation = new Reclamation();
        reclamation.setId(1);

        when(reclamationRepository.findById(1)).thenReturn(Optional.of(reclamation));

        reclamationService.deleteReclamation(1);

        verify(reclamationRepository, times(1)).delete(reclamation);
    }
}