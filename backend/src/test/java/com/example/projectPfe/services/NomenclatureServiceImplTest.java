package com.example.projectPfe.services;

import com.example.projectPfe.dto.NomenclatureDTO;
import com.example.projectPfe.models.Eacte;
import com.example.projectPfe.models.Nomenclature;
import com.example.projectPfe.repository.NomenclatureRepository;
import com.example.projectPfe.utils.Mapper;
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

class NomenclatureServiceImplTest {

    @Mock
    private NomenclatureRepository nomenclatureRepository;

    @InjectMocks
    private com.example.projectPfe.Services.NomenclatureServiceImpl nomenclatureService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void findNomenclatureByNomActes_shouldReturnNomenclatureList_whenNomenclaturesExist() {
        Eacte acte = Eacte.Consultation;
        Nomenclature nomenclature = new Nomenclature();
        nomenclature.setCodeActe("C001");

        when(nomenclatureRepository.findByActeDentaire_Nom(acte)).thenReturn(Arrays.asList(nomenclature));

        List<Nomenclature> result = nomenclatureService.findNomenclatureByNomActes(acte);

        assertEquals(1, result.size());
        assertEquals("C001", result.get(0).getCodeActe());
        verify(nomenclatureRepository, times(1)).findByActeDentaire_Nom(acte);
    }

    @Test
    void deleteNomenclature_shouldDeleteNomenclature_whenIdExists() {
        int id = 1;

        doNothing().when(nomenclatureRepository).deleteById(id);

        nomenclatureService.deleteNomenclature(id);

        verify(nomenclatureRepository, times(1)).deleteById(id);
    }

}
