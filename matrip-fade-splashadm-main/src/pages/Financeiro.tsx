import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Search, Download, Eye, DollarSign, TrendingUp, Wallet } from "lucide-react";

const AMBER = "213 68% 15%";
const AMBER_DARK = "213 68% 15%";
const AMBER_SOFT = "213 50% 95%";

const KPIS = [
  { label: "Receita Bruta (Mês)", value: "R$ 12.450,00", desc: "Total processado no site", bar: AMBER },
  { label: "A Repassar", value: "R$ 8.900,00", desc: "Pagamentos a guias e agências", bar: "213 68% 25%" },
  { label: "Lucro Matrip", value: "R$ 3.550,00", desc: "Comissões líquidas da plataforma", bar: AMBER_DARK },
];

const TX = [
  { data: "19/03/2026", pedido: "#10254", cliente: "João Silva", valor: "R$ 450,00", status: "PAGO" },
  { data: "18/03/2026", pedido: "#10253", cliente: "Maria Souza", valor: "R$ 1.200,00", status: "PAGO" },
  { data: "18/03/2026", pedido: "#10252", cliente: "Carlos Lima", valor: "R$ 320,00", status: "PENDENTE" },
  { data: "17/03/2026", pedido: "#10251", cliente: "Ana Pereira", valor: "R$ 780,00", status: "PAGO" },
  { data: "17/03/2026", pedido: "#10250", cliente: "Lucas Rocha", valor: "R$ 560,00", status: "ESTORNADO" },
];

const STATUS_STYLE: Record<string, { bg: string; color: string }> = {
  PAGO: { bg: "hsl(145 55% 90%)", color: "hsl(145 65% 22%)" },
  PENDENTE: { bg: "hsl(38 90% 90%)", color: "hsl(32 85% 35%)" },
  ESTORNADO: { bg: "hsl(0 80% 96%)", color: "hsl(0 70% 45%)" },
};

const Financeiro = () => {
  const navigate = useNavigate();
  const [periodo, setPeriodo] = useState("Últimos 30 dias");
  const [search, setSearch] = useState("");

  const filtered = TX.filter(
    (t) =>
      !search ||
      t.pedido.toLowerCase().includes(search.toLowerCase()) ||
      t.cliente.toLowerCase().includes(search.toLowerCase())
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
          <h1 className="text-2xl font-semibold tracking-tight">Controle Financeiro</h1>
          <p className="text-white/80 text-sm mt-1">
            Monitore vendas, repasses a parceiros e fluxo de caixa da plataforma.
          </p>
        </div>

        <div className="p-5 space-y-5 -mt-4">
          {/* KPIs */}
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
                  style={{ color: `hsl(${k.bar})` }}
                >
                  {k.value}
                </p>
                <p className="text-xs mt-2" style={{ color: "hsl(0 0% 45%)" }}>
                  {k.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Filtros */}
          <div
            className="bg-white rounded-2xl p-4"
            style={{ boxShadow: "0 4px 14px -8px hsl(0 0% 0% / 0.1)" }}
          >
            <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-end">
              <div className="md:w-48">
                <label className="text-xs font-semibold" style={{ color: "hsl(0 0% 30%)" }}>
                  Período
                </label>
                <select
                  value={periodo}
                  onChange={(e) => setPeriodo(e.target.value)}
                  className="w-full mt-1 px-3 py-2 rounded-lg text-sm bg-white"
                  style={{ border: "1px solid hsl(0 0% 88%)" }}
                >
                  <option>Últimos 7 dias</option>
                  <option>Últimos 30 dias</option>
                  <option>Últimos 90 dias</option>
                  <option>Este ano</option>
                </select>
              </div>
              <div className="flex-1">
                <label className="text-xs font-semibold" style={{ color: "hsl(0 0% 30%)" }}>
                  Buscar Transação
                </label>
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Nº Pedido, Cliente ou Guia..."
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
                <Download size={16} /> Exportar Relatório
              </button>
            </div>
          </div>

          {/* Tabela */}
          <div
            className="bg-white rounded-2xl p-5"
            style={{ boxShadow: "0 4px 14px -8px hsl(0 0% 0% / 0.1)" }}
          >
            <h2
              className="text-lg font-semibold mb-4"
              style={{ color: "hsl(220 25% 18%)" }}
            >
              Últimas Transações
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
                    <th className="text-left py-3 font-semibold">Data</th>
                    <th className="text-left py-3 font-semibold">Pedido</th>
                    <th className="text-left py-3 font-semibold">Cliente</th>
                    <th className="text-left py-3 font-semibold">Valor Bruto</th>
                    <th className="text-center py-3 font-semibold">Status</th>
                    <th className="text-right py-3 font-semibold">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((t) => (
                    <tr key={t.pedido} style={{ borderBottom: "1px solid hsl(0 0% 94%)" }}>
                      <td className="py-3" style={{ color: "hsl(0 0% 30%)" }}>
                        {t.data}
                      </td>
                      <td className="py-3 font-semibold" style={{ color: "hsl(220 25% 18%)" }}>
                        {t.pedido}
                      </td>
                      <td className="py-3" style={{ color: "hsl(0 0% 25%)" }}>
                        {t.cliente}
                      </td>
                      <td className="py-3 font-medium" style={{ color: "hsl(220 25% 18%)" }}>
                        {t.valor}
                      </td>
                      <td className="py-3 text-center">
                        <span
                          className="text-xs font-bold px-3 py-1 rounded-full"
                          style={STATUS_STYLE[t.status]}
                        >
                          {t.status}
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        <button
                          className="h-8 w-8 inline-flex items-center justify-center rounded-lg"
                          style={{
                            background: `hsl(${AMBER_SOFT})`,
                            color: `hsl(${AMBER_DARK})`,
                          }}
                        >
                          <Eye size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-sm" style={{ color: "hsl(0 0% 50%)" }}>
                        Nenhuma transação encontrada.
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

export default Financeiro;
