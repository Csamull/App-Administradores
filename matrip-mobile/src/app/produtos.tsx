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
import { ArrowLeft, ShoppingBag, Search, DollarSign, CheckCircle2, Clock, PlusCircle, X, MapPin, Tag } from 'lucide-react-native';
import { apiFetch, apiPost, apiPut } from '@/utils/api';

interface Produto {
  id: number;
  nome: string;
  agencia: string;
  cidade: string;
  tipo: string;
  preco: number;
  status: 'aprovado' | 'pendente';
}

const CIDADES = ['Todas', 'São Luís', 'Barreirinhas', 'Alcântara', 'Carolina', 'Tutóia'];
const TIPOS = ['Todos', 'Passeio', 'Hospedagem', 'Transporte', 'Pacote'];

export default function Produtos() {
  const router = useRouter();
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [search, setSearch] = useState('');
  const [cidade, setCidade] = useState('Todas');
  const [tipo, setTipo] = useState('Todos');
  const [showForm, setShowForm] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState<'cidade' | 'tipo' | null>(null);
  const [form, setForm] = useState({ nome: '', agencia: '', cidade: 'São Luís', tipo: 'Passeio', preco: '' });

  const loadProdutos = async () => {
    try {
      const data = await apiFetch<Produto>('/produtos');
      setProdutos(data);
    } catch (e) {
      console.error(e);
      Alert.alert('Erro', 'Não foi possível carregar os produtos.');
    }
  };

  useEffect(() => {
    loadProdutos();
  }, []);

  const total = produtos.length;
  const precoMedio = produtos.reduce((s, p) => s + p.preco, 0) / (produtos.length || 1);
  const aprovados = produtos.filter((p) => p.status === 'aprovado').length;
  const pendentes = produtos.filter((p) => p.status === 'pendente').length;

  const filtered = produtos.filter((p) => {
    const q = search.toLowerCase();
    const matchSearch = p.agencia.toLowerCase().includes(q) || p.nome.toLowerCase().includes(q);
    const matchCidade = cidade === 'Todas' || p.cidade === cidade;
    const matchTipo = tipo === 'Todos' || p.tipo === tipo;
    return matchSearch && matchCidade && matchTipo;
  });

  const save = async () => {
    if (!form.nome || !form.agencia || !form.preco) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos obrigatórios.');
      return;
    }
    try {
      await apiPost<Produto>('/produtos', {
        ...form,
        preco: Number(form.preco),
        status: 'pendente'
      });
      setForm({ nome: '', agencia: '', cidade: 'São Luís', tipo: 'Passeio', preco: '' });
      setShowForm(false);
      loadProdutos();
    } catch (e) {
      console.error(e);
      Alert.alert('Erro', 'Não foi possível adicionar o produto.');
    }
  };

  const fmt = (v: number) =>
    v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });

  const toggleStatus = async (id: number, currentStatus: string) => {
    const nextStatus = currentStatus === 'aprovado' ? 'pendente' : 'aprovado';
    try {
      await apiPut(`/produtos/${id}/status?status=${nextStatus}`);
      loadProdutos();
    } catch (e) {
      console.error(e);
      Alert.alert('Erro', 'Não foi possível atualizar o status do produto.');
    }
  };

  const KPIS = [
    { label: 'Total', value: total, icon: ShoppingBag, color: '#2196F3', bg: '#E3F2FD' },
    { label: 'Média', value: fmt(precoMedio), icon: DollarSign, color: '#0c2340', bg: '#E8EDF4' },
    { label: 'Aprovados', value: aprovados, icon: CheckCircle2, color: '#2E7D32', bg: '#E8F5E9' },
    { label: 'Pendentes', value: pendentes, icon: Clock, color: '#C62828', bg: '#FFEBEE' },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft size={18} color="#ffffff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Gerenciar Produtos</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* KPIs */}
        <View style={styles.kpiGrid}>
          {KPIS.map((k, idx) => {
            const Icon = k.icon;
            return (
              <View key={idx} style={styles.kpiCard}>
                <View style={[styles.kpiIconWrapper, { backgroundColor: k.bg }]}>
                  <Icon size={18} color={k.color} />
                </View>
                <Text style={styles.kpiLabel}>{k.label}</Text>
                <Text style={styles.kpiValue}>{k.value}</Text>
              </View>
            );
          })}
        </View>

        {/* Search */}
        <View style={styles.searchWrapper}>
          <Search size={16} color="#758494" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar por agência ou passeio..."
            placeholderTextColor="#758494"
            value={search}
            onChangeText={setSearch}
          />
        </View>

        {/* Filter Rows */}
        <View style={styles.filterRow}>
          <TouchableOpacity
            style={styles.filterSelect}
            onPress={() => setShowFilterModal('cidade')}
          >
            <Text style={styles.filterSelectLabel}>Cidade: {cidade}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.filterSelect}
            onPress={() => setShowFilterModal('tipo')}
          >
            <Text style={styles.filterSelectLabel}>Tipo: {tipo}</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.newButton}
          onPress={() => setShowForm(true)}
          activeOpacity={0.9}
        >
          <PlusCircle size={16} color="#ffffff" style={{ marginRight: 8 }} />
          <Text style={styles.newButtonText}>Adicionar Novo Produto</Text>
        </TouchableOpacity>

        {/* List */}
        <View style={styles.listContainer}>
          {filtered.map((item) => (
            <View key={item.id} style={styles.productCard}>
              <View style={styles.productHeader}>
                <View style={{ flex: 1, marginRight: 8 }}>
                  <Text style={styles.productName}>{item.nome}</Text>
                  <Text style={styles.productAgencia}>{item.agencia}</Text>
                </View>
                <TouchableOpacity
                  onPress={() => toggleStatus(item.id, item.status)}
                  style={[
                    styles.statusBadge,
                    { backgroundColor: item.status === 'aprovado' ? '#E8F5E9' : '#FFEBEE' },
                  ]}
                >
                  <Text
                    style={[
                      styles.statusBadgeText,
                      { color: item.status === 'aprovado' ? '#2E7D32' : '#C62828' },
                    ]}
                  >
                    {item.status.toUpperCase()}
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={styles.productFooter}>
                <View style={styles.metaRow}>
                  <MapPin size={12} color="#758494" />
                  <Text style={styles.metaText}>{item.cidade}</Text>
                  <Tag size={12} color="#758494" style={{ marginLeft: 8 }} />
                  <Text style={styles.metaText}>{item.tipo}</Text>
                </View>
                <Text style={styles.productPrice}>{fmt(item.preco)}</Text>
              </View>
            </View>
          ))}
          {filtered.length === 0 && (
            <Text style={styles.emptyText}>Nenhum produto encontrado.</Text>
          )}
        </View>
      </ScrollView>

      {/* Filter Modal */}
      <Modal visible={showFilterModal !== null} transparent={true} animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                Filtrar por {showFilterModal === 'cidade' ? 'Cidade' : 'Tipo'}
              </Text>
              <TouchableOpacity onPress={() => setShowFilterModal(null)}>
                <X size={20} color="#191E24" />
              </TouchableOpacity>
            </View>
            {(showFilterModal === 'cidade' ? CIDADES : TIPOS).map((opt) => (
              <TouchableOpacity
                key={opt}
                style={[
                  styles.filterOption,
                  (showFilterModal === 'cidade' ? cidade : tipo) === opt
                    ? styles.filterOptionActive
                    : null,
                ]}
                onPress={() => {
                  if (showFilterModal === 'cidade') {
                    setCidade(opt);
                  } else {
                    setTipo(opt);
                  }
                  setShowFilterModal(null);
                }}
              >
                <Text
                  style={[
                    styles.filterOptionText,
                    (showFilterModal === 'cidade' ? cidade : tipo) === opt
                      ? styles.filterOptionTextActive
                      : null,
                  ]}
                >
                  {opt}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>

      {/* Form Modal */}
      <Modal visible={showForm} transparent={true} animationType="slide">
        <View style={styles.modalOverlay}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.modalCard}
          >
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Adicionar Produto</Text>
              <TouchableOpacity onPress={() => setShowForm(false)}>
                <X size={20} color="#191E24" />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.formScroll}>
              <Text style={styles.formLabel}>Nome do Produto *</Text>
              <TextInput
                style={styles.formInput}
                placeholder="Ex: Passeio de Lancha Barreirinhas"
                value={form.nome}
                onChangeText={(val) => setForm((f) => ({ ...f, nome: val }))}
              />
              <Text style={styles.formLabel}>Agência / Fornecedor *</Text>
              <TextInput
                style={styles.formInput}
                placeholder="Ex: Horizonte Turismo"
                value={form.agencia}
                onChangeText={(val) => setForm((f) => ({ ...f, agencia: val }))}
              />
              <Text style={styles.formLabel}>Cidade</Text>
              <TextInput
                style={styles.formInput}
                placeholder="Ex: Barreirinhas"
                value={form.cidade}
                onChangeText={(val) => setForm((f) => ({ ...f, cidade: val }))}
              />
              <Text style={styles.formLabel}>Preço (R$) *</Text>
              <TextInput
                style={styles.formInput}
                placeholder="Ex: 350"
                value={form.preco}
                onChangeText={(val) => setForm((f) => ({ ...f, preco: val }))}
                keyboardType="numeric"
              />
              <TouchableOpacity style={styles.saveButton} onPress={save}>
                <Text style={styles.saveButtonText}>Adicionar Produto</Text>
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
  scrollContent: {
    padding: 14,
  },
  kpiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 16,
  },
  kpiCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    width: '48%',
    padding: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  kpiIconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  kpiLabel: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#758494',
  },
  kpiValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#191E24',
    marginTop: 4,
  },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#E2E6EA',
    borderRadius: 10,
    paddingHorizontal: 10,
    height: 42,
    marginBottom: 12,
  },
  searchIcon: {
    marginRight: 6,
  },
  searchInput: {
    flex: 1,
    color: '#191E24',
    fontSize: 13,
  },
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 12,
  },
  filterSelect: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#E2E6EA',
    borderRadius: 10,
    height: 42,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterSelectLabel: {
    fontSize: 12,
    fontWeight: '600',
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
  },
  newButtonText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: 'bold',
  },
  listContainer: {
    gap: 10,
  },
  productCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  productHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  productName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#191E24',
  },
  productAgencia: {
    fontSize: 12,
    color: '#758494',
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  statusBadgeText: {
    fontSize: 9,
    fontWeight: 'bold',
  },
  productFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: '#F4F5F7',
    paddingTop: 10,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    fontSize: 11,
    color: '#758494',
    marginLeft: 4,
  },
  productPrice: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0c2340',
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
