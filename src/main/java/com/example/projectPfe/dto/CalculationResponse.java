package com.example.projectPfe.dto;

import lombok.Data;

@Data
public class CalculationResponse {

    private double totalOrdonnance;
    private double montantTicketModerateur;
    private double montantRembourse;

}
