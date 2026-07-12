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
import { ArrowLeft, Search, Download, Eye, DollarSign, X } from 'lucide-react-native';
import { apiFetch } from '@/utils/api';

interface Transacao {
  id: number;
  data: string;
  pedido: string;
  cliente: string;
  valor: string;
  status: 'PAGO' | 'PENDENTE' | 'ESTORNADO';
}

const KPIS = [
  { label: 'Receita Bruta (Mês)', value: 'R$ 12.450,00', desc: 'Total processado no site', bar: '#0c2340' },
  { label: 'A Repassar', value: 'R$ 8.900,00', desc: 'Pagamentos a guias e agências', bar: '#0c2340' },
  { label: 'Lucro Matrip', value: 'R$ 3.550,00', desc: 'Comissões líquidas da plataforma', bar: '#2E7D32' },
];

const STATUS_STYLE: Record<string, { bg: string; text: string }> = {
  PAGO: { bg: '#E8F5E9', text: '#2E7D32' },
  PENDENTE: { bg: '#FFFDE7', text: '#F57F17' },
  ESTORNADO: { bg: '#FFEBEE', text: '#C62828' },
};

const PERIODOS = ['Últimos 7 dias', 'Últimos 30 dias', 'Últimos 90 dias', 'Este ano'];

export default function Financeiro() {
  const router = useRouter();
  const [transactions, setTransactions] = useState<Transacao[]>([]);
  const [periodo, setPeriodo] = useState('Últimos 30 dias');
  const [search, setSearch] = useState('');
  const [showPeriodModal, setShowPeriodModal] = useState(false);

  const loadTransactions = async () => {
    try {
      const data = await apiFetch<Transacao>('/financeiro');
      setTransactions(data);
    } catch (e) {
      console.error(e);
      Alert.alert('Erro', 'Não foi possível carregar as transações.');
    }
  };

  useEffect(() => {
    loadTransactions();
  }, []);

  const filtered = transactions.filter(
    (t) =>
      !search ||
      t.pedido.toLowerCase().includes(search.toLowerCase()) ||
      t.cliente.toLowerCase().includes(search.toLowerCase())
  );

  const handleExport = () => {
    Alert.alert('Exportar Relatório', 'Relatório CSV exportado com sucesso.');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft size={18} color="#ffffff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Controle Financeiro</Text>
        </View>
        <Text style={styles.headerSubtitle}>
          Monitore vendas, repasses a parceiros e fluxo de caixa da plataforma.
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
              onPress={() => setShowPeriodModal(true)}
            >
              <Text style={styles.selectButtonText}>Período: {periodo}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.exportBtn} onPress={handleExport}>
              <Download size={16} color="#ffffff" style={{ marginRight: 6 }} />
              <Text style={styles.exportBtnText}>Exportar</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.searchWrapper}>
            <Search size={16} color="#758494" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar por Nº Pedido, Cliente..."
              placeholderTextColor="#758494"
              value={search}
              onChangeText={setSearch}
            />
          </View>
        </View>

        {/* Transactions Table */}
        <View style={styles.tableCard}>
          <Text style={styles.tableTitle}>Últimas Transações</Text>
          {filtered.map((item, idx) => {
            const s = STATUS_STYLE[item.status] || { bg: '#EEEEEE', text: '#616161' };
            return (
              <View
                key={idx}
                style={[
                  styles.tableRow,
                  idx === filtered.length - 1 ? styles.tableRowLast : null,
                ]}
              >
                <View style={styles.rowMain}>
                  <View style={styles.rowTop}>
                    <Text style={styles.rowPedido}>{item.pedido}</Text>
                    <Text style={styles.rowDate}>{item.data}</Text>
                  </View>
                  <Text style={styles.rowClient}>Cliente: {item.cliente}</Text>
                  <View style={styles.rowBottom}>
                    <Text style={styles.rowPrice}>{item.valor}</Text>
                    <View style={[styles.statusBadge, { backgroundColor: s.bg }]}>
                      <Text style={[styles.statusBadgeText, { color: s.text }]}>
                        {item.status}
                      </Text>
                    </View>
                  </View>
                </View>
                <TouchableOpacity style={styles.eyeBtn}>
                  <Eye size={14} color="#0c2340" />
                </TouchableOpacity>
              </View>
            );
          })}
          {filtered.length === 0 && (
            <Text style={styles.emptyText}>Nenhuma transação encontrada.</Text>
          )}
        </View>
      </ScrollView>

      {/* Period Modal */}
      <Modal visible={showPeriodModal} transparent={true} animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Selecionar Período</Text>
              <TouchableOpacity onPress={() => setShowPeriodModal(false)}>
                <X size={20} color="#191E24" />
              </TouchableOpacity>
            </View>
            {PERIODOS.map((p) => (
              <TouchableOpacity
                key={p}
                style={[
                  styles.filterOption,
                  periodo === p ? styles.filterOptionActive : null,
                ]}
                onPress={() => {
                  setPeriodo(p);
                  setShowPeriodModal(false);
                }}
              >
                <Text
                  style={[
                    styles.filterOptionText,
                    periodo === p ? styles.filterOptionTextActive : null,
                  ]}
                >
                  {p}
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
    gap: 10,
    marginBottom: 16,
  },
  kpiCard: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
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
    fontSize: 22,
    fontWeight: '800',
    marginVertical: 4,
  },
  kpiDesc: {
    fontSize: 10,
    color: '#9AABBD',
  },
  controlCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 14,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
    gap: 12,
  },
  controlRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  selectButton: {
    flex: 1,
    backgroundColor: '#F4F5F7',
    borderWidth: 1,
    borderColor: '#E2E6EA',
    borderRadius: 10,
    height: 42,
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  selectButtonText: {
    fontSize: 12,
    color: '#191E24',
    fontWeight: '500',
  },
  exportBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0c2340',
    borderRadius: 10,
    paddingHorizontal: 14,
    height: 42,
  },
  exportBtnText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F4F5F7',
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
  tableCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  tableTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#191E24',
    marginBottom: 14,
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: '#E2E6EA',
  },
  tableRowLast: {
    borderBottomWidth: 0,
  },
  rowMain: {
    flex: 1,
    gap: 4,
  },
  rowTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingRight: 8,
  },
  rowPedido: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#191E24',
  },
  rowDate: {
    fontSize: 11,
    color: '#758494',
  },
  rowClient: {
    fontSize: 12,
    color: '#758494',
  },
  rowBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: 8,
    marginTop: 4,
  },
  rowPrice: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#0c2340',
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
  eyeBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#E8EDF4',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 6,
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
