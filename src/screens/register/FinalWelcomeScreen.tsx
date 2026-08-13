// src/screens/register/FinalWelcomeScreen.tsx
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { useRegistration } from '@/context/RegistrationContext';
import { useAuth } from '@/context/AuthContext';
import { RegisterFlowParamList } from '@/navigation/types/registerFlowParams';
import { COLORS } from '@/constants/theme';

type FinalWelcomeScreenProps = NativeStackScreenProps<
  RegisterFlowParamList,
  'FinalWelcome'
>;

const CONFETTI = [
  { top: 6, left: 30, size: 8, color: '#F5A623', rotate: '24deg' },
  { top: 18, right: 34, size: 9, color: '#2ECC71', rotate: '-18deg' },
  { bottom: 30, left: 18, size: 8, color: '#EE5DA8', rotate: '45deg' },
  { bottom: 16, right: 26, size: 10, color: '#5BC0EB', rotate: '-30deg' },
  { top: 40, right: 10, size: 8, color: '#F5A623', rotate: '12deg' },
  { top: 8, right: 70, size: 9, color: COLORS.primary, rotate: '60deg' },
];

const FinalWelcomeScreen: React.FC<FinalWelcomeScreenProps> = () => {
  const { data } = useRegistration();
  const { registerAccount } = useAuth();

  const isTherapist = data.role === 'fisioterapeuta';
  const firstName = data.fullName.split(' ')[0] || 'Laura';

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <View style={styles.container}>
        <View style={styles.illustration}>
          {CONFETTI.map((piece, index) => (
            <View
              key={index}
              style={[
                styles.confetti,
                {
                  top: piece.top,
                  right: piece.right,
                  bottom: piece.bottom,
                  left: piece.left,
                  width: piece.size,
                  height: piece.size,
                  backgroundColor: piece.color,
                  borderRadius: piece.size / 3,
                  transform: [{ rotate: piece.rotate }],
                },
              ]}
            />
          ))}
          <Image
            source={
              isTherapist
                ? require('../../assets/images/physical_therapist_profile.png')
                : require('../../assets/images/patient_profile.png')
            }
            style={styles.welcomeImage}
            resizeMode="cover"
          />
        </View>

        <View style={styles.header}>
          <Text style={styles.title}>¡Bienvenida, {firstName}! 👋</Text>
          <Text style={styles.message}>
            {isTherapist
              ? 'Tu cuenta está lista. Ahora puedes configurar tu perfil profesional y comenzar a gestionar pacientes.'
              : 'Tu cuenta está lista. Ahora puedes comenzar tu recuperación y monitorear tu progreso.'}
          </Text>
        </View>

        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.primaryButton}
            activeOpacity={0.85}
            onPress={registerAccount}
          >
            <Text style={styles.primaryButtonText}>
              {isTherapist ? 'Ir al dashboard' : 'Ir a mi recuperación'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.outlineButton}
            activeOpacity={0.8}
            onPress={registerAccount}
          >
            <Text style={styles.outlineButtonText}>
              Completar perfil después
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 24,
  },
  illustration: {
    height: 310,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 6,
  },
  welcomeImage: {
    width: '100%',
    height: 298,
  },
  confetti: {
    position: 'absolute',
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.textPrimary,
    textAlign: 'center',
  },
  message: {
    fontSize: 15,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginTop: 10,
    maxWidth: 330,
  },
  footer: {
    marginTop: 'auto',
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
  outlineButton: {
    height: 50,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 14,
  },
  outlineButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.primary,
  },
});

export default FinalWelcomeScreen;
