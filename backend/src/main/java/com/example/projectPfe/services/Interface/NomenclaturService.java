package com.example.projectPfe.Services.Interface;

import com.example.projectPfe.dto.NomenclatureDTO;
import com.example.projectPfe.models.Eacte;
import com.example.projectPfe.models.Nomenclature;

import java.util.List;

public interface NomenclaturService {

    public List<Nomenclature> findNomenclatureByNomActes(Eacte nomActe);

    NomenclatureDTO createNomenclature(Nomenclature nomenclature);

    NomenclatureDTO updateNomenclature(int id, Nomenclature nomenclature);

    void deleteNomenclature(int id);

    NomenclatureDTO getNomenclatureById(int id);

    List<NomenclatureDTO> getAllNomenclatures();



}
