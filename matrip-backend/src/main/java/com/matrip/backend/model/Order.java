package com.matrip.backend.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Entity
@Table(name = "pedidos")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Cliente é obrigatório")
    private String cliente;

    @NotBlank(message = "Destino é obrigatório")
    private String destino;

    @NotBlank(message = "Data da viagem é obrigatória")
    private String dataViagem;

    @NotBlank(message = "Valor é obrigatório")
    private String valor;

    @NotBlank
    private String status = "pendente"; // "pendente", "confirmado", "cancelado"
}
