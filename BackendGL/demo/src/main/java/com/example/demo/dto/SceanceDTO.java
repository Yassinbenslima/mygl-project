package com.example.demo.dto;


import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
public class SceanceDTO {
    private String nom;
    private LocalDate date;
    private HoraireDTO horaire;
    private List<MatierePlanifieeDTO> matieresPlanifiees;
    private List<EnseignantDTO> enseignants;
}
