import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { COLORS } from '@/constants/theme';
import type { AverageMetric } from '@/types/exerciseProgress';

interface MetricsListCardProps {
  title: string;
  metrics: AverageMetric[];
}

export const MetricsListCard: React.FC<MetricsListCardProps> = ({
  title,
  metrics,
}) => (
  <View style={styles.card}>
    <Text style={styles.cardTitle}>{title}</Text>

    {metrics.map((metric, index) => (
      <View key={metric.id}>
        {index > 0 && <View style={styles.divider} />}
        <View
          style={[
            styles.row,
            index === metrics.length - 1 && styles.lastRow,
          ]}
        >
          <Text style={styles.label} numberOfLines={1}>
            {metric.label}
          </Text>
          <Text style={styles.value}>{metric.value}</Text>
        </View>
      </View>
    ))}
  </View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    padding: 22,
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 18,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 16,
  },
  lastRow: {
    paddingBottom: 0,
  },
  label: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
    color: COLORS.textSecondary,
  },
  value: {
    flexShrink: 0,
    fontSize: 17,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.divider,
  },
});