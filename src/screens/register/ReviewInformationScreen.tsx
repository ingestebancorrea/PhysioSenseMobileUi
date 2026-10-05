// src/screens/register/ReviewInformationScreen.tsx
import React, { useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  AlertCircle,
  Briefcase,
  ChevronLeft,
  Globe,
  GraduationCap,
  IdCard,
  Mail,
  MapPin,
  Phone,
  Star,
  Stethoscope,
  type LucideIcon,
  User,
  UserRound,
} from 'lucide-react-native';

import { useRegistration } from '@/context/RegistrationContext';
import { registerWithPassword } from '@/services/auth/AuthService';
import { toRegisterPasswordRequest } from '@/services/auth/registerPasswordMapper';
import { RegisterFlowParamList } from '@/navigation/types/registerFlowParams';
import {
  validateAccountStep,
  validateAdditionalStep,
  validatePatientStep,
  validateProfessionalStep,
} from '@/utils/validation/registrationValidation';
import { COLORS } from '@/constants/theme';

type ReviewInformationScreenProps = NativeStackScreenProps<
  RegisterFlowParamList,
  'ReviewInformation'
>;

interface InfoRow {
  icon: LucideIcon;
  label: string;
  value: string;
  isPlaceholder?: boolean;
}

interface InfoSectionProps {
  title: string;
  rows: InfoRow[];
  onEdit: () => void;
}

const InfoSection: React.FC<InfoSectionProps> = ({ title, rows, onEdit }) => (
  <View style={styles.section}>
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <TouchableOpacity activeOpacity={0.7} onPress={onEdit}>
        <Text style={styles.editText}>Editar</Text>
      </TouchableOpacity>
    </View>
    {rows.map(({ icon: Icon, label, value, isPlaceholder }) => (
      <View key={label} style={styles.row}>
        <View style={styles.rowIcon}>
          <Icon size={18} color={COLORS.primary} strokeWidth={2} />
        </View>
        <View style={styles.rowTexts}>
          <Text style={styles.rowLabel}>{label}</Text>
          <Text
            style={[
              styles.rowValue,
              isPlaceholder === true && styles.rowValuePlaceholder,
            ]}
            numberOfLines={1}
          >
            {value}
          </Text>
        </View>
      </View>
    ))}
  </View>
);

/**
 * A field the user left blank shows a neutral "nothing here" label, never sample
 * data. The value the user typed is the only thing that can look like their data,
 * and `isPlaceholder` marks the difference so the row renders in muted italics.
 */
const readRowValue = (
  value: string,
  placeholder: string,
): Pick<InfoRow, 'value' | 'isPlaceholder'> => {
  const trimmed = value.trim();

  return trimmed.length > 0
    ? { value: trimmed, isPlaceholder: false }
    : { value: placeholder, isPlaceholder: true };
};

/** Everything the flow collected must be valid again before the user is created. */
const hasBlockingErrors = (
  data: Parameters<typeof validateAccountStep>[0],
  isTherapist: boolean,
): boolean =>
  [
    validateAccountStep(data),
    validateAdditionalStep(data),
    isTherapist ? validateProfessionalStep(data) : validatePatientStep(data),
  ].some(errors => Object.values(errors).some(Boolean));

const ReviewInformationScreen: React.FC<ReviewInformationScreenProps> = ({
  navigation,
}) => {
  const { data } = useRegistration();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const isTherapist = data.role === 'fisioterapeuta';

  const handleCreateAccount = async () => {
    if (isSubmitting) {
      return;
    }

    if (hasBlockingErrors(data, isTherapist)) {
      setSubmitError(
        'Revisa los datos de las pantallas anteriores antes de crear la cuenta.',
      );
      return;
    }

    setSubmitError(null);
    setIsSubmitting(true);

    try {
      const registration = await registerWithPassword(
        toRegisterPasswordRequest(data),
      );
      navigation.navigate('FinalWelcome', { registration });
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : 'No se pudo crear la cuenta. Intenta de nuevo.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const basicRows: InfoRow[] = [
    {
      icon: User,
      label: 'Nombre',
      ...readRowValue(data.fullName, 'Sin nombre'),
    },
    {
      icon: Mail,
      label: 'Correo',
      ...readRowValue(data.email, 'Sin correo'),
    },
  ];

  const roleRows: InfoRow[] = isTherapist
    ? [
        {
          icon: Briefcase,
          label: 'Rol',
          value: 'Fisioterapeuta',
          isPlaceholder: false,
        },
        {
          icon: Star,
          label: 'Especialidad',
          ...readRowValue(data.specialty, 'Sin especialidad'),
        },
        {
          icon: IdCard,
          label: 'Licencia',
          ...readRowValue(data.licenseNumber, 'Sin número de licencia'),
        },
        {
          icon: GraduationCap,
          label: 'Universidad',
          ...readRowValue(data.institution, 'Sin universidad'),
        },
        {
          icon: Stethoscope,
          label: 'Experiencia',
          ...readRowValue(data.yearsExperience, 'Sin experiencia'),
        },
      ]
    : [
        {
          icon: UserRound,
          label: 'Rol',
          value: 'Paciente',
          isPlaceholder: false,
        },
        {
          icon: MapPin,
          label: 'Ciudad',
          ...readRowValue(data.city, 'Sin ciudad'),
        },
        {
          icon: Globe,
          label: 'País',
          ...readRowValue(data.country, 'Sin país'),
        },
        {
          icon: UserRound,
          label: 'Mano dominante',
          ...readRowValue(data.dominantHand, 'Sin mano dominante'),
        },
      ];

  const additionalRows: InfoRow[] = [
    {
      icon: Phone,
      label: 'Teléfono',
      ...readRowValue(data.phone, 'Sin teléfono'),
    },
    {
      icon: Stethoscope,
      label: 'Notas',
      ...readRowValue(data.notes, 'Sin notas adicionales'),
    },
  ];

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Revisa tu información</Text>
          <Text style={styles.subtitle}>
            Verifica que todos tus datos estén correctos antes de continuar.
          </Text>
        </View>

        <InfoSection
          title="Información básica"
          rows={basicRows}
          onEdit={() => navigation.navigate('CreateAccount')}
        />
        <InfoSection
          title={isTherapist ? 'Información profesional' : 'Información personal'}
          rows={roleRows}
          onEdit={() =>
            navigation.navigate(isTherapist ? 'ProfessionalInfo' : 'PatientInfo')
          }
        />
        <InfoSection
          title="Información adicional"
          rows={additionalRows}
          onEdit={() => navigation.navigate('AdditionalInfo')}
        />

        {submitError !== null && (
          <View style={styles.errorBanner}>
            <AlertCircle size={18} color={COLORS.dangerRed} strokeWidth={2} />
            <Text style={styles.errorText}>{submitError}</Text>
          </View>
        )}

        <TouchableOpacity
          style={[styles.primaryButton, isSubmitting && styles.primaryButtonDisabled]}
          activeOpacity={0.85}
          disabled={isSubmitting}
          onPress={handleCreateAccount}
        >
          {isSubmitting ? (
            <ActivityIndicator color={COLORS.white} />
          ) : (
            <Text style={styles.primaryButtonText}>Crear cuenta</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.backButton}
          activeOpacity={0.7}
          onPress={() => navigation.goBack()}
        >
          <ChevronLeft size={20} color={COLORS.textSecondary} strokeWidth={2.2} />
          <Text style={styles.backText}>Volver</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 32,
  },
  header: {
    alignItems: 'center',
    marginBottom: 22,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginTop: 6,
    maxWidth: 300,
  },
  section: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 16,
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  editText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  rowIcon: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: COLORS.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowTexts: {
    flex: 1,
    marginLeft: 12,
  },
  rowLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  rowValue: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginTop: 2,
  },
  rowValuePlaceholder: {
    fontWeight: '500',
    fontStyle: 'italic',
    color: COLORS.textMuted,
  },
  primaryButton: {
    height: 54,
    borderRadius: 14,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  primaryButtonDisabled: {
    opacity: 0.7,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: COLORS.dangerRedSoft,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  errorText: {
    flex: 1,
    color: COLORS.dangerRed,
    fontSize: 13,
    lineHeight: 18,
  },
  primaryButtonText: {
    color: COLORS.white,
    fontSize: 17,
    fontWeight: '700',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 16,
  },
  backText: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
});

export default ReviewInformationScreen;
