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
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Eye, EyeOff, Mail, Lock, ArrowRight, Briefcase, Shield } from 'lucide-react-native';
import { Colors } from '@/constants/theme';
import { sessionStorage } from '@/utils/storage';
import { apiPost } from '@/utils/api';
import { LinearGradient } from 'expo-linear-gradient';

export default function Login() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Erro', 'Por favor, preencha o e-mail e a senha.');
      return;
    }
    try {
      const user = await apiPost<any>('/usuarios/login', {
        email: email.trim(),
        senha: password,
      });
      sessionStorage.setItem('matrip_role', user.tipo);
      sessionStorage.setItem('matrip_display_name', user.nome);
      router.replace('/(admin)/dashboard');
    } catch (e) {
      console.error(e);
      Alert.alert(
        'Erro ao entrar',
        'E-mail ou senha incorretos, ou você não tem acesso administrativo.'
      );
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} bounces={false}>
        {/* Header Area */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Image
              source={require('@/assets/logo_matrip.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.headerTitle}>Matrip Corporate</Text>
          <Text style={styles.headerSubtitle}>Sua próxima aventura começa aqui</Text>
        </View>

        {/* Form Card */}
        <View style={styles.card}>
          <Text style={styles.welcomeText}>Bem-vindo (a) de volta</Text>
          <Text style={styles.subtitleText}>Entre na sua conta para continuar</Text>

          {/* Tipo de acesso */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Tipo de acesso</Text>
            <LinearGradient
              colors={['#0c2340', '#1a3b5c']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.roleButton}
            >
              <Shield size={16} color="#ffffff" style={styles.roleIcon} />
              <Text style={styles.roleButtonText}>Admin</Text>
            </LinearGradient>
          </View>

          {/* E-mail / Usuário */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>E-mail, usuário ou CNPJ</Text>
            <View
              style={[
                styles.inputWrapper,
                email ? styles.inputWrapperActive : null,
              ]}
            >
              <Mail size={18} color="#0c2340" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="E-mail, usuário ou CNPJ"
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
            <View
              style={[
                styles.inputWrapper,
                password ? styles.inputWrapperActive : null,
              ]}
            >
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
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeButton}
              >
                {showPassword ? (
                  <EyeOff size={18} color="#758494" />
                ) : (
                  <Eye size={18} color="#758494" />
                )}
              </TouchableOpacity>
            </View>
          </View>

          {/* Esqueci a senha */}
          <TouchableOpacity
            style={styles.forgotPasswordContainer}
            onPress={() => router.push('/forgot-password')}
          >
            <Text style={styles.forgotPasswordText}>Esqueceu a senha?</Text>
          </TouchableOpacity>

          {/* Botão Entrar */}
          <TouchableOpacity onPress={handleLogin} activeOpacity={0.9}>
            <LinearGradient
              colors={['#0c2340', '#1a3b5c']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.loginButton}
            >
              <Text style={styles.loginButtonText}>
                Entrar como Admin
              </Text>
              <ArrowRight size={18} color="#ffffff" />
            </LinearGradient>
          </TouchableOpacity>

          {/* Divisor */}
          <div style={webStyles.dividerContainer as any}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>ou entre com</Text>
            <View style={styles.dividerLine} />
          </div>

          {/* Google Button */}
          <TouchableOpacity style={styles.googleButton} activeOpacity={0.8}>
            <Image
              source={{
                uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/1024px-Google_%22G%22_logo.svg.png',
              }}
              style={styles.googleIcon}
            />
            <Text style={styles.googleButtonText}>Continuar com Google</Text>
          </TouchableOpacity>

          {/* Cadastro Link */}
          <View style={styles.registerContainer}>
            <Text style={styles.registerText}>Não tem uma conta? </Text>
            <TouchableOpacity onPress={() => router.push('/register')}>
              <Text style={styles.registerLink}>Cadastre-se grátis</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// Inline fallback for divider container layout since React Native has no <div>
const webStyles = {
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
    width: '100%',
  },
};

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
    paddingTop: 32,
    paddingBottom: 40,
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
  roleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    shadowColor: '#0c2340',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  roleIcon: {
    marginRight: 8,
  },
  roleButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
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
  forgotPasswordContainer: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  forgotPasswordText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#0c2340',
  },
  loginButton: {
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
  loginButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: 'bold',
    marginRight: 8,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E2E6EA',
  },
  dividerText: {
    fontSize: 12,
    color: '#758494',
    marginHorizontal: 16,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    borderWidth: 1,
    borderColor: '#E2E6EA',
    borderRadius: 12,
    backgroundColor: '#ffffff',
    marginBottom: 24,
  },
  googleIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  googleButtonText: {
    color: '#191E24',
    fontSize: 14,
    fontWeight: '500',
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  registerText: {
    fontSize: 13,
    color: '#758494',
  },
  registerLink: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#0c2340',
  },
});
