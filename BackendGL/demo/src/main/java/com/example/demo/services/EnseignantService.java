package com.example.demo.services;

import com.example.demo.dto.SceanceRequestDTO;
import com.example.demo.model.EnseignantEntity;
import com.example.demo.model.SceanceEntity;
import com.example.demo.repo.EnseignantRepository;
import com.example.demo.repo.SeanceRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.jpa.repository.support.SimpleJpaRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class EnseignantService {
    private final EnseignantRepository enseignantRepository;
    private final SeanceRepository sceanceRepository;
    public List<EnseignantEntity> findAll() {
        return enseignantRepository.findAll();
    }

    public void addSceanceToEnseignant(Long idEnseignant, List<Long> sceanceIds)

    {
        EnseignantEntity enseignantEntity ;
        enseignantEntity=enseignantRepository.findById(idEnseignant).orElseThrow(()->new EntityNotFoundException("Enseignant not found"));
        List<SceanceEntity> sceances = sceanceRepository.findAllById(sceanceIds);
        enseignantEntity.getSceances().addAll(sceances);
        enseignantRepository.save(enseignantEntity);
    }

    public void deleteVoeux(Long idEnseignant,List<Long> seanceIds)
    {

        EnseignantEntity enseignantEntity ;
        enseignantEntity=enseignantRepository.findById(idEnseignant).orElseThrow(()->new EntityNotFoundException("Enseignant not found"));
        List<SceanceEntity> sceances = sceanceRepository.findAllById(seanceIds);
        enseignantEntity.getSceances().removeAll(sceances);
        enseignantRepository.save(enseignantEntity);
    }


}
