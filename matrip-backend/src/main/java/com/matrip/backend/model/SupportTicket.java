package com.matrip.backend.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Entity
@Table(name = "suporte_tickets")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SupportTicket {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Ticket ID é obrigatório")
    private String ticket; // ex: #TK-8854

    @NotBlank(message = "Nome do remetente é obrigatório")
    private String nome;

    @NotBlank(message = "Assunto é obrigatório")
    private String assunto;

    @NotBlank(message = "Urgência é obrigatória")
    private String urgencia; // "Alta", "Média", "Baixa"

    @NotBlank
    private String status = "ABERTO"; // "ABERTO", "EM ATENDIMENTO", "RESOLVIDO"
}
