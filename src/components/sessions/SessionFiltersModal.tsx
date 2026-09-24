import React, { useEffect, useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { CheckCircle2, RotateCcw, X } from 'lucide-react-native';
import { COLORS } from '@/constants/theme';
import { CheckboxRow } from '@/components/common/checkboxRow/CheckboxRow';
import type { SessionStatus } from '@/types/session';

export type DurationRange = 'short' | 'medium' | 'long';

export interface SessionFilters {
  statuses: SessionStatus[];
  duration: DurationRange | null;
  patients: string[];
}

export const EMPTY_FILTERS: SessionFilters = {
  statuses: [],
  duration: null,
  patients: [],
};

export const getActiveFilterCount = (filters: SessionFilters): number =>
  filters.statuses.length +
  (filters.duration ? 1 : 0) +
  filters.patients.length;

const STATUS_OPTIONS: SessionStatus[] = [
  'Activa',
  'Programada',
  'Completada',
  'Borrador',
];

const DURATION_OPTIONS: { key: DurationRange; label: string }[] = [
  { key: 'short', label: 'Hasta 30 min' },
  { key: 'medium', label: '30 - 45 min' },
  { key: 'long', label: 'Más de 45 min' },
];

interface SessionFiltersModalProps {
  visible: boolean;
  initialFilters: SessionFilters;
  patientOptions: string[];
  onClose: () => void;
  onApply: (filters: SessionFilters) => void;
  onReset: () => void;
}

export const SessionFiltersModal: React.FC<SessionFiltersModalProps> = ({
  visible,
  initialFilters,
  patientOptions,
  onClose,
  onApply,
  onReset,
}) => {
  const [draft, setDraft] = useState<SessionFilters>(initialFilters);

  useEffect(() => {
    if (visible) {
      setDraft(initialFilters);
    }
  }, [visible, initialFilters]);

  const toggleStatus = (status: SessionStatus) => {
    setDraft(prev => ({
      ...prev,
      statuses: prev.statuses.includes(status)
        ? prev.statuses.filter(s => s !== status)
        : [...prev.statuses, status],
    }));
  };

  const selectDuration = (key: DurationRange) => {
    setDraft(prev => ({
      ...prev,
      duration: prev.duration === key ? null : key,
    }));
  };

  const togglePatient = (name: string) => {
    setDraft(prev => ({
      ...prev,
      patients: prev.patients.includes(name)
        ? prev.patients.filter(p => p !== name)
        : [...prev.patients, name],
    }));
  };

  const handleReset = () => {
    setDraft(EMPTY_FILTERS);
    onReset();
    onClose();
  };

  const handleApply = () => {
    onApply(draft);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={styles.sheet}>
          <View style={styles.handleContainer}>
            <View style={styles.handleBar} />
          </View>

          <View style={styles.header}>
            <Text style={styles.headerTitle}>Filtros</Text>
            <TouchableOpacity
              style={styles.closeButton}
              activeOpacity={0.7}
              onPress={onClose}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <X size={22} color={COLORS.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
            bounces={false}
          >
            <Text style={styles.sectionTitle}>Estado</Text>
            <View style={styles.sectionCard}>
              {STATUS_OPTIONS.map(status => (
                <CheckboxRow
                  key={status}
                  text={status}
                  checked={draft.statuses.includes(status)}
                  onToggle={() => toggleStatus(status)}
                />
              ))}
            </View>

            <Text style={styles.sectionTitle}>Duración</Text>
            <View style={styles.durationRow}>
              {DURATION_OPTIONS.map(option => {
                const selected = draft.duration === option.key;
                return (
                  <TouchableOpacity
                    key={option.key}
                    style={[
                      styles.durationPill,
                      selected && styles.durationPillSelected,
                    ]}
                    activeOpacity={0.7}
                    onPress={() => selectDuration(option.key)}
                  >
                    <Text
                      style={[
                        styles.durationPillText,
                        selected && styles.durationPillTextSelected,
                      ]}
                    >
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <Text style={styles.sectionTitle}>Pacientes</Text>
            <View style={styles.patientWrap}>
              {patientOptions.length === 0 ? (
                <Text style={styles.noPatientsText}>
                  No hay pacientes disponibles.
                </Text>
              ) : (
                patientOptions.map(name => {
                  const selected = draft.patients.includes(name);
                  return (
                    <TouchableOpacity
                      key={name}
                      style={[
                        styles.patientChip,
                        selected && styles.patientChipSelected,
                      ]}
                      activeOpacity={0.7}
                      onPress={() => togglePatient(name)}
                    >
                      <Text
                        style={[
                          styles.patientChipText,
                          selected && styles.patientChipTextSelected,
                        ]}
                      >
                        {name}
                      </Text>
                    </TouchableOpacity>
                  );
                })
              )}
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.secondaryButton}
              activeOpacity={0.8}
              onPress={handleReset}
            >
              <RotateCcw size={18} color={COLORS.textPrimary} />
              <Text style={styles.secondaryButtonText}>Limpiar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.primaryButton}
              activeOpacity={0.8}
              onPress={handleApply}
            >
              <CheckCircle2 size={18} color={COLORS.white} />
              <Text style={styles.primaryButtonText}>Aplicar</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: COLORS.cardSoft,
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    maxHeight: '85%',
    overflow: 'hidden',
  },
  handleContainer: {
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 4,
    backgroundColor: COLORS.cardSoft,
  },
  handleBar: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.progressTrack,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 14,
    backgroundColor: COLORS.cardSoft,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
  },
  scroll: {
    flexGrow: 0,
    flexShrink: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 8,
    marginTop: 6,
  },
  sectionCard: {
    backgroundColor: COLORS.white,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 4,
  },
  durationRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  durationPill: {
    paddingVertical: 9,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  durationPillSelected: {
    backgroundColor: COLORS.primarySoft,
    borderColor: COLORS.primary,
  },
  durationPillText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  durationPillTextSelected: {
    color: COLORS.primaryDark,
  },
  patientWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  patientChip: {
    paddingVertical: 9,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  patientChipSelected: {
    backgroundColor: COLORS.violetSoft,
    borderColor: COLORS.violet,
  },
  patientChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  patientChipTextSelected: {
    color: COLORS.violet,
  },
  noPatientsText: {
    fontSize: 13,
    color: COLORS.textMuted,
  },
  footer: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 26,
    backgroundColor: COLORS.cardSoft,
  },
  secondaryButton: {
    flex: 1,
    height: 50,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  secondaryButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  primaryButton: {
    flex: 1.6,
    height: 50,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: COLORS.primary,
  },
  primaryButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.white,
  },
});