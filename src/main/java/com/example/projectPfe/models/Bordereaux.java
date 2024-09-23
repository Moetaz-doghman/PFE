package com.example.projectPfe.models;

import com.fasterxml.jackson.annotation.JsonFormat;
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
@Table(name = "bordereau")
public class Bordereaux {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    private String ref;
    private String refNumber;
    private String numFacture ;
    @JsonFormat(pattern="yyyy-MM-dd")
    private Date dateCreationF;
    private int nbPrestation ;
    private float montant_total ;
    private float montant_total_Remboursable ;
    private float montant_ticket_moderateur ;
    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private EstatusBord status;
    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private EPrest type;

    @OneToMany(mappedBy = "bordereau", cascade = CascadeType.ALL)
    private Set<Prestation> prestations = new HashSet<>();

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }

}
