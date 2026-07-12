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
import { ArrowLeft, Search, PlusCircle, Edit2, X } from 'lucide-react-native';
import { apiFetch, apiPost, apiPut } from '@/utils/api';

interface Servico {
  id: number;
  nome: string;
  categoria: string;
  preco: string;
  status: string;
}

const CATEGORIAS = ['Hotel', 'Transporte', 'Seguro viagem', 'Guia turístico', 'Passeio'];

const STATUS_COLOR: Record<string, { bg: string; text: string }> = {
  ativo: { bg: '#E8F5E9', text: '#2E7D32' },
  inativo: { bg: '#EEEEEE', text: '#616161' },
};

export default function Servicos() {
  const router = useRouter();
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<Servico | null>(null);
  const [form, setForm] = useState({ nome: '', categoria: 'Hotel', preco: '', status: 'ativo' });

  const loadServicos = async () => {
    try {
      const data = await apiFetch<Servico>('/servicos');
      setServicos(data);
    } catch (e) {
      console.error(e);
      Alert.alert('Erro', 'Não foi possível carregar os serviços.');
    }
  };

  useEffect(() => {
    loadServicos();
  }, []);

  const filtered = servicos.filter(
    (s) =>
      s.nome.toLowerCase().includes(search.toLowerCase()) ||
      s.categoria.toLowerCase().includes(search.toLowerCase())
  );

  const openNew = () => {
    setEditing(null);
    setForm({ nome: '', categoria: 'Hotel', preco: '', status: 'ativo' });
    setModal(true);
  };

  const openEdit = (s: Servico) => {
    setEditing(s);
    setForm({ nome: s.nome, categoria: s.categoria, preco: s.preco, status: s.status });
    setModal(true);
  };

  const save = async () => {
    if (!form.nome.trim() || !form.preco.trim()) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos obrigatórios.');
      return;
    }
    try {
      const payload = editing ? { id: editing.id, ...form } : form;
      await apiPost<Servico>('/servicos', payload);
      setModal(false);
      loadServicos();
    } catch (e) {
      console.error(e);
      Alert.alert('Erro', 'Não foi possível salvar o serviço.');
    }
  };

  const toggleStatus = async (id: number, currentStatus: string) => {
    const nextStatus = currentStatus === 'ativo' ? 'inativo' : 'ativo';
    try {
      await apiPut(`/servicos/${id}/status?status=${nextStatus}`);
      loadServicos();
    } catch (e) {
      console.error(e);
      Alert.alert('Erro', 'Não foi possível atualizar o status do serviço.');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft size={18} color="#ffffff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Serviços Disponíveis</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Controls */}
        <View style={styles.controlRow}>
          <View style={styles.searchWrapper}>
            <Search size={16} color="#758494" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar serviço..."
              placeholderTextColor="#758494"
              value={search}
              onChangeText={setSearch}
            />
          </View>
          <TouchableOpacity style={styles.newButton} onPress={openNew}>
            <PlusCircle size={16} color="#ffffff" style={{ marginRight: 6 }} />
            <Text style={styles.newButtonText}>Novo</Text>
          </TouchableOpacity>
        </View>

        {/* List */}
        <View style={styles.listContainer}>
          {filtered.map((item) => {
            const s = STATUS_COLOR[item.status] || { bg: '#EEEEEE', text: '#616161' };
            return (
              <View key={item.id} style={styles.card}>
                <View style={styles.cardHeader}>
                  <View style={styles.headerText}>
                    <Text style={styles.cardTitle}>{item.nome}</Text>
                    <Text style={styles.cardCategory}>{item.categoria}</Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => toggleStatus(item.id, item.status)}
                    style={[styles.statusBadge, { backgroundColor: s.bg }]}
                  >
                    <Text style={[styles.statusBadgeText, { color: s.text }]}>
                      {item.status.toUpperCase()}
                    </Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.cardFooter}>
                  <Text style={styles.cardPrice}>{item.preco}</Text>
                  <TouchableOpacity style={styles.editBtn} onPress={() => openEdit(item)}>
                    <Edit2 size={12} color="#0c2340" style={{ marginRight: 4 }} />
                    <Text style={styles.editBtnText}>Editar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}
          {filtered.length === 0 && (
            <Text style={styles.emptyText}>Nenhum serviço encontrado.</Text>
          )}
        </View>
      </ScrollView>

      {/* Form Modal */}
      <Modal visible={modal} transparent={true} animationType="slide">
        <View style={styles.modalOverlay}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.modalCard}
          >
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editing ? 'Editar Serviço' : 'Adicionar Serviço'}
              </Text>
              <TouchableOpacity onPress={() => setModal(false)}>
                <X size={20} color="#191E24" />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.formScroll}>
              <Text style={styles.formLabel}>Nome do Serviço *</Text>
              <TextInput
                style={styles.formInput}
                placeholder="Ex: Hospedagem Premium"
                value={form.nome}
                onChangeText={(val) => setForm((f) => ({ ...f, nome: val }))}
              />
              <Text style={styles.formLabel}>Categoria</Text>
              <View style={styles.categorySelectContainer}>
                {CATEGORIAS.map((cat) => (
                  <TouchableOpacity
                    key={cat}
                    style={[
                      styles.categoryOption,
                      form.categoria === cat ? styles.categoryOptionActive : null,
                    ]}
                    onPress={() => setForm((f) => ({ ...f, categoria: cat }))}
                  >
                    <Text
                      style={[
                        styles.categoryOptionText,
                        form.categoria === cat ? styles.categoryOptionTextActive : null,
                      ]}
                    >
                      {cat}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              <Text style={styles.formLabel}>Preço / Tarifa *</Text>
              <TextInput
                style={styles.formInput}
                placeholder="Ex: R$ 450/noite ou R$ 120"
                value={form.preco}
                onChangeText={(val) => setForm((f) => ({ ...f, preco: val }))}
              />
              <TouchableOpacity style={styles.saveButton} onPress={save}>
                <Text style={styles.saveButtonText}>Salvar Serviço</Text>
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
  controlRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
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
  newButton: {
    backgroundColor: '#0c2340',
    borderRadius: 10,
    height: 42,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
  },
  newButtonText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: 'bold',
  },
  listContainer: {
    gap: 12,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  headerText: {
    flex: 1,
    marginRight: 8,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#191E24',
  },
  cardCategory: {
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
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: '#F4F5F7',
    paddingTop: 10,
  },
  cardPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0c2340',
  },
  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    height: 28,
    borderRadius: 6,
    backgroundColor: '#E8EDF4',
  },
  editBtnText: {
    fontSize: 11,
    fontWeight: 'bold',
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
    marginBottom: 10,
  },
  categorySelectContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 10,
  },
  categoryOption: {
    borderWidth: 1,
    borderColor: '#E2E6EA',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  categoryOptionActive: {
    backgroundColor: '#E8EDF4',
    borderColor: '#0c2340',
  },
  categoryOptionText: {
    fontSize: 12,
    color: '#191E24',
  },
  categoryOptionTextActive: {
    color: '#0c2340',
    fontWeight: 'bold',
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
