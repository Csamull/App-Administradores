import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, ArrowLeft } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { sessionStorage } from '@/utils/storage';
import { apiPost } from '@/utils/api';

export default function Register() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');

  const handleRegister = async () => {
    setError('');
    if (!name.trim()) return setError('Informe como quer ser chamado.');
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) return setError('E-mail inválido.');
    if (password.length < 6) return setError('A senha deve ter pelo menos 6 caracteres.');
    if (password !== confirm) return setError('As senhas não coincidem.');

    try {
      await apiPost<any>('/usuarios', {
        nome: name.trim(),
        email: email.trim(),
        senha: password,
        tipo: 'admin',
      });
      sessionStorage.setItem('matrip_display_name', name.trim());
      router.replace('/login');
    } catch (e) {
      console.error(e);
      setError('Não foi possível realizar o cadastro. O e-mail pode já estar em uso.');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} bounces={false}>
        {/* Logo area */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Image
              source={require('@/assets/logo_matrip.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.headerTitle}>Matrip Corporate</Text>
          <Text style={styles.headerSubtitle}>Crie sua conta grátis agora</Text>
        </View>

        {/* White card */}
        <View style={styles.card}>
          {/* Back button */}
          <TouchableOpacity
            onPress={() => router.replace('/login')}
            style={styles.backButton}
            activeOpacity={0.7}
          >
            <ArrowLeft size={16} color="#0c2340" />
            <Text style={styles.backButtonText}>Voltar ao login</Text>
          </TouchableOpacity>

          <Text style={styles.welcomeText}>Criar conta</Text>
          <Text style={styles.subtitleText}>Preencha os dados abaixo para começar</Text>

          {/* Como quer ser chamado */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Como Quer Ser Chamado</Text>
            <View style={[styles.inputWrapper, name ? styles.inputWrapperActive : null]}>
              <User size={18} color="#0c2340" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Seu nome ou apelido"
                placeholderTextColor="#758494"
                value={name}
                onChangeText={setName}
              />
            </View>
          </View>

          {/* E-mail */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>E-mail</Text>
            <View style={[styles.inputWrapper, email ? styles.inputWrapperActive : null]}>
              <Mail size={18} color="#0c2340" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="seu@email.com"
                placeholderTextColor="#758494"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </View>

          {/* Senha */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Senha</Text>
            <View style={[styles.inputWrapper, password ? styles.inputWrapperActive : null]}>
              <Lock size={18} color="#0c2340" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="••••••••"
                placeholderTextColor="#758494"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeButton}>
                {showPassword ? <EyeOff size={18} color="#758494" /> : <Eye size={18} color="#758494" />}
              </TouchableOpacity>
            </View>
          </View>

          {/* Confirmar Senha */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Confirmar Senha</Text>
            <View style={[styles.inputWrapper, confirm ? styles.inputWrapperActive : null]}>
              <Lock size={18} color="#0c2340" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="••••••••"
                placeholderTextColor="#758494"
                secureTextEntry={!showConfirm}
                value={confirm}
                onChangeText={setConfirm}
                autoCapitalize="none"
              />
              <TouchableOpacity onPress={() => setShowConfirm(!showConfirm)} style={styles.eyeButton}>
                {showConfirm ? <EyeOff size={18} color="#758494" /> : <Eye size={18} color="#758494" />}
              </TouchableOpacity>
            </View>
          </View>

          {/* Error message */}
          {error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          {/* Submit button */}
          <TouchableOpacity onPress={handleRegister} activeOpacity={0.9} style={styles.submitMargin}>
            <LinearGradient
              colors={['#0c2340', '#1a3b5c']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.submitButton}
            >
              <Text style={styles.submitButtonText}>Criar minha conta</Text>
              <ArrowRight size={18} color="#ffffff" />
            </LinearGradient>
          </TouchableOpacity>

          {/* Fazer Login Link */}
          <View style={styles.loginLinkContainer}>
            <Text style={styles.loginLinkText}>Já tem uma conta? </Text>
            <TouchableOpacity onPress={() => router.replace('/login')}>
              <Text style={styles.loginLink}>Fazer login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0c2340',
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 70 : 50,
    paddingBottom: 24,
    paddingHorizontal: 24,
    backgroundColor: '#0c2340',
  },
  logoContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 80,
    padding: 8,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  logo: {
    width: 110,
    height: 110,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  headerSubtitle: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.75)',
    marginTop: 4,
  },
  card: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 40,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    alignSelf: 'flex-start',
    paddingVertical: 4,
    paddingRight: 12,
  },
  backButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0c2340',
    marginLeft: 8,
  },
  welcomeText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#191E24',
  },
  subtitleText: {
    fontSize: 13,
    color: '#758494',
    marginTop: 4,
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
    color: '#758494',
    marginBottom: 6,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F4F5F7',
    borderWidth: 1,
    borderColor: '#E2E6EA',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 52,
  },
  inputWrapperActive: {
    borderColor: '#0c2340',
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    color: '#191E24',
    fontSize: 14,
    height: '100%',
  },
  eyeButton: {
    padding: 8,
  },
  errorContainer: {
    backgroundColor: 'rgba(239, 68, 68, 0.08)',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  errorText: {
    color: '#ef4444',
    fontSize: 13,
    fontWeight: '500',
  },
  submitMargin: {
    marginTop: 8,
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 56,
    borderRadius: 12,
    shadowColor: '#0c2340',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 4,
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: 'bold',
    marginRight: 8,
  },
  loginLinkContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  loginLinkText: {
    fontSize: 13,
    color: '#758494',
  },
  loginLink: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#0c2340',
  },
});
