package com.matrip.backend.controller;

import com.matrip.backend.model.SupportTicket;
import com.matrip.backend.repository.SupportTicketRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/suporte")
@CrossOrigin(origins = "*")
public class SupportController {

    @Autowired
    private SupportTicketRepository supportTicketRepository;

    @GetMapping
    public List<SupportTicket> getAllTickets() {
        return supportTicketRepository.findAll();
    }

    @PostMapping
    public ResponseEntity<?> createTicket(@Valid @RequestBody SupportTicket ticket) {
        if (ticket.getTicket() == null || ticket.getTicket().isBlank()) {
            ticket.setTicket("#TK-" + (int)(Math.random() * 9000 + 1000));
        }
        SupportTicket saved = supportTicketRepository.save(ticket);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateTicketStatus(@PathVariable Long id, @RequestParam String status) {
        Optional<SupportTicket> optionalTicket = supportTicketRepository.findById(id);
        if (optionalTicket.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        SupportTicket ticket = optionalTicket.get();
        ticket.setStatus(status.toUpperCase());
        supportTicketRepository.save(ticket);
        
        return ResponseEntity.ok(ticket);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTicket(@PathVariable Long id) {
        if (!supportTicketRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        supportTicketRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
