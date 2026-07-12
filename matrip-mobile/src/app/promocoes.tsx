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
import { ArrowLeft, Tag, Search, PlusCircle, Edit2, Trash2, X, Percent, MapPin, Calendar } from 'lucide-react-native';
import { apiFetch, apiPost, apiDelete } from '@/utils/api';

interface Promocao {
  id: number;
  nome: string;
  destino: string;
  desconto: number;
  validade: string;
  status: string;
}

const STATUS_COLOR: Record<string, { bg: string; text: string }> = {
  ativa: { bg: '#E8F5E9', text: '#2E7D32' },
  expirada: { bg: '#EEEEEE', text: '#616161' },
};

export default function Promocoes() {
  const router = useRouter();
  const [promos, setPromos] = useState<Promocao[]>([]);
  const [search, setSearch] = useState('');
  const [filterActive, setFilterActive] = useState(false);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<Promocao | null>(null);
  const [form, setForm] = useState({ nome: '', destino: '', desconto: '', validade: '', status: 'ativa' });

  const loadPromos = async () => {
    try {
      const data = await apiFetch<Promocao>('/promocoes');
      setPromos(data);
    } catch (e) {
      console.error(e);
      Alert.alert('Erro', 'Não foi possível carregar as promoções.');
    }
  };

  useEffect(() => {
    loadPromos();
  }, []);

  const filtered = promos.filter((p) => {
    const matchSearch =
      p.nome.toLowerCase().includes(search.toLowerCase()) ||
      p.destino.toLowerCase().includes(search.toLowerCase());
    const matchFilter = !filterActive || p.status === 'ativa';
    return matchSearch && matchFilter;
  });

  const openNew = () => {
    setEditing(null);
    setForm({ nome: '', destino: '', desconto: '', validade: '', status: 'ativa' });
    setModal(true);
  };

  const openEdit = (p: Promocao) => {
    setEditing(p);
    setForm({
      nome: p.nome,
      destino: p.destino,
      desconto: String(p.desconto),
      validade: p.validade,
      status: p.status,
    });
    setModal(true);
  };

  const save = async () => {
    if (!form.nome.trim()) {
      Alert.alert('Erro', 'Por favor, preencha o nome da promoção.');
      return;
    }
    try {
      const payload = editing
        ? { id: editing.id, ...form, desconto: Number(form.desconto) }
        : { ...form, desconto: Number(form.desconto) };
      await apiPost<Promocao>('/promocoes', payload);
      setModal(false);
      loadPromos();
    } catch (e) {
      console.error(e);
      Alert.alert('Erro', 'Não foi possível salvar a promoção.');
    }
  };

  const remove = (id: number) => {
    Alert.alert('Excluir Promoção', 'Deseja realmente remover esta promoção?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Remover',
        style: 'destructive',
        onPress: async () => {
          try {
            await apiDelete(`/promocoes/${id}`);
            loadPromos();
          } catch (e) {
            console.error(e);
            Alert.alert('Erro', 'Não foi possível remover a promoção.');
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
          <Text style={styles.headerTitle}>Promoções</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Controls */}
        <View style={styles.controlRow}>
          <View style={styles.searchWrapper}>
            <Search size={16} color="#758494" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar promoção..."
              placeholderTextColor="#758494"
              value={search}
              onChangeText={setSearch}
            />
          </View>
          <TouchableOpacity
            style={[styles.filterBtn, filterActive ? styles.filterBtnActive : null]}
            onPress={() => setFilterActive(!filterActive)}
          >
            <Text style={[styles.filterBtnText, filterActive ? styles.filterBtnTextActive : null]}>
              {filterActive ? 'Somente Ativas' : 'Todas'}
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.newButton} onPress={openNew} activeOpacity={0.9}>
          <PlusCircle size={16} color="#ffffff" style={{ marginRight: 8 }} />
          <Text style={styles.newButtonText}>Nova Promoção</Text>
        </TouchableOpacity>

        {/* List */}
        <View style={styles.listContainer}>
          {filtered.map((item) => {
            const s = STATUS_COLOR[item.status] || { bg: '#EEEEEE', text: '#616161' };
            return (
              <View key={item.id} style={styles.card}>
                <View style={styles.cardHeader}>
                  <View style={styles.iconWrapper}>
                    <Percent size={18} color="#0c2340" />
                  </View>
                  <View style={styles.headerText}>
                    <Text style={styles.cardTitle}>{item.nome}</Text>
                    <View style={styles.metaRow}>
                      <MapPin size={12} color="#758494" />
                      <Text style={styles.metaText}>{item.destino}</Text>
                    </View>
                  </View>
                  <View style={[styles.statusBadge, { backgroundColor: s.bg }]}>
                    <Text style={[styles.statusBadgeText, { color: s.text }]}>
                      {item.status.toUpperCase()}
                    </Text>
                  </View>
                </View>

                <View style={styles.cardBody}>
                  <Text style={styles.bodyText}>Desconto: {item.desconto}% OFF</Text>
                  <View style={styles.dateRow}>
                    <Calendar size={12} color="#758494" />
                    <Text style={styles.dateText}>Validade: {item.validade}</Text>
                  </View>
                </View>

                <View style={styles.actionRow}>
                  <TouchableOpacity style={styles.editBtn} onPress={() => openEdit(item)}>
                    <Edit2 size={11} color="#758494" />
                    <Text style={styles.editBtnText}>Editar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.deleteBtn} onPress={() => remove(item.id)}>
                    <Trash2 size={12} color="#C62828" />
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}
          {filtered.length === 0 && (
            <Text style={styles.emptyText}>Nenhuma promoção encontrada.</Text>
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
                {editing ? 'Editar Promoção' : 'Adicionar Promoção'}
              </Text>
              <TouchableOpacity onPress={() => setModal(false)}>
                <X size={20} color="#191E24" />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.formScroll}>
              <Text style={styles.formLabel}>Nome da Promoção *</Text>
              <TextInput
                style={styles.formInput}
                placeholder="Ex: Verão nos Lençóis"
                value={form.nome}
                onChangeText={(val) => setForm((f) => ({ ...f, nome: val }))}
              />
              <Text style={styles.formLabel}>Destino *</Text>
              <TextInput
                style={styles.formInput}
                placeholder="Ex: Lençóis Maranhenses"
                value={form.destino}
                onChangeText={(val) => setForm((f) => ({ ...f, destino: val }))}
              />
              <Text style={styles.formLabel}>Desconto (%) *</Text>
              <TextInput
                style={styles.formInput}
                placeholder="Ex: 25"
                value={form.desconto}
                onChangeText={(val) => setForm((f) => ({ ...f, desconto: val }))}
                keyboardType="numeric"
              />
              <Text style={styles.formLabel}>Validade *</Text>
              <TextInput
                style={styles.formInput}
                placeholder="Ex: 30/06/2025"
                value={form.validade}
                onChangeText={(val) => setForm((f) => ({ ...f, validade: val }))}
              />
              <TouchableOpacity style={styles.saveButton} onPress={save}>
                <Text style={styles.saveButtonText}>Salvar Promoção</Text>
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
  filterBtn: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#E2E6EA',
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 42,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterBtnActive: {
    borderColor: '#0c2340',
    backgroundColor: '#E8EDF4',
  },
  filterBtnText: {
    fontSize: 12,
    color: '#758494',
    fontWeight: '500',
  },
  filterBtnTextActive: {
    color: '#0c2340',
    fontWeight: 'bold',
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
    alignItems: 'center',
    marginBottom: 12,
  },
  iconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#E8EDF4',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  headerText: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#191E24',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  metaText: {
    fontSize: 11,
    color: '#758494',
    marginLeft: 4,
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
  cardBody: {
    backgroundColor: '#F4F5F7',
    borderRadius: 10,
    padding: 12,
    gap: 6,
    marginBottom: 12,
  },
  bodyText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#0c2340',
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 11,
    color: '#758494',
    marginLeft: 6,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 8,
  },
  editBtn: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#F4F5F7',
    borderRadius: 8,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  editBtnText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#758494',
  },
  deleteBtn: {
    backgroundColor: '#FFEBEE',
    borderRadius: 8,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
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
