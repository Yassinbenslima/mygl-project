package com.example.demo.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Data;

import java.util.List;

@Entity
@Data

public class GradeEntity {

    @Id
    private Long id;
    private int grade;
    private int chargeEnseignement;
    @OneToMany(mappedBy = "grade", cascade = CascadeType.ALL,fetch = FetchType.LAZY)
    @JsonBackReference
    //@JsonBackReference obligatoire
    //bien que amelna fetc=FetchType.LAZY
    //hedhi ki zedtha nahatli le problème mtaa l boucle infine binet enseignants w grade .
    //malgré mazedtech jsonmanagedreference f enseignantEntity
    private List<EnseignantEntity> enseignants;

}
