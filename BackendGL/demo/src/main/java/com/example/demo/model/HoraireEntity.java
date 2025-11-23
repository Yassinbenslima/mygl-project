package com.example.demo.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Data;
import java.util.List;

@Entity
@Data
public class HoraireEntity {
    @Id
    private Long id;
    private String debut;
    private String fin;
    @OneToMany(mappedBy = "horaire")
    @JsonBackReference      // évite boucle Horaire → Sceance → Horaire
    private List<SceanceEntity> sceances;
}