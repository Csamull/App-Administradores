import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Globe, Languages, Shapes, PlusCircle, Pencil } from "lucide-react";

type CategoryKey = "localizacao" | "idiomas" | "categorias";

interface Activity {
  id: number;
  type: "add" | "edit";
  title: string;
  description: string;
  when: string;
}

const CATEGORIES: {
  key: CategoryKey;
  icon: typeof Globe;
  title: string;
  description: string;
}[] = [
  { key: "localizacao", icon: Globe, title: "Localização", description: "Gerenciar os estados e municípios atendidos" },
  { key: "idiomas", icon: Languages, title: "Idiomas", description: "Adicionar as línguas faladas pelos guias no sistema" },
  { key: "categorias", icon: Shapes, title: "Categorias", description: "Definir os tipos de produtos (Aventura, Histórico, etc.)" },
];

const KPIS = [
  { label: "IDIOMAS ATIVOS", value: "08", bar: "213 68% 15%" },
  { label: "CIDADES ATENDIDAS", value: "15", bar: "213 68% 15%" },
  { label: "CATEGORIAS CRIADAS", value: "12", bar: "213 68% 15%" },
  { label: "AGÊNCIAS PENDENTES", value: "03", bar: "213 68% 25%" },
];

const ACTIVITIES: Activity[] = [
  { id: 1, type: "add", title: "Nova Cidade Cadastrada", description: 'Administrador adicionou a localização "Barreirinhas - MA".', when: "Hoje, 10:45" },
  { id: 2, type: "edit", title: "Categoria Atualizada", description: 'A categoria "Aventura" teve sua descrição modificada.', when: "Ontem, 16:30" },
  { id: 3, type: "add", title: "Novo Idioma Cadastrado", description: 'Administrador adicionou o idioma "Espanhol" ao sistema.', when: "Ontem, 09:12" },
  { id: 4, type: "edit", title: "Cidade Atualizada", description: 'A cidade "São Luís - MA" teve seus dados atualizados.', when: "23/04, 14:20" },
];

const Cadastros = () => {
  const navigate = useNavigate();
  const [active, setActive] = useState<CategoryKey>("localizacao");

  return (
    <div className="min-h-screen bg-[hsl(0_0%_98%)]" style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}>
      {/* Header */}
      <div
        className="px-5 pt-14 pb-7 text-white"
        style={{ background: "linear-gradient(135deg, hsl(213 68% 15%), hsl(213 68% 10%))" }}
      >
        <div className="mx-auto" style={{ maxWidth: 1080 }}>
          <button
            onClick={() => navigate("/admin")}
            className="flex items-center gap-2 text-white/90 text-sm mb-4 hover:text-white"
          >
            <ArrowLeft size={18} /> Voltar
          </button>
          <h1 className="text-3xl font-bold tracking-tight">Central de Cadastros</h1>
          <p className="text-white/80 text-sm mt-1">Selecione o tipo de registro que deseja adicionar ao sistema.</p>
        </div>
      </div>

      <div className="mx-auto px-5 py-6 space-y-6" style={{ maxWidth: 1080 }}>
        {/* Categories */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isActive = active === cat.key;
            return (
              <button
                key={cat.key}
                onClick={() => setActive(cat.key)}
                className="text-left rounded-2xl bg-white p-5 transition-all flex items-start gap-4"
                style={{
                  border: isActive ? "2px solid hsl(213 68% 15%)" : "1px solid hsl(0 0% 92%)",
                  boxShadow: isActive ? "0 6px 18px -8px hsl(213 68% 15% / 0.35)" : "0 1px 2px hsl(0 0% 0% / 0.04)",
                }}
              >
                <div
                  className="rounded-xl p-3 shrink-0"
                  style={{ background: "hsl(213 68% 15%)", color: "white" }}
                >
                  <Icon size={22} />
                </div>
                <div>
                  <div className="font-semibold text-[hsl(220_15%_18%)]">{cat.title}</div>
                  <div className="text-sm text-[hsl(220_10%_45%)] mt-1 leading-snug">{cat.description}</div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Inventory summary */}
        <div>
          <h2 className="text-lg font-semibold text-[hsl(220_15%_18%)] mb-3">Resumo do Inventário</h2>
          <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
            {KPIS.map((k) => (
              <div
                key={k.label}
                className="rounded-xl bg-white p-4"
                style={{ borderLeft: `4px solid hsl(${k.bar})`, border: "1px solid hsl(0 0% 92%)", borderLeftWidth: 4, borderLeftColor: `hsl(${k.bar})` }}
              >
                <div className="text-[10px] tracking-wider font-semibold text-[hsl(220_10%_45%)]">{k.label}</div>
                <div className="text-3xl font-bold mt-2" style={{ color: `hsl(${k.bar})` }}>{k.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="rounded-2xl bg-white p-5" style={{ border: "1px solid hsl(0 0% 92%)" }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-[hsl(220_15%_18%)]">Registro de Atividades Recentes</h2>
            <button
              className="hidden sm:flex items-center gap-2 text-sm font-medium text-white px-3 py-2 rounded-lg"
              style={{ background: "hsl(213 68% 15%)" }}
            >
              <PlusCircle size={16} /> Novo Registro
            </button>
          </div>
          <div className="space-y-2">
            {ACTIVITIES.map((a) => {
              const Icon = a.type === "add" ? PlusCircle : Pencil;
              return (
                <div
                  key={a.id}
                  className="flex items-start gap-3 p-3 rounded-lg"
                  style={{ background: "hsl(213 50% 95%)", borderLeft: "3px solid hsl(213 68% 15%)" }}
                >
                  <div className="mt-0.5" style={{ color: "hsl(213 68% 15%)" }}>
                    <Icon size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm text-[hsl(220_15%_18%)]">{a.title}</div>
                    <div className="text-xs text-[hsl(220_10%_45%)] mt-0.5">{a.description}</div>
                  </div>
                  <div className="text-xs text-[hsl(220_10%_50%)] whitespace-nowrap">{a.when}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cadastros;
