package com.starttostar.backend.controller;

import com.starttostar.backend.entity.Startup;
import com.starttostar.backend.service.StartupService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/startups")
@CrossOrigin(origins = "*")
public class StartupController {

    private final StartupService startupService;

    public StartupController(StartupService startupService) {
        this.startupService = startupService;
    }

    // CREATE
    @PostMapping
    public ResponseEntity<Startup> createStartup(@RequestBody Startup startup) {
        Startup created = startupService.createStartup(startup);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    // GET ALL
    @GetMapping
    public ResponseEntity<List<Startup>> getAllStartups() {
        return ResponseEntity.ok(startupService.getAllStartups());
    }

    // GET BY ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getStartupById(@PathVariable Long id) {
        Startup startup = startupService.getStartupById(id);
        if (startup != null) {
            return ResponseEntity.ok(startup);
        } else {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Startup not found with id: " + id);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
    }

    // UPDATE
    @PutMapping("/{id}")
    public ResponseEntity<?> updateStartup(
            @PathVariable Long id,
            @RequestBody Startup startup) {

        Startup updated = startupService.updateStartup(id, startup);
        if (updated != null) {
            return ResponseEntity.ok(updated);
        } else {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Startup not found with id: " + id);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
    }

    // DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteStartup(@PathVariable Long id) {
        boolean deleted = startupService.deleteStartup(id);
        Map<String, Object> response = new HashMap<>();
        if (deleted) {
            response.put("message", "Startup deleted successfully");
            response.put("id", id);
            return ResponseEntity.ok(response);
        } else {
            response.put("message", "Startup not found with id: " + id);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
    }
}