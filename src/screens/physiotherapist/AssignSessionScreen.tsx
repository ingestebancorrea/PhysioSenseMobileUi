import React, { useCallback, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '@/constants/theme';
import { ICONS } from '@/constants/icons';
import { DatePickerField } from '@/components/sessionForm/DatePickerField';
import { NumberPickerField } from '@/components/sessionForm/NumberPickerField';
import { PickerField } from '@/components/assignSession/PickerField';
import { PickerSheet } from '@/components/common/pickerSheet/PickerSheet';
import { PatientCard } from '@/components/patients/PatientCard';
import { SessionCard } from '@/components/sessions/SessionCard';
import { useAppAlert } from '@/hooks/useAppAlert';
import { useRemoteList } from '@/hooks/useRemoteList';
import { ApiClientError } from '@/services/api/client';
import { patientService } from '@/services/patientService';
import { sessionService } from '@/services/sessionService';
import type { Patient } from '@/types/patient';
import type { Session } from '@/types/session';

const pad = (num: number) => String(num).padStart(2, '0');

const todayDisplay = () => {
  const now = new Date();
  return `${pad(now.getDate())}/${pad(now.getMonth() + 1)}/${now.getFullYear()}`;
};

/** Convierte el formato visual `DD/MM/AAAA` al `YYYY-MM-DD` que pide el API. */
const toIsoDate = (value: string): string => {
  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(value);
  if (!match) return '';
  const [, day, month, year] = match;
  return `${year}-${month}-${day}`;
};

const ASSIGN_ERROR_MESSAGE =
  'No se pudo asignar la sesión. Intenta de nuevo más tarde.';

export interface AssignSessionScreenProps {
  onBack?: () => void;
  onCreateSession?: () => void;
  /** Paciente preseleccionado (p.ej. cuando se entra desde su ficha). */
  initialPatient?: Patient | null;
}

export const AssignSessionScreen: React.FC<AssignSessionScreenProps> = ({
  onBack,
  onCreateSession,
  initialPatient,
}) => {
  const [patient, setPatient] = useState<Patient | null>(
    initialPatient ?? null,
  );
  const [session, setSession] = useState<Session | null>(null);
  const [startDate, setStartDate] = useState(todayDisplay);
  const [frequency, setFrequency] = useState('3');
  const [planDuration, setPlanDuration] = useState('4');
  const [notes, setNotes] = useState('');

  const [patientPickerVisible, setPatientPickerVisible] = useState(false);
  const [sessionPickerVisible, setSessionPickerVisible] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Primera pantalla: un único GET de los pacientes asignados.
  const loadPatients = useCallback(async (term: string) => {
    const result = await patientService.getMyPatients(
      term ? { search: term } : undefined,
    );

    return result.patients;
  }, []);

  // Las sesiones se piden cuando ya hay un paciente seleccionado.
  const loadSessions = useCallback(
    async (term: string) => {
      if (!patient) {
        return [];
      }

      const result = await sessionService.getSessionsForPatient(patient.id, {
        search: term || undefined,
      });

      return result.sessions;
    },
    [patient],
  );

  const {
    items: patients,
    loading: patientsLoading,
    error: patientsError,
    search: patientSearch,
    setSearch: setPatientSearch,
    reload: reloadPatients,
  } = useRemoteList(loadPatients);

  const {
    items: sessions,
    loading: sessionsLoading,
    error: sessionsError,
    search: sessionSearch,
    setSearch: setSessionSearch,
    reload: reloadSessions,
  } = useRemoteList(loadSessions);

  const { alertModal, showAlert } = useAppAlert();

  const BackIcon = ICONS.arrowLeft;
  const PlusIcon = ICONS.plus;

  const handleSelectPatient = useCallback((selected: Patient) => {
    setPatient(selected);
    // Al cambiar de paciente se descarta la sesión elegida: ya no pertenece
    // al paciente nuevo.
    setSession(null);
    setPatientPickerVisible(false);
  }, []);

  const handleSelectSession = useCallback(
    (sessionId: string) => {
      const selected = sessions.find(item => item.id === sessionId);

      if (selected) {
        setSession(selected);
        setSessionPickerVisible(false);
      }
    },
    [sessions],
  );

  const handleClearPatient = useCallback(() => {
    setPatient(null);
    setSession(null);
  }, []);

  const handleClearSession = useCallback(() => {
    setSession(null);
  }, []);

  const handleAssignSession = async () => {
    if (!patient || !session || !startDate) {
      showAlert({
        title: 'Campos requeridos',
        message:
          'Por favor selecciona un paciente, una sesión y la fecha de inicio.',
        variant: 'warning',
      });
      return;
    }

    setSubmitting(true);

    try {
      await sessionService.createTreatmentPlan({
        patientId: patient.id,
        sessionId: session.id,
        startDate: toIsoDate(startDate),
        frequencyPerWeek: Number(frequency),
        planDurationWeeks: Number(planDuration),
        notes: notes.trim() || undefined,
      });

      showAlert({
        title: '¡Éxito!',
        message: `La sesión "${session.title}" ha sido asignada a ${patient.name} correctamente.`,
        variant: 'success',
        confirmText: 'OK',
        onConfirm: onBack,
      });
    } catch (error) {
      showAlert({
        title: 'No se pudo asignar la sesión',
        message:
          error instanceof ApiClientError ? error.message : ASSIGN_ERROR_MESSAGE,
        variant: 'error',
      });
    } finally {
      setSubmitting(false);
    }
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

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
        <View style={styles.formGroup}>
          <PickerField
            label="Seleccionar paciente"
            required
            value={patient?.name}
            subtitle={
              patient
                ? `ID: ${patient.id} • ${patient.age} años`
                : undefined
            }
            placeholder="Buscar paciente..."
            icon={ICONS.user}
            onPress={() => setPatientPickerVisible(true)}
            onClear={handleClearPatient}
          />

          <PickerField
            label="Seleccionar sesión"
            required
            value={session?.title}
            subtitle={
              session
                ? `${session.dateText} • ${session.durationMinutes} min`
                : undefined
            }
            placeholder={
              patient
                ? 'Buscar o crear sesión...'
                : 'Selecciona primero un paciente'
            }
            icon={ICONS.calendarDays}
            onPress={() => {
              if (!patient) {
                showAlert({
                  title: 'Selecciona un paciente',
                  message:
                    'Primero elige el paciente al que le vas a asignar la sesión.',
                  variant: 'info',
                });
                return;
              }

              setSessionPickerVisible(true);
            }}
            onClear={handleClearSession}
          />

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
            disabled={submitting}
            onPress={handleAssignSession}
            style={[styles.assignButton, submitting && styles.assignButtonDisabled]}
          >
            <Text style={styles.assignButtonText}>
              {submitting ? 'Asignando...' : 'Asignar sesión'}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      <PickerSheet
        visible={patientPickerVisible}
        title="Seleccionar paciente"
        search={patientSearch}
        onSearchChange={setPatientSearch}
        searchPlaceholder="Buscar por nombre o ID..."
        loading={patientsLoading}
        error={patientsError}
        onRetry={reloadPatients}
        items={patients}
        keyExtractor={item => item.id}
        renderItem={item => (
          <PatientCard patient={item} onPress={handleSelectPatient} />
        )}
        emptyTitle="No se encontraron pacientes"
        emptyMessage="Prueba con otro nombre o con el ID del paciente."
        onClose={() => setPatientPickerVisible(false)}
      />

      <PickerSheet
        visible={sessionPickerVisible}
        title="Seleccionar sesión"
        subtitle={patient?.name}
        search={sessionSearch}
        onSearchChange={setSessionSearch}
        searchPlaceholder="Buscar por título de sesión..."
        loading={sessionsLoading}
        error={sessionsError}
        onRetry={reloadSessions}
        items={sessions}
        keyExtractor={item => item.id}
        renderItem={item => (
          <SessionCard session={item} onPress={handleSelectSession} />
        )}
        emptyTitle="No se encontraron sesiones"
        emptyMessage="Este paciente todavía no tiene sesiones que puedas asignar."
        onClose={() => setSessionPickerVisible(false)}
      />

      {alertModal}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.backgroundMuted,
  },
  flex: {
    flex: 1,
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
    marginBottom: 8,
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
  assignButtonDisabled: {
    opacity: 0.6,
  },
  assignButtonText: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: '700',
  },
});
