import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { CARD, COLORS } from '@/constants/theme';
import { ICONS } from '@/constants/icons';
import type { QualityLevel } from '@/types/execution';

interface MetricsGridProps {
  force: number;
  quality: QualityLevel;
}

const QUALITY_TONE: Record<QualityLevel, { color: string; bg: string }> = {
  Buena: { color: COLORS.success, bg: COLORS.successSoft },
  Regular: { color: COLORS.warning, bg: '#FFF5E6' },
  Mala: { color: COLORS.danger, bg: COLORS.dangerSoft },
};

export const MetricsGrid: React.FC<MetricsGridProps> = ({ force, quality }) => {
  const QualityIcon = ICONS.check;
  const ActivityIcon = ICONS.activity;
  const tone = QUALITY_TONE[quality];

  return (
    <View style={styles.row}>
      <View style={[CARD, styles.card]}>
        <View style={[styles.iconContainer, styles.iconPrimary]}>
          <ActivityIcon size={20} color={COLORS.primary} />
        </View>
        <Text style={styles.cardLabel}>Fuerza</Text>
        <Text style={styles.cardValue}>{force} N</Text>
      </View>

      <View style={[CARD, styles.card]}>
        <View style={[styles.iconContainer, { backgroundColor: tone.bg }]}>
          <QualityIcon size={20} color={tone.color} />
        </View>
        <Text style={styles.cardLabel}>Calidad</Text>
        <Text style={[styles.cardValue, { color: tone.color }]}>{quality}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  card: {
    flex: 1,
    alignItems: 'center',
    gap: 6,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  iconPrimary: {
    backgroundColor: COLORS.primarySoft,
  },
  cardLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: COLORS.textMuted,
  },
  cardValue: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
});
