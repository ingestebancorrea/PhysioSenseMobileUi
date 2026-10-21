import React, { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { CARD, COLORS } from '@/constants/theme';
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

export const MetricCard = memo(({ metric }: MetricCardProps) => {
  const Icon = ICONS[metric.icon];
  const tone = TONES[metric.tone];

  return (
    <View style={styles.card}>
      <View style={styles.container}>
        <View style={[styles.iconContainer, { backgroundColor: tone.background }]}>
          <Icon size={22} color={tone.color} />
        </View>
        <Text style={styles.title} numberOfLines={2} adjustsFontSizeToFit minimumFontScale={0.8}>
          {metric.title}
        </Text>
      </View>
      <Text style={styles.value}>{metric.value}</Text>
      {metric.progress !== undefined && (
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${metric.progress}%` }]} />
        </View>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  card: {
    ...CARD,
    flexBasis: '48%',
    flexGrow: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  title: {
    fontSize: 19,
    color: COLORS.textSecondary,
    marginBottom: 4,
    flex: 1,
    flexShrink: 1,
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
});
