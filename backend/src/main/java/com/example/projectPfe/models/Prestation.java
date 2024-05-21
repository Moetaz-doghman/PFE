package com.example.projectPfe.models;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.util.Date;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

@Data
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
@Entity
@Table(name = "prestation")
public class Prestation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    private String ref;
    private String refNumber;
    private String description;
    @JsonFormat(pattern="yyyy-MM-dd")
    private Date dateCreation;
    private boolean etat;
    private boolean statut;
    private float montantTotal;
    private float montantRembourse ;
    private float montant_ticket_moderateur ;
    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private EPrest type;
    private float sphereD;
    private float axeD;
    private float acuiteD;
    private float sphereG;
    private float axeG;
    private float acuiteG;
    private float valeurVerreOeilGauche;
    private float valeurVerreOeilDroit;
    private float valeurMonture;
    @Enumerated(EnumType.STRING)
    //@Column(length = 20)
    private Efavore favore ;
    private String cle_cotation;
    private int totalCotation;
    private int idUserControlleur;
    private boolean ContreVisite;

    private String beneficiaireId;

    private boolean rapportcontreVisite ;

    @Column(columnDefinition = "boolean default false")
    private boolean archive ;

    private String idPrestation ;



    @ManyToMany(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JoinTable(  name = "pres_actes",
            joinColumns = @JoinColumn(name = "pres_id"),
            inverseJoinColumns = @JoinColumn(name = "acte_id"))
    private Set<ActeDentaire> actes = new HashSet<>();


    @ManyToOne
    @JoinColumn(name = "id_adherant")
    private Adherant adherant;

    @ManyToOne
    @JoinColumn(name = "id_user")
    private Utilisateur user;

    @ManyToOne
    @JoinColumn(name = "bordereau_id")
    @JsonIgnore
    private Bordereaux bordereau;


    @OneToOne(mappedBy = "prestation", cascade = CascadeType.ALL)
    @JsonIgnore
    private Rapport_C_V rapportCV;



    @Override
    public int hashCode() {
        return Objects.hash(id);
    }

}
