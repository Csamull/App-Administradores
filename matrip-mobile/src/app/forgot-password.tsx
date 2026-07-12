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
import { Mail, ArrowLeft, CheckCircle2, Send } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function ForgotPassword() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const validateEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

  const handleSubmit = () => {
    setError('');
    if (!email.trim()) {
      setError('Informe seu e-mail cadastrado.');
      return;
    }
    if (!validateEmail(email)) {
      setError('E-mail inválido. Verifique e tente novamente.');
      return;
    }
    setSent(true);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} bounces={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Image
              source={require('@/assets/logo_matrip.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.headerTitle}>Recuperar Senha</Text>
          <Text style={styles.headerSubtitle}>Enviaremos um link para redefinir sua senha</Text>
        </View>

        {/* Card */}
        <View style={styles.card}>
          {!sent ? (
            <>
              <Text style={styles.infoText}>
                Digite o e-mail vinculado à sua conta. Você receberá um link para criar uma nova senha.
              </Text>

              {/* Email input */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>E-MAIL CADASTRADO</Text>
                <View
                  style={[
                    styles.inputWrapper,
                    error ? styles.inputWrapperError : null,
                    email && !error ? styles.inputWrapperActive : null,
                  ]}
                >
                  <Mail size={18} color="#0c2340" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="seuemail@exemplo.com"
                    placeholderTextColor="#758494"
                    value={email}
                    onChangeText={(val) => {
                      setEmail(val);
                      if (error) setError('');
                    }}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>
                {error ? <Text style={styles.errorText}>{error}</Text> : null}
              </View>

              {/* Submit Button */}
              <TouchableOpacity onPress={handleSubmit} activeOpacity={0.9} style={styles.submitMargin}>
                <LinearGradient
                  colors={['#0c2340', '#1a3b5c']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.submitButton}
                >
                  <Send size={18} color="#ffffff" style={styles.submitIcon} />
                  <Text style={styles.submitButtonText}>Enviar link de recuperação</Text>
                </LinearGradient>
              </TouchableOpacity>

              {/* Back Link */}
              <TouchableOpacity
                onPress={() => router.back()}
                style={styles.backContainer}
                activeOpacity={0.7}
              >
                <ArrowLeft size={16} color="#0c2340" />
                <Text style={styles.backText}>Voltar para o login</Text>
              </TouchableOpacity>
            </>
          ) : (
            /* Success State */
            <View style={styles.successContainer}>
              <View style={styles.successIconWrapper}>
                <CheckCircle2 size={40} color="#0c2340" />
              </View>
              <Text style={styles.successTitle}>E-mail enviado!</Text>
              <Text style={styles.successSubtitle}>Enviaremos um link de recuperação para:</Text>
              <Text style={styles.successEmail}>{email}</Text>
              <Text style={styles.successInfo}>
                Verifique sua caixa de entrada e a pasta de spam. O link expira em 30 minutos.
              </Text>

              <TouchableOpacity
                onPress={() => {
                  setSent(false);
                  setEmail('');
                }}
                style={styles.resendButton}
                activeOpacity={0.8}
              >
                <Text style={styles.resendButtonText}>Reenviar e-mail</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => router.replace('/login')}
                style={styles.backContainer}
                activeOpacity={0.7}
              >
                <ArrowLeft size={16} color="#0c2340" />
                <Text style={styles.backText}>Voltar para o login</Text>
              </TouchableOpacity>
            </View>
          )}
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
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    padding: 4,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  logo: {
    width: 90,
    height: 90,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  headerSubtitle: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: 4,
    textAlign: 'center',
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
  infoText: {
    fontSize: 14,
    color: '#758494',
    lineHeight: 20,
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
  inputWrapperError: {
    borderColor: '#ef4444',
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
  errorText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#ef4444',
    marginTop: 6,
  },
  submitMargin: {
    marginTop: 24,
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
  submitIcon: {
    marginRight: 8,
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: 'bold',
  },
  backContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
    alignSelf: 'center',
    padding: 8,
  },
  backText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0c2340',
    marginLeft: 8,
  },
  successContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  successIconWrapper: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(207, 131, 9, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  successTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#191E24',
    marginBottom: 8,
  },
  successSubtitle: {
    fontSize: 14,
    color: '#758494',
    textAlign: 'center',
  },
  successEmail: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0c2340',
    marginVertical: 8,
    textAlign: 'center',
  },
  successInfo: {
    fontSize: 12,
    color: '#758494',
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: 16,
    marginBottom: 32,
  },
  resendButton: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    borderWidth: 1,
    borderColor: '#E2E6EA',
    borderRadius: 12,
    backgroundColor: '#ffffff',
  },
  resendButtonText: {
    color: '#191E24',
    fontSize: 14,
    fontWeight: '500',
  },
});
