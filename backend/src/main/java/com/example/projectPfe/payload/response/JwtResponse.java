package com.example.projectPfe.payload.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.util.List;
@Data
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
public class JwtResponse {
    private String token;
    private String type = "Bearer";
    private int id;
    private String nom;
    private String email;
    private String password;
    private String matricule;
    private String prenom;
    private String adresse;
    private String tel;
    private String identiteBancaire;
    private boolean active;


    private List<String> roles;

    public  JwtResponse(String accessToken, int id, String email, String password, String nom,
                        String prenom, String matricule, String adresse, String tel,
                        String identiteB, boolean active, List<String> roles) {
        this.token = accessToken;
        this.id = id;
        this.email = email;
        this.password= password;
        this.nom = nom;
        this.prenom = prenom;
        this.matricule = matricule;
        this.adresse = adresse;
        this.tel = tel;
        this.identiteBancaire = identiteB;
        this.active = active;
        this.roles = roles;

    }

    public String getAccessToken() {
        return token;
    }

    public void setAccessToken(String accessToken) {
        this.token = accessToken;
    }

    public String getTokenType() {
        return type;
    }

    public void setTokenType(String tokenType) {
        this.type = tokenType;
    }

//    public int getId() {
//        return id;
//    }
//
//    public void setId(int id) {
//        this.id = id;
//    }
//
//    public String getEmail() {
//        return email;
//    }
//
//    public void setEmail(String email) {
//        this.email = email;
//    }
//
//    public String getNom() {
//        return nom;
//    }
//
//    public void setNom(String username) {
//        this.nom = username;
//    }
//
//    public List<String> getRoles() {
//        return roles;
//    }
//
//    public String getPassword() {
//        return password;
//    }
}
