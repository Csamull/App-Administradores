package com.matrip.backend;

import com.matrip.backend.model.*;
import com.matrip.backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataSeeder implements CommandLineRunner {

    @Autowired
    private AgencyRepository agencyRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private PartnerRepository partnerRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private ContractRepository contractRepository;

    @Autowired
    private PromotionRepository promotionRepository;

    @Autowired
    private ServiceRepository serviceRepository;

    @Autowired
    private SupportTicketRepository supportTicketRepository;

    @Autowired
    private TransactionRepository transactionRepository;

    @Override
    public void run(String... args) throws Exception {
        seedAgencies();
        seedUsers();
        seedProducts();
        seedPartners();
        seedOrders();
        seedContracts();
        seedPromotions();
        seedServices();
        seedSupportTickets();
        seedTransactions();
    }

    private void seedAgencies() {
        if (agencyRepository.count() == 0) {
            agencyRepository.save(Agency.builder().nome("Aventuras MA").cnpj("12.345.678/0001-90").email("contato@aventuras.com").telefone("(98) 99999-1111").status("ativo").build());
            agencyRepository.save(Agency.builder().nome("Lençóis Tour").cnpj("98.765.432/0001-10").email("reserva@lencoistour.com").telefone("(98) 98888-2222").status("pendente").build());
            agencyRepository.save(Agency.builder().nome("SLZ Viagens").cnpj("45.678.123/0001-55").email("slz@viagens.com").telefone("(98) 97777-3333").status("bloqueado").build());
        }
    }

    private void seedUsers() {
        if (userRepository.count() == 0) {
            userRepository.save(User.builder().nome("Ana Silva").email("ana.silva@email.com").cpf("123.456.789-01").status("ativo").criadoEm("2026-04-12").build());
            userRepository.save(User.builder().nome("Bruno Costa").email("bruno.costa@email.com").cpf("234.567.890-12").status("ativo").criadoEm("2026-05-02").build());
            userRepository.save(User.builder().nome("Carla Mendes").email("carla.mendes@email.com").cpf("345.678.901-23").status("bloqueado").criadoEm("2026-03-18").build());
            userRepository.save(User.builder().nome("Diego Rocha").email("diego.rocha@email.com").cpf("456.789.012-34").status("ativo").criadoEm("2026-05-05").build());
            userRepository.save(User.builder().nome("Eduarda Lima").email("eduarda.lima@email.com").cpf("567.890.123-45").status("ativo").criadoEm("2026-04-28").build());
            userRepository.save(User.builder().nome("Felipe Souza").email("felipe.souza@email.com").cpf("678.901.234-56").status("bloqueado").criadoEm("2026-02-10").build());
            userRepository.save(User.builder().nome("Gabriela Reis").email("gabriela.reis@email.com").cpf("789.012.345-67").status("ativo").criadoEm("2026-05-08").build());
        }
    }

    private void seedProducts() {
        if (productRepository.count() == 0) {
            productRepository.save(Product.builder().nome("Lençóis Maranhenses - 3 dias").agencia("Horizonte Turismo").cidade("Barreirinhas").tipo("Pacote").preco(1280.0).status("aprovado").build());
            productRepository.save(Product.builder().nome("City Tour São Luís").agencia("TurExpress").cidade("São Luís").tipo("Passeio").preco(180.0).status("aprovado").build());
            productRepository.save(Product.builder().nome("Pousada Vista Mar").agencia("Sol & Mar Turismo").cidade("São Luís").tipo("Hospedagem").preco(320.0).status("pendente").build());
            productRepository.save(Product.builder().nome("Travessia Alcântara").agencia("Horizonte Turismo").cidade("Alcântara").tipo("Transporte").preco(95.0).status("aprovado").build());
            productRepository.save(Product.builder().nome("Chapada das Mesas Trek").agencia("TurExpress").cidade("Carolina").tipo("Passeio").preco(450.0).status("pendente").build());
            productRepository.save(Product.builder().nome("Delta do Parnaíba").agencia("Sol & Mar Turismo").cidade("Tutóia").tipo("Pacote").preco(890.0).status("aprovado").build());
        }
    }

    private void seedPartners() {
        if (partnerRepository.count() == 0) {
            partnerRepository.save(Partner.builder().nome("Hotel Maravilha").categoria("Hotel").status("ativo").build());
            partnerRepository.save(Partner.builder().nome("Latam Airlines").categoria("Companhia Aérea").status("ativo").build());
            partnerRepository.save(Partner.builder().nome("Seguro Plus").categoria("Seguro Viagem").status("pendente").build());
            partnerRepository.save(Partner.builder().nome("TransTur Express").categoria("Transporte").status("ativo").build());
            partnerRepository.save(Partner.builder().nome("Restaurante Sabor Local").categoria("Restaurante").status("inativo").build());
            partnerRepository.save(Partner.builder().nome("Aventura & Trilhas").categoria("Passeio").status("ativo").build());
        }
    }

    private void seedOrders() {
        if (orderRepository.count() == 0) {
            orderRepository.save(Order.builder().cliente("Maria Silva").destino("Fernando de Noronha").dataViagem("2026-05-15").valor("R$ 4.500").status("confirmado").build());
            orderRepository.save(Order.builder().cliente("João Santos").destino("Gramado").dataViagem("2026-06-01").valor("R$ 2.800").status("pendente").build());
            orderRepository.save(Order.builder().cliente("Ana Costa").destino("Cancún").dataViagem("2026-07-10").valor("R$ 8.200").status("confirmado").build());
            orderRepository.save(Order.builder().cliente("Pedro Lima").destino("Maceió").dataViagem("2026-05-20").valor("R$ 3.100").status("cancelado").build());
            orderRepository.save(Order.builder().cliente("Carla Mendes").destino("Paris").dataViagem("2026-08-05").valor("R$ 12.500").status("pendente").build());
            orderRepository.save(Order.builder().cliente("Lucas Oliveira").destino("Salvador").dataViagem("2026-06-18").valor("R$ 2.200").status("confirmado").build());
        }
    }

    private void seedContracts() {
        if (contractRepository.count() == 0) {
            contractRepository.save(Contract.builder().cliente("Hotel Lençóis Premium").tipo("Parceria").inicio("01/01/2025").termino("31/12/2025").status("ativo").valor("R$ 120.000").build());
            contractRepository.save(Contract.builder().cliente("Maria Silva").tipo("Pacote de viagem").inicio("15/03/2025").termino("22/03/2025").status("ativo").valor("R$ 8.400").build());
            contractRepository.save(Contract.builder().cliente("TransTur Ltda").tipo("Serviço").inicio("01/06/2024").termino("01/06/2025").status("vencido").valor("R$ 36.000").build());
            contractRepository.save(Contract.builder().cliente("João Pereira").tipo("Pacote de viagem").inicio("10/02/2025").termino("17/02/2025").status("cancelado").valor("R$ 5.200").build());
            contractRepository.save(Contract.builder().cliente("Agência Sol Nascente").tipo("Parceria").inicio("01/04/2025").termino("01/04/2026").status("ativo").valor("R$ 85.000").build());
        }
    }

    private void seedPromotions() {
        if (promotionRepository.count() == 0) {
            promotionRepository.save(Promotion.builder().nome("Verão nos Lençóis").destino("Lençóis Maranhenses").desconto(25).validade("30/06/2025").status("ativa").build());
            promotionRepository.save(Promotion.builder().nome("Carnaval São Luís").destino("São Luís").desconto(15).validade("05/03/2025").status("expirada").build());
            promotionRepository.save(Promotion.builder().nome("Páscoa em Barreirinhas").destino("Barreirinhas").desconto(20).validade("20/04/2025").status("ativa").build());
            promotionRepository.save(Promotion.builder().nome("Férias em Carolina").destino("Carolina").desconto(30).validade("31/07/2025").status("ativa").build());
            promotionRepository.save(Promotion.builder().nome("Réveillon Raposa").destino("Raposa").desconto(10).validade("01/01/2025").status("expirada").build());
        }
    }

    private void seedServices() {
        if (serviceRepository.count() == 0) {
            serviceRepository.save(Service.builder().nome("Hospedagem Premium").categoria("Hotel").preco("R$ 450/noite").status("ativo").build());
            serviceRepository.save(Service.builder().nome("Transfer Aeroporto").categoria("Transporte").preco("R$ 120").status("ativo").build());
            serviceRepository.save(Service.builder().nome("Seguro Viagem Nacional").categoria("Seguro viagem").preco("R$ 89").status("ativo").build());
            serviceRepository.save(Service.builder().nome("Guia Turístico Particular").categoria("Guia turístico").preco("R$ 300/dia").status("inativo").build());
            serviceRepository.save(Service.builder().nome("Passeio de Barco").categoria("Passeio").preco("R$ 180").status("ativo").build());
            serviceRepository.save(Service.builder().nome("Aluguel de Carro").categoria("Transporte").preco("R$ 200/dia").status("ativo").build());
        }
    }

    private void seedSupportTickets() {
        if (supportTicketRepository.count() == 0) {
            supportTicketRepository.save(SupportTicket.builder().ticket("#TK-8854").nome("Carlos Magno (Guia)").assunto("Dúvida sobre repasse").urgencia("Alta").status("ABERTO").build());
            supportTicketRepository.save(SupportTicket.builder().ticket("#TK-8853").nome("Agência Sol & Mar").assunto("Erro ao publicar produto").urgencia("Alta").status("EM ATENDIMENTO").build());
            supportTicketRepository.save(SupportTicket.builder().ticket("#TK-8852").nome("Maria Souza").assunto("Reembolso de pacote").urgencia("Média").status("ABERTO").build());
            supportTicketRepository.save(SupportTicket.builder().ticket("#TK-8851").nome("João Silva").assunto("Alterar dados cadastrais").urgencia("Baixa").status("RESOLVIDO").build());
            supportTicketRepository.save(SupportTicket.builder().ticket("#TK-8850").nome("Agência Lençóis Tour").assunto("Comissão divergente").urgencia("Alta").status("EM ATENDIMENTO").build());
        }
    }

    private void seedTransactions() {
        if (transactionRepository.count() == 0) {
            transactionRepository.save(Transaction.builder().data("19/03/2026").pedido("#10254").cliente("João Silva").valor("R$ 450,00").status("PAGO").build());
            transactionRepository.save(Transaction.builder().data("18/03/2026").pedido("#10253").cliente("Maria Souza").valor("R$ 1.200,00").status("PAGO").build());
            transactionRepository.save(Transaction.builder().data("18/03/2026").pedido("#10252").cliente("Carlos Lima").valor("R$ 320,00").status("PENDENTE").build());
            transactionRepository.save(Transaction.builder().data("17/03/2026").pedido("#10251").cliente("Ana Pereira").valor("R$ 780,00").status("PAGO").build());
            transactionRepository.save(Transaction.builder().data("17/03/2026").pedido("#10250").cliente("Lucas Rocha").valor("R$ 560,00").status("ESTORNADO").build());
        }
    }
}
