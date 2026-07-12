package com.matrip.backend.controller;

import com.matrip.backend.model.Service;
import com.matrip.backend.repository.ServiceRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/servicos")
@CrossOrigin(origins = "*")
public class ServiceController {

    @Autowired
    private ServiceRepository serviceRepository;

    @GetMapping
    public List<Service> getAllServices() {
        return serviceRepository.findAll();
    }

    @PostMapping
    public ResponseEntity<?> createService(@Valid @RequestBody Service service) {
        Service saved = serviceRepository.save(service);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateServiceStatus(@PathVariable Long id, @RequestParam String status) {
        Optional<Service> optionalService = serviceRepository.findById(id);
        if (optionalService.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        Service service = optionalService.get();
        service.setStatus(status.toLowerCase());
        serviceRepository.save(service);
        
        return ResponseEntity.ok(service);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteService(@PathVariable Long id) {
        if (!serviceRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        serviceRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
