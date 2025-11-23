package com.example.demo.model;

import jakarta.persistence.*;
import lombok.Data;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Data
public class EnseignantEntity {
    @Id
    private Long id;
    private String nom;
    private String prenom;
    private int tel;
    @ManyToOne
    @JoinColumn(name = "grade_id")
    private GradeEntity grade;
    @ManyToMany
    @JoinTable(
            name = "enseignant_matiere",
            joinColumns = @JoinColumn(name = "enseignant_id"),
            inverseJoinColumns = @JoinColumn(name = "matiere_id")
    )
    @JsonManagedReference
    private Set<MatiereEntity> matieresEnseignees = new HashSet<>();
    @ManyToMany
    @JoinTable(
            name = "enseignant_sceance",
            joinColumns = @JoinColumn(name = "enseignant_id"),
            inverseJoinColumns = @JoinColumn(name = "sceance_id")
    )
    @JsonManagedReference
    private List<SceanceEntity> sceances = new ArrayList<>();

}
