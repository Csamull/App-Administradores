import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  SafeAreaView,
  Platform,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  Home as HomeIcon,
  FileText,
  Plane,
  Users,
  DollarSign,
  Bell,
  User,
  LogOut,
  ArrowUpRight,
  Building,
  Tag,
  BarChart2,
  Edit2,
  Eye,
  Trash2,
  Search,
  PlusCircle,
  Briefcase,
  Shield,
} from 'lucide-react-native';
import { Colors } from '@/constants/theme';
import { sessionStorage } from '@/utils/storage';
import { apiFetch } from '@/utils/api';

const CHART_DATA = [
  { month: 'Out', vendas: 42 },
  { month: 'Nov', vendas: 68 },
  { month: 'Dez', vendas: 55 },
  { month: 'Jan', vendas: 90 },
  { month: 'Fev', vendas: 78 },
  { month: 'Mar', vendas: 112 },
];

const STATUS_COLOR: Record<string, { bg: string; text: string }> = {
  ativo: { bg: '#E8F5E9', text: '#2E7D32' },
  pendente: { bg: '#FFFDE7', text: '#F57F17' },
  inativo: { bg: '#EEEEEE', text: '#616161' },
};

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'home' | 'partners' | 'reports' | 'profile'>('home');
  const [search, setSearch] = useState('');
  
  const [agenciesCount, setAgenciesCount] = useState(0);
  const [usersCount, setUsersCount] = useState(0);
  const [productsCount, setProductsCount] = useState(0);
  const [pendingAgenciesCount, setPendingAgenciesCount] = useState(0);
  const [partners, setPartners] = useState<any[]>([]);

  const displayName = sessionStorage.getItem('matrip_display_name') || 'Lucas (Admin)';

  const loadDashboardData = async () => {
    try {
      const agencies = await apiFetch<any>('/agencias');
      setAgenciesCount(agencies.length);
      setPendingAgenciesCount(agencies.filter((a: any) => a.status === 'pendente').length);

      const users = await apiFetch<any>('/usuarios');
      setUsersCount(users.length);

      const products = await apiFetch<any>('/produtos');
      setProductsCount(products.length);

      const loadedPartners = await apiFetch<any>('/parceiros');
      setPartners(loadedPartners);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleLogout = () => {
    sessionStorage.clear();
    router.replace('/login');
  };

  const dynamicKPI = [
    { label: 'Total de Agências', value: String(agenciesCount), icon: Building, color: '#2196F3', bg: '#E3F2FD' },
    { label: 'Usuários', value: String(usersCount), icon: Users, color: '#9C27B0', bg: '#F3E5F5' },
    { label: 'Produtos', value: String(productsCount), icon: Tag, color: '#4CAF50', bg: '#E8F5E9' },
    { label: 'Pendentes', value: String(pendingAgenciesCount), icon: FileText, color: '#0c2340', bg: '#E8EDF4' },
  ];

  const filteredPartners = partners.map((p: any) => ({
    id: p.id,
    name: p.nome,
    status: p.status,
    sales: 'R$ 0,00',
    contract: p.status === 'ativo' ? 'Vigente' : 'Inativo',
  })).filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.status.toLowerCase().includes(search.toLowerCase())
  );

  const handleAction = (label: string) => {
    Alert.alert('Ação', `Funcionalidade "${label}" será integrada ao backend em vigor.`);
  };

  const renderChart = () => {
    const maxSales = Math.max(...CHART_DATA.map((d) => d.vendas));
    return (
      <View style={styles.chartCard}>
        <View style={styles.chartHeader}>
          <Text style={styles.sectionTitle}>Volume de vendas corporativas</Text>
          <View style={styles.badgeSuccess}>
            <ArrowUpRight size={12} color="#2E7D32" />
            <Text style={styles.badgeSuccessText}>+45%</Text>
          </View>
        </View>
        <View style={styles.chartContainer}>
          <View style={styles.chartBars}>
            {CHART_DATA.map((item, i) => {
              const barHeight = (item.vendas / maxSales) * 100;
              return (
                <View key={i} style={styles.chartBarCol}>
                  <View style={styles.barTrack}>
                    <View style={[styles.barFill, { height: `${barHeight}%` }]} />
                  </View>
                  <Text style={styles.chartMonthLabel}>{item.month}</Text>
                  <Text style={styles.chartValLabel}>{item.vendas}k</Text>
                </View>
              );
            })}
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.userInfo}>
            <Image
              source={require('@/assets/logo_matrip.png')}
              style={styles.avatar}
              resizeMode="contain"
            />
            <View>
              <Text style={styles.headerSub}>Matrip Corporate Admin</Text>
              <Text style={styles.headerTitle}>Olá, {displayName}!</Text>
            </View>
          </View>

          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.headerIconBtn}>
              <Bell size={18} color="#ffffff" />
              <View style={styles.badgeDot} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => router.push('/profile')}
              style={styles.headerIconBtn}
            >
              <User size={18} color="#ffffff" />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleLogout} style={styles.headerIconBtn}>
              <LogOut size={16} color="#ffffff" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} bounces={true}>
        {activeTab === 'home' && (
          <View style={styles.tabContent}>
            {/* KPI CARDS */}
            <View style={styles.kpiGrid}>
              {dynamicKPI.map((kpi, i) => {
                const IconComponent = kpi.icon;
                return (
                  <View key={i} style={styles.kpiCard}>
                    <View style={[styles.kpiIconWrapper, { backgroundColor: kpi.bg }]}>
                      <IconComponent size={19} color={kpi.color} />
                    </View>
                    <Text style={styles.kpiLabel}>{kpi.label}</Text>
                    <Text style={styles.kpiValue}>{kpi.value}</Text>
                  </View>
                );
              })}
            </View>

            {/* QUICK ACTIONS */}
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Gerenciamento de Módulos</Text>
              <View style={styles.actionGrid}>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => router.push('/agencias')}
                >
                  <View style={[styles.actionIconWrapper, { backgroundColor: '#E3F2FD' }]}>
                    <Building size={18} color="#2196F3" />
                  </View>
                  <Text style={styles.actionText}>Gerenciar Agências</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => router.push('/usuarios')}
                >
                  <View style={[styles.actionIconWrapper, { backgroundColor: '#F3E5F5' }]}>
                    <Users size={18} color="#9C27B0" />
                  </View>
                  <Text style={styles.actionText}>Gerenciar Usuários</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => router.push('/parceiros')}
                >
                  <View style={[styles.actionIconWrapper, { backgroundColor: '#E8F5E9' }]}>
                    <Briefcase size={18} color="#4CAF50" />
                  </View>
                  <Text style={styles.actionText}>Gerenciar Parceiros</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => router.push('/contratos')}
                >
                  <View style={[styles.actionIconWrapper, { backgroundColor: '#E8EDF4' }]}>
                    <FileText size={18} color="#0c2340" />
                  </View>
                  <Text style={styles.actionText}>Contratos & Acordos</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* CHART */}
            {renderChart()}
          </View>
        )}

        {activeTab === 'partners' && (
          <View style={styles.tabContent}>
            {/* PARTNERS SECTION */}
            <View style={styles.sectionContainer}>
              <View style={styles.sectionHeaderRow}>
                <Text style={styles.sectionTitle}>Parceiros Cadastrados</Text>
                <TouchableOpacity
                  onPress={() => handleAction('Novo Parceiro')}
                  activeOpacity={0.8}
                  style={styles.newButton}
                >
                  <PlusCircle size={14} color="#ffffff" style={styles.newButtonIcon} />
                  <Text style={styles.newButtonText}>Novo</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.searchWrapper}>
                <Search size={16} color="#758494" style={styles.searchIcon} />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Pesquisar parceiro..."
                  placeholderTextColor="#758494"
                  value={search}
                  onChangeText={setSearch}
                />
              </View>

              <View style={styles.tableCard}>
                {filteredPartners.map((p, i) => {
                  const statusInfo = STATUS_COLOR[p.status] || { bg: '#EEEEEE', text: '#616161' };
                  return (
                    <View
                      key={p.id}
                      style={[
                        styles.tableRow,
                        i === filteredPartners.length - 1 ? styles.tableRowLast : null,
                      ]}
                    >
                      <View style={styles.tableRowIconWrapper}>
                        <Briefcase size={17} color="#2196F3" />
                      </View>
                      <View style={styles.tableRowMain}>
                        <Text style={styles.tableRowTitle} numberOfLines={1}>
                          {p.name}
                        </Text>
                        <Text style={styles.tableRowSubtitle}>
                          Contrato: {p.contract} • {p.sales}
                        </Text>
                      </View>
                      <View
                        style={[styles.statusBadge, { backgroundColor: statusInfo.bg }]}
                      >
                        <Text style={[styles.statusBadgeText, { color: statusInfo.text }]}>
                          {p.status.toUpperCase()}
                        </Text>
                      </View>
                      <TouchableOpacity
                        onPress={() => handleAction(`Visualizar ${p.name}`)}
                        style={styles.rowActionBtn}
                      >
                        <Eye size={13} color="#758494" />
                      </TouchableOpacity>
                    </View>
                  );
                })}
              </View>
            </View>
          </View>
        )}

        {activeTab === 'reports' && (
          <View style={styles.tabContent}>
            {/* REPORTS SECTION */}
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Relatórios Gerais</Text>
              <View style={styles.actionGrid}>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => router.push('/relatorios-parceiro')}
                >
                  <View style={[styles.actionIconWrapper, { backgroundColor: '#F3E5F5' }]}>
                    <BarChart2 size={18} color="#9C27B0" />
                  </View>
                  <Text style={styles.actionText}>Relatórios Executivos</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => router.push('/financeiro')}
                >
                  <View style={[styles.actionIconWrapper, { backgroundColor: '#E8EDF4' }]}>
                    <DollarSign size={18} color="#0c2340" />
                  </View>
                  <Text style={styles.actionText}>Financeiro Consolidado</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => router.push('/suporte')}
                >
                  <View style={[styles.actionIconWrapper, { backgroundColor: '#E3F2FD' }]}>
                    <FileText size={18} color="#2196F3" />
                  </View>
                  <Text style={styles.actionText}>Chamados de Suporte</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => router.push('/cadastros')}
                >
                  <View style={[styles.actionIconWrapper, { backgroundColor: '#E8F5E9' }]}>
                    <PlusCircle size={18} color="#4CAF50" />
                  </View>
                  <Text style={styles.actionText}>Cadastros Auxiliares</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}

        {activeTab === 'profile' && (
          <View style={styles.tabContent}>
            <View style={styles.profileCard}>
              <View style={styles.profileHeader}>
                <Image
                  source={require('@/assets/logo_matrip.png')}
                  style={styles.profileAvatar}
                  resizeMode="contain"
                />
                <Text style={styles.profileName}>{displayName}</Text>
                <Text style={styles.profileEmail}>lucas.admin@matrip.com.br</Text>
              </View>

              <View style={styles.profileDetails}>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Nível de Acesso</Text>
                  <Text style={styles.detailVal}>Administrador Geral</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Status de Conta</Text>
                  <Text style={[styles.detailVal, { color: '#2E7D32' }]}>Ativo</Text>
                </View>
              </View>

              <TouchableOpacity
                onPress={() => router.push('/profile')}
                style={styles.editProfileBtn}
              >
                <Text style={styles.editProfileBtnText}>Editar Perfil</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn}>
                <LogOut size={16} color="#ffffff" style={{ marginRight: 8 }} />
                <Text style={styles.logoutBtnText}>Fazer Logout</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>

      {/* BOTTOM NAV */}
      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => setActiveTab('home')}
          activeOpacity={0.7}
        >
          <View style={[styles.navIconBg, activeTab === 'home' ? styles.navIconBgActive : null]}>
            <HomeIcon size={20} color={activeTab === 'home' ? '#0c2340' : '#758494'} />
          </View>
          <Text style={[styles.navText, activeTab === 'home' ? styles.navTextActive : null]}>
            Home
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => setActiveTab('partners')}
          activeOpacity={0.7}
        >
          <View
            style={[styles.navIconBg, activeTab === 'partners' ? styles.navIconBgActive : null]}
          >
            <Briefcase size={20} color={activeTab === 'partners' ? '#0c2340' : '#758494'} />
          </View>
          <Text style={[styles.navText, activeTab === 'partners' ? styles.navTextActive : null]}>
            Parceiros
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => setActiveTab('reports')}
          activeOpacity={0.7}
        >
          <View style={[styles.navIconBg, activeTab === 'reports' ? styles.navIconBgActive : null]}>
            <BarChart2 size={20} color={activeTab === 'reports' ? '#0c2340' : '#758494'} />
          </View>
          <Text style={[styles.navText, activeTab === 'reports' ? styles.navTextActive : null]}>
            Módulos
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => setActiveTab('profile')}
          activeOpacity={0.7}
        >
          <View style={[styles.navIconBg, activeTab === 'profile' ? styles.navIconBgActive : null]}>
            <User size={20} color={activeTab === 'profile' ? '#0c2340' : '#758494'} />
          </View>
          <Text style={[styles.navText, activeTab === 'profile' ? styles.navTextActive : null]}>
            Perfil
          </Text>
        </TouchableOpacity>
      </View>
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
    paddingBottom: 40,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#ffffff',
    marginRight: 10,
    padding: 2,
  },
  headerSub: {
    fontSize: 9,
    fontWeight: 'bold',
    color: 'rgba(255, 255, 255, 0.7)',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerIconBtn: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  badgeDot: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#ef4444',
  },
  scrollContent: {
    paddingBottom: 100,
  },
  tabContent: {
    marginTop: -20,
    paddingHorizontal: 14,
  },
  kpiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 10,
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
    fontSize: 10,
    fontWeight: '600',
    color: '#758494',
    lineHeight: 14,
  },
  kpiValue: {
    fontSize: 20,
    fontWeight: '800',
    color: '#191E24',
    marginTop: 4,
  },
  sectionContainer: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#191E24',
    marginBottom: 12,
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 10,
  },
  actionButton: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    width: '48%',
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E6EA',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  actionIconWrapper: {
    width: 34,
    height: 34,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#191E24',
    lineHeight: 14,
  },
  chartCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  badgeSuccess: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  badgeSuccessText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginLeft: 2,
  },
  chartContainer: {
    height: 160,
    justifyContent: 'flex-end',
  },
  chartBars: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: '100%',
    paddingHorizontal: 8,
  },
  chartBarCol: {
    alignItems: 'center',
    flex: 1,
  },
  barTrack: {
    height: 100,
    width: 14,
    backgroundColor: '#F4F5F7',
    borderRadius: 7,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  barFill: {
    width: '100%',
    backgroundColor: '#0c2340',
    borderRadius: 7,
  },
  chartMonthLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#758494',
    marginTop: 6,
  },
  chartValLabel: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#191E24',
    marginTop: 2,
  },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#E2E6EA',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
    marginBottom: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: '#191E24',
    fontSize: 13,
  },
  tableCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
    overflow: 'hidden',
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderColor: '#E2E6EA',
  },
  tableRowLast: {
    borderBottomWidth: 0,
  },
  tableRowIconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  tableRowMain: {
    flex: 1,
    marginRight: 8,
  },
  tableRowTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#191E24',
  },
  tableRowSubtitle: {
    fontSize: 11,
    color: '#758494',
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    marginRight: 6,
  },
  statusBadgeText: {
    fontSize: 9,
    fontWeight: 'bold',
  },
  rowActionGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rowActionBtn: {
    backgroundColor: '#F4F5F7',
    borderRadius: 8,
    padding: 6,
  },
  rowActionBtnDestructive: {
    backgroundColor: '#FFEBEE',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  newButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0c2340',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  newButtonIcon: {
    marginRight: 4,
  },
  newButtonText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  emptyText: {
    textAlign: 'center',
    padding: 24,
    color: '#758494',
    fontSize: 13,
  },
  profileCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F4F5F7',
    borderWidth: 2,
    borderColor: '#E2E6EA',
    marginBottom: 12,
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#191E24',
  },
  profileEmail: {
    fontSize: 13,
    color: '#758494',
    marginTop: 2,
  },
  profileDetails: {
    width: '100%',
    borderTopWidth: 1,
    borderColor: '#E2E6EA',
    paddingTop: 16,
    marginBottom: 20,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
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
  editProfileBtn: {
    width: '100%',
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#0c2340',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  editProfileBtnText: {
    color: '#0c2340',
    fontSize: 14,
    fontWeight: 'bold',
  },
  logoutBtn: {
    width: '100%',
    height: 48,
    borderRadius: 12,
    backgroundColor: '#C62828',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoutBtnText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderColor: '#E2E6EA',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingTop: 8,
    paddingBottom: Platform.OS === 'ios' ? 24 : 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 10,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    paddingHorizontal: 12,
  },
  navIconBg: {
    width: 44,
    height: 30,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  navIconBgActive: {
    backgroundColor: '#E8EDF4',
  },
  navText: {
    fontSize: 9,
    fontWeight: '500',
    color: '#758494',
  },
  navTextActive: {
    fontWeight: 'bold',
    color: '#0c2340',
  },
});
