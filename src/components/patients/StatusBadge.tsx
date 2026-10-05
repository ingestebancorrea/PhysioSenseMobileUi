import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { COLORS } from '@/constants/theme';
import type { PatientStatus } from '@/types/patient';

const STATUS_CONFIG: Record<
  PatientStatus,
  { color: string; background: string }
> = {
  Activo: { color: COLORS.active, background: COLORS.activeSoft },
  Inactivo: { color: COLORS.inactive, background: COLORS.inactiveSoft },
};

interface StatusBadgeProps {
  status: PatientStatus;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const config = STATUS_CONFIG[status];

  return (
    <View style={[styles.badge, { backgroundColor: config.background }]}>
      <Text style={[styles.badgeText, { color: config.color }]}>{status}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
});
