import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ICONS } from '@/constants/icons';
import { COLORS, CARD } from '@/constants/theme';
import type { ExerciseDetailSpecs } from '@/types/exerciseDetail';

interface ExerciseSpecsCardProps {
  specs: ExerciseDetailSpecs;
}

export const ExerciseSpecsCard: React.FC<ExerciseSpecsCardProps> = ({ specs }) => {
  const RepeatIcon = ICONS.repeat;
  const CheckIcon = ICONS.check;
  const ClockIcon = ICONS.clock;
  const CircleCheckIcon = ICONS.circleCheck;

  const metrics = [
    { key: 'series', icon: RepeatIcon, value: String(specs.series), label: 'Series' },
    {
      key: 'reps',
      icon: CheckIcon,
      value: `${specs.repsPerSeries} por serie`,
      label: 'Repeticiones',
    },
    {
      key: 'rest',
      icon: ClockIcon,
      value: `${specs.restTimeSeconds} seg`,
      label: 'Descanso',
    },
  ];

  return (
    <View style={[CARD, styles.card]}>
      <View style={styles.metricsRow}>
        {metrics.map(metric => (
          <View key={metric.key} style={styles.metricColumn}>
            <View style={styles.metricIcon}>
              <metric.icon size={15} color={COLORS.primary} />
            </View>
            <Text style={styles.metricValue}>{metric.value}</Text>
            <Text style={styles.metricLabel}>{metric.label}</Text>
          </View>
        ))}
      </View>

      <View style={styles.divider} />

      <View style={styles.requirementsSection}>
        <Text style={styles.requirementsTitle}>Requisitos</Text>
        <View style={styles.requirements}>
          {specs.requirements.map(requirement => (
            <View key={requirement} style={styles.requirementRow}>
              <CircleCheckIcon size={20} color={COLORS.success} />
              <Text style={styles.requirementText}>{requirement}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    gap: 16,
  },
  metricsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  metricColumn: {
    flex: 1,
    alignItems: 'center',
    gap: 6,
  },
  metricIcon: {
    width: 38,
    height: 38,
    borderRadius: 14,
    backgroundColor: COLORS.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  metricValue: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
    textAlign: 'center',
  },
  metricLabel: {
    fontSize: 13,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.divider,
  },
  requirementsSection: {
    gap: 12,
  },
  requirementsTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  requirements: {
    gap: 12,
  },
  requirementRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  requirementText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.textSecondary,
  },
});
