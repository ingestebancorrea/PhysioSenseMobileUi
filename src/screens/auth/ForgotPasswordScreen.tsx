// src/screens/auth/ForgotPasswordScreen.tsx
import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { AuthStackParamList } from '@/navigation/types/authStackParams';

type ForgotPasswordScreenProps = NativeStackScreenProps<
  AuthStackParamList,
  'ForgotPassword'
>;

const ForgotPasswordScreen: React.FC<ForgotPasswordScreenProps> = ({ navigation }) => {
  const [email, setEmail] = useState<string>('');

  const handleSubmit = () => {
    if (!email.trim()) {
      return;
    }
    navigation.navigate('EmailSent', { email: email.trim() });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <MaterialCommunityIcons
              name="heart-outline"
              size={24}
              color={PRIMARY}
            />
            <Text style={styles.logoText}>PhysioSense</Text>
          </View>

          <Text style={styles.title}>¿Olvidaste tu contraseña?</Text>
          <Text style={styles.subtitle}>
            No te preocupes, te ayudaremos a recuperarla.
          </Text>

          <View style={styles.mailIconContainer}>
            <MaterialCommunityIcons
              name="email-outline"
              size={120}
              color={PASTEL_PRIMARY}
            />
          </View>

          <View style={styles.form}>
            <Text style={styles.label}>Correo electrónico</Text>
            <TextInput
              style={styles.input}
              placeholder="ejemplo@correo.com"
              placeholderTextColor="#A0A0AB"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              textContentType="emailAddress"
              value={email}
              onChangeText={(text: string) => setEmail(text)}
            />

            <TouchableOpacity
              style={styles.primaryButton}
              activeOpacity={0.8}
              onPress={handleSubmit}
            >
              <Text style={styles.primaryButtonText}>Enviar instrucciones</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.backContainer}
            activeOpacity={0.7}
            onPress={() => navigation.goBack()}
          >
            <MaterialCommunityIcons name="arrow-left" size={18} color={PRIMARY} />
            <Text style={styles.backText}>Volver al inicio de sesión</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const PRIMARY = '#6236FF';
const PASTEL_PRIMARY = '#C9B5FF';

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  flex: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  logoText: {
    fontSize: 20,
    fontWeight: '700',
    color: PRIMARY,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1A1A24',
    textAlign: 'center',
    marginTop: 24,
  },
  subtitle: {
    fontSize: 14,
    color: '#7A7A85',
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20,
  },
  mailIconContainer: {
    width: 190,
    height: 190,
    borderRadius: 95,
    backgroundColor: '#F1ECFF',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginVertical: 40,
  },
  form: {
    width: '100%',
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#2D3142',
    marginBottom: 8,
  },
  input: {
    height: 50,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E2E2',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    fontSize: 15,
    color: '#1A1A24',
  },
  primaryButton: {
    height: 50,
    borderRadius: 10,
    backgroundColor: PRIMARY,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  backContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 20,
  },
  backText: {
    fontSize: 14,
    fontWeight: '600',
    color: PRIMARY,
  },
});

export default ForgotPasswordScreen;
