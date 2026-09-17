package com.starttostar.backend.service;

import com.starttostar.backend.entity.Startup;
import com.starttostar.backend.repository.StartupRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StartupService {

    private final StartupRepository startupRepository;

    public StartupService(StartupRepository startupRepository) {
        this.startupRepository = startupRepository;
    }

    // CREATE
    public Startup createStartup(Startup startup) {
        return startupRepository.save(startup);
    }

    // GET ALL
    public List<Startup> getAllStartups() {
        return startupRepository.findAll();
    }

    // GET BY ID
    public Startup getStartupById(Long id) {
        return startupRepository.findById(id).orElse(null);
    }

    // UPDATE
    public Startup updateStartup(Long id, Startup updatedStartup) {

        Startup existingStartup =
                startupRepository.findById(id).orElse(null);

        if (existingStartup == null) {
            return null;
        }

        existingStartup.setStartupName(updatedStartup.getStartupName());
        existingStartup.setFounderName(updatedStartup.getFounderName());
        existingStartup.setEmail(updatedStartup.getEmail());
        existingStartup.setIndustry(updatedStartup.getIndustry());
        existingStartup.setFunding(updatedStartup.getFunding());
        existingStartup.setDescription(updatedStartup.getDescription());
        existingStartup.setWebsite(updatedStartup.getWebsite());
        if (updatedStartup.getLocation() != null) {
            existingStartup.setLocation(updatedStartup.getLocation());
        }
        if (updatedStartup.getStage() != null) {
            existingStartup.setStage(updatedStartup.getStage());
        }

        return startupRepository.save(existingStartup);
    }

    // DELETE
    public boolean deleteStartup(Long id) {
        if (startupRepository.existsById(id)) {
            startupRepository.deleteById(id);
            return true;
        }
        return false;
    }
}