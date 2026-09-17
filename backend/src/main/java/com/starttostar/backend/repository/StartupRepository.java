package com.starttostar.backend.repository;

import com.starttostar.backend.entity.Startup;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StartupRepository extends JpaRepository<Startup, Long> {

}