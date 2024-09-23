package com.example.projectPfe.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
@Entity
@Table(name = "assurance")
public class Assurance {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    private String nom;
    private float prix_cotation ;
    private float prix_cotationODF;
    private float prix_cotationProthese ;

    @OneToMany(mappedBy = "assurance")
    @JsonIgnore
    private List<Adherant> adherants;




}
