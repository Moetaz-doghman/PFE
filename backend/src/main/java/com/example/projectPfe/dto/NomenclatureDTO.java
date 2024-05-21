package com.example.projectPfe.dto;

import lombok.Data;

@Data
public class NomenclatureDTO {

    private int id;
    private String codeActe;
    private String cotation;
    private String avisMedical;
    private ActeDentaireDTO acteDentaire;
}
