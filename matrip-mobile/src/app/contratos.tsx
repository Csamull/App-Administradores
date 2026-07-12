import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, FileText, CheckCircle2, AlertCircle } from 'lucide-react-native';
import { apiFetch, apiPut } from '@/utils/api';

interface Contrato {
  id: number;
  title: string;
  parceiro: string;
  date: string;
  value: string;
  status: 'assinado' | 'pendente';
}

export default function Contratos() {
  const router = useRouter();
  const [contratos, setContratos] = useState<Contrato[]>([]);
  const [activeTab, setActiveTab] = useState<'pendente' | 'assinado'>('pendente');

  const loadContratos = async () => {
    try {
      const data = await apiFetch<any>('/contratos');
      const mapped = data.map((c: any) => ({
        id: c.id,
        title: c.tipo,
        parceiro: c.cliente,
        date: `${c.inicio} a ${c.termino}`,
        value: c.valor,
        status: (c.status === 'ativo' ? 'assinado' : 'pendente') as 'assinado' | 'pendente',
      }));
      setContratos(mapped);
    } catch (e) {
      console.error(e);
      Alert.alert('Erro', 'Não foi possível carregar os contratos.');
    }
  };

  useEffect(() => {
    loadContratos();
  }, []);

  const handleSign = (id: number) => {
    Alert.alert('Assinar Contrato', 'Deseja confirmar a assinatura digital deste contrato?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Confirmar Assinatura',
        onPress: async () => {
          try {
            await apiPut(`/contratos/${id}/status?status=ativo`);
            loadContratos();
            Alert.alert('Sucesso', 'Contrato assinado com sucesso!');
          } catch (e) {
            console.error(e);
            Alert.alert('Erro', 'Não foi possível assinar o contrato.');
          }
        },
      },
    ]);
  };

  const filtered = contratos.filter((c) => c.status === activeTab);

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft size={18} color="#ffffff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Contratos & Acordos</Text>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'pendente' ? styles.tabActive : null]}
          onPress={() => setActiveTab('pendente')}
        >
          <Text style={[styles.tabText, activeTab === 'pendente' ? styles.tabTextActive : null]}>
            Pendentes
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'assinado' ? styles.tabActive : null]}
          onPress={() => setActiveTab('assinado')}
        >
          <Text style={[styles.tabText, activeTab === 'assinado' ? styles.tabTextActive : null]}>
            Assinados
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.listContainer}>
          {filtered.map((item) => (
            <View key={item.id} style={styles.card}>
              <View style={styles.cardHeader}>
                <View
                  style={[
                    styles.iconWrapper,
                    { backgroundColor: item.status === 'assinado' ? '#E8F5E9' : '#FFFDE7' },
                  ]}
                >
                  {item.status === 'assinado' ? (
                    <CheckCircle2 size={18} color="#2E7D32" />
                  ) : (
                    <AlertCircle size={18} color="#F57F17" />
                  )}
                </View>
                <View style={styles.headerText}>
                  <Text style={styles.cardTitle}>{item.title}</Text>
                  <Text style={styles.cardPartner}>{item.parceiro}</Text>
                </View>
              </View>

              <View style={styles.cardBody}>
                <Text style={styles.bodyText}>Valor Previsto: {item.value}</Text>
                <Text style={styles.bodyText}>Prazo / Data: {item.date}</Text>
              </View>

              {item.status === 'pendente' ? (
                <TouchableOpacity style={styles.actionBtn} onPress={() => handleSign(item.id)}>
                  <FileText size={14} color="#ffffff" style={{ marginRight: 6 }} />
                  <Text style={styles.actionBtnText}>Assinar Digitalmente</Text>
                </TouchableOpacity>
              ) : (
                <View style={styles.signedStatus}>
                  <CheckCircle2 size={14} color="#2E7D32" style={{ marginRight: 6 }} />
                  <Text style={styles.signedStatusText}>Contrato Vigente e Assinado</Text>
                </View>
              )}
            </View>
          ))}
          {filtered.length === 0 && (
            <Text style={styles.emptyText}>Nenhum contrato nesta categoria.</Text>
          )}
        </View>
      </ScrollView>
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
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderColor: '#E2E6EA',
  },
  tab: {
    flex: 1,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: '#0c2340',
  },
  tabText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#758494',
  },
  tabTextActive: {
    color: '#0c2340',
    fontWeight: 'bold',
  },
  scrollContent: {
    padding: 14,
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
  cardPartner: {
    fontSize: 12,
    color: '#758494',
    marginTop: 2,
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
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0c2340',
    borderRadius: 10,
    height: 38,
  },
  actionBtnText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  signedStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E8F5E9',
    borderRadius: 10,
    height: 38,
  },
  signedStatusText: {
    color: '#2E7D32',
    fontSize: 12,
    fontWeight: 'bold',
  },
  emptyText: {
    textAlign: 'center',
    padding: 24,
    color: '#758494',
    fontSize: 13,
  },
});
