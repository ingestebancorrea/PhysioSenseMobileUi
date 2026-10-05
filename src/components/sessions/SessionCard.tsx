import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COLORS, CARD } from '@/constants/theme';
import type { Session } from '@/types/session';
import { SessionStatusBadge } from '@/components/sessions/SessionStatusBadge';

interface SessionCardProps {
  session: Session;
  onPress: (sessionId: string) => void;
}

export const SessionCard: React.FC<SessionCardProps> = React.memo(
  ({ session, onPress }) => (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.7}
      onPress={() => onPress(session.id)}
    >
      <Image
        source={{ uri: session.patientAvatarUrl }}
        style={styles.avatar}
      />
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={1}>
          {session.title}
        </Text>
        <Text style={styles.meta}>
          {session.patientName} • {session.dateText}
        </Text>
        <Text style={styles.details}>
          Ejercicios: {session.exerciseCount} • Duración:{' '}
          {session.durationMinutes} min
        </Text>
      </View>
      <SessionStatusBadge status={session.status} />
    </TouchableOpacity>
  ),
);

const styles = StyleSheet.create({
  card: {
    ...CARD,
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 10,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.progressTrack,
  },
  info: {
    flex: 1,
    marginLeft: 12,
    marginRight: 8,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  meta: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  details: {
    fontSize: 12,
    color: COLORS.textSubtitle,
    marginTop: 2,
  },
});
