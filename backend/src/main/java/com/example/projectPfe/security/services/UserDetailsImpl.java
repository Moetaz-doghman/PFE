package com.example.projectPfe.security.services;


import com.example.projectPfe.models.Utilisateur;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Data
@NoArgsConstructor
@SuperBuilder
public class UserDetailsImpl implements UserDetails {
    private static final long serialVersionUID = 1L;
    private int id;

    private String nom;

    private String email;

    @JsonIgnore
    private String password;

    private String matricule;
    private String prenom;
    private String adresse;
    private String tel;
    private String identiteBancaire;
    private boolean active;

    private Collection<? extends GrantedAuthority> authorities;

    public UserDetailsImpl(int id, String email, String password, String nom,
                           String prenom, String matricule, String adresse, String tel,
                           String identiteB, boolean active,
                           Collection<? extends GrantedAuthority> authorities) {
        this.id = id;
        this.email = email;
        this.password = password;
        this.nom =nom;
        this.prenom = prenom;
        this.matricule = matricule;
        this.adresse = adresse;
        this.tel = tel;
        this.identiteBancaire = identiteB;
        this.active = active;
        this.authorities = authorities;
    }

    public static UserDetailsImpl build(Utilisateur user) {
        List<GrantedAuthority> authorities = user.getRoles().stream()
                .map(role -> new SimpleGrantedAuthority(role.getName().name()))
                .collect(Collectors.toList());

        return new UserDetailsImpl(
                user.getId(),
                user.getEmail(),
                user.getPassword(),
                user.getNom(),
                user.getPrenom(),
                user.getMatricule(),
                user.getAdresse(),
                user.getTel(),
                user.getIdentiteBancaire(),
                user.isActive(),
                authorities);
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    @Override
    public String getUsername() {
        return nom;
    }

//    public int getId() {
//        return id;
//    }
//
//    public String getEmail() {
//        return email;
//    }
//
//    @Override
//    public String getPassword() {
//        return password;
//    }
//
//    @Override
//    public String getUsername() {
//        return username;
//    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o)
            return true;
        if (o == null || getClass() != o.getClass())
            return false;
        UserDetailsImpl user = (UserDetailsImpl) o;
        return Objects.equals(id, user.id);
    }
}