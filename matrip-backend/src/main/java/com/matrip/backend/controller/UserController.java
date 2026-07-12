package com.matrip.backend.controller;

import com.matrip.backend.model.User;
import com.matrip.backend.repository.UserRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/usuarios")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    // Get all users
    @GetMapping
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // Create a new user
    @PostMapping
    public ResponseEntity<?> createUser(@Valid @RequestBody User user) {
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("E-mail já cadastrado");
        }
        if (user.getCpf() != null && !user.getCpf().isBlank() && userRepository.findByCpf(user.getCpf()).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("CPF já cadastrado");
        }
        if (user.getCriadoEm() == null || user.getCriadoEm().isBlank()) {
            user.setCriadoEm(new java.text.SimpleDateFormat("yyyy-MM-dd").format(new java.util.Date()));
        }
        // Encrypt password if present
        if (user.getSenha() != null && !user.getSenha().isBlank()) {
            user.setSenha(passwordEncoder.encode(user.getSenha()));
        }
        User saved = userRepository.save(user);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    // Login endpoint
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User loginRequest) {
        Optional<User> optionalUser = userRepository.findByEmail(loginRequest.getEmail());
        if (optionalUser.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("E-mail ou senha incorretos");
        }

        User user = optionalUser.get();
        
        // Verificação se é admin
        if (!"admin".equalsIgnoreCase(user.getTipo())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Acesso permitido apenas para administradores");
        }

        // Verificação da senha usando BCrypt
        if (loginRequest.getSenha() == null || !passwordEncoder.matches(loginRequest.getSenha(), user.getSenha())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("E-mail ou senha incorretos");
        }

        return ResponseEntity.ok(user);
    }

    // Update status of a user (e.g. ativo, bloqueado)
    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateUserStatus(@PathVariable Long id, @RequestParam String status) {
        Optional<User> optionalUser = userRepository.findById(id);
        if (optionalUser.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        User user = optionalUser.get();
        user.setStatus(status.toLowerCase());
        userRepository.save(user);
        
        return ResponseEntity.ok(user);
    }

    // Delete a user
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        if (!userRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        userRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
