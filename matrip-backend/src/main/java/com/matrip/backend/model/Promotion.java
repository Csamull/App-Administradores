package com.matrip.backend.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Entity
@Table(name = "promocoes")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Promotion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Nome é obrigatório")
    private String nome;

    @NotBlank(message = "Destino é obrigatório")
    private String destino;

    @NotNull(message = "Desconto é obrigatório")
    private Integer desconto;

    @NotBlank(message = "Validade é obrigatória")
    private String validade;

    @NotBlank
    private String status = "ativa"; // "ativa", "expirada"
}
