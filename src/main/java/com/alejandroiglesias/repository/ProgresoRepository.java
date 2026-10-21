package com.alejandroiglesias.repository;

import com.alejandroiglesias.entity.Progreso;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProgresoRepository extends JpaRepository<Progreso, Long> {
    // No métodos personalizados adicionales necesarios - hereda findAll, findById, save, delete
}