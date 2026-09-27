import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { CARD, COLORS } from '@/constants/theme';
import { ICONS } from '@/constants/icons';
import type { QualityLevel } from '@/types/execution';

interface SeriesMetricsRowProps {
  completedReps: number;
  totalReps: number;
  averageQuality: QualityLevel;
  averageForce: number;
}

const QUALITY_COLOR: Record<QualityLevel, string> = {
  Buena: COLORS.success,
  Regular: COLORS.warning,
  Mala: COLORS.danger,
};

export const SeriesMetricsRow: React.FC<SeriesMetricsRowProps> = ({
  completedReps,
  totalReps,
  averageQuality,
  averageForce,
}) => {
  const RepeatIcon = ICONS.repeat;
  const CheckIcon = ICONS.check;
  const ActivityIcon = ICONS.activity;

  return (
    <View style={[CARD, styles.card]}>
      <View style={styles.column}>
        <View style={[styles.iconCircle, styles.iconPurple]}>
          <RepeatIcon size={18} color={COLORS.primary} />
        </View>
        <Text style={styles.metricValue}>
          {completedReps}/{totalReps}
        </Text>
        <Text style={styles.metricLabel}>Repeticiones</Text>
      </View>

      <View style={styles.divider} />

      <View style={styles.column}>
        <View
          style={[
            styles.iconCircle,
            { backgroundColor: `${QUALITY_COLOR[averageQuality]}15` },
          ]}
        >
          <CheckIcon size={18} color={QUALITY_COLOR[averageQuality]} />
        </View>
        <Text
          style={[styles.metricValue, { color: QUALITY_COLOR[averageQuality] }]}
        >
          {averageQuality}
        </Text>
        <Text style={styles.metricLabel}>Calidad</Text>
      </View>

      <View style={styles.divider} />

      <View style={styles.column}>
        <View style={[styles.iconCircle, styles.iconPurple]}>
          <ActivityIcon size={18} color={COLORS.primary} />
        </View>
        <Text style={styles.metricValue}>{averageForce} N</Text>
        <Text style={styles.metricLabel}>Fuerza</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 12,
  },
  column: {
    flex: 1,
    alignItems: 'center',
    gap: 6,
  },
  divider: {
    width: 1,
    height: 40,
    backgroundColor: COLORS.divider,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconPurple: {
    backgroundColor: COLORS.primarySoft,
  },
  metricValue: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  metricLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: COLORS.textMuted,
  },
});
