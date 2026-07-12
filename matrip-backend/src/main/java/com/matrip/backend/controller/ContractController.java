package com.matrip.backend.controller;

import com.matrip.backend.model.Contract;
import com.matrip.backend.repository.ContractRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/contratos")
@CrossOrigin(origins = "*")
public class ContractController {

    @Autowired
    private ContractRepository contractRepository;

    @GetMapping
    public List<Contract> getAllContracts() {
        return contractRepository.findAll();
    }

    @PostMapping
    public ResponseEntity<?> createContract(@Valid @RequestBody Contract contract) {
        Contract saved = contractRepository.save(contract);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateContractStatus(@PathVariable Long id, @RequestParam String status) {
        Optional<Contract> optionalContract = contractRepository.findById(id);
        if (optionalContract.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        Contract contract = optionalContract.get();
        contract.setStatus(status.toLowerCase());
        contractRepository.save(contract);
        
        return ResponseEntity.ok(contract);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteContract(@PathVariable Long id) {
        if (!contractRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        contractRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
