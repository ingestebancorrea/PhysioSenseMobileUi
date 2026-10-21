import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { Clock } from 'lucide-react-native';
import { COLORS } from '@/constants/theme';
import { SelectField } from '@/components/common/selectField/SelectField';
import { DatePickerField } from './DatePickerField';
import { NumberPickerField } from './NumberPickerField';
import { LabeledField } from './LabeledField';
import { durationSuffix, formatDurationNumber } from './duration';
import type { SessionFormData } from '@/types/session';

export type SessionInfoField =
  | 'patientName'
  | 'sessionTitle'
  | 'sessionObjective'
  | 'selectedDate'
  | 'selectedTime'
  | 'estimatedDuration';

export interface SessionInfoStepProps {
  form: SessionFormData;
  errors: Partial<Record<SessionInfoField, string>>;
  onChange: <K extends SessionInfoField>(key: K, value: SessionFormData[K]) => void;
}

const PATIENTS = ['María López', 'Juan Pérez', 'Ana García', 'Carlos Rodríguez'];
const TIMES = [
  '08:00 a. m.',
  '09:00 a. m.',
  '10:00 a. m.',
  '11:00 a. m.',
  '12:00 p. m.',
  '01:00 p. m.',
  '02:00 p. m.',
  '03:00 p. m.',
  '04:00 p. m.',
  '05:00 p. m.',
];

export const SessionInfoStep: React.FC<SessionInfoStepProps> = ({
  form,
  errors,
  onChange,
}) => {
  return (
    <View style={styles.container}>
      <FieldError error={errors.patientName}>
        <SelectField
          label="Paciente *"
          value={form.patientName}
          onSelect={(v) => onChange('patientName', v)}
          options={PATIENTS}
          placeholder="Selecciona un paciente"
        />
      </FieldError>

      <LabeledField label="Título de la sesión" required error={errors.sessionTitle}>
        <TextInput
          style={styles.input}
          placeholder="Ej: Sesión de seguimiento"
          placeholderTextColor={COLORS.textMuted}
          value={form.sessionTitle}
          onChangeText={(v) => onChange('sessionTitle', v)}
        />
      </LabeledField>

      <LabeledField label="Objetivo de la sesión" required error={errors.sessionObjective}>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Ej: Mejorar la fuerza y el rango de movimiento"
          placeholderTextColor={COLORS.textMuted}
          multiline
          numberOfLines={3}
          textAlignVertical="top"
          value={form.sessionObjective}
          onChangeText={(v) => onChange('sessionObjective', v)}
        />
      </LabeledField>

      <View style={styles.row}>
        <View style={styles.rowItem}>
          <FieldError error={errors.selectedDate}>
            <DatePickerField
              label="Fecha *"
              value={form.selectedDate}
              onSelect={(v) => onChange('selectedDate', v)}
              placeholder="Selecciona fecha"
            />
          </FieldError>
        </View>
        <View style={styles.rowItem}>
          <FieldError error={errors.selectedTime}>
            <SelectField
              label="Hora *"
              icon={Clock}
              value={form.selectedTime}
              onSelect={(v) => onChange('selectedTime', v)}
              options={TIMES}
              placeholder="Hora"
            />
          </FieldError>
        </View>
      </View>

      <NumberPickerField
        label="Duración estimada"
        value={form.estimatedDuration}
        onSelect={(v) => onChange('estimatedDuration', v)}
        min={1}
        max={240}
        step={5}
        format={formatDurationNumber}
        suffix={durationSuffix(Number(form.estimatedDuration))}
        editable
        required
      />
    </View>
  );
};

const FieldError: React.FC<{ error?: string; children: React.ReactNode }> = ({
  error,
  children,
}) => (
  <View>
    {children}
    {error ? <Text style={styles.error}>{error}</Text> : null}
  </View>
);

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  row: {
    flexDirection: 'row',
    gap: 10,
    flexWrap: 'wrap',
  },
  rowItem: {
    flex: 1,
    minWidth: 150,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EBECEF',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: '#1A1C20',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  error: {
    fontSize: 12,
    color: '#E5484D',
    marginTop: 6,
  },
});
