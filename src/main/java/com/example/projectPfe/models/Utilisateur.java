package com.example.projectPfe.models;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Data
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
@Entity
@Table(name = "users",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = "email")
        })
@JsonIgnoreProperties({"prestations"})

public class Utilisateur {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    private String email;
    private String password;
    private String matricule;
    private String nom;
    private String prenom;
    private String adresse;
    private String tel;
    private String identiteBancaire;
    private boolean active;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(  name = "user_roles",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "role_id"))
    private Set<Role> roles = new HashSet<>();


    @OneToMany(mappedBy = "user")
    private List<Prestation> prestations;

    @OneToMany(mappedBy = "user")
    private List<Reclamation> reclamations;

    @JsonBackReference
    @OneToMany(mappedBy = "utilisateur")
    private List<Rapport_C_V_Dentaire> rapports;


    public int getId() {
        return id;
    }

    public String getEmail() {
        return email;
    }

    public String getPassword() {
        return password;
    }

    public String getMatricule() {
        return matricule;
    }

    public String getNom() {
        return nom;
    }

    public String getPrenom() {
        return prenom;
    }

    public String getAdresse() {
        return adresse;
    }

    public String getTel() {
        return tel;
    }

    public String getIdentiteBancaire() {
        return identiteBancaire;
    }

    public Set<Role> getRoles() {
        return roles;
    }

    public Utilisateur(String email, String password) {
        this.email = email;
        this.password = password;
    }

    public boolean isActive() {
        return active;
    }

    public void desactiverCompte() {
        this.active = false;
    }

    public void activerCompte() {
        this.active = true;
    }

}
