package com.matrip.backend.controller;

import com.matrip.backend.model.Partner;
import com.matrip.backend.repository.PartnerRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/parceiros")
@CrossOrigin(origins = "*")
public class PartnerController {

    @Autowired
    private PartnerRepository partnerRepository;

    @GetMapping
    public List<Partner> getAllPartners() {
        return partnerRepository.findAll();
    }

    @PostMapping
    public ResponseEntity<?> createPartner(@Valid @RequestBody Partner partner) {
        Partner saved = partnerRepository.save(partner);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updatePartnerStatus(@PathVariable Long id, @RequestParam String status) {
        Optional<Partner> optionalPartner = partnerRepository.findById(id);
        if (optionalPartner.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        Partner partner = optionalPartner.get();
        partner.setStatus(status.toLowerCase());
        partnerRepository.save(partner);
        
        return ResponseEntity.ok(partner);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePartner(@PathVariable Long id) {
        if (!partnerRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        partnerRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
