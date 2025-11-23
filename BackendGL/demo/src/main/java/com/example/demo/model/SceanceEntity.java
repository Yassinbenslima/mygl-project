package com.example.demo.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Data;
import com.fasterxml.jackson.annotation.JsonBackReference;
import lombok.EqualsAndHashCode;
import lombok.ToString;

import java.time.LocalDate;
import java.util.List;

@Entity
@Data
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class SceanceEntity {
    @Id
    @EqualsAndHashCode.Include
    private Long id;
    private LocalDate date;
    @Transient
    private int nbEnseignants;
    @ManyToMany(mappedBy = "sceances")
    //hedhi 3amletli mochkla ki mamelthech
      @JsonBackReference
    private List<EnseignantEntity> enseignants;
    @OneToMany(mappedBy = "dateEpreuve", cascade = CascadeType.ALL)
    //houni nahit @jsonbackreference w famech mochkla
    private List<MatiereEntity> matieresPlanifies;
    @ManyToOne
    @JoinColumn(name = "horaire_id")
    //hedhi nahitha  w mamletlich mochkla
    //   @JsonManagedReference
    private HoraireEntity horaire;
}