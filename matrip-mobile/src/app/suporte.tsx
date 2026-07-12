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
} from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Search, MessageSquare, X } from 'lucide-react-native';
import { apiFetch } from '@/utils/api';

type Status = 'ABERTO' | 'EM ATENDIMENTO' | 'RESOLVIDO';
type Urgencia = 'Alta' | 'Média' | 'Baixa';

interface Ticket {
  id: number;
  ticket: string;
  nome: string;
  assunto: string;
  urgencia: Urgencia;
  status: Status;
}

const STATUS_STYLE: Record<Status, { bg: string; text: string }> = {
  ABERTO: { bg: '#FFEBEE', text: '#C62828' },
  'EM ATENDIMENTO': { bg: '#E3F2FD', text: '#2196F3' },
  RESOLVIDO: { bg: '#E8F5E9', text: '#2E7D32' },
};

const URG_COLOR: Record<Urgencia, string> = {
  Alta: '#C62828',
  Média: '#0c2340',
  Baixa: '#2E7D32',
};

const FILTERS = ['Todos os chamados', 'Aberto', 'Em Atendimento', 'Resolvido'];

export default function Suporte() {
  const router = useRouter();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [filterStatus, setFilterStatus] = useState('Todos os chamados');
  const [search, setSearch] = useState('');
  const [showFilterModal, setShowFilterModal] = useState(false);

  const loadTickets = async () => {
    try {
      const data = await apiFetch<Ticket>('/suporte');
      setTickets(data);
    } catch (e) {
      console.error(e);
      Alert.alert('Erro', 'Não foi possível carregar os chamados.');
    }
  };

  useEffect(() => {
    loadTickets();
  }, []);

  const filtered = tickets.filter(
    (t) =>
      (filterStatus === 'Todos os chamados' || t.status === filterStatus.toUpperCase()) &&
      (!search ||
        t.ticket.toLowerCase().includes(search.toLowerCase()) ||
        t.nome.toLowerCase().includes(search.toLowerCase()) ||
        t.assunto.toLowerCase().includes(search.toLowerCase()))
  );

  const handleOpenTicket = (ticket: string) => {
    Alert.alert('Chamado', `Visualizando histórico e mensagens do chamado ${ticket}`);
  };

  const chamadosAbertos = tickets.filter((t) => t.status === 'ABERTO').length;
  const emAtendimento = tickets.filter((t) => t.status === 'EM ATENDIMENTO').length;

  const KPIS = [
    { label: 'Chamados Abertos', value: String(chamadosAbertos), desc: 'Aguardando resposta', bar: '#ef4444' },
    { label: 'Em Atendimento', value: String(emAtendimento), desc: 'Sendo analisados', bar: '#0c2340' },
    { label: 'Tempo Médio', value: '45 min', desc: 'Resposta rápida', bar: '#2E7D32' },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft size={18} color="#ffffff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Central de Suporte</Text>
        </View>
        <Text style={styles.headerSubtitle}>
          Gerencie chamados de usuários, guias e agências parceiras.
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* KPIs */}
        <View style={styles.kpiContainer}>
          {KPIS.map((k, idx) => (
            <View key={idx} style={[styles.kpiCard, { borderLeftColor: k.bar }]}>
              <Text style={styles.kpiLabel}>{k.label}</Text>
              <Text style={[styles.kpiValue, { color: k.bar }]}>{k.value}</Text>
              <Text style={styles.kpiDesc}>{k.desc}</Text>
            </View>
          ))}
        </View>

        {/* Controls */}
        <View style={styles.controlCard}>
          <View style={styles.controlRow}>
            <TouchableOpacity
              style={styles.selectButton}
              onPress={() => setShowFilterModal(true)}
            >
              <Text style={styles.selectButtonText}>Filtro: {filterStatus}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.searchWrapper}>
            <Search size={16} color="#758494" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar chamado por ID, nome, assunto..."
              placeholderTextColor="#758494"
              value={search}
              onChangeText={setSearch}
            />
          </View>
        </View>

        {/* Tickets List */}
        <View style={styles.listContainer}>
          {filtered.map((item, idx) => {
            const s = STATUS_STYLE[item.status] || { bg: '#EEEEEE', text: '#616161' };
            const urgColor = URG_COLOR[item.urgencia] || '#758494';
            return (
              <View key={idx} style={styles.card}>
                <View style={styles.cardHeader}>
                  <View style={styles.headerMain}>
                    <Text style={styles.cardTicket}>{item.ticket}</Text>
                    <Text style={styles.cardNome}>{item.nome}</Text>
                  </View>
                  <View style={[styles.statusBadge, { backgroundColor: s.bg }]}>
                    <Text style={[styles.statusBadgeText, { color: s.text }]}>
                      {item.status}
                    </Text>
                  </View>
                </View>

                <View style={styles.cardBody}>
                  <Text style={styles.cardSubject}>{item.assunto}</Text>
                  <View style={styles.metaRow}>
                    <Text style={styles.metaLabel}>Urgência:</Text>
                    <Text style={[styles.metaVal, { color: urgColor }]}>{item.urgencia}</Text>
                  </View>
                </View>

                <TouchableOpacity
                  style={styles.actionBtn}
                  onPress={() => handleOpenTicket(item.ticket)}
                >
                  <MessageSquare size={14} color="#0c2340" style={{ marginRight: 6 }} />
                  <Text style={styles.actionBtnText}>Responder / Ver Mensagens</Text>
                </TouchableOpacity>
              </View>
            );
          })}
          {filtered.length === 0 && (
            <Text style={styles.emptyText}>Nenhum chamado encontrado.</Text>
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
            {FILTERS.map((f) => (
              <TouchableOpacity
                key={f}
                style={[
                  styles.filterOption,
                  filterStatus === f ? styles.filterOptionActive : null,
                ]}
                onPress={() => {
                  setFilterStatus(f);
                  setShowFilterModal(false);
                }}
              >
                <Text
                  style={[
                    styles.filterOptionText,
                    filterStatus === f ? styles.filterOptionTextActive : null,
                  ]}
                >
                  {f}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
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
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  kpiCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 10,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  kpiLabel: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#758494',
    lineHeight: 12,
  },
  kpiValue: {
    fontSize: 18,
    fontWeight: '800',
    marginVertical: 4,
  },
  kpiDesc: {
    fontSize: 8,
    color: '#9AABBD',
  },
  controlCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
    gap: 10,
  },
  controlRow: {
    flexDirection: 'row',
  },
  selectButton: {
    flex: 1,
    backgroundColor: '#F4F5F7',
    borderWidth: 1,
    borderColor: '#E2E6EA',
    borderRadius: 8,
    height: 38,
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  selectButtonText: {
    fontSize: 12,
    color: '#191E24',
    fontWeight: '500',
  },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F4F5F7',
    borderWidth: 1,
    borderColor: '#E2E6EA',
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 38,
  },
  searchIcon: {
    marginRight: 6,
  },
  searchInput: {
    flex: 1,
    color: '#191E24',
    fontSize: 12,
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
    marginBottom: 8,
  },
  headerMain: {
    flex: 1,
    marginRight: 8,
  },
  cardTicket: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#0c2340',
  },
  cardNome: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#191E24',
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
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
  cardSubject: {
    fontSize: 12,
    fontWeight: '500',
    color: '#191E24',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaLabel: {
    fontSize: 11,
    color: '#758494',
  },
  metaVal: {
    fontSize: 11,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#0c2340',
    borderRadius: 10,
    height: 38,
  },
  actionBtnText: {
    color: '#0c2340',
    fontSize: 12,
    fontWeight: 'bold',
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
});
