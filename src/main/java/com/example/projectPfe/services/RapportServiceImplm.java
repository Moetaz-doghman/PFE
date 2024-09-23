package com.example.projectPfe.Services;

import com.example.projectPfe.Services.Interface.RapportService;
import com.example.projectPfe.dto.CombinedRapportDTO;
import com.example.projectPfe.models.Prestation;
import com.example.projectPfe.models.Rapport_C_V;
import com.example.projectPfe.models.Rapport_C_V_Optcien;
import com.example.projectPfe.models.Rapport_C_V_OpticienDTO;
import com.example.projectPfe.repository.PrestationRepository;
import com.example.projectPfe.repository.RapportOpticienRepo;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RapportServiceImplm implements RapportService {

    private final PrestationRepository prestationOrdinaireRepository;
    private final RapportOpticienRepo rapportOpticienRepository;
    private final ModelMapper modelMapper;

    @Override
    public void ajouterRapportOpticien(Rapport_C_V_Optcien rapport_opt, int idPrestationOrdinaire) {

        Prestation prestationOrdinaire = prestationOrdinaireRepository.findById(idPrestationOrdinaire)
                .orElseThrow(() -> new IllegalArgumentException("Prestation ordinaire non trouvée avec l'ID: " + idPrestationOrdinaire));

        if (prestationOrdinaire.isRapportcontreVisite() ) {
            throw new RuntimeException("Prestaion deja affecté contre visite");
        }
        prestationOrdinaire.setRapportcontreVisite(true);
        prestationOrdinaireRepository.save(prestationOrdinaire);
        Integer maxReference = rapportOpticienRepository.getMaxReference();
        int nouvelleReference = (maxReference != null) ? maxReference + 1 : 1;
        rapportOpticienRepository.save(rapport_opt);
        rapport_opt.setDateRapport(new Date());
        rapport_opt.setRefNumber(String.valueOf(nouvelleReference));
        rapport_opt.setRef(genererRef(nouvelleReference));
        rapport_opt.setPrestation(prestationOrdinaire);
        rapportOpticienRepository.save(rapport_opt);
        System.out.println(rapport_opt.getPrixMontureMax());

    }

    @Override
    public Rapport_C_V_OpticienDTO  findRapportByPrestationId(int prestationId) {
        Rapport_C_V_Optcien rapportOpticien = rapportOpticienRepository.findByPrestationId(prestationId);
        return convertToDto(rapportOpticien);
    }

    private Rapport_C_V_OpticienDTO convertToDto(Rapport_C_V_Optcien rapportOpticien) {
        return modelMapper.map(rapportOpticien, Rapport_C_V_OpticienDTO.class);
    }


    private String genererRef(int ref) {

        return "2024rapportO" +ref ;
    }






}
