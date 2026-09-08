import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { CARD, COLORS } from '@/constants/theme';

interface TargetRangeBarProps {
  currentAngle?: number;
  minTargetAngle?: number;
  maxTargetAngle?: number;
  maxAngleScale?: number;
}

export const TargetRangeBar: React.FC<TargetRangeBarProps> = ({
  currentAngle = 78,
  minTargetAngle = 60,
  maxTargetAngle = 90,
  maxAngleScale = 120,
}) => {
  const progressPercent = Math.min((currentAngle / maxAngleScale) * 100, 100);
  const targetMaxPercent = Math.min((maxTargetAngle / maxAngleScale) * 100, 100);
  const rangeWidthPercent = Math.max(targetMaxPercent - progressPercent, 0);

  return (
    <View style={[CARD, styles.container]}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Rango objetivo</Text>
        <Text style={styles.rangeValue}>
          {minTargetAngle}° - {maxTargetAngle}°
        </Text>
      </View>

      <View style={styles.trackBackground}>
        <View
          style={[styles.progressFill, { width: `${progressPercent}%` }]}
        />
        <View
          style={[styles.targetRangeFill, { width: `${rangeWidthPercent}%` }]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  rangeValue: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  trackBackground: {
    height: 10,
    width: '100%',
    backgroundColor: '#F2F4F8',
    borderRadius: 5,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5,
  },
  targetRangeFill: {
    height: '100%',
    backgroundColor: '#8C6CFF',
    opacity: 0.7,
  },
});
