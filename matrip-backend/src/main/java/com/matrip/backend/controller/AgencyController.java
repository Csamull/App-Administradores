package com.matrip.backend.controller;

import com.matrip.backend.model.Agency;
import com.matrip.backend.repository.AgencyRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/agencias")
@CrossOrigin(origins = "*") // Allow requests from any origin (e.g. mobile app, React Native)
public class AgencyController {

    @Autowired
    private AgencyRepository agencyRepository;

    // Get all agencies
    @GetMapping
    public List<Agency> getAllAgencies() {
        return agencyRepository.findAll();
    }

    // Create a new agency
    @PostMapping
    public ResponseEntity<?> createAgency(@Valid @RequestBody Agency agency) {
        if (agencyRepository.findByCnpj(agency.getCnpj()).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("CNPJ já cadastrado");
        }
        Agency saved = agencyRepository.save(agency);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    // Update status of an agency (e.g. active, pending, blocked)
    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateAgencyStatus(@PathVariable Long id, @RequestParam String status) {
        Optional<Agency> optionalAgency = agencyRepository.findById(id);
        if (optionalAgency.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        Agency agency = optionalAgency.get();
        agency.setStatus(status.toLowerCase());
        agencyRepository.save(agency);
        
        return ResponseEntity.ok(agency);
    }

    // Delete an agency
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteAgency(@PathVariable Long id) {
        if (!agencyRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        agencyRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
