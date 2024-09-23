package com.example.projectPfe.models;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
@Entity
@Table(name = "beneficaire")
public class Beneficiaire {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    private String nom;
    private String prenom;
    private String sexe;
    @JsonFormat(pattern="yyyy-MM-dd")
    private Date dateNais;
    private String qualite;
    private float plafond;

    @ManyToOne
    @JoinColumn(name = "id_adherant")
    @JsonIgnore
    private Adherant adherant;




}
