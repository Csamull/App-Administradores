import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  SafeAreaView,
  Platform,
  Alert,
  KeyboardAvoidingView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Search, PlusCircle, X, ShieldAlert } from 'lucide-react-native';
import { Colors } from '@/constants/theme';
import { apiFetch, apiPost } from '@/utils/api';

type Status = 'ativo' | 'pendente' | 'bloqueado';

interface Agencia {
  id: number;
  nome: string;
  cnpj: string;
  email: string;
  telefone: string;
  status: Status;
}

const STATUS_STYLE: Record<Status, { bg: string; text: string; label: string; bar: string }> = {
  ativo: { bg: '#E8F5E9', text: '#2E7D32', label: 'ATIVO', bar: '#2E7D32' },
  pendente: { bg: '#FFFDE7', text: '#F57F17', label: 'PENDENTE', bar: '#F57F17' },
  bloqueado: { bg: '#FFEBEE', text: '#C62828', label: 'BLOQUEADO', bar: '#C62828' },
};

export default function Agencias() {
  const router = useRouter();
  const [agencias, setAgencias] = useState<Agencia[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'todos' | Status>('todos');
  const [showForm, setShowForm] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [form, setForm] = useState({ nome: '', cnpj: '', email: '', telefone: '', status: 'pendente' as Status });

  const loadAgencias = async () => {
    try {
      const data = await apiFetch<Agencia>('/agencias');
      setAgencias(data);
    } catch (e) {
      console.error(e);
      Alert.alert('Erro', 'Não foi possível carregar as agências do servidor.');
    }
  };

  useEffect(() => {
    loadAgencias();
  }, []);

  const total = agencias.length;
  const aguardando = agencias.filter((a) => a.status === 'pendente').length;
  const ativas = agencias.filter((a) => a.status === 'ativo').length;

  const filtered = agencias.filter((a) => {
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      a.nome.toLowerCase().includes(q) ||
      a.cnpj.replace(/\D/g, '').includes(q.replace(/\D/g, ''));
    const matchStatus = statusFilter === 'todos' || a.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const save = async () => {
    if (!form.nome || !form.cnpj || !form.email) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos obrigatórios.');
      return;
    }
    try {
      await apiPost<Agencia>('/agencias', form);
      setForm({ nome: '', cnpj: '', email: '', telefone: '', status: 'pendente' });
      setShowForm(false);
      loadAgencias();
    } catch (e) {
      console.error(e);
      Alert.alert('Erro', 'Não foi possível adicionar a agência.');
    }
  };

  const KPIS = [
    { label: 'Total de Agências', value: total, sub: 'na base de dados', bar: '#0c2340' },
    { label: 'Aguardando Aprovação', value: aguardando, sub: 'precisam de análise', bar: '#0c2340' },
    { label: 'Agências Ativas', value: ativas, sub: 'vendendo no site', bar: '#2E7D32' },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft size={18} color="#ffffff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Gerenciar Agências</Text>
        </View>
        <Text style={styles.headerSubtitle}>
          Aprove novos parceiros, visualize documentos e controle o acesso à plataforma.
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* KPIs */}
        <View style={styles.kpiContainer}>
          {KPIS.map((k, idx) => (
            <View key={idx} style={[styles.kpiCard, { borderLeftColor: k.bar }]}>
              <Text style={styles.kpiLabel}>{k.label}</Text>
              <Text style={styles.kpiValue}>{k.value}</Text>
              <Text style={styles.kpiSub}>{k.sub}</Text>
            </View>
          ))}
        </View>

        {/* Filter & Action Buttons */}
        <View style={styles.controlRow}>
          <View style={styles.searchWrapper}>
            <Search size={16} color="#758494" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Pesquisar por nome ou CNPJ..."
              placeholderTextColor="#758494"
              value={search}
              onChangeText={setSearch}
            />
          </View>
          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => setShowFilterModal(true)}
          >
            <Text style={styles.filterButtonText}>
              Filtrar: {statusFilter.toUpperCase()}
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.newButton}
          onPress={() => setShowForm(true)}
          activeOpacity={0.9}
        >
          <PlusCircle size={16} color="#ffffff" style={{ marginRight: 8 }} />
          <Text style={styles.newButtonText}>Adicionar Nova Agência</Text>
        </TouchableOpacity>

        {/* Agency List */}
        <View style={styles.listContainer}>
          {filtered.map((item) => {
            const style = STATUS_STYLE[item.status];
            return (
              <View key={item.id} style={styles.agencyCard}>
                <View style={styles.agencyHeader}>
                  <Text style={styles.agencyName}>{item.nome}</Text>
                  <View style={[styles.statusBadge, { backgroundColor: style.bg }]}>
                    <Text style={[styles.statusBadgeText, { color: style.text }]}>
                      {style.label}
                    </Text>
                  </View>
                </View>
                <View style={styles.agencyDetails}>
                  <Text style={styles.detailText}>CNPJ: {item.cnpj}</Text>
                  <Text style={styles.detailText}>E-mail: {item.email}</Text>
                  <Text style={styles.detailText}>Tel: {item.telefone}</Text>
                </View>
              </View>
            );
          })}
          {filtered.length === 0 && (
            <Text style={styles.emptyText}>Nenhuma agência encontrada.</Text>
          )}
        </View>
      </ScrollView>

      {/* Filter Modal */}
      <Modal visible={showFilterModal} transparent={true} animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filtrar por Status</Text>
              <TouchableOpacity onPress={() => setShowFilterModal(false)}>
                <X size={20} color="#191E24" />
              </TouchableOpacity>
            </View>
            {(['todos', 'ativo', 'pendente', 'bloqueado'] as const).map((st) => (
              <TouchableOpacity
                key={st}
                style={[
                  styles.filterOption,
                  statusFilter === st ? styles.filterOptionActive : null,
                ]}
                onPress={() => {
                  setStatusFilter(st);
                  setShowFilterModal(false);
                }}
              >
                <Text
                  style={[
                    styles.filterOptionText,
                    statusFilter === st ? styles.filterOptionTextActive : null,
                  ]}
                >
                  {st.toUpperCase()}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>

      {/* Add Form Modal */}
      <Modal visible={showForm} transparent={true} animationType="slide">
        <View style={styles.modalOverlay}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.modalCard}
          >
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Adicionar Agência</Text>
              <TouchableOpacity onPress={() => setShowForm(false)}>
                <X size={20} color="#191E24" />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.formScroll}>
              <Text style={styles.formLabel}>Nome Fantasia *</Text>
              <TextInput
                style={styles.formInput}
                placeholder="Ex: Aventuras MA"
                value={form.nome}
                onChangeText={(val) => setForm((f) => ({ ...f, nome: val }))}
              />
              <Text style={styles.formLabel}>CNPJ *</Text>
              <TextInput
                style={styles.formInput}
                placeholder="Ex: 00.000.000/0000-00"
                value={form.cnpj}
                onChangeText={(val) => setForm((f) => ({ ...f, cnpj: val }))}
              />
              <Text style={styles.formLabel}>E-mail de Contato *</Text>
              <TextInput
                style={styles.formInput}
                placeholder="Ex: contato@agencia.com"
                value={form.email}
                onChangeText={(val) => setForm((f) => ({ ...f, email: val }))}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <Text style={styles.formLabel}>Telefone</Text>
              <TextInput
                style={styles.formInput}
                placeholder="Ex: (98) 99999-9999"
                value={form.telefone}
                onChangeText={(val) => setForm((f) => ({ ...f, telefone: val }))}
              />
              <TouchableOpacity style={styles.saveButton} onPress={save}>
                <Text style={styles.saveButtonText}>Adicionar Agência</Text>
              </TouchableOpacity>
            </ScrollView>
          </KeyboardAvoidingView>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F4F5F7',
  },
  header: {
    backgroundColor: '#0c2340',
    paddingTop: Platform.OS === 'ios' ? 12 : 36,
    paddingBottom: 24,
    paddingHorizontal: 16,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  backButton: {
    padding: 6,
    marginRight: 10,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  headerSubtitle: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.85)',
    lineHeight: 16,
  },
  scrollContent: {
    padding: 14,
  },
  kpiContainer: {
    gap: 10,
    marginBottom: 16,
  },
  kpiCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 14,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  kpiLabel: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#758494',
  },
  kpiValue: {
    fontSize: 24,
    fontWeight: '800',
    color: '#191E24',
    marginVertical: 4,
  },
  kpiSub: {
    fontSize: 10,
    color: '#758494',
  },
  controlRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  searchWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#E2E6EA',
    borderRadius: 10,
    paddingHorizontal: 10,
    height: 42,
  },
  searchIcon: {
    marginRight: 6,
  },
  searchInput: {
    flex: 1,
    color: '#191E24',
    fontSize: 13,
  },
  filterButton: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#E2E6EA',
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 42,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterButtonText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#0c2340',
  },
  newButton: {
    backgroundColor: '#0c2340',
    borderRadius: 10,
    height: 46,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#0c2340',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 2,
  },
  newButtonText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: 'bold',
  },
  listContainer: {
    gap: 10,
  },
  agencyCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  agencyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  agencyName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#191E24',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  statusBadgeText: {
    fontSize: 9,
    fontWeight: 'bold',
  },
  agencyDetails: {
    gap: 2,
  },
  detailText: {
    fontSize: 12,
    color: '#758494',
  },
  emptyText: {
    textAlign: 'center',
    padding: 24,
    color: '#758494',
    fontSize: 13,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderColor: '#E2E6EA',
    paddingBottom: 10,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#191E24',
  },
  filterOption: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderColor: '#E2E6EA',
    alignItems: 'center',
  },
  filterOptionActive: {
    backgroundColor: '#E8EDF4',
  },
  filterOptionText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#191E24',
  },
  filterOptionTextActive: {
    color: '#0c2340',
    fontWeight: 'bold',
  },
  formScroll: {
    maxHeight: 400,
  },
  formLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#758494',
    marginBottom: 6,
    marginTop: 10,
  },
  formInput: {
    backgroundColor: '#F4F5F7',
    borderWidth: 1,
    borderColor: '#E2E6EA',
    borderRadius: 8,
    height: 44,
    paddingHorizontal: 12,
    color: '#191E24',
    fontSize: 13,
  },
  saveButton: {
    backgroundColor: '#0c2340',
    borderRadius: 10,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
