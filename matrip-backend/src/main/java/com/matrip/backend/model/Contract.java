package com.matrip.backend.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Entity
@Table(name = "contratos")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Contract {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Cliente/Parceiro é obrigatório")
    private String cliente;

    @NotBlank(message = "Tipo de contrato é obrigatório")
    private String tipo;

    @NotBlank(message = "Data de início é obrigatória")
    private String inicio;

    @NotBlank(message = "Data de término é obrigatória")
    private String termino;

    @NotBlank
    private String status = "ativo"; // "ativo", "vencido", "cancelado"

    @NotBlank(message = "Valor é obrigatório")
    private String valor;
}
