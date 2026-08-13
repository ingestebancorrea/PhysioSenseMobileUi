// src/screens/register/CreateAccountScreen.tsx
import React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import { LockKeyhole, Mail, User } from 'lucide-react-native';

import { useRegistration } from '@/context/RegistrationContext';
import { FormField } from '@/components/common/formField/FormField';
import { CheckboxRow } from '@/components/common/checkboxRow/CheckboxRow';
import { RegisterFlowParamList } from '@/navigation/types/registerFlowParams';
import { AuthStackParamList } from '@/navigation/types/authStackParams';
import { COLORS } from '@/constants/theme';

type CreateAccountScreenProps = NativeStackScreenProps<
  RegisterFlowParamList,
  'CreateAccount'
>;

const CreateAccountScreen: React.FC<CreateAccountScreenProps> = ({
  navigation,
}) => {
  const { data, updateField } = useRegistration();

  const handleContinue = () => {
    if (data.role === 'fisioterapeuta') {
      navigation.navigate('ProfessionalInfo');
    } else {
      navigation.navigate('PatientInfo');
    }
  };

  const goToLogin = () =>
    navigation
      .getParent<NativeStackNavigationProp<AuthStackParamList>>()
      ?.navigate('Login');

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Text style={styles.title}>Crea tu cuenta</Text>
            <Text style={styles.subtitle}>Ingresa tus datos para comenzar.</Text>
          </View>

          <FormField
            label="Nombre completo"
            placeholder="Ej. Laura Martínez"
            value={data.fullName}
            onChangeText={text => updateField('fullName', text)}
            icon={User}
            autoCapitalize="words"
          />

          <FormField
            label="Correo electrónico"
            placeholder="ejemplo@correo.com"
            value={data.email}
            onChangeText={text => updateField('email', text)}
            icon={Mail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            textContentType="emailAddress"
          />

          <FormField
            label="Contraseña"
            placeholder="••••••••"
            value={data.password}
            onChangeText={text => updateField('password', text)}
            icon={LockKeyhole}
            secureTextEntry
            showSecureToggle
            textContentType="newPassword"
          />

          <FormField
            label="Confirmar contraseña"
            placeholder="••••••••"
            value={data.confirmPassword}
            onChangeText={text => updateField('confirmPassword', text)}
            icon={LockKeyhole}
            secureTextEntry
            showSecureToggle
            textContentType="newPassword"
          />

          <CheckboxRow
            checked={data.acceptTerms}
            onToggle={() => updateField('acceptTerms', !data.acceptTerms)}
            text="Acepto los Términos y condiciones y la Política de"
            highlight="privacidad"
          />

          <TouchableOpacity
            style={styles.primaryButton}
            activeOpacity={0.85}
            onPress={handleContinue}
          >
            <Text style={styles.primaryButtonText}>Continuar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.loginButton}
            activeOpacity={0.7}
            onPress={goToLogin}
          >
            <Text style={styles.loginText}>
              ¿Ya tienes una cuenta?{' '}
              <Text style={styles.loginLink}>Inicia sesión</Text>
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  flex: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 48,
    paddingBottom: 32,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  subtitle: {
    fontSize: 15,
    color: COLORS.textSecondary,
    marginTop: 6,
  },
  primaryButton: {
    height: 54,
    borderRadius: 14,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  primaryButtonText: {
    color: COLORS.white,
    fontSize: 17,
    fontWeight: '700',
  },
  loginButton: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  loginText: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  loginLink: {
    fontWeight: '700',
    color: COLORS.primary,
  },
});

export default CreateAccountScreen;
