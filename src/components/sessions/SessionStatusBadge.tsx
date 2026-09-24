import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { COLORS } from '@/constants/theme';
import type { SessionStatus } from '@/types/session';

const STATUS_CONFIG: Record<
  SessionStatus,
  { color: string; background: string }
> = {
  Activa: { color: COLORS.active, background: COLORS.activeSoft },
  Programada: { color: COLORS.blue, background: COLORS.blueSoft },
  Borrador: { color: COLORS.inactive, background: COLORS.inactiveSoft },
  Completada: { color: COLORS.violet, background: COLORS.violetSoft },
};

interface SessionStatusBadgeProps {
  status: SessionStatus;
}

export const SessionStatusBadge: React.FC<SessionStatusBadgeProps> = ({
  status,
}) => {
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
