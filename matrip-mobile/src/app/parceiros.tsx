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
import { ArrowLeft, Search, PlusCircle, Edit2, Trash2, X, Handshake } from 'lucide-react-native';
import { apiFetch, apiPost, apiDelete } from '@/utils/api';

interface Parceiro {
  id: number;
  nome: string;
  categoria: string;
  status: 'ativo' | 'pendente' | 'inativo';
}

const CATEGORIAS = ['Hotel', 'Companhia Aérea', 'Seguro Viagem', 'Transporte', 'Restaurante', 'Passeio'];

const STATUS_STYLE: Record<string, { bg: string; text: string }> = {
  ativo: { bg: '#E8F5E9', text: '#2E7D32' },
  pendente: { bg: '#FFFDE7', text: '#F57F17' },
  inativo: { bg: '#EEEEEE', text: '#616161' },
};

const CAT_COLORS: Record<string, string> = {
  Hotel: '#E3F2FD',
  'Companhia Aérea': '#F3E5F5',
  'Seguro Viagem': '#E8F5E9',
  Transporte: '#E8EDF4',
  Restaurante: '#FFEBEE',
  Passeio: '#E0F7FA',
};

export default function Parceiros() {
  const router = useRouter();
  const [parceiros, setParceiros] = useState<Parceiro[]>([]);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Parceiro | null>(null);
  const [form, setForm] = useState({ nome: '', categoria: 'Hotel', status: 'ativo' as Parceiro['status'] });

  const loadParceiros = async () => {
    try {
      const data = await apiFetch<Parceiro>('/parceiros');
      setParceiros(data);
    } catch (e) {
      console.error(e);
      Alert.alert('Erro', 'Não foi possível carregar os parceiros.');
    }
  };

  useEffect(() => {
    loadParceiros();
  }, []);

  const filtered = parceiros.filter(
    (p) =>
      p.nome.toLowerCase().includes(search.toLowerCase()) ||
      p.categoria.toLowerCase().includes(search.toLowerCase())
  );

  const openNew = () => {
    setForm({ nome: '', categoria: 'Hotel', status: 'ativo' });
    setEditing(null);
    setShowForm(true);
  };

  const openEdit = (p: Parceiro) => {
    setForm({ nome: p.nome, categoria: p.categoria, status: p.status });
    setEditing(p);
    setShowForm(true);
  };

  const save = async () => {
    if (!form.nome) {
      Alert.alert('Erro', 'Por favor, informe o nome do parceiro.');
      return;
    }
    try {
      const payload = editing ? { id: editing.id, ...form } : form;
      await apiPost<Parceiro>('/parceiros', payload);
      setShowForm(false);
      loadParceiros();
    } catch (e) {
      console.error(e);
      Alert.alert('Erro', 'Não foi possível salvar o parceiro.');
    }
  };

  const remove = (id: number) => {
    Alert.alert('Remover Parceiro', 'Deseja realmente remover este parceiro?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Remover',
        style: 'destructive',
        onPress: async () => {
          try {
            await apiDelete(`/parceiros/${id}`);
            loadParceiros();
          } catch (e) {
            console.error(e);
            Alert.alert('Erro', 'Não foi possível remover o parceiro.');
          }
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft size={18} color="#ffffff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Parceiros</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Search row */}
        <View style={styles.controlRow}>
          <View style={styles.searchWrapper}>
            <Search size={16} color="#758494" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar parceiro..."
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

        {/* Cards Grid */}
        <View style={styles.grid}>
          {filtered.map((p) => {
            const s = STATUS_STYLE[p.status] || { bg: '#EEEEEE', text: '#616161' };
            const catBg = CAT_COLORS[p.categoria] || '#F4F5F7';
            return (
              <View key={p.id} style={styles.card}>
                <View style={[styles.iconWrapper, { backgroundColor: catBg }]}>
                  <Handshake size={20} color="#191E24" />
                </View>
                <View style={styles.cardDetails}>
                  <Text style={styles.cardName} numberOfLines={1}>
                    {p.nome}
                  </Text>
                  <Text style={styles.cardCategory}>{p.categoria}</Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: s.bg }]}>
                  <Text style={[styles.statusBadgeText, { color: s.text }]}>
                    {p.status.toUpperCase()}
                  </Text>
                </View>
                <View style={styles.actionRow}>
                  <TouchableOpacity style={styles.editBtn} onPress={() => openEdit(p)}>
                    <Edit2 size={11} color="#758494" />
                    <Text style={styles.editBtnText}>Editar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.deleteBtn} onPress={() => remove(p.id)}>
                    <Trash2 size={11} color="#C62828" />
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}
          {filtered.length === 0 && (
            <Text style={styles.emptyText}>Nenhum parceiro encontrado.</Text>
          )}
        </View>
      </ScrollView>

      {/* Form Modal */}
      <Modal visible={showForm} transparent={true} animationType="slide">
        <View style={styles.modalOverlay}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.modalCard}
          >
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editing ? 'Editar Parceiro' : 'Adicionar Parceiro'}
              </Text>
              <TouchableOpacity onPress={() => setShowForm(false)}>
                <X size={20} color="#191E24" />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.formScroll}>
              <Text style={styles.formLabel}>Nome do Parceiro *</Text>
              <TextInput
                style={styles.formInput}
                placeholder="Ex: Latam Airlines"
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
              <TouchableOpacity style={styles.saveButton} onPress={save}>
                <Text style={styles.saveButtonText}>Salvar Parceiro</Text>
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
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 10,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    width: '48%',
    padding: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
    gap: 8,
  },
  iconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardDetails: {
    gap: 2,
  },
  cardName: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#191E24',
  },
  cardCategory: {
    fontSize: 11,
    color: '#758494',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  statusBadgeText: {
    fontSize: 9,
    fontWeight: 'bold',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 6,
  },
  editBtn: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#F4F5F7',
    borderRadius: 8,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  editBtnText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#758494',
  },
  deleteBtn: {
    backgroundColor: '#FFEBEE',
    borderRadius: 8,
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    textAlign: 'center',
    padding: 24,
    color: '#758494',
    fontSize: 13,
    width: '100%',
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
    marginBottom: 12,
  },
  categorySelectContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
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
