import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Search, Plus, MessageSquare } from "lucide-react";

const AMBER = "213 68% 15%";
const AMBER_DARK = "213 68% 15%";
const AMBER_SOFT = "37 80% 92%";

const KPIS = [
  { label: "Chamados Abertos", value: "8", desc: "Aguardando resposta", bar: "0 75% 55%", valueColor: "0 75% 50%" },
  { label: "Em Atendimento", value: "3", desc: "Sendo analisados", bar: "213 68% 25%", valueColor: "213 68% 25%" },
  { label: "Tempo Médio", value: "45 min", desc: "Resposta rápida", bar: "145 65% 38%", valueColor: "220 25% 18%" },
];

type Status = "ABERTO" | "EM ATENDIMENTO" | "RESOLVIDO";
type Urgencia = "Alta" | "Média" | "Baixa";

const TICKETS: { ticket: string; nome: string; assunto: string; urgencia: Urgencia; status: Status }[] = [
  { ticket: "#TK-8854", nome: "Carlos Magno (Guia)", assunto: "Dúvida sobre repasse", urgencia: "Alta", status: "ABERTO" },
  { ticket: "#TK-8853", nome: "Agência Sol & Mar", assunto: "Erro ao publicar produto", urgencia: "Alta", status: "EM ATENDIMENTO" },
  { ticket: "#TK-8852", nome: "Maria Souza", assunto: "Reembolso de pacote", urgencia: "Média", status: "ABERTO" },
  { ticket: "#TK-8851", nome: "João Silva", assunto: "Alterar dados cadastrais", urgencia: "Baixa", status: "RESOLVIDO" },
  { ticket: "#TK-8850", nome: "Agência Lençóis Tour", assunto: "Comissão divergente", urgencia: "Alta", status: "EM ATENDIMENTO" },
];

const STATUS_STYLE: Record<Status, { bg: string; color: string }> = {
  ABERTO: { bg: `hsl(${AMBER_SOFT})`, color: `hsl(${AMBER_DARK})` },
  "EM ATENDIMENTO": { bg: "hsl(210 90% 94%)", color: "hsl(210 80% 38%)" },
  RESOLVIDO: { bg: "hsl(145 65% 90%)", color: "hsl(145 70% 25%)" },
};

const URG_COLOR: Record<Urgencia, string> = {
  Alta: "0 75% 50%",
  Média: "213 68% 25%",
  Baixa: "145 65% 35%",
};

const Suporte = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState("Todos os chamados");
  const [search, setSearch] = useState("");

  const filtered = TICKETS.filter(
    (t) =>
      (status === "Todos os chamados" || t.status === status.toUpperCase()) &&
      (!search ||
        t.ticket.toLowerCase().includes(search.toLowerCase()) ||
        t.nome.toLowerCase().includes(search.toLowerCase()) ||
        t.assunto.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="min-h-screen" style={{ background: "hsl(0 0% 97%)" }}>
      <div className="mx-auto" style={{ maxWidth: 1080 }}>
        <div
          className="px-5 pb-7 text-white"
          style={{
            paddingTop: 56,
            background: `linear-gradient(135deg, hsl(${AMBER_DARK}), hsl(${AMBER}))`,
          }}
        >
          <button
            onClick={() => navigate("/admin")}
            className="flex items-center gap-2 text-white/90 text-sm mb-4"
          >
            <ArrowLeft size={16} /> Voltar
          </button>
          <h1 className="text-2xl font-semibold tracking-tight">Central de Suporte</h1>
          <p className="text-white/80 text-sm mt-1">
            Gerencie chamados de usuários, guias e agências parceiras.
          </p>
        </div>

        <div className="p-5 space-y-5 -mt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {KPIS.map((k) => (
              <div
                key={k.label}
                className="bg-white rounded-2xl p-5"
                style={{
                  borderLeft: `4px solid hsl(${k.bar})`,
                  boxShadow: "0 4px 14px -8px hsl(0 0% 0% / 0.12)",
                }}
              >
                <p className="text-sm font-medium" style={{ color: "hsl(0 0% 25%)" }}>
                  {k.label}
                </p>
                <p
                  className="text-2xl font-bold mt-2"
                  style={{ color: `hsl(${k.valueColor})` }}
                >
                  {k.value}
                </p>
                <p className="text-xs mt-2" style={{ color: "hsl(0 0% 45%)" }}>
                  {k.desc}
                </p>
              </div>
            ))}
          </div>

          <div
            className="bg-white rounded-2xl p-4"
            style={{ boxShadow: "0 4px 14px -8px hsl(0 0% 0% / 0.1)" }}
          >
            <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-end">
              <div className="md:w-52">
                <label className="text-xs font-semibold" style={{ color: "hsl(0 0% 30%)" }}>
                  Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full mt-1 px-3 py-2 rounded-lg text-sm bg-white"
                  style={{ border: "1px solid hsl(0 0% 88%)" }}
                >
                  <option>Todos os chamados</option>
                  <option>Aberto</option>
                  <option>Em atendimento</option>
                  <option>Resolvido</option>
                </select>
              </div>
              <div className="flex-1">
                <label className="text-xs font-semibold" style={{ color: "hsl(0 0% 30%)" }}>
                  Buscar Chamado
                </label>
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Assunto, Nome ou Nº do Ticket..."
                  className="w-full mt-1 px-3 py-2 rounded-lg text-sm bg-white"
                  style={{ border: "1px solid hsl(0 0% 88%)" }}
                />
              </div>
              <button
                className="h-10 w-10 rounded-lg flex items-center justify-center text-white shrink-0"
                style={{ background: "hsl(220 25% 18%)" }}
              >
                <Search size={18} />
              </button>
              <button
                className="h-10 px-4 rounded-lg flex items-center justify-center gap-2 text-white text-sm font-medium shrink-0"
                style={{ background: `hsl(${AMBER})` }}
              >
                <Plus size={16} /> Novo Ticket
              </button>
            </div>
          </div>

          <div
            className="bg-white rounded-2xl p-5"
            style={{ boxShadow: "0 4px 14px -8px hsl(0 0% 0% / 0.1)" }}
          >
            <h2
              className="text-lg font-semibold mb-4"
              style={{ color: "hsl(220 25% 18%)" }}
            >
              Chamados Recentes
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr
                    className="text-xs uppercase tracking-wide"
                    style={{
                      color: "hsl(0 0% 35%)",
                      borderBottom: `2px solid hsl(${AMBER})`,
                    }}
                  >
                    <th className="text-left py-3 font-semibold">Ticket</th>
                    <th className="text-left py-3 font-semibold">Solicitante</th>
                    <th className="text-left py-3 font-semibold">Assunto</th>
                    <th className="text-left py-3 font-semibold">Urgência</th>
                    <th className="text-center py-3 font-semibold">Status</th>
                    <th className="text-right py-3 font-semibold">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((t) => (
                    <tr key={t.ticket} style={{ borderBottom: "1px solid hsl(0 0% 94%)" }}>
                      <td className="py-3 font-semibold" style={{ color: "hsl(220 25% 18%)" }}>
                        {t.ticket}
                      </td>
                      <td className="py-3" style={{ color: "hsl(0 0% 25%)" }}>{t.nome}</td>
                      <td className="py-3" style={{ color: "hsl(0 0% 25%)" }}>{t.assunto}</td>
                      <td className="py-3 font-semibold" style={{ color: `hsl(${URG_COLOR[t.urgencia]})` }}>
                        {t.urgencia}
                      </td>
                      <td className="py-3 text-center">
                        <span
                          className="text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap"
                          style={STATUS_STYLE[t.status]}
                        >
                          {t.status}
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        <button
                          className="h-8 w-8 inline-flex items-center justify-center rounded-lg text-white"
                          style={{ background: `hsl(${AMBER})` }}
                        >
                          <MessageSquare size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-sm" style={{ color: "hsl(0 0% 50%)" }}>
                        Nenhum chamado encontrado.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Suporte;
