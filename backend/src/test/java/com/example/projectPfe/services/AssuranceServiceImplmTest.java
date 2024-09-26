package com.example.projectPfe.services;


import com.example.projectPfe.models.Assurance;
import com.example.projectPfe.repository.AssuranceRepository;
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

class AssuranceServiceImplmTest {

    @InjectMocks
    private com.example.projectPfe.Services.AssuranceServiceImplm assuranceService;

    @Mock
    private AssuranceRepository assuranceRepository;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testGetAllAssurances() {
        // Arrange
        Assurance assurance1 = new Assurance(1, "Assurance1", 100, 200, 300, null);
        Assurance assurance2 = new Assurance(2, "Assurance2", 150, 250, 350, null);
        List<Assurance> expectedAssurances = Arrays.asList(assurance1, assurance2);
        when(assuranceRepository.findAll()).thenReturn(expectedAssurances);

        // Act
        List<Assurance> result = assuranceService.getAllAssurances();

        // Assert
        assertEquals(expectedAssurances, result);
        verify(assuranceRepository, times(1)).findAll();
    }

    @Test
    void testGetAssuranceById() {
        // Arrange
        Assurance expectedAssurance = new Assurance(1, "Assurance1", 100, 200, 300, null);
        when(assuranceRepository.findById(1)).thenReturn(Optional.of(expectedAssurance));

        // Act
        Assurance result = assuranceService.getAssuranceById(1);

        // Assert
        assertEquals(expectedAssurance, result);
        verify(assuranceRepository, times(1)).findById(1);
    }

    @Test
    void testCreateAssurance() {
        // Arrange
        Assurance assuranceToCreate = new Assurance(0, "New Assurance", 100, 200, 300, null);
        Assurance savedAssurance = new Assurance(1, "New Assurance", 100, 200, 300, null);
        when(assuranceRepository.save(assuranceToCreate)).thenReturn(savedAssurance);

        // Act
        Assurance result = assuranceService.createAssurance(assuranceToCreate);

        // Assert
        assertEquals(savedAssurance, result);
        verify(assuranceRepository, times(1)).save(assuranceToCreate);
    }

    @Test
    void testUpdateAssurance() {
        // Arrange
        Assurance existingAssurance = new Assurance(1, "Old Assurance", 100, 200, 300, null);
        Assurance updatedAssurance = new Assurance(1, "Updated Assurance", 150, 250, 350, null);
        when(assuranceRepository.existsById(1)).thenReturn(true);
        when(assuranceRepository.save(updatedAssurance)).thenReturn(updatedAssurance);

        // Act
        Assurance result = assuranceService.updateAssurance(1, updatedAssurance);

        // Assert
        assertEquals(updatedAssurance, result);
        verify(assuranceRepository, times(1)).existsById(1);
        verify(assuranceRepository, times(1)).save(updatedAssurance);
    }

    @Test
    void testDeleteAssurance() {
        // Act
        assuranceService.deleteAssurance(1);

        // Assert
        verify(assuranceRepository, times(1)).deleteById(1);
    }
}
