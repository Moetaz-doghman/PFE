package com.example.projectPfe.dto;

import lombok.Data;

import java.util.List;

@Data
public class CalculationRequest {

    private Long adherantId;
    private List<String> actes;
    private Integer totalCotation;
    private Long assuranceId;
    private String assuranceName;

}
