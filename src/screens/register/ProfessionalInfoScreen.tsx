// src/screens/register/ProfessionalInfoScreen.tsx
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
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  ChevronLeft,
  GraduationCap,
  IdCard,
  Stethoscope,
} from 'lucide-react-native';

import { useRegistration } from '@/context/RegistrationContext';
import { FormField } from '@/components/common/formField/FormField';
import { SelectField } from '@/components/common/selectField/SelectField';
import { RegisterFlowParamList } from '@/navigation/types/registerFlowParams';
import { COLORS } from '@/constants/theme';

type ProfessionalInfoScreenProps = NativeStackScreenProps<
  RegisterFlowParamList,
  'ProfessionalInfo'
>;

const SPECIALTIES = [
  'Terapia de mano',
  'Ortopedia',
  'Neurología',
  'Deportiva',
  'Geriátrica',
  'Pediatría',
];

const EXPERIENCE_OPTIONS = [
  'Menos de 1 año',
  '1 - 2 años',
  '3 - 5 años',
  '5 - 10 años',
  'Más de 10 años',
];

const ProfessionalInfoScreen: React.FC<ProfessionalInfoScreenProps> = ({
  navigation,
}) => {
  const { data, updateField } = useRegistration();

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
          <View style={styles.headerIcon}>
            <Stethoscope size={32} color={COLORS.primary} strokeWidth={2} />
          </View>

          <View style={styles.header}>
            <Text style={styles.title}>Cuéntanos más sobre ti</Text>
            <Text style={styles.subtitle}>
              Completa tu información profesional.
            </Text>
          </View>

          <SelectField
            label="Especialidad"
            value={data.specialty}
            onSelect={value => updateField('specialty', value)}
            options={SPECIALTIES}
            placeholder="Ej. Terapia de mano"
          />

          <FormField
            label="Número de licencia profesional"
            placeholder="Ej. TP-123456"
            value={data.licenseNumber}
            onChangeText={text => updateField('licenseNumber', text)}
            icon={IdCard}
            autoCapitalize="characters"
          />

          <FormField
            label="Institución / Universidad"
            placeholder="Ej. Universidad del Rosario"
            value={data.institution}
            onChangeText={text => updateField('institution', text)}
            icon={GraduationCap}
            autoCapitalize="words"
          />

          <SelectField
            label="Años de experiencia"
            value={data.yearsExperience}
            onSelect={value => updateField('yearsExperience', value)}
            options={EXPERIENCE_OPTIONS}
            placeholder="Selecciona"
          />

          <TouchableOpacity
            style={styles.primaryButton}
            activeOpacity={0.85}
            onPress={() => navigation.navigate('AdditionalInfo')}
          >
            <Text style={styles.primaryButtonText}>Continuar</Text>
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
    paddingTop: 20,
    paddingBottom: 32,
  },
  headerIcon: {
    alignSelf: 'center',
    width: 72,
    height: 72,
    borderRadius: 22,
    backgroundColor: COLORS.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
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

export default ProfessionalInfoScreen;
