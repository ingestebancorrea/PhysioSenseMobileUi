import React, { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { CARD, COLORS } from '@/constants/theme';
import type { ProgressMetric } from '@/types/progress';

interface ProgressMetricCardProps {
  metric: ProgressMetric;
}

export const ProgressMetricCard = memo(({ metric }: ProgressMetricCardProps) => {
  const percentageColor = metric.isPositive
    ? COLORS.success
    : COLORS.warning;

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{metric.title}</Text>
      <Text style={styles.value}>{metric.value}</Text>
      <Text style={[styles.percentage, { color: percentageColor }]}>
        {metric.percentage}
      </Text>
    </View>
  );
});

const styles = StyleSheet.create({
  card: {
    ...CARD,
    flexBasis: '48%',
    flexGrow: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 13,
    color: COLORS.textMuted,
    marginBottom: 8,
  },
  value: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 6,
  },
  percentage: {
    fontSize: 13,
    fontWeight: '600',
  },
});
