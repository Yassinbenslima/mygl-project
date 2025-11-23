package com.example.demo.repo;

import com.example.demo.model.SceanceEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;


public interface SeanceRepository extends JpaRepository<SceanceEntity,Long> {



    List<SceanceEntity> findAllSeanceByDate(LocalDate date);

}
