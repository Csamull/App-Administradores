package com.matrip.backend.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Entity
@Table(name = "agencias")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Agency {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Nome é obrigatório")
    @Column(name = "nome_fantasia")
    private String nome;

    @NotBlank(message = "CNPJ é obrigatório")
    @Column(unique = true)
    private String cnpj;

    @NotBlank(message = "E-mail é obrigatório")
    @Email(message = "E-mail deve ser válido")
    private String email;

    private String telefone;

    private String status = "pendente"; // "ativo", "pendente", "bloqueado"

    @Column(name = "razao_social")
    private String razaoSocial = "Razão Social não informada";

    private String homepage;

    private String endereco = "Endereço não informado";

    private String bairro = "Bairro não informado";

    private String celular = "Celular não informado";

    private String logo;

    @Column(name = "created_at", insertable = false, updatable = false)
    private java.sql.Timestamp createdAt;
}
