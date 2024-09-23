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
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
@Entity
@Table(name = "adherent")
@JsonIgnoreProperties({"prestations"})
public class Adherant {
        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private int id;
        private String cin;
        private String matricule;
        private String nom;
        private String prenom;
        private String sexe;
        private String numtel;
        @JsonFormat(pattern="yyyy-MM-dd")
        private Date dateNais;
        private String gouvNais;
        private String paysNais;
        private String email ;
        private float plafond;
        private Boolean active;

        @OneToMany(mappedBy = "adherant")
        @JsonIgnore
        private List<Prestation> prestations;
        @OneToMany(mappedBy = "adherant")
        private List<Beneficiaire> beneficiaires;
        @ManyToOne
        @JoinColumn(name = "id_assurance")
        private Assurance assurance;

        public boolean isActive() {
                return active;
        }

        public void desactiverAdherant() {
                this.active = false;
        }

        public void activerAdherant() {
                this.active = true;
        }

}
