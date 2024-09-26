package com.example.projectPfe.services;
import com.example.projectPfe.dto.CombinedRapportDTO;
import com.example.projectPfe.models.Prestation;
import com.example.projectPfe.models.Rapport_C_V_Optcien;
import com.example.projectPfe.models.Rapport_C_V_OpticienDTO;
import com.example.projectPfe.repository.PrestationRepository;
import com.example.projectPfe.repository.RapportOpticienRepo;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.modelmapper.ModelMapper;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
public class RapportServiceImplmTest {

    @Mock
    private PrestationRepository prestationRepository;

    @Mock
    private RapportOpticienRepo rapportOpticienRepository;

    @Mock
    private ModelMapper modelMapper;

    @InjectMocks
    private com.example.projectPfe.Services.RapportServiceImplm rapportService;

    private Prestation prestation;
    private Rapport_C_V_Optcien rapportOpticien;

    @BeforeEach
    public void setup() {
        prestation = new Prestation();
        prestation.setId(1);
        prestation.setRapportcontreVisite(false);

        rapportOpticien = new Rapport_C_V_Optcien();
        rapportOpticien.setId(1);
    }

    @Test
    public void testAjouterRapportOpticienSuccess() {
        // Arrange
        when(prestationRepository.findById(anyInt())).thenReturn(Optional.of(prestation));
        when(rapportOpticienRepository.getMaxReference()).thenReturn(10);

        // Act
        rapportService.ajouterRapportOpticien(rapportOpticien, 1);

        // Assert
        assertTrue(prestation.isRapportcontreVisite());
        verify(prestationRepository, times(1)).save(prestation);
        verify(rapportOpticienRepository, times(2)).save(rapportOpticien);
    }

    @Test
    public void testAjouterRapportOpticienThrowsExceptionWhenAlreadyAffecte() {
        // Arrange
        prestation.setRapportcontreVisite(true);
        when(prestationRepository.findById(anyInt())).thenReturn(Optional.of(prestation));

        // Act & Assert
        assertThrows(RuntimeException.class, () -> {
            rapportService.ajouterRapportOpticien(rapportOpticien, 1);
        });

        verify(prestationRepository, never()).save(prestation);
        verify(rapportOpticienRepository, never()).save(rapportOpticien);
    }

    @Test
    public void testFindRapportByPrestationId() {
        // Arrange
        when(rapportOpticienRepository.findByPrestationId(anyInt())).thenReturn(rapportOpticien);
        Rapport_C_V_OpticienDTO rapportDTO = new Rapport_C_V_OpticienDTO();
        when(modelMapper.map(any(Rapport_C_V_Optcien.class), eq(Rapport_C_V_OpticienDTO.class))).thenReturn(rapportDTO);

        // Act
        Rapport_C_V_OpticienDTO result = rapportService.findRapportByPrestationId(1);

        // Assert
        assertNotNull(result);
        verify(rapportOpticienRepository, times(1)).findByPrestationId(1);
        verify(modelMapper, times(1)).map(rapportOpticien, Rapport_C_V_OpticienDTO.class);
    }

    @Test
    public void testAjouterRapportOpticienPrestationNotFound() {
        // Arrange
        when(prestationRepository.findById(anyInt())).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(IllegalArgumentException.class, () -> rapportService.ajouterRapportOpticien(rapportOpticien, 1));
    }
}