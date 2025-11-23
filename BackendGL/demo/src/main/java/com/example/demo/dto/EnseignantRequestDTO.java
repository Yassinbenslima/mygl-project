package com.example.demo.dto;

import lombok.Data;

import java.util.List;

@Data
public class EnseignantRequestDTO {
    private Long id;
    private List<Long> sceancesIds; // avec s
}
