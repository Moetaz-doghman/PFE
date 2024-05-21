package com.example.projectPfe.models;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.util.Date;

@Data
@NoArgsConstructor
@SuperBuilder
@Entity
@Table(name = "rapportCV")
@Inheritance(strategy = InheritanceType.JOINED)
@DiscriminatorColumn(name="rapport_type")
public abstract class Rapport_C_V {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    private String ref;
    private String refNumber;
    private Date dateRapport ;
    private String observation ;
    @OneToOne
    @JoinColumn(name = "prestation_id", referencedColumnName = "id")
    private Prestation prestation;






}
