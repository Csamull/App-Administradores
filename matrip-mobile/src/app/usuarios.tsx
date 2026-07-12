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
import { ArrowLeft, Users as UsersIcon, Search, Download, UserCheck, UserX, UserPlus, PlusCircle, X } from 'lucide-react-native';
import { apiFetch, apiPost, apiPut } from '@/utils/api';

interface Usuario {
  id: number;
  nome: string;
  email: string;
  cpf: string;
  status: 'ativo' | 'bloqueado';
  criadoEm: string;
}

export default function Usuarios() {
  const router = useRouter();
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ nome: '', email: '', cpf: '', status: 'ativo' as Usuario['status'] });

  const loadUsuarios = async () => {
    try {
      const data = await apiFetch<Usuario>('/usuarios');
      setUsuarios(data);
    } catch (e) {
      console.error(e);
      Alert.alert('Erro', 'Não foi possível carregar os usuários do servidor.');
    }
  };

  useEffect(() => {
    loadUsuarios();
  }, []);

  const now = new Date();
  const novosMes = usuarios.filter((u) => {
    const d = new Date(u.criadoEm);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).length;
  const ativos = usuarios.filter((u) => u.status === 'ativo').length;
  const bloqueados = usuarios.filter((u) => u.status === 'bloqueado').length;

  const filtered = usuarios.filter((u) => {
    const q = search.toLowerCase();
    return (
      u.nome.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.cpf.replace(/\D/g, '').includes(q.replace(/\D/g, ''))
    );
  });

  const handleExport = () => {
    Alert.alert('Exportar Relatório', 'Relatório CSV gerado com sucesso. (Funcionalidade mockada no mobile)');
  };

  const toggleStatus = async (id: number, currentStatus: string) => {
    const nextStatus = currentStatus === 'ativo' ? 'bloqueado' : 'ativo';
    try {
      await apiPut(`/usuarios/${id}/status?status=${nextStatus}`);
      loadUsuarios();
    } catch (e) {
      console.error(e);
      Alert.alert('Erro', 'Não foi possível alterar o status do usuário.');
    }
  };

  const save = async () => {
    if (!form.nome || !form.email || !form.cpf) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos obrigatórios.');
      return;
    }
    const today = new Date().toISOString().slice(0, 10);
    try {
      await apiPost<Usuario>('/usuarios', { ...form, criadoEm: today });
      setForm({ nome: '', email: '', cpf: '', status: 'ativo' });
      setShowForm(false);
      loadUsuarios();
    } catch (e) {
      console.error(e);
      Alert.alert('Erro', 'Não foi possível adicionar o usuário.');
    }
  };

  const KPIS = [
    { label: 'Total', value: usuarios.length, icon: UsersIcon, color: '#2196F3', bg: '#E3F2FD' },
    { label: 'Novos no mês', value: novosMes, icon: UserPlus, color: '#0c2340', bg: '#E8EDF4' },
    { label: 'Ativos', value: ativos, icon: UserCheck, color: '#2E7D32', bg: '#E8F5E9' },
    { label: 'Bloqueados', value: bloqueados, icon: UserX, color: '#C62828', bg: '#FFEBEE' },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft size={18} color="#ffffff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Gerenciar Usuários</Text>
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

        {/* Controls */}
        <View style={styles.controlRow}>
          <View style={styles.searchWrapper}>
            <Search size={16} color="#758494" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Pesquisar usuário..."
              placeholderTextColor="#758494"
              value={search}
              onChangeText={setSearch}
            />
          </View>
          <TouchableOpacity style={styles.exportButton} onPress={handleExport}>
            <Download size={18} color="#0c2340" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.newButton}
          onPress={() => setShowForm(true)}
          activeOpacity={0.9}
        >
          <PlusCircle size={16} color="#ffffff" style={{ marginRight: 8 }} />
          <Text style={styles.newButtonText}>Adicionar Novo Usuário</Text>
        </TouchableOpacity>

        {/* List */}
        <View style={styles.listContainer}>
          {filtered.map((item) => (
            <View key={item.id} style={styles.userCard}>
              <View style={styles.userHeader}>
                <View>
                  <Text style={styles.userName}>{item.nome}</Text>
                  <Text style={styles.userEmail}>{item.email}</Text>
                </View>
                <TouchableOpacity
                  onPress={() => toggleStatus(item.id, item.status)}
                  style={[
                    styles.statusBadge,
                    { backgroundColor: item.status === 'ativo' ? '#E8F5E9' : '#FFEBEE' },
                  ]}
                >
                  <Text
                    style={[
                      styles.statusBadgeText,
                      { color: item.status === 'ativo' ? '#2E7D32' : '#C62828' },
                    ]}
                  >
                    {item.status.toUpperCase()}
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={styles.userDetails}>
                <Text style={styles.detailText}>CPF: {item.cpf}</Text>
                <Text style={styles.detailText}>Cadastrado em: {item.criadoEm}</Text>
              </View>
            </View>
          ))}
          {filtered.length === 0 && (
            <Text style={styles.emptyText}>Nenhum usuário encontrado.</Text>
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
              <Text style={styles.modalTitle}>Adicionar Usuário</Text>
              <TouchableOpacity onPress={() => setShowForm(false)}>
                <X size={20} color="#191E24" />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.formScroll}>
              <Text style={styles.formLabel}>Nome Completo *</Text>
              <TextInput
                style={styles.formInput}
                placeholder="Ex: Ana Silva"
                value={form.nome}
                onChangeText={(val) => setForm((f) => ({ ...f, nome: val }))}
              />
              <Text style={styles.formLabel}>E-mail *</Text>
              <TextInput
                style={styles.formInput}
                placeholder="Ex: ana.silva@email.com"
                value={form.email}
                onChangeText={(val) => setForm((f) => ({ ...f, email: val }))}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <Text style={styles.formLabel}>CPF *</Text>
              <TextInput
                style={styles.formInput}
                placeholder="Ex: 000.000.000-00"
                value={form.cpf}
                onChangeText={(val) => setForm((f) => ({ ...f, cpf: val }))}
              />
              <TouchableOpacity style={styles.saveButton} onPress={save}>
                <Text style={styles.saveButtonText}>Adicionar Usuário</Text>
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
    fontSize: 22,
    fontWeight: '800',
    color: '#191E24',
    marginTop: 4,
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
  exportButton: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#E2E6EA',
    borderRadius: 10,
    width: 42,
    height: 42,
    justifyContent: 'center',
    alignItems: 'center',
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
  userCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  userHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  userName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#191E24',
  },
  userEmail: {
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
  userDetails: {
    borderTopWidth: 1,
    borderColor: '#F4F5F7',
    paddingTop: 8,
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
