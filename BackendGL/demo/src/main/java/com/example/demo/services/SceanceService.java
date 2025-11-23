package com.example.demo.services;

import com.example.demo.dto.EnseignantDTO;
import com.example.demo.dto.HoraireDTO;
import com.example.demo.dto.MatierePlanifieeDTO;
import com.example.demo.dto.SceanceDTO;
import com.example.demo.model.MatiereEntity;
import com.example.demo.model.SceanceEntity;
import com.example.demo.repo.SeanceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SceanceService {

    private final SeanceRepository seanceRepository;

    public void SetnbEnseignants(){
        List<SceanceEntity> sceanceEntities = seanceRepository.findAll();
        for (SceanceEntity sceanceEntity : sceanceEntities) {
            int result=0;
            for(MatiereEntity matiereEntity: sceanceEntity.getMatieresPlanifies()){
               result+=matiereEntity.getNbPaquets()*1.5;
                sceanceEntity.setNbEnseignants(result);
            }
        }
        for (SceanceEntity sceance : sceanceEntities) {
            System.out.println("Sceance: " + sceance.getNbEnseignants());
        }
    }

    /*
    public List<SceanceEntity> findAllByDate(LocalDate date){
        return seanceRepository.findAllSeanceByDate(date);
    }
    */
}
    /*
    //2ème méthode
    public List<SceanceDTO> getAllSceancesWithDetails() {
        List<SceanceEntity> sceances = seanceRepository.findAll();
        List<SceanceDTO> dtos = new ArrayList<>();

        for (SceanceEntity s : sceances) {
            SceanceDTO dto = new SceanceDTO();
            dto.setNom(s.getNom());
            dto.setDate(s.getDate());

            // Horaire
            if (s.getHoraire() != null) {
                HoraireDTO hDto = new HoraireDTO();
                hDto.setDebut(s.getHoraire().getDebut());
                hDto.setFin(s.getHoraire().getFin());
                dto.setHoraire(hDto);
            }

            // Matières planifiées
            List<MatierePlanifieeDTO> matieresDto = s.getMatieresPlanifies().stream().map(m -> {
                MatierePlanifieeDTO mDto = new MatierePlanifieeDTO();
                mDto.setNom(m.getNom());
                mDto.setNbPaquets(m.getNbPaquets());
                return mDto;
            }).toList();
            dto.setMatieresPlanifiees(matieresDto);

            // Enseignants demandeurs
            List<EnseignantDTO> enseignantsDto = s.getEnseignants().stream().map(e -> {
                EnseignantDTO eDto = new EnseignantDTO();
                eDto.setNom(e.getNom());
                eDto.setPrenom(e.getPrenom());
                return eDto;
            }).toList();
            dto.setEnseignants(enseignantsDto);

            dtos.add(dto);
        }

        return dtos;
    }
*/
