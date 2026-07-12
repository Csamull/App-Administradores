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
import { ArrowLeft, Search, ShoppingBag, Eye, X } from 'lucide-react-native';
import { apiFetch, apiPut } from '@/utils/api';

interface Pedido {
  id: number;
  cliente: string;
  destino: string;
  dataViagem: string;
  valor: string;
  status: 'pendente' | 'confirmado' | 'cancelado';
}

const STATUS_STYLE: Record<string, { bg: string; text: string; label: string }> = {
  pendente: { bg: '#FFFDE7', text: '#F57F17', label: 'Pendente' },
  confirmado: { bg: '#E8F5E9', text: '#2E7D32', label: 'Confirmado' },
  cancelado: { bg: '#FFEBEE', text: '#C62828', label: 'Cancelado' },
};

export default function Pedidos() {
  const router = useRouter();
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('todos');
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [detail, setDetail] = useState<Pedido | null>(null);

  const loadPedidos = async () => {
    try {
      const data = await apiFetch<Pedido>('/pedidos');
      setPedidos(data);
    } catch (e) {
      console.error(e);
      Alert.alert('Erro', 'Não foi possível carregar os pedidos.');
    }
  };

  useEffect(() => {
    loadPedidos();
  }, []);

  const filtered = pedidos.filter((p) => {
    const matchSearch =
      p.cliente.toLowerCase().includes(search.toLowerCase()) ||
      p.destino.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'todos' || p.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const changeStatus = async (id: number, status: Pedido['status']) => {
    try {
      await apiPut(`/pedidos/${id}/status?status=${status}`);
      loadPedidos();
      if (detail?.id === id) {
        setDetail((d) => d ? { ...d, status } : null);
      }
    } catch (e) {
      console.error(e);
      Alert.alert('Erro', 'Não foi possível atualizar o status do pedido.');
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
          <Text style={styles.headerTitle}>Pedidos de Clientes</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Controls */}
        <View style={styles.controlRow}>
          <View style={styles.searchWrapper}>
            <Search size={16} color="#758494" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Pesquisar por cliente ou destino..."
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
              Filtrar: {filterStatus.toUpperCase()}
            </Text>
          </TouchableOpacity>
        </View>

        {/* List */}
        <View style={styles.listContainer}>
          {filtered.map((item) => {
            const style = STATUS_STYLE[item.status] || { bg: '#EEEEEE', text: '#616161', label: item.status };
            return (
              <View key={item.id} style={styles.card}>
                <View style={styles.cardHeader}>
                  <View style={styles.iconWrapper}>
                    <ShoppingBag size={18} color="#0c2340" />
                  </View>
                  <View style={styles.headerText}>
                    <Text style={styles.cardTitle}>Pedido #{item.id}</Text>
                    <Text style={styles.cardDest}>{item.destino}</Text>
                  </View>
                  <View style={[styles.statusBadge, { backgroundColor: style.bg }]}>
                    <Text style={[styles.statusBadgeText, { color: style.text }]}>
                      {style.label.toUpperCase()}
                    </Text>
                  </View>
                </View>

                <View style={styles.cardBody}>
                  <Text style={styles.bodyText}>Cliente: {item.cliente}</Text>
                  <Text style={styles.bodyText}>Valor: {item.valor}</Text>
                  <Text style={styles.bodyText}>Data da Viagem: {item.dataViagem}</Text>
                </View>

                <TouchableOpacity
                  style={styles.detailBtn}
                  onPress={() => setDetail(item)}
                >
                  <Eye size={14} color="#0c2340" style={{ marginRight: 6 }} />
                  <Text style={styles.detailBtnText}>Visualizar Detalhes</Text>
                </TouchableOpacity>
              </View>
            );
          })}
          {filtered.length === 0 && (
            <Text style={styles.emptyText}>Nenhum pedido encontrado.</Text>
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
            {['todos', 'confirmado', 'pendente', 'cancelado'].map((opt) => (
              <TouchableOpacity
                key={opt}
                style={[
                  styles.filterOption,
                  filterStatus === opt ? styles.filterOptionActive : null,
                ]}
                onPress={() => {
                  setFilterStatus(opt);
                  setShowFilterModal(false);
                }}
              >
                <Text
                  style={[
                    styles.filterOptionText,
                    filterStatus === opt ? styles.filterOptionTextActive : null,
                  ]}
                >
                  {opt.toUpperCase()}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>

      {/* Detail Modal */}
      <Modal visible={detail !== null} transparent={true} animationType="fade">
        <View style={styles.overlayFade}>
          <View style={styles.detailModalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Detalhes do Pedido #{detail?.id}</Text>
              <TouchableOpacity onPress={() => setDetail(null)}>
                <X size={20} color="#191E24" />
              </TouchableOpacity>
            </View>

            {detail && (
              <View style={styles.detailContent}>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Cliente:</Text>
                  <Text style={styles.detailVal}>{detail.cliente}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Destino:</Text>
                  <Text style={styles.detailVal}>{detail.destino}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Data da Viagem:</Text>
                  <Text style={styles.detailVal}>{detail.dataViagem}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Valor Total:</Text>
                  <Text style={styles.detailVal}>{detail.valor}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Status Atual:</Text>
                  <Text style={styles.detailVal}>{detail.status.toUpperCase()}</Text>
                </View>

                {/* Actions to change status */}
                <View style={styles.statusActions}>
                  <TouchableOpacity
                    style={[styles.statusActionBtn, { backgroundColor: '#E8F5E9' }]}
                    onPress={() => changeStatus(detail.id, 'confirmado')}
                  >
                    <Text style={{ color: '#2E7D32', fontWeight: 'bold', fontSize: 11 }}>
                      Confirmar
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.statusActionBtn, { backgroundColor: '#FFFDE7' }]}
                    onPress={() => changeStatus(detail.id, 'pendente')}
                  >
                    <Text style={{ color: '#F57F17', fontWeight: 'bold', fontSize: 11 }}>
                      Pendente
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.statusActionBtn, { backgroundColor: '#FFEBEE' }]}
                    onPress={() => changeStatus(detail.id, 'cancelado')}
                  >
                    <Text style={{ color: '#C62828', fontWeight: 'bold', fontSize: 11 }}>
                      Cancelar
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
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
    justifyContent: 'space-between',
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
  cardDest: {
    fontSize: 12,
    color: '#758494',
    marginTop: 2,
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
    gap: 4,
    marginBottom: 12,
  },
  bodyText: {
    fontSize: 12,
    color: '#191E24',
  },
  detailBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#0c2340',
    borderRadius: 10,
    height: 38,
  },
  detailBtnText: {
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
  overlayFade: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  detailModalCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
  },
  detailContent: {
    gap: 10,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderColor: '#F4F5F7',
  },
  detailLabel: {
    fontSize: 13,
    color: '#758494',
  },
  detailVal: {
    fontSize: 13,
    fontWeight: '600',
    color: '#191E24',
  },
  statusActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 6,
    marginTop: 16,
  },
  statusActionBtn: {
    flex: 1,
    height: 38,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
