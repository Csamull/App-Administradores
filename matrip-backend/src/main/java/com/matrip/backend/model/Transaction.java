package com.matrip.backend.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Entity
@Table(name = "transacoes")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Transaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Data é obrigatória")
    private String data;

    @NotBlank(message = "Número do pedido é obrigatório")
    private String pedido;

    @NotBlank(message = "Nome do cliente é obrigatório")
    private String cliente;

    @NotBlank(message = "Valor é obrigatório")
    private String valor;

    @NotBlank
    private String status = "PENDENTE"; // "PAGO", "PENDENTE", "ESTORNADO"
}
