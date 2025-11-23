package com.example.demo.controllers;


import com.example.demo.dto.SceanceDTO;
import com.example.demo.model.SceanceEntity;
import com.example.demo.repo.SeanceRepository;
import com.example.demo.services.SceanceService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/get")
public class SceanceController {

    private  final SeanceRepository seanceRepository;
    private  final SceanceService sceanceService;

    @GetMapping("/Allseances")
    public List<SceanceEntity> findAll(){
        return seanceRepository.findAll();
    }


    @GetMapping("/test")
    public void set(){
        sceanceService.SetnbEnseignants();
    }


    @GetMapping("/find")
    public List<SceanceEntity> findAllWithDate(@RequestParam LocalDate date){
        return seanceRepository.findAllSeanceByDate(date);
    }

    /*
    @GetMapping("/details")
    public List<SceanceDTO> getSceancesWithDetails() {
        return sceanceService.getAllSceancesWithDetails();
    }
    */

}
