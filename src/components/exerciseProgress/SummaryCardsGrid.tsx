import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { COLORS } from '@/constants/theme';
import type { SummaryMetric } from '@/types/exerciseProgress';

interface SummaryCardsGridProps {
  metrics: SummaryMetric[];
}

export const SummaryCardsGrid: React.FC<SummaryCardsGridProps> = ({
  metrics,
}) => (
  <View style={styles.grid}>
    {metrics.map(metric => (
      <View key={metric.id} style={styles.card}>
        <Text
          style={styles.value}
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={0.8}
        >
          {metric.value}
        </Text>
        <Text style={styles.label} numberOfLines={2}>
          {metric.title}
        </Text>
      </View>
    ))}
  </View>
);

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 16,
  },
  card: {
    flex: 1,
    flexBasis: 100,
    minWidth: 0,
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    paddingVertical: 16,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  value: {
    flexShrink: 0,
    fontSize: 17,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  label: {
    fontSize: 11,
    fontWeight: '500',
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
});