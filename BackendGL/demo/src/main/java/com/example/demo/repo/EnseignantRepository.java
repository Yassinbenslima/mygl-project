package com.example.demo.repo;

import com.example.demo.dto.SceanceRequestDTO;
import com.example.demo.model.EnseignantEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface EnseignantRepository extends JpaRepository<EnseignantEntity,Long>
{


    List<EnseignantEntity> findAll();


    Optional<EnseignantEntity> findById(Long id);



}
