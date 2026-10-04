// src/screens/register/CreateAccountScreen.tsx
import React, { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import type {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import { LockKeyhole, Mail, User } from 'lucide-react-native';

import { useRegistrationStep } from '@/hooks/useRegistrationStep';
import { useAuth } from '@/context/AuthContext';
import { useAppAlert } from '@/hooks/useAppAlert';
import { validateAccountStep } from '@/utils/validation/registrationValidation';
import {
  configureSocialSignIn,
  describeSocialAuthError,
  getFacebookAccessToken,
  getGoogleIdToken,
} from '@/services/auth/socialAuth';
import { FormField } from '@/components/common/formField/FormField';
import { CheckboxRow } from '@/components/common/checkboxRow/CheckboxRow';
import { RegisterFlowParamList } from '@/navigation/types/registerFlowParams';
import { AuthStackParamList } from '@/navigation/types/authStackParams';
import { COLORS } from '@/constants/theme';
import { ROLE_ALIAS_BY_ROLE } from '@/constants/roles';
import { SocialLoginProvider } from '@/types/auth';

type CreateAccountScreenProps = NativeStackScreenProps<
  RegisterFlowParamList,
  'CreateAccount'
>;

const GENERIC_ERROR_MESSAGE = 'No pudimos crear tu cuenta. Inténtalo de nuevo.';

configureSocialSignIn();

const CreateAccountScreen: React.FC<CreateAccountScreenProps> = ({
  navigation,
}) => {
  const { data, errors, submit, change, changeTerms } = useRegistrationStep();
  const { registerWithProvider } = useAuth();
  const { alertModal, showAlert } = useAppAlert();
  const [pendingProvider, setPendingProvider] =
    useState<SocialLoginProvider | null>(null);

  const aliasRole = data.role ? ROLE_ALIAS_BY_ROLE[data.role] : null;
  const isBusy = pendingProvider !== null;

  const handleContinue = () => {
    if (!submit(validateAccountStep)) {
      return;
    }

    if (data.role === 'fisioterapeuta') {
      navigation.navigate('ProfessionalInfo');
      return;
    }

    navigation.navigate('PatientInfo');
  };

  const goToLogin = () =>
    navigation
      .getParent<NativeStackNavigationProp<AuthStackParamList>>()
      ?.navigate('Login');

  const registerWith = async (
    provider: SocialLoginProvider,
    getToken: () => Promise<string | null>,
  ) => {
    if (!aliasRole) {
      showAlert({
        title: 'Error',
        message: 'Selecciona primero cómo utilizarás PhysioSense.',
        variant: 'error',
      });
      return;
    }

    setPendingProvider(provider);

    try {
      const token = await getToken();

      if (!token) {
        return;
      }

      await registerWithProvider({
        token,
        loginprovider: provider,
        alias_role: aliasRole,
      });
    } catch (error) {
      showAlert({
        title: 'Error',
        message: describeSocialAuthError(error) || GENERIC_ERROR_MESSAGE,
        variant: 'error',
      });
    } finally {
      setPendingProvider(null);
    }
  };

  const handleGoogleRegister = () =>
    registerWith(SocialLoginProvider.GOOGLE, getGoogleIdToken);

  const handleFacebookRegister = () =>
    registerWith(SocialLoginProvider.FACEBOOK, getFacebookAccessToken);

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
            onChangeText={text => change('fullName', text)}
            icon={User}
            autoCapitalize="words"
            error={errors.fullName}
          />

          <FormField
            label="Correo electrónico"
            placeholder="ejemplo@correo.com"
            value={data.email}
            onChangeText={text => change('email', text)}
            icon={Mail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            textContentType="emailAddress"
            error={errors.email}
          />

          <FormField
            label="Contraseña"
            placeholder="••••••••"
            value={data.password}
            onChangeText={text => change('password', text)}
            icon={LockKeyhole}
            secureTextEntry
            showSecureToggle
            textContentType="newPassword"
            error={errors.password}
          />

          <FormField
            label="Confirmar contraseña"
            placeholder="••••••••"
            value={data.confirmPassword}
            onChangeText={text => change('confirmPassword', text)}
            icon={LockKeyhole}
            secureTextEntry
            showSecureToggle
            textContentType="newPassword"
            error={errors.confirmPassword}
          />

          <CheckboxRow
            checked={data.acceptTerms}
            onToggle={() => changeTerms(!data.acceptTerms)}
            text="Acepto los Términos y condiciones y la Política de"
            highlight="privacidad"
            error={errors.acceptTerms}
          />

          <TouchableOpacity
            style={styles.primaryButton}
            activeOpacity={0.85}
            onPress={handleContinue}
          >
            <Text style={styles.primaryButtonText}>Continuar</Text>
          </TouchableOpacity>

          <View style={styles.dividerContainer}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>o regístrate con</Text>
            <View style={styles.dividerLine} />
          </View>

          <View style={styles.socialRow}>
            <TouchableOpacity
              style={styles.socialButton}
              activeOpacity={0.8}
              disabled={isBusy}
              onPress={handleGoogleRegister}
            >
              {pendingProvider === SocialLoginProvider.GOOGLE ? (
                <ActivityIndicator size="small" color={COLORS.primary} />
              ) : (
                <MaterialCommunityIcons
                  name="google"
                  size={22}
                  color="#4285F4"
                />
              )}
              <Text style={styles.socialButtonText}>Google</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.socialButton}
              activeOpacity={0.8}
              disabled={isBusy}
              onPress={handleFacebookRegister}
            >
              {pendingProvider === SocialLoginProvider.FACEBOOK ? (
                <ActivityIndicator size="small" color={COLORS.primary} />
              ) : (
                <MaterialCommunityIcons
                  name="facebook"
                  size={22}
                  color="#1877F2"
                />
              )}
              <Text style={styles.socialButtonText}>Facebook</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.socialHint}>
            Tu cuenta se creará con los datos de tu perfil y el rol
            seleccionado.
          </Text>

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
      {alertModal}
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
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.border,
  },
  dividerText: {
    fontSize: 13,
    color: COLORS.textMuted,
  },
  socialRow: {
    flexDirection: 'row',
    gap: 12,
  },
  socialButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 52,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },
  socialButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  socialHint: {
    fontSize: 12,
    lineHeight: 17,
    color: COLORS.textMuted,
    textAlign: 'center',
    marginTop: 12,
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
