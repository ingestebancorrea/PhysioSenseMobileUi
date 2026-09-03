import React, { useMemo, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft } from 'lucide-react-native';
import { COLORS } from '@/constants/theme';
import type { SessionFormData } from '@/types/session';
import { SessionFormStepper } from '@/components/sessionForm/SessionFormStepper';
import { SessionInfoStep, type SessionInfoField } from '@/components/sessionForm/SessionInfoStep';
import { SessionExercisesStep } from '@/components/sessionForm/SessionExercisesStep';
import { SessionReviewStep } from '@/components/sessionForm/SessionReviewStep';
import { SessionFormFooter } from '@/components/sessionForm/SessionFormFooter';

const INITIAL_FORM: SessionFormData = {
  patientName: 'María López',
  sessionTitle: 'Sesión de seguimiento - Semana 4',
  sessionObjective: 'Mejorar fuerza y rango de movimiento de la muñeca.',
  selectedDate: '14/05/2024',
  selectedTime: '10:00 a. m.',
  estimatedDuration: '40',
  exercises: [
    { id: '1', title: 'Apertura de mano', sessions: '3', repetitions: '15', imageUrl: 'countdownFive' },
    { id: '2', title: 'Flexión de dedos', sessions: '3', repetitions: '15', imageUrl: 'countdownFour' },
    { id: '3', title: 'Extensión de muñeca', sessions: '3', repetitions: '15', imageUrl: 'countdownThree' },
    { id: '4', title: 'Supinación de muñeca', sessions: '3', repetitions: '15', imageUrl: 'countdownTwo' },
  ],
};

export interface CreateSessionScreenProps {
  onBack?: () => void;
}

export const CreateSessionScreen: React.FC<CreateSessionScreenProps> = ({ onBack }) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [form, setForm] = useState<SessionFormData>(INITIAL_FORM);
  const [showExercises, setShowExercises] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<SessionInfoField, string>>>({});

  const stepValidation: Record<number, SessionInfoField[]> = useMemo(
    () => ({
      1: ['patientName', 'sessionTitle', 'sessionObjective', 'selectedDate', 'selectedTime'],
    }),
    [],
  );

  const updateField = <K extends SessionInfoField>(key: K, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors((prev) => ({ ...prev, [key]: undefined }));
    }
  };

  const updateExercises = (updater: (prev: SessionFormData['exercises']) => SessionFormData['exercises']) => {
    setForm((prev) => ({ ...prev, exercises: updater(prev.exercises) }));
  };

  const validateStep = (): boolean => {
    const fieldsToValidate = stepValidation[currentStep] ?? [];
    const nextErrors: Partial<Record<SessionInfoField, string>> = {};

    fieldsToValidate.forEach((field) => {
      if (!form[field]?.trim()) {
        nextErrors[field] = 'Campo obligatorio';
      }
    });

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleNext = () => {
    if (!validateStep()) {
      return;
    }
    setCurrentStep((prev) => prev + 1);
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(1, prev - 1));
  };

  const handleRemoveExercise = (id: string) => {
    updateExercises((prev) => prev.filter((item) => item.id !== id));
  };

  const handleAddExercise = () => {
    Alert.alert('Información', 'La selección de ejercicios estará disponible próximamente.');
  };

  const handleSaveSession = () => {
    const payload = {
      patientName: form.patientName,
      sessionTitle: form.sessionTitle,
      sessionObjective: form.sessionObjective,
      dateTime: `${form.selectedDate} - ${form.selectedTime}`,
      estimatedDuration: `${form.estimatedDuration} min`,
      exercisesCount: form.exercises.length,
      exercises: form.exercises,
    };

    console.log('Sesión Guardada Exitosamente:', payload);
    Alert.alert('¡Éxito!', 'La sesión ha sido creada correctamente.', [
      { text: 'OK', onPress: () => onBack?.() },
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={onBack}
          style={styles.backButton}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <ArrowLeft color={COLORS.textPrimary} size={22} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Crear sesión</Text>
        <View style={styles.headerSpacer} />
      </View>

      <SessionFormStepper currentStep={currentStep} />

      <ScrollView
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {currentStep === 1 && (
          <SessionInfoStep form={form} errors={errors} onChange={updateField} />
        )}

        {currentStep === 2 && (
          <SessionExercisesStep
            exercises={form.exercises}
            onAdd={handleAddExercise}
            onRemove={handleRemoveExercise}
          />
        )}

        {currentStep === 3 && (
          <SessionReviewStep
            form={form}
            onToggleExercises={() => setShowExercises((prev) => !prev)}
            showExercises={showExercises}
          />
        )}
      </ScrollView>

      <SessionFormFooter
        currentStep={currentStep}
        isLastStep={currentStep === 3}
        onPrevious={handlePrevious}
        onNext={handleNext}
        onSave={handleSaveSession}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FAFAFC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
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
    padding: 20,
    gap: 12,
  },
});
