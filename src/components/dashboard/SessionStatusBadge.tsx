import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { COLORS } from '@/constants/theme';
import type { LastSession } from '@/types/dashboard';

type SessionStatus = LastSession['status'];

const STATUS_CONFIG: Record<
  SessionStatus,
  { label: string; color: string; background: string }
> = {
  completed: { label: 'Completada', color: COLORS.success, background: COLORS.successSoft },
  in_progress: { label: 'En progreso', color: COLORS.primary, background: COLORS.primarySoft },
  cancelled: { label: 'Cancelada', color: COLORS.textSecondary, background: COLORS.progressTrack },
};

interface SessionStatusBadgeProps {
  status: SessionStatus;
}

export const SessionStatusBadge: React.FC<SessionStatusBadgeProps> = ({ status }) => {
  const config = STATUS_CONFIG[status];

  return (
    <View style={[styles.badge, { backgroundColor: config.background }]}>
      <Text style={[styles.badgeText, { color: config.color }]}>{config.label}</Text>
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
