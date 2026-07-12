package com.matrip.backend.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Entity
@Table(name = "passeios")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Nome é obrigatório")
    @Column(name = "local")
    private String nome;

    private String agencia = "Matrip Oficial";

    @NotBlank(message = "Cidade é obrigatória")
    private String cidade;

    @NotBlank(message = "Tipo é obrigatório")
    @Column(name = "categoria")
    private String tipo;

    @NotNull(message = "Preço é obrigatório")
    @Column(name = "valor_final")
    private Double preco;

    private String status = "aprovado"; // "aprovado", "pendente"

    private String estado = "MA";

    @Column(columnDefinition = "TEXT")
    private String descricao;

    @Column(name = "valor_adulto")
    private Double valorAdulto;

    @Column(name = "valor_estudante")
    private Double valorEstudante;

    @Column(name = "valor_crianca")
    private Double valorCrianca;

    @Column(name = "guia_id")
    private Long guiaId;

    @Column(name = "data_passeio")
    private java.sql.Date dataPasseio;

    private String frequencia;
    private String classificacao;

    @Column(name = "informacoes_importantes", columnDefinition = "TEXT")
    private String informacoesImportantes;
}
