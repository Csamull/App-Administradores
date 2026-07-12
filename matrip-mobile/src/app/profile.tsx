import React, { useState } from 'react';
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
  KeyboardAvoidingView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, User, FileText, MapPin, Phone, Building2, Save } from 'lucide-react-native';
import { Colors } from '@/constants/theme';
import { sessionStorage } from '@/utils/storage';

interface ProfileData {
  nickname: string;
  fullName: string;
  birthDate: string;
  gender: string;
  cpf: string;
  rg: string;
  cep: string;
  street: string;
  city: string;
  state: string;
  phone: string;
  email: string;
  company: string;
  cnpj: string;
  role: string;
}

const INITIAL: ProfileData = {
  nickname: 'SOLtur',
  fullName: 'SOLtur Carlos da Silva',
  birthDate: '15/04/1985',
  gender: 'Masculino',
  cpf: '123.456.789-00',
  rg: '12.345.678-9',
  cep: '01310-100',
  street: 'Av. Paulista, 1578',
  city: 'São Paulo',
  state: 'SP',
  phone: '(11) 91234-5678',
  email: 'solturviagens@gmail.com',
  company: 'Agência Horizonte Viagens',
  cnpj: '12.345.678/0001-90',
  role: 'Gestor Comercial',
};

type Section = 'pessoal' | 'documento' | 'endereco' | 'contato' | 'empresa';

export default function UserProfile() {
  const router = useRouter();
  const [profile, setProfile] = useState<ProfileData>(INITIAL);
  const [activeSection, setActiveSection] = useState<Section>('pessoal');

  const handleSave = () => {
    sessionStorage.setItem('matrip_display_name', profile.nickname);
    Alert.alert('Sucesso', 'Perfil atualizado com sucesso!');
    router.back();
  };

  const SECTIONS = [
    { id: 'pessoal', label: 'Pessoal', icon: User, color: '#2196F3', bg: '#E3F2FD' },
    { id: 'documento', label: 'Documentos', icon: FileText, color: '#9C27B0', bg: '#F3E5F5' },
    { id: 'endereco', label: 'Endereço', icon: MapPin, color: '#4CAF50', bg: '#E8F5E9' },
    { id: 'contato', label: 'Contato', icon: Phone, color: '#0c2340', bg: '#E8EDF4' },
    { id: 'empresa', label: 'Empresa', icon: Building2, color: '#C62828', bg: '#FFEBEE' },
  ] as const;

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft size={18} color="#ffffff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Meu Perfil</Text>
        </View>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Avatar Area */}
          <View style={styles.avatarContainer}>
            <Image
              source={require('@/assets/logo_matrip.png')}
              style={styles.avatar}
              resizeMode="contain"
            />
            <Text style={styles.avatarName}>{profile.nickname}</Text>
            <Text style={styles.avatarSub}>{profile.role} na {profile.company}</Text>
          </View>

          {/* Section Selector */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.sectionTabs}
          >
            {SECTIONS.map((sec) => {
              const Icon = sec.icon;
              const isActive = activeSection === sec.id;
              return (
                <TouchableOpacity
                  key={sec.id}
                  style={[
                    styles.tabButton,
                    isActive ? { backgroundColor: sec.color } : null,
                  ]}
                  onPress={() => setActiveSection(sec.id)}
                >
                  <Icon size={14} color={isActive ? '#ffffff' : sec.color} style={{ marginRight: 6 }} />
                  <Text style={[styles.tabButtonText, isActive ? styles.tabButtonTextActive : null]}>
                    {sec.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Fields based on Section */}
          <View style={styles.fieldsCard}>
            {activeSection === 'pessoal' && (
              <>
                <Text style={styles.fieldLabel}>Apelido / Nome Curto *</Text>
                <TextInput
                  style={styles.fieldInput}
                  value={profile.nickname}
                  onChangeText={(val) => setProfile((p) => ({ ...p, nickname: val }))}
                />
                <Text style={styles.fieldLabel}>Nome Completo *</Text>
                <TextInput
                  style={styles.fieldInput}
                  value={profile.fullName}
                  onChangeText={(val) => setProfile((p) => ({ ...p, fullName: val }))}
                />
                <Text style={styles.fieldLabel}>Data de Nascimento</Text>
                <TextInput
                  style={styles.fieldInput}
                  value={profile.birthDate}
                  onChangeText={(val) => setProfile((p) => ({ ...p, birthDate: val }))}
                />
                <Text style={styles.fieldLabel}>Gênero</Text>
                <TextInput
                  style={styles.fieldInput}
                  value={profile.gender}
                  onChangeText={(val) => setProfile((p) => ({ ...p, gender: val }))}
                />
              </>
            )}

            {activeSection === 'documento' && (
              <>
                <Text style={styles.fieldLabel}>CPF *</Text>
                <TextInput
                  style={styles.fieldInput}
                  value={profile.cpf}
                  onChangeText={(val) => setProfile((p) => ({ ...p, cpf: val }))}
                />
                <Text style={styles.fieldLabel}>RG</Text>
                <TextInput
                  style={styles.fieldInput}
                  value={profile.rg}
                  onChangeText={(val) => setProfile((p) => ({ ...p, rg: val }))}
                />
              </>
            )}

            {activeSection === 'endereco' && (
              <>
                <Text style={styles.fieldLabel}>CEP</Text>
                <TextInput
                  style={styles.fieldInput}
                  value={profile.cep}
                  onChangeText={(val) => setProfile((p) => ({ ...p, cep: val }))}
                />
                <Text style={styles.fieldLabel}>Rua e Número</Text>
                <TextInput
                  style={styles.fieldInput}
                  value={profile.street}
                  onChangeText={(val) => setProfile((p) => ({ ...p, street: val }))}
                />
                <Text style={styles.fieldLabel}>Cidade</Text>
                <TextInput
                  style={styles.fieldInput}
                  value={profile.city}
                  onChangeText={(val) => setProfile((p) => ({ ...p, city: val }))}
                />
                <Text style={styles.fieldLabel}>Estado (UF)</Text>
                <TextInput
                  style={styles.fieldInput}
                  value={profile.state}
                  onChangeText={(val) => setProfile((p) => ({ ...p, state: val }))}
                />
              </>
            )}

            {activeSection === 'contato' && (
              <>
                <Text style={styles.fieldLabel}>Telefone / Whatsapp</Text>
                <TextInput
                  style={styles.fieldInput}
                  value={profile.phone}
                  onChangeText={(val) => setProfile((p) => ({ ...p, phone: val }))}
                />
                <Text style={styles.fieldLabel}>E-mail Principal</Text>
                <TextInput
                  style={styles.fieldInput}
                  value={profile.email}
                  onChangeText={(val) => setProfile((p) => ({ ...p, email: val }))}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </>
            )}

            {activeSection === 'empresa' && (
              <>
                <Text style={styles.fieldLabel}>Nome da Empresa</Text>
                <TextInput
                  style={styles.fieldInput}
                  value={profile.company}
                  onChangeText={(val) => setProfile((p) => ({ ...p, company: val }))}
                />
                <Text style={styles.fieldLabel}>CNPJ</Text>
                <TextInput
                  style={styles.fieldInput}
                  value={profile.cnpj}
                  onChangeText={(val) => setProfile((p) => ({ ...p, cnpj: val }))}
                />
                <Text style={styles.fieldLabel}>Cargo / Função</Text>
                <TextInput
                  style={styles.fieldInput}
                  value={profile.role}
                  onChangeText={(val) => setProfile((p) => ({ ...p, role: val }))}
                />
              </>
            )}

            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Save size={18} color="#ffffff" style={{ marginRight: 8 }} />
              <Text style={styles.saveButtonText}>Salvar Alterações</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#F4F5F7',
    borderWidth: 2,
    borderColor: '#E2E6EA',
    marginBottom: 12,
  },
  avatarName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#191E24',
  },
  avatarSub: {
    fontSize: 12,
    color: '#758494',
    marginTop: 4,
  },
  sectionTabs: {
    paddingBottom: 14,
    gap: 8,
  },
  tabButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 10,
    paddingHorizontal: 14,
    height: 38,
    borderWidth: 1,
    borderColor: '#E2E6EA',
  },
  tabButtonText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#758494',
  },
  tabButtonTextActive: {
    color: '#ffffff',
  },
  fieldsCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#758494',
    marginBottom: 6,
    marginTop: 12,
  },
  fieldInput: {
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
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 10,
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
