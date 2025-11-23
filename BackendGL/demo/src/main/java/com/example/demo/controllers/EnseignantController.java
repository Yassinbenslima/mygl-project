package com.example.demo.controllers;

import com.example.demo.dto.EnseignantRequestDTO;
import com.example.demo.model.EnseignantEntity;
import com.example.demo.repo.EnseignantRepository;
import com.example.demo.services.EnseignantService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import java.util.List;
@RestController
@RequestMapping("/enseignant")
@RequiredArgsConstructor
public class EnseignantController {
    private final EnseignantService serviceEnseignant;

    @GetMapping("/all")
    public List<EnseignantEntity> getAllEnseignants() {
        return serviceEnseignant.findAll();
    }

    @PostMapping("/add-sceances")
    public void addSceances(@RequestBody EnseignantRequestDTO ens) {
        serviceEnseignant.addSceanceToEnseignant(ens.getId(), ens.getSceancesIds());
    }

    @PostMapping("/delete-seances")
    public void deleteVoeux(@RequestBody EnseignantRequestDTO ens) {
        serviceEnseignant.deleteVoeux(ens.getId(), ens.getSceancesIds());
    }

    //deltebyIdlvoeux


}
