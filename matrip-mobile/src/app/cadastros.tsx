import React, { useState } from 'react';
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
import { ArrowLeft, Globe, Languages, Shapes, PlusCircle, Pencil } from 'lucide-react-native';

type CategoryKey = 'localizacao' | 'idiomas' | 'categorias';

interface Activity {
  id: number;
  type: 'add' | 'edit';
  title: string;
  description: string;
  when: string;
}

const CATEGORIES: {
  key: CategoryKey;
  icon: typeof Globe;
  title: string;
  description: string;
}[] = [
  { key: 'localizacao', icon: Globe, title: 'Localização', description: 'Gerenciar os estados e municípios' },
  { key: 'idiomas', icon: Languages, title: 'Idiomas', description: 'Gerenciar as línguas faladas no sistema' },
  { key: 'categorias', icon: Shapes, title: 'Categorias', description: 'Definir os tipos de produtos' },
];

const KPIS = [
  { label: 'IDIOMAS ATIVOS', value: '08', bar: '#0c2340' },
  { label: 'CIDADES ATENDIDAS', value: '15', bar: '#0c2340' },
  { label: 'CATEGORIAS CRIADAS', value: '12', bar: '#0c2340' },
  { label: 'AGÊNCIAS PENDENTES', value: '03', bar: '#0c2340' },
];

const ACTIVITIES: Activity[] = [
  { id: 1, type: 'add', title: 'Nova Cidade Cadastrada', description: 'Administrador adicionou a localização "Barreirinhas - MA".', when: 'Hoje, 10:45' },
  { id: 2, type: 'edit', title: 'Categoria Atualizada', description: 'A categoria "Aventura" teve sua descrição modificada.', when: 'Ontem, 16:30' },
  { id: 3, type: 'add', title: 'Novo Idioma Cadastrado', description: 'Administrador adicionou o idioma "Espanhol" ao sistema.', when: 'Ontem, 09:12' },
  { id: 4, type: 'edit', title: 'Cidade Atualizada', description: 'A cidade "São Luís - MA" teve seus dados atualizados.', when: '23/04, 14:20' },
];

export default function Cadastros() {
  const router = useRouter();
  const [active, setActive] = useState<CategoryKey>('localizacao');

  const handleNewRecord = () => {
    Alert.alert('Novo Registro', `Esta funcionalidade de cadastro para "${active}" será integrada em breve.`);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft size={18} color="#ffffff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Central de Cadastros</Text>
        </View>
        <Text style={styles.headerSubtitle}>
          Selecione o tipo de registro que deseja gerenciar ou adicionar ao sistema.
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Categories */}
        <View style={styles.categoriesContainer}>
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isActive = active === cat.key;
            return (
              <TouchableOpacity
                key={cat.key}
                style={[styles.catCard, isActive ? styles.catCardActive : null]}
                onPress={() => setActive(cat.key)}
                activeOpacity={0.8}
              >
                <View style={styles.catIconWrapper}>
                  <Icon size={20} color="#ffffff" />
                </View>
                <View style={styles.catInfo}>
                  <Text style={styles.catTitle}>{cat.title}</Text>
                  <Text style={styles.catDesc} numberOfLines={2}>
                    {cat.description}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Inventory Summary */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Resumo do Inventário</Text>
          <View style={styles.kpiGrid}>
            {KPIS.map((k, idx) => (
              <View key={idx} style={[styles.kpiCard, { borderLeftColor: k.bar }]}>
                <Text style={styles.kpiLabel}>{k.label}</Text>
                <Text style={[styles.kpiValue, { color: k.bar }]}>{k.value}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Recent Activity */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Registro de Atividades</Text>
            <TouchableOpacity style={styles.newBtn} onPress={handleNewRecord}>
              <PlusCircle size={14} color="#ffffff" style={{ marginRight: 4 }} />
              <Text style={styles.newBtnText}>Novo</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.activitiesContainer}>
            {ACTIVITIES.map((a) => {
              const Icon = a.type === 'add' ? PlusCircle : Pencil;
              return (
                <View key={a.id} style={styles.activityRow}>
                  <View style={styles.activityIconWrapper}>
                    <Icon size={16} color="#0c2340" />
                  </View>
                  <View style={styles.activityInfo}>
                    <Text style={styles.activityTitle}>{a.title}</Text>
                    <Text style={styles.activityDesc}>{a.description}</Text>
                  </View>
                  <Text style={styles.activityTime}>{a.when}</Text>
                </View>
              );
            })}
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
  categoriesContainer: {
    gap: 10,
    marginBottom: 16,
  },
  catCard: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E6EA',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  catCardActive: {
    borderColor: '#0c2340',
    borderWidth: 2,
  },
  catIconWrapper: {
    backgroundColor: '#0c2340',
    width: 38,
    height: 38,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  catInfo: {
    flex: 1,
  },
  catTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#191E24',
  },
  catDesc: {
    fontSize: 11,
    color: '#758494',
    marginTop: 2,
    lineHeight: 14,
  },
  sectionContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#191E24',
    marginBottom: 10,
  },
  kpiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 10,
  },
  kpiCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    width: '48%',
    padding: 12,
    borderLeftWidth: 4,
    borderWidth: 1,
    borderColor: '#E2E6EA',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
  },
  kpiLabel: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#758494',
  },
  kpiValue: {
    fontSize: 22,
    fontWeight: '800',
    marginTop: 6,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  newBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0c2340',
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 30,
  },
  newBtnText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: 'bold',
  },
  activitiesContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E6EA',
    padding: 12,
    gap: 10,
  },
  activityRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(207, 131, 9, 0.05)',
    borderLeftWidth: 3,
    borderLeftColor: '#0c2340',
    padding: 10,
    borderRadius: 8,
  },
  activityIconWrapper: {
    marginRight: 8,
    marginTop: 2,
  },
  activityInfo: {
    flex: 1,
    marginRight: 8,
  },
  activityTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#191E24',
  },
  activityDesc: {
    fontSize: 11,
    color: '#758494',
    marginTop: 2,
  },
  activityTime: {
    fontSize: 10,
    color: '#9AABBD',
  },
});
