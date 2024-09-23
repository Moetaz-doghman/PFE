package com.example.projectPfe.models;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import java.util.Date;

@Data
public class RapportDentaireDTO {
    private String acte;
    private String adherantNom;
    private String prestataireNom;
    private int userId;
    private String adhesion;
    private String numero;
    private int prestationId;
    private String dent;
    private String codeActe;
    private String cotation;
    private String avisMedical;
    private String observation;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd MMM yyyy")
    private Date date;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd MMM yyyy")
    private Date dateRapport;
}
