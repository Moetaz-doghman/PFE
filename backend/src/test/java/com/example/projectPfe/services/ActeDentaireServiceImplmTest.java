package com.example.projectPfe.services;

import static org.junit.jupiter.api.Assertions.*;
import com.example.projectPfe.Services.ActeDentaireServiceImplm;
import com.example.projectPfe.models.ActeDentaire;
import com.example.projectPfe.models.Eacte;
import com.example.projectPfe.repository.ActeDentaireRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class ActeDentaireServiceImplmTest {

    @Mock
    private ActeDentaireRepository acteDentaireRepository;  // Simuler le repository

    @InjectMocks
    private ActeDentaireServiceImplm acteDentaireService;  // Injecter les mocks dans le service

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);  // Initialisation des mocks
    }

    @Test
    void testCreateActeDentaire() {
        // Arrange (préparation des données)
        ActeDentaire acteDentaire = new ActeDentaire();
        acteDentaire.setNom(Eacte.Consultation);
        when(acteDentaireRepository.save(any(ActeDentaire.class))).thenReturn(acteDentaire);

        // Act (exécution du code à tester)
        ActeDentaire result = acteDentaireService.createActeDentaire(acteDentaire);

        // Assert (vérification des résultats)
        assertNotNull(result);
        assertEquals(Eacte.Consultation, result.getNom());
        verify(acteDentaireRepository, times(1)).save(acteDentaire);
    }

    @Test
    void testUpdateActeDentaire() {
        // Arrange
        ActeDentaire existingActe = new ActeDentaire();
        existingActe.setId(1);
        existingActe.setNom(Eacte.Consultation);

        ActeDentaire updatedActe = new ActeDentaire();
        updatedActe.setNom(Eacte.SoinsDentaire);

        when(acteDentaireRepository.findById(1)).thenReturn(Optional.of(existingActe));
        when(acteDentaireRepository.save(any(ActeDentaire.class))).thenReturn(updatedActe);

        // Act
        ActeDentaire result = acteDentaireService.updateActeDentaire(1, updatedActe);

        // Assert
        assertNotNull(result);
        assertEquals(Eacte.SoinsDentaire, result.getNom());
        verify(acteDentaireRepository, times(1)).findById(1);
        verify(acteDentaireRepository, times(1)).save(existingActe);
    }

    @Test
    void testDeleteActeDentaire() {
        // Act
        acteDentaireService.deleteActeDentaire(1);

        // Assert (vérifier si la méthode deleteById a été appelée)
        verify(acteDentaireRepository, times(1)).deleteById(1);
    }

    @Test
    void testGetActeDentaireById() {
        // Arrange
        ActeDentaire acteDentaire = new ActeDentaire();
        acteDentaire.setId(1);
        acteDentaire.setNom(Eacte.Consultation);
        when(acteDentaireRepository.findById(1)).thenReturn(Optional.of(acteDentaire));

        // Act
        ActeDentaire result = acteDentaireService.getActeDentaireById(1);

        // Assert
        assertNotNull(result);
        assertEquals(Eacte.Consultation, result.getNom());
        verify(acteDentaireRepository, times(1)).findById(1);
    }

    @Test
    void testGetAllActeDentaires() {
        // Arrange
        ActeDentaire acte1 = new ActeDentaire();
        acte1.setNom(Eacte.Consultation);

        ActeDentaire acte2 = new ActeDentaire();
        acte2.setNom(Eacte.Prothese);

        List<ActeDentaire> acteList = Arrays.asList(acte1, acte2);
        when(acteDentaireRepository.findAll()).thenReturn(acteList);

        // Act
        List<ActeDentaire> result = acteDentaireService.getAllActeDentaires();

        // Assert
        assertNotNull(result);
        assertEquals(2, result.size());
        verify(acteDentaireRepository, times(1)).findAll();
    }
}