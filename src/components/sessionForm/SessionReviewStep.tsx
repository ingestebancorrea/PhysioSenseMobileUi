import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COLORS } from '@/constants/theme';
import { durationSuffix, formatDurationNumber } from './duration';
import type { SessionFormData } from '@/types/session';

export interface SessionReviewStepProps {
  form: SessionFormData;
  onToggleExercises: () => void;
  showExercises: boolean;
}

interface ReviewRowProps {
  label: string;
  value: string;
}

const ReviewRow: React.FC<ReviewRowProps> = ({ label, value }) => (
  <View style={styles.row}>
    <Text style={styles.rowLabel}>{label}</Text>
    <Text style={styles.rowValue}>{value}</Text>
  </View>
);

export const SessionReviewStep: React.FC<SessionReviewStepProps> = ({
  form,
  onToggleExercises,
  showExercises,
}) => {
  const { selectedDate, selectedTime } = form;
  return (
    <View style={styles.card}>
      <Text style={styles.mainTitle}>Resumen de la sesión</Text>

      <ReviewRow label="Paciente" value={form.patientName} />
      <ReviewRow label="Título" value={form.sessionTitle} />
      <ReviewRow label="Fecha y hora" value={`${selectedDate} - ${selectedTime}`} />
      <ReviewRow
        label="Duración estimada"
        value={`${formatDurationNumber(Number(form.estimatedDuration))} ${durationSuffix(Number(form.estimatedDuration))}`}
      />

      <View style={styles.row}>
        <Text style={styles.rowLabel}>{`Ejercicios (${form.exercises.length})`}</Text>
        <TouchableOpacity onPress={onToggleExercises} activeOpacity={0.7}>
          <Text style={styles.viewListText}>{showExercises ? 'Ocultar lista' : 'Ver lista'}</Text>
        </TouchableOpacity>
      </View>

      {showExercises &&
        form.exercises.map((exercise, index) => (
          <View key={exercise.id} style={styles.exerciseRow}>
            <Text style={styles.exerciseIndex}>{index + 1}.</Text>
            <View style={styles.exerciseTextCol}>
              <Text style={styles.exerciseTitle}>{exercise.title}</Text>
              <Text style={styles.exerciseDetails}>
                {`${exercise.sessions} sesiones x ${exercise.repetitions} repeticiones`}
              </Text>
            </View>
          </View>
        ))}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#F0F1F5',
    gap: 16,
  },
  mainTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1A1C20',
    marginBottom: 4,
  },
  row: {
    gap: 4,
  },
  rowLabel: {
    fontSize: 12,
    color: '#8E94A0',
    fontWeight: '500',
  },
  rowValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1A1C20',
  },
  viewListText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.primary,
  },
  exerciseRow: {
    flexDirection: 'row',
    gap: 10,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F1F5',
  },
  exerciseIndex: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.primary,
  },
  exerciseTextCol: {
    flex: 1,
  },
  exerciseTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1C20',
  },
  exerciseDetails: {
    fontSize: 12,
    color: '#8E94A0',
    marginTop: 2,
  },
});
