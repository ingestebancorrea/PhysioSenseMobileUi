// src/screens/register/ReviewInformationScreen.tsx
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
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
import { RegisterFlowParamList } from '@/navigation/types/registerFlowParams';
import { COLORS } from '@/constants/theme';

type ReviewInformationScreenProps = NativeStackScreenProps<
  RegisterFlowParamList,
  'ReviewInformation'
>;

interface InfoRow {
  icon: LucideIcon;
  label: string;
  value: string;
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
    {rows.map(({ icon: Icon, label, value }) => (
      <View key={label} style={styles.row}>
        <View style={styles.rowIcon}>
          <Icon size={18} color={COLORS.primary} strokeWidth={2} />
        </View>
        <View style={styles.rowTexts}>
          <Text style={styles.rowLabel}>{label}</Text>
          <Text style={styles.rowValue} numberOfLines={1}>
            {value}
          </Text>
        </View>
      </View>
    ))}
  </View>
);

const orFallback = (value: string, fallback: string) =>
  value.trim() || fallback;

const ReviewInformationScreen: React.FC<ReviewInformationScreenProps> = ({
  navigation,
}) => {
  const { data } = useRegistration();
  const isTherapist = data.role === 'fisioterapeuta';

  const basicRows: InfoRow[] = [
    {
      icon: User,
      label: 'Nombre',
      value: orFallback(data.fullName, 'Laura Martínez'),
    },
    {
      icon: Mail,
      label: 'Correo',
      value: orFallback(data.email, 'laura.martinez@correo.com'),
    },
  ];

  const roleRows: InfoRow[] = isTherapist
    ? [
        {
          icon: Briefcase,
          label: 'Rol',
          value: 'Fisioterapeuta',
        },
        {
          icon: Star,
          label: 'Especialidad',
          value: orFallback(data.specialty, 'Terapia de mano'),
        },
        {
          icon: IdCard,
          label: 'Licencia',
          value: orFallback(data.licenseNumber, 'TP-123456'),
        },
        {
          icon: GraduationCap,
          label: 'Universidad',
          value: orFallback(data.institution, 'Universidad del Rosario'),
        },
        {
          icon: Stethoscope,
          label: 'Experiencia',
          value: orFallback(data.yearsExperience, '5 años'),
        },
      ]
    : [
        {
          icon: UserRound,
          label: 'Rol',
          value: 'Paciente',
        },
        {
          icon: MapPin,
          label: 'Ciudad',
          value: orFallback(data.city, 'Bogotá'),
        },
        {
          icon: Globe,
          label: 'País',
          value: orFallback(data.country, 'Colombia'),
        },
        {
          icon: UserRound,
          label: 'Mano dominante',
          value: orFallback(data.dominantHand, 'Derecha'),
        },
      ];

  const additionalRows: InfoRow[] = [
    {
      icon: Phone,
      label: 'Teléfono',
      value: orFallback(data.phone, '300 123 4567'),
    },
    {
      icon: Stethoscope,
      label: 'Notas',
      value: orFallback(data.notes, 'Sin notas adicionales'),
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

        <TouchableOpacity
          style={styles.primaryButton}
          activeOpacity={0.85}
          onPress={() => navigation.navigate('FinalWelcome')}
        >
          <Text style={styles.primaryButtonText}>Crear cuenta</Text>
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
