package com.example.demo.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Data;
import java.util.List;

@Entity
@Data
public class MatiereEntity {
    @Id
    private Long id;
    private String nom;
    private int nbPaquets;
    @ManyToMany(mappedBy = "matieresEnseignees")
    @JsonBackReference
    private List<EnseignantEntity> enseignants;
    @ManyToOne
    @JoinColumn(name = "sceance_id")
    //hedhi 3amletli mochkla ki nahitha
    @JsonBackReference // évite boucle infinie Sceance → Matiere → Sceance
    private SceanceEntity dateEpreuve;
}
