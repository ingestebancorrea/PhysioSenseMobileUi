import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { COLORS } from '@/constants/theme';
import { ICONS } from '@/constants/icons';
import type { DashboardMetric, MetricTone } from '@/types/dashboard';

interface MetricCardProps {
  metric: DashboardMetric;
}

const TONES: Record<
  MetricTone,
  { color: string; background: string }
> = {
  success: { color: COLORS.success, background: COLORS.successSoft },
  primary: { color: COLORS.primary, background: COLORS.primarySoft },
};

export const MetricCard: React.FC<MetricCardProps> = ({ metric }) => {
  const Icon = ICONS[metric.icon];
  const tone = TONES[metric.tone];

  return (
    <View style={styles.card}>
      <View style={styles.container }>
        <View style={[styles.iconContainer, { backgroundColor: tone.background }]}>
          <Icon size={22} color={tone.color} />
        </View>
        <Text style={styles.title}>{metric.title}</Text>
      </View>
      <Text style={styles.value}>{metric.value}</Text>
      {metric.progress !== undefined && (
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${metric.progress}%` }]} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '48%',
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 16,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 19,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  value: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.textPrimary,
    textAlign: 'center',
  },
  progressTrack: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.progressTrack,
    marginTop: 10,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
    backgroundColor: COLORS.primary,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
});
