// src/screens/register/RoleSelectionScreen.tsx
import React from 'react';
import {
  Image,
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
import { ChevronRight, Stethoscope, UserRound, type LucideIcon } from 'lucide-react-native';

import { useRegistration, type UserRole } from '@/context/RegistrationContext';
import { RegisterFlowParamList } from '@/navigation/types/registerFlowParams';
import { AuthStackParamList } from '@/navigation/types/authStackParams';
import { COLORS } from '@/constants/theme';

type RoleSelectionScreenProps = NativeStackScreenProps<
  RegisterFlowParamList,
  'RoleSelection'
>;

interface RoleCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  onPress: () => void;
}

const RoleCard: React.FC<RoleCardProps> = ({
  title,
  description,
  icon: Icon,
  onPress,
}) => (
  <TouchableOpacity style={styles.card} activeOpacity={0.8} onPress={onPress}>
    <View style={styles.cardIcon}>
      <Icon size={26} color={COLORS.primary} strokeWidth={2} />
    </View>
    <View style={styles.cardTexts}>
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.cardDescription}>{description}</Text>
    </View>
    <ChevronRight size={22} color={COLORS.textMuted} strokeWidth={2.2} />
  </TouchableOpacity>
);

const RoleSelectionScreen: React.FC<RoleSelectionScreenProps> = ({
  navigation,
}) => {
  const { updateField } = useRegistration();

  const selectRole = (role: UserRole) => {
    updateField('role', role);
    navigation.navigate('CreateAccount');
  };

  const goToLogin = () =>
    navigation
      .getParent<NativeStackNavigationProp<AuthStackParamList>>()
      ?.navigate('Login');

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <View style={styles.container}>
        <View style={styles.logoWrapper}>
          <Image
            source={require('../../assets/images/register_logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        <View style={styles.header}>
          <Text style={styles.title}>¿Cómo utilizarás PhysioSense?</Text>
          <Text style={styles.subtitle}>
            Selecciona la opción que mejor te describa.
          </Text>
        </View>

        <View style={styles.cards}>
          <RoleCard
            title="Soy fisioterapeuta"
            description="Gestiona pacientes, asigna ejercicios y analiza su evolución."
            icon={Stethoscope}
            onPress={() => selectRole('fisioterapeuta')}
          />
          <RoleCard
            title="Soy paciente"
            description="Realiza tus ejercicios y monitorea tu recuperación."
            icon={UserRound}
            onPress={() => selectRole('paciente')}
          />
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>¿Ya tienes una cuenta? </Text>
          <TouchableOpacity activeOpacity={0.7} onPress={goToLogin}>
            <Text style={styles.footerLink}>Inicia sesión</Text>
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
  logoWrapper: {
    alignItems: 'center',
    marginBottom: 36,
  },
  logo: {
    width: 220,
    height: 57,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: COLORS.textPrimary,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 8,
  },
  cards: {
    gap: 16,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 18,
    gap: 14,
  },
  cardIcon: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: COLORS.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTexts: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  cardDescription: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 19,
    marginTop: 4,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 'auto',
    paddingTop: 24,
  },
  footerText: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  footerLink: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.primary,
  },
});

export default RoleSelectionScreen;
