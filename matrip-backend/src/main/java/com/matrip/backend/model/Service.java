package com.matrip.backend.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Entity
@Table(name = "servicos")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Service {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Nome é obrigatório")
    private String nome;

    private String categoria = "Geral";

    @NotBlank(message = "Preço é obrigatório")
    @Column(name = "valor", columnDefinition = "varchar(255)")
    private String preco;

    private String status = "ativo"; // "ativo", "inativo"

    @Column(name = "guia_id")
    private Long guiaId;

    @Column(name = "passeio_id")
    private Long passeioId;

    @Column(columnDefinition = "TEXT")
    private String descricao = "Descrição do serviço";

    private String foto;

    @Column(name = "criado_em", insertable = false, updatable = false)
    private java.sql.Timestamp criadoEm;
}
