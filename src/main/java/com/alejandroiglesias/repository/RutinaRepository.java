package com.alejandroiglesias.repository;

import com.alejandroiglesias.entity.Rutina;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RutinaRepository extends JpaRepository<Rutina, Long> {
    // No métodos personalizados adicionales necesarios - hereda findAll, findById, save, delete
}