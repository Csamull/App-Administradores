import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft, User, FileText, MapPin, Phone,
  Mail, Camera, Edit3, Check, ChevronRight,
  CreditCard, Building2, Calendar, Globe, Save } from
"lucide-react";

/* ── Types ── */
interface ProfileData {
  // Pessoal
  nickname: string;
  fullName: string;
  birthDate: string;
  gender: string;
  // Documento
  cpf: string;
  rg: string;
  rgOrg: string;
  passport: string;
  passportExpiry: string;
  nationality: string;
  // Endereço
  cep: string;
  street: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
  // Contato
  phone: string;
  whatsapp: string;
  email: string;
  // Empresa (visível só para Parceiro)
  company: string;
  cnpj: string;
  role: string;
}

const INITIAL: ProfileData = {
  nickname: "João",
  fullName: "João Carlos da Silva",
  birthDate: "15/04/1985",
  gender: "Masculino",
  cpf: "123.456.789-00",
  rg: "12.345.678-9",
  rgOrg: "SSP-SP",
  passport: "BR1234567",
  passportExpiry: "10/2030",
  nationality: "Brasileira",
  cep: "01310-100",
  street: "Av. Paulista",
  number: "1578",
  complement: "Apto 42",
  neighborhood: "Bela Vista",
  city: "São Paulo",
  state: "SP",
  phone: "(11) 91234-5678",
  whatsapp: "(11) 91234-5678",
  email: "joao.silva@email.com",
  company: "Agência Horizonte Viagens",
  cnpj: "12.345.678/0001-90",
  role: "Gestor Comercial"
};

type Section = "pessoal" | "documento" | "endereco" | "contato" | "empresa";

interface SectionConfig {
  id: Section;
  label: string;
  icon: React.ElementType;
  color: string;
  bg: string;
}

const SECTIONS: SectionConfig[] = [
{ id: "pessoal", label: "Dados pessoais", icon: User, color: "210 90% 56%", bg: "210 90% 94%" },
{ id: "documento", label: "Documentos", icon: FileText, color: "270 60% 58%", bg: "270 60% 94%" },
{ id: "endereco", label: "Endereço", icon: MapPin, color: "155 70% 42%", bg: "155 70% 92%" },
{ id: "contato", label: "Contato", icon: Phone, color: "38 90% 44%", bg: "213 50% 92%" },
{ id: "empresa", label: "Dados da empresa", icon: Building2, color: "0 70% 50%", bg: "0 84% 95%" }];


const Field = ({
  label,
  value,
  editing,
  onChange,
  type = "text",
  placeholder,
  hint








}: {label: string;value: string;editing: boolean;onChange: (v: string) => void;type?: string;placeholder?: string;hint?: string;}) =>
<div style={{ marginBottom: 14 }}>
    <label style={{ fontSize: 11, fontWeight: 700, color: "hsl(var(--muted-foreground))", textTransform: "uppercase", letterSpacing: 0.8, display: "block", marginBottom: 5 }}>
      {label}
    </label>
    {editing ?
  <input
    type={type}
    value={value}
    placeholder={placeholder ?? label}
    onChange={(e) => onChange(e.target.value)}
    style={{
      width: "100%",
      border: "1.5px solid hsl(var(--primary) / 0.5)",
      borderRadius: 10,
      padding: "9px 12px",
      fontSize: 14,
      fontWeight: 500,
      color: "hsl(var(--foreground))",
      background: "hsl(var(--background))",
      outline: "none",
      boxSizing: "border-box"
    }} /> :


  <p style={{ fontSize: 14, fontWeight: 600, color: value ? "hsl(var(--foreground))" : "hsl(var(--muted-foreground))", margin: 0, padding: "9px 0", borderBottom: "1px solid hsl(var(--border))" }}>
        {value || (hint ?? "—")}
      </p>
  }
  </div>;


const UserProfile = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<ProfileData>(INITIAL);
  const [editingSection, setEditingSection] = useState<Section | null>(null);
  const [draft, setDraft] = useState<ProfileData>(INITIAL);
  const [saved, setSaved] = useState<Section | null>(null);

  const startEdit = (s: Section) => {
    setDraft({ ...data });
    setEditingSection(s);
  };

  const saveEdit = (s: Section) => {
    setData({ ...draft });
    setEditingSection(null);
    setSaved(s);
    setTimeout(() => setSaved(null), 2000);
  };

  const cancelEdit = () => setEditingSection(null);

  const set = (key: keyof ProfileData) => (v: string) =>
  setDraft((prev) => ({ ...prev, [key]: v }));

  const isEditing = (s: Section) => editingSection === s;

  /* ── Avatar initials ── */
  const initials = data.fullName.
  split(" ").
  slice(0, 2).
  map((w) => w[0]).
  join("").
  toUpperCase();

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        background: "hsl(var(--muted))",
        maxWidth: 480,
        margin: "0 auto"
      }}>
      
      {/* ── HEADER ── */}
      <div
        style={{
          background: "hsl(var(--primary))",
          padding: "28px 20px 36px",
          position: "relative",
          overflow: "hidden"
        }} className="bg-primary">
        

        <div className="flex items-center justify-between relative z-10">
          <button
            onClick={() => navigate(-1)}
            style={{ background: "rgba(255,255,255,0.18)", border: "none", borderRadius: 12, padding: 8, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
            
            <ArrowLeft size={18} color="white" />
          </button>
          <span style={{ color: "white", fontWeight: 700, fontSize: 16 }}>Meu Perfil</span>
          <div style={{ width: 38 }} />
        </div>

        {/* Avatar */}
        <div className="flex flex-col items-center relative z-10" style={{ marginTop: 24 }}>
          <div style={{ position: "relative" }}>
            <div
              style={{
                width: 84,
                height: 84,
                borderRadius: "50%",
                background: "rgba(255,255,255,0.25)",
                border: "3px solid rgba(255,255,255,0.6)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 30,
                fontWeight: 800,
                color: "white",
                letterSpacing: -1
              }}>
              
              {initials}
            </div>
            <button
              style={{
                position: "absolute",
                bottom: 0,
                right: 0,
                width: 26,
                height: 26,
                borderRadius: "50%",
                background: "white",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 2px 8px rgba(0,0,0,0.18)"
              }}>
              
              <Camera size={13} style={{ color: "hsl(var(--primary))" }} />
            </button>
          </div>
          <h2 style={{ color: "white", fontWeight: 800, fontSize: 18, marginTop: 12, marginBottom: 2 }}>
            {data.nickname}
          </h2>
          <span style={{ color: "rgba(255,255,255,0.7)", fontSize: 12, fontWeight: 500 }}>
            {data.email}
          </span>

          {/* Completion badge */}
          <div
            style={{
              marginTop: 12,
              background: "rgba(255,255,255,0.18)",
              borderRadius: 20,
              padding: "5px 14px",
              display: "flex",
              alignItems: "center",
              gap: 6
            }}>
            
            <div style={{ width: 60, height: 5, borderRadius: 10, background: "rgba(255,255,255,0.25)", overflow: "hidden" }}>
              <div style={{ width: "70%", height: "100%", background: "white", borderRadius: 10 }} />
            </div>
            <span style={{ color: "white", fontSize: 11, fontWeight: 700 }}>70% completo</span>
          </div>
        </div>
      </div>

      {/* ── SECTIONS ── */}
      <div style={{ flex: 1, overflowY: "auto", paddingBottom: 32, marginTop: 0, paddingTop: 14, background: "hsl(var(--muted))" }}>

        {/* ── DADOS PESSOAIS ── */}
        <SectionCard
          section={SECTIONS[0]}
          isEditing={isEditing("pessoal")}
          saved={saved === "pessoal"}
          onEdit={() => startEdit("pessoal")}
          onSave={() => saveEdit("pessoal")}
          onCancel={cancelEdit}>
          
          <Field label="Como quer ser chamado" value={isEditing("pessoal") ? draft.nickname : data.nickname} editing={isEditing("pessoal")} onChange={set("nickname")} />
          <Field label="Nome completo (doc. oficial)" value={isEditing("pessoal") ? draft.fullName : data.fullName} editing={isEditing("pessoal")} onChange={set("fullName")} />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Field label="Data de nascimento" value={isEditing("pessoal") ? draft.birthDate : data.birthDate} editing={isEditing("pessoal")} onChange={set("birthDate")} placeholder="DD/MM/AAAA" />
            <Field label="Gênero" value={isEditing("pessoal") ? draft.gender : data.gender} editing={isEditing("pessoal")} onChange={set("gender")} />
          </div>
          <Field label="Nacionalidade" value={isEditing("pessoal") ? draft.nationality : data.nationality} editing={isEditing("pessoal")} onChange={set("nationality")} />
        </SectionCard>

        {/* ── DOCUMENTOS ── */}
        <SectionCard
          section={SECTIONS[1]}
          isEditing={isEditing("documento")}
          saved={saved === "documento"}
          onEdit={() => startEdit("documento")}
          onSave={() => saveEdit("documento")}
          onCancel={cancelEdit}>
          
          <Field label="CPF" value={isEditing("documento") ? draft.cpf : data.cpf} editing={isEditing("documento")} onChange={set("cpf")} placeholder="000.000.000-00" />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Field label="RG" value={isEditing("documento") ? draft.rg : data.rg} editing={isEditing("documento")} onChange={set("rg")} />
            <Field label="Órgão emissor" value={isEditing("documento") ? draft.rgOrg : data.rgOrg} editing={isEditing("documento")} onChange={set("rgOrg")} placeholder="SSP-UF" />
          </div>
          <div
            style={{
              background: "hsl(270 60% 97%)",
              borderRadius: 12,
              padding: "10px 14px",
              marginBottom: 14,
              borderLeft: "3px solid hsl(270 60% 58%)"
            }}>
            
            <p style={{ fontSize: 11, fontWeight: 700, color: "hsl(270 60% 44%)", margin: "0 0 8px" }}>🛂 Passaporte (opcional)</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <Field label="Número" value={isEditing("documento") ? draft.passport : data.passport} editing={isEditing("documento")} onChange={set("passport")} />
              <Field label="Validade" value={isEditing("documento") ? draft.passportExpiry : data.passportExpiry} editing={isEditing("documento")} onChange={set("passportExpiry")} placeholder="MM/AAAA" />
            </div>
          </div>
        </SectionCard>

        {/* ── ENDEREÇO ── */}
        <SectionCard
          section={SECTIONS[2]}
          isEditing={isEditing("endereco")}
          saved={saved === "endereco"}
          onEdit={() => startEdit("endereco")}
          onSave={() => saveEdit("endereco")}
          onCancel={cancelEdit}>
          
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Field label="CEP" value={isEditing("endereco") ? draft.cep : data.cep} editing={isEditing("endereco")} onChange={set("cep")} placeholder="00000-000" />
            <Field label="Estado" value={isEditing("endereco") ? draft.state : data.state} editing={isEditing("endereco")} onChange={set("state")} placeholder="UF" />
          </div>
          <Field label="Rua / Avenida" value={isEditing("endereco") ? draft.street : data.street} editing={isEditing("endereco")} onChange={set("street")} />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Field label="Número" value={isEditing("endereco") ? draft.number : data.number} editing={isEditing("endereco")} onChange={set("number")} />
            <Field label="Complemento" value={isEditing("endereco") ? draft.complement : data.complement} editing={isEditing("endereco")} onChange={set("complement")} placeholder="Apto, sala…" />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Field label="Bairro" value={isEditing("endereco") ? draft.neighborhood : data.neighborhood} editing={isEditing("endereco")} onChange={set("neighborhood")} />
            <Field label="Cidade" value={isEditing("endereco") ? draft.city : data.city} editing={isEditing("endereco")} onChange={set("city")} />
          </div>
        </SectionCard>

        {/* ── CONTATO ── */}
        <SectionCard
          section={SECTIONS[3]}
          isEditing={isEditing("contato")}
          saved={saved === "contato"}
          onEdit={() => startEdit("contato")}
          onSave={() => saveEdit("contato")}
          onCancel={cancelEdit}>
          
          <Field label="Celular / Telefone" value={isEditing("contato") ? draft.phone : data.phone} editing={isEditing("contato")} onChange={set("phone")} placeholder="(00) 00000-0000" />
          <Field label="WhatsApp" value={isEditing("contato") ? draft.whatsapp : data.whatsapp} editing={isEditing("contato")} onChange={set("whatsapp")} placeholder="(00) 00000-0000" />
          <Field label="E-mail" value={isEditing("contato") ? draft.email : data.email} editing={isEditing("contato")} onChange={set("email")} type="email" />
        </SectionCard>

        {/* ── EMPRESA ── */}
        <SectionCard
          section={SECTIONS[4]}
          isEditing={isEditing("empresa")}
          saved={saved === "empresa"}
          onEdit={() => startEdit("empresa")}
          onSave={() => saveEdit("empresa")}
          onCancel={cancelEdit}>
          
          <Field label="Nome da empresa" value={isEditing("empresa") ? draft.company : data.company} editing={isEditing("empresa")} onChange={set("company")} />
          <Field label="CNPJ" value={isEditing("empresa") ? draft.cnpj : data.cnpj} editing={isEditing("empresa")} onChange={set("cnpj")} placeholder="00.000.000/0000-00" />
          <Field label="Cargo / Função" value={isEditing("empresa") ? draft.role : data.role} editing={isEditing("empresa")} onChange={set("role")} />
        </SectionCard>

        {/* ── SEGURANÇA ── */}
        <div style={{ margin: "0 14px 14px" }}>
          <div
            style={{
              background: "white",
              borderRadius: 20,
              overflow: "hidden",
              boxShadow: "0 4px 20px rgba(0,0,0,0.06)"
            }}>
            
            <div style={{ padding: "14px 16px", borderBottom: "1px solid hsl(var(--border))" }}>
              <div className="flex items-center gap-3">
                <div style={{ width: 36, height: 36, borderRadius: 10, background: "hsl(0 84% 95%)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <CreditCard size={18} style={{ color: "hsl(0 70% 50%)" }} />
                </div>
                <span style={{ fontWeight: 700, fontSize: 14, color: "hsl(var(--foreground))" }}>Segurança da conta</span>
              </div>
            </div>
            {[
            { label: "Alterar senha", desc: "Atualizar sua senha de acesso" },
            { label: "Autenticação em dois fatores", desc: "Proteja sua conta com 2FA" }].
            map((item, i) =>
            <button
              key={i}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "14px 16px",
                background: "none",
                border: "none",
                borderBottom: i === 0 ? "1px solid hsl(var(--border))" : "none",
                cursor: "pointer",
                textAlign: "left"
              }}>
              
                <div>
                  <p style={{ fontWeight: 600, fontSize: 14, color: "hsl(var(--foreground))", margin: 0 }}>{item.label}</p>
                  <p style={{ fontSize: 11, color: "hsl(var(--muted-foreground))", margin: "2px 0 0" }}>{item.desc}</p>
                </div>
                <ChevronRight size={16} style={{ color: "hsl(var(--muted-foreground))", flexShrink: 0 }} />
              </button>
            )}
          </div>
        </div>

        <div style={{ height: 16 }} />
      </div>
    </div>);

};

/* ── Section Card helper ── */
const SectionCard = ({
  section,
  isEditing,
  saved,
  onEdit,
  onSave,
  onCancel,
  children








}: {section: SectionConfig;isEditing: boolean;saved: boolean;onEdit: () => void;onSave: () => void;onCancel: () => void;children: React.ReactNode;}) => {
  const Icon = section.icon;
  return (
    <div style={{ margin: "0 14px 14px" }}>
      <div
        style={{
          background: "white",
          borderRadius: 20,
          overflow: "hidden",
          boxShadow: "0 4px 20px rgba(0,0,0,0.06)"
        }}>
        
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "14px 16px",
            borderBottom: "1px solid hsl(var(--border))"
          }}>
          
          <div className="flex items-center gap-3">
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: `hsl(${section.bg})`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}>
              
              <Icon size={18} style={{ color: `hsl(${section.color})` }} />
            </div>
            <span style={{ fontWeight: 700, fontSize: 14, color: "hsl(var(--foreground))" }}>
              {section.label}
            </span>
          </div>
          {!isEditing ?
          <button
            onClick={onEdit}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 5,
              background: "hsl(var(--muted))",
              border: "none",
              borderRadius: 10,
              padding: "6px 12px",
              cursor: "pointer"
            }}>
            
              <Edit3 size={13} style={{ color: "hsl(var(--muted-foreground))" }} />
              <span style={{ fontSize: 12, fontWeight: 600, color: "hsl(var(--muted-foreground))" }}>Editar</span>
            </button> :

          <div className="flex items-center gap-2">
              <button
              onClick={onCancel}
              style={{
                background: "hsl(var(--muted))",
                border: "none",
                borderRadius: 10,
                padding: "6px 12px",
                cursor: "pointer",
                fontSize: 12,
                fontWeight: 600,
                color: "hsl(var(--muted-foreground))"
              }}>
              
                Cancelar
              </button>
              <button
              onClick={onSave}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 5,
                background: "hsl(var(--primary))",
                border: "none",
                borderRadius: 10,
                padding: "6px 14px",
                cursor: "pointer"
              }}>
              
                <Save size={13} color="white" />
                <span style={{ fontSize: 12, fontWeight: 700, color: "white" }}>Salvar</span>
              </button>
            </div>
          }
        </div>

        {/* Saved toast */}
        {saved &&
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            background: "hsl(155 70% 92%)",
            padding: "8px 16px",
            borderBottom: "1px solid hsl(155 70% 80%)"
          }}>
          
            <Check size={14} style={{ color: "hsl(155 70% 36%)" }} />
            <span style={{ fontSize: 12, fontWeight: 600, color: "hsl(155 70% 34%)" }}>
              Dados salvos com sucesso!
            </span>
          </div>
        }

        {/* Body */}
        <div style={{ padding: "16px 16px 4px" }}>{children}</div>
      </div>
    </div>);

};

export default UserProfile;