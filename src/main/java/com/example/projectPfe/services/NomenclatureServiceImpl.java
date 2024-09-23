package com.example.projectPfe.Services;

import com.example.projectPfe.Services.Interface.NomenclaturService;
import com.example.projectPfe.dto.NomenclatureDTO;
import com.example.projectPfe.models.Eacte;
import com.example.projectPfe.models.Nomenclature;
import com.example.projectPfe.repository.NomenclatureRepository;
import com.example.projectPfe.utils.Mapper;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NomenclatureServiceImpl implements NomenclaturService {

    private final NomenclatureRepository nomenclatureRepository ;

    public NomenclatureServiceImpl(NomenclatureRepository nomenclatureRepository) {
        this.nomenclatureRepository = nomenclatureRepository;
    }

    @Override
    public List<Nomenclature> findNomenclatureByNomActes(Eacte nomActe) {
        return nomenclatureRepository.findByActeDentaire_Nom(nomActe);
    }

    @Override
    public NomenclatureDTO createNomenclature(Nomenclature nomenclature) {
        Nomenclature savedNomenclature = nomenclatureRepository.save(nomenclature);
        return Mapper.toNomenclatureDTO(savedNomenclature);
    }

    @Override
    public NomenclatureDTO updateNomenclature(int id, Nomenclature nomenclature) {
        Nomenclature existingNomenclature = nomenclatureRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Nomenclature not found"));
        existingNomenclature.setCodeActe(nomenclature.getCodeActe());
        existingNomenclature.setCotation(nomenclature.getCotation());
        existingNomenclature.setAvisMedical(nomenclature.getAvisMedical());
        existingNomenclature.setActeDentaire(nomenclature.getActeDentaire());
        Nomenclature updatedNomenclature = nomenclatureRepository.save(existingNomenclature);
        return Mapper.toNomenclatureDTO(updatedNomenclature);
    }

    @Override
    public void deleteNomenclature(int id) {
        nomenclatureRepository.deleteById(id);
    }

    @Override
    public NomenclatureDTO getNomenclatureById(int id) {
        Nomenclature nomenclature = nomenclatureRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Nomenclature not found"));
        return Mapper.toNomenclatureDTO(nomenclature);
    }

    @Override
    public List<NomenclatureDTO> getAllNomenclatures() {
        List<Nomenclature> nomenclatures = nomenclatureRepository.findAll();
        return Mapper.toNomenclatureDTOList(nomenclatures);
    }


}
