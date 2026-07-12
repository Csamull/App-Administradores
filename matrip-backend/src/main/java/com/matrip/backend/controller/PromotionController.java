package com.matrip.backend.controller;

import com.matrip.backend.model.Promotion;
import com.matrip.backend.repository.PromotionRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/promocoes")
@CrossOrigin(origins = "*")
public class PromotionController {

    @Autowired
    private PromotionRepository promotionRepository;

    @GetMapping
    public List<Promotion> getAllPromotions() {
        return promotionRepository.findAll();
    }

    @PostMapping
    public ResponseEntity<?> createPromotion(@Valid @RequestBody Promotion promotion) {
        Promotion saved = promotionRepository.save(promotion);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updatePromotionStatus(@PathVariable Long id, @RequestParam String status) {
        Optional<Promotion> optionalPromotion = promotionRepository.findById(id);
        if (optionalPromotion.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        Promotion promotion = optionalPromotion.get();
        promotion.setStatus(status.toLowerCase());
        promotionRepository.save(promotion);
        
        return ResponseEntity.ok(promotion);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePromotion(@PathVariable Long id) {
        if (!promotionRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        promotionRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
