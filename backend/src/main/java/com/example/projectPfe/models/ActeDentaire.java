package com.example.projectPfe.models;

import com.fasterxml.jackson.annotation.*;
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
@Table(name = "acte")
public class ActeDentaire {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private Eacte nom ;

    @OneToMany(mappedBy = "acteDentaire", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<Nomenclature> nomenclatures;

    @Override
    public String toString() {
        return "ActeDentaire{" +
                "id=" + id +
                ", nom=" + nom +
                '}';
    }

}
