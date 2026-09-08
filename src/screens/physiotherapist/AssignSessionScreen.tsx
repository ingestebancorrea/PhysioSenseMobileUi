import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '@/constants/theme';
import { ICONS } from '@/constants/icons';
import { DatePickerField } from '@/components/sessionForm/DatePickerField';
import { NumberPickerField } from '@/components/sessionForm/NumberPickerField';

const pad = (num: number) => String(num).padStart(2, '0');

const todayDisplay = () => {
  const now = new Date();
  return `${pad(now.getDate())}/${pad(now.getMonth() + 1)}/${now.getFullYear()}`;
};

export interface AssignSessionScreenProps {
  onBack?: () => void;
  onCreateSession?: () => void;
  initialPatient?: string;
}

export const AssignSessionScreen: React.FC<AssignSessionScreenProps> = ({
  onBack,
  onCreateSession,
  initialPatient,
}) => {
  const [patient, setPatient] = useState(initialPatient ?? '');
  const [session, setSession] = useState('');
  const [startDate, setStartDate] = useState(todayDisplay);
  const [frequency, setFrequency] = useState('3');
  const [planDuration, setPlanDuration] = useState('4');
  const [notes, setNotes] = useState('');

  const BackIcon = ICONS.arrowLeft;
  const PlusIcon = ICONS.plus;

  const handleAssignSession = () => {
    if (!patient || !session || !startDate) {
      Alert.alert(
        'Campos requeridos',
        'Por favor selecciona un paciente, una sesión y la fecha de inicio.',
      );
      return;
    }

    const payload = {
      patient,
      session,
      startDate,
      frequency: `${frequency} veces por semana`,
      planDuration: `${planDuration} semanas`,
      notes,
    };

    console.log('Sesión Asignada Exitosamente:', payload);
    Alert.alert(
      '¡Éxito!',
      'La sesión ha sido asignada al paciente correctamente.',
      [{ text: 'OK', onPress: onBack }],
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={onBack}
          style={styles.backButton}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <BackIcon color={COLORS.textPrimary} size={22} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Asignar sesión</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.formGroup}>
          <Text style={styles.inputLabel}>
            Seleccionar paciente{' '}
            <Text style={styles.requiredAsterisk}>*</Text>
          </Text>
          <View style={styles.inputWrapper}>
            <TextInput
              value={patient}
              onChangeText={setPatient}
              placeholder="Buscar paciente..."
              placeholderTextColor={COLORS.textMuted}
              style={styles.textInput}
            />
          </View>

          <Text style={styles.inputLabel}>
            Seleccionar sesión{' '}
            <Text style={styles.requiredAsterisk}>*</Text>
          </Text>
          <View style={styles.inputWrapper}>
            <TextInput
              value={session}
              onChangeText={setSession}
              placeholder="Buscar o crear sesión..."
              placeholderTextColor={COLORS.textMuted}
              style={styles.textInput}
            />
          </View>

          <TouchableOpacity
            onPress={onCreateSession}
            style={styles.createSessionLink}
            activeOpacity={0.7}
          >
            <PlusIcon color={COLORS.primary} size={16} />
            <Text style={styles.createSessionLinkText}> Crear nueva sesión</Text>
          </TouchableOpacity>

          <DatePickerField
            label="Fecha de inicio *"
            value={startDate}
            onSelect={setStartDate}
            placeholder="DD/MM/AAAA"
          />

          <NumberPickerField
            label="Frecuencia"
            value={frequency}
            onSelect={setFrequency}
            min={1}
            max={7}
            step={1}
            suffix="veces por semana"
          />

          <NumberPickerField
            label="Duración del plan"
            value={planDuration}
            onSelect={setPlanDuration}
            min={1}
            max={24}
            step={1}
            suffix="semanas"
          />

          <Text style={styles.inputLabel}>Notas (opcional)</Text>
          <View style={[styles.inputWrapper, styles.textAreaWrapper]}>
            <TextInput
              value={notes}
              onChangeText={setNotes}
              placeholder="Indicaciones adicionales para el paciente..."
              placeholderTextColor={COLORS.textMuted}
              style={[styles.textInput, styles.textArea]}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={handleAssignSession}
          style={styles.assignButton}
        >
          <Text style={styles.assignButtonText}>Asignar sesión</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.backgroundMuted,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderSubtle,
    backgroundColor: COLORS.surface,
  },
  backButton: {
    padding: 4,
  },
  headerSpacer: {
    width: 28,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1A1C20',
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
  },
  formGroup: {
    gap: 4,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1A1C20',
    marginTop: 12,
  },
  requiredAsterisk: {
    color: COLORS.danger,
  },
  inputWrapper: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: '#EBECEF',
    borderRadius: 12,
    paddingHorizontal: 14,
  },
  textInput: {
    paddingVertical: 12,
    fontSize: 14,
    color: '#1A1C20',
  },
  createSessionLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
    marginBottom: 4,
    alignSelf: 'flex-start',
  },
  createSessionLinkText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.primary,
  },
  textAreaWrapper: {
    paddingVertical: 4,
    minHeight: 100,
  },
  textArea: {
    height: 90,
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 16,
    paddingTop: 12,
    backgroundColor: COLORS.backgroundMuted,
  },
  assignButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  assignButtonText: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: '700',
  },
});
