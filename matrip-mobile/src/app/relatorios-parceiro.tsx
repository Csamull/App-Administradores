import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, DollarSign, FileText, TrendingUp, BarChart2 } from 'lucide-react-native';

const MONTHLY = [
  { month: 'Out', vendas: 18000 },
  { month: 'Nov', vendas: 30000 },
  { month: 'Dez', vendas: 25000 },
  { month: 'Jan', vendas: 44000 },
  { month: 'Fev', vendas: 38000 },
  { month: 'Mar', vendas: 57000 },
];

const MONTHLY_ANNUAL = [
  { month: 'Jan', vendas: 44000 },
  { month: 'Fev', vendas: 38000 },
  { month: 'Mar', vendas: 57000 },
  { month: 'Abr', vendas: 42000 },
  { month: 'Mai', vendas: 51000 },
  { month: 'Jun', vendas: 63000 },
  { month: 'Jul', vendas: 72000 },
  { month: 'Ago', vendas: 58000 },
  { month: 'Set', vendas: 49000 },
  { month: 'Out', vendas: 66000 },
  { month: 'Nov', vendas: 78000 },
  { month: 'Dez', vendas: 85000 },
];

const BY_SERVICE = [
  { name: 'Hotel', vendas: 185000 },
  { name: 'Transporte', vendas: 92000 },
  { name: 'Seguro', vendas: 45000 },
  { name: 'Passeio', vendas: 78000 },
  { name: 'Guia', vendas: 32000 },
];

const TOP_PROMOS = [
  { nome: 'Verão nos Lençóis', vendas: 'R$ 98.000', qtd: 42 },
  { nome: 'Páscoa em Barreirinhas', vendas: 'R$ 65.000', qtd: 28 },
  { nome: 'Férias em Carolina', vendas: 'R$ 52.000', qtd: 19 },
];

export default function RelatoriosParceiro() {
  const router = useRouter();
  const [period, setPeriod] = useState<'mensal' | 'anual'>('mensal');

  const chartData = period === 'mensal' ? MONTHLY : MONTHLY_ANNUAL;
  const totalVendas = period === 'mensal' ? 'R$ 212K' : 'R$ 703K';
  const totalContratos = period === 'mensal' ? 48 : 186;

  const renderSalesChart = () => {
    const maxVal = Math.max(...chartData.map((d) => d.vendas));
    return (
      <View style={styles.chartCard}>
        <Text style={styles.chartTitle}>Vendas por mês</Text>
        <View style={styles.chartContainer}>
          {chartData.map((item, idx) => {
            const barHeight = (item.vendas / maxVal) * 100;
            return (
              <View key={idx} style={styles.chartCol}>
                <View style={styles.barTrack}>
                  <View style={[styles.barFill, { height: `${barHeight}%` }]} />
                </View>
                <Text style={styles.monthLabel}>{item.month}</Text>
                <Text style={styles.valLabel}>R$ {(item.vendas / 1000).toFixed(0)}k</Text>
              </View>
            );
          })}
        </View>
      </View>
    );
  };

  const renderServiceChart = () => {
    const maxVal = Math.max(...BY_SERVICE.map((d) => d.vendas));
    return (
      <View style={styles.chartCard}>
        <Text style={styles.chartTitle}>Vendas por tipo de serviço</Text>
        <View style={styles.chartContainer}>
          {BY_SERVICE.map((item, idx) => {
            const barHeight = (item.vendas / maxVal) * 100;
            return (
              <View key={idx} style={styles.chartCol}>
                <View style={styles.barTrack}>
                  <View style={[styles.barFill, { height: `${barHeight}%`, backgroundColor: '#9C27B0' }]} />
                </View>
                <Text style={styles.monthLabel}>{item.name}</Text>
                <Text style={styles.valLabel}>R$ {(item.vendas / 1000).toFixed(0)}k</Text>
              </View>
            );
          })}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft size={18} color="#ffffff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Relatórios de Vendas</Text>
        </View>
      </View>

      {/* Selector */}
      <View style={styles.filterBar}>
        {(['mensal', 'anual'] as const).map((p) => {
          const isActive = period === p;
          return (
            <TouchableOpacity
              key={p}
              style={[styles.filterBtn, isActive ? styles.filterBtnActive : null]}
              onPress={() => setPeriod(p)}
            >
              <Text style={[styles.filterBtnText, isActive ? styles.filterBtnTextActive : null]}>
                {p.charAt(0).toUpperCase() + p.slice(1)}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* KPIs */}
        <View style={styles.kpiGrid}>
          <View style={styles.kpiCard}>
            <View style={[styles.kpiIconWrapper, { backgroundColor: '#E8F5E9' }]}>
              <DollarSign size={18} color="#2E7D32" />
            </View>
            <Text style={styles.kpiLabel}>Total de Vendas</Text>
            <Text style={styles.kpiValue}>{totalVendas}</Text>
          </View>

          <View style={styles.kpiCard}>
            <View style={[styles.kpiIconWrapper, { backgroundColor: '#E3F2FD' }]}>
              <FileText size={18} color="#2196F3" />
            </View>
            <Text style={styles.kpiLabel}>Contratos Fechados</Text>
            <Text style={styles.kpiValue}>{totalContratos}</Text>
          </View>
        </View>

        {/* Charts */}
        {renderSalesChart()}
        {renderServiceChart()}

        {/* Top Promos */}
        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>Promoções que mais venderam</Text>
          <View style={styles.promoList}>
            {TOP_PROMOS.map((p, i) => (
              <View
                key={i}
                style={[
                  styles.promoRow,
                  i === TOP_PROMOS.length - 1 ? { borderBottomWidth: 0 } : null,
                ]}
              >
                <View style={styles.promoRank}>
                  <Text style={styles.promoRankText}>#{i + 1}</Text>
                </View>
                <View style={styles.promoInfo}>
                  <Text style={styles.promoName}>{p.nome}</Text>
                  <Text style={styles.promoSales}>
                    {p.vendas} • {p.qtd} vendas
                  </Text>
                </View>
                <TrendingUp size={16} color="#2E7D32" />
              </View>
            ))}
          </View>
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
  filterBar: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderColor: '#E2E6EA',
    paddingVertical: 10,
    paddingHorizontal: 16,
    gap: 8,
  },
  filterBtn: {
    paddingHorizontal: 16,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#F4F5F7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterBtnActive: {
    backgroundColor: '#0c2340',
  },
  filterBtnText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#758494',
  },
  filterBtnTextActive: {
    color: '#ffffff',
  },
  scrollContent: {
    padding: 14,
  },
  kpiGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 16,
  },
  kpiCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
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
    marginBottom: 10,
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
  chartCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  chartTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#191E24',
    marginBottom: 16,
  },
  chartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 140,
    paddingHorizontal: 8,
  },
  chartCol: {
    alignItems: 'center',
    flex: 1,
  },
  barTrack: {
    height: 90,
    width: 12,
    backgroundColor: '#F4F5F7',
    borderRadius: 6,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  barFill: {
    width: '100%',
    backgroundColor: '#0c2340',
    borderRadius: 6,
  },
  monthLabel: {
    fontSize: 9,
    color: '#758494',
    marginTop: 6,
    textAlign: 'center',
  },
  valLabel: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#191E24',
    marginTop: 2,
  },
  promoList: {
    gap: 8,
  },
  promoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: '#F4F5F7',
  },
  promoRank: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: '#E8EDF4',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  promoRankText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0c2340',
  },
  promoInfo: {
    flex: 1,
  },
  promoName: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#191E24',
  },
  promoSales: {
    fontSize: 11,
    color: '#758494',
    marginTop: 2,
  },
});
