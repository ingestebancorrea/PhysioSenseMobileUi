import React, { memo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ICONS } from '@/constants/icons';
import { CARD, COLORS } from '@/constants/theme';
import { SessionStatusBadge } from '@/components/dashboard/SessionStatusBadge';
import type { SessionRecord } from '@/types/progress';

interface SessionHistoryCardProps {
  session: SessionRecord;
  onPress?: () => void;
}

export const SessionHistoryCard = memo(
  ({ session, onPress }: SessionHistoryCardProps) => {
    const ClockIcon = ICONS.clock;
    const RepeatIcon = ICONS.repeat;
    const ChevronRightIcon = ICONS.chevronRight;

    return (
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.8}
        onPress={onPress}
      >
        <View style={styles.info}>
          <View style={styles.titleRow}>
            <Text style={styles.date}>{session.date}</Text>
            <SessionStatusBadge status={session.status} />
          </View>
          <View style={styles.detailsRow}>
            <View style={styles.detail}>
              <ClockIcon size={16} color={COLORS.textMuted} />
              <Text style={styles.detailText}>{session.duration}</Text>
            </View>
            <View style={styles.detail}>
              <RepeatIcon size={16} color={COLORS.textMuted} />
              <Text style={styles.detailText}>
                {`${session.repetitions} rep`}
              </Text>
            </View>
            <Text style={styles.detailText}>
              {`${session.exerciseCount} ejercicios`}
            </Text>
          </View>
        </View>
        <ChevronRightIcon size={20} color={COLORS.textMuted} />
      </TouchableOpacity>
    );
  },
);

const styles = StyleSheet.create({
  card: {
    ...CARD,
    flexDirection: 'row',
    alignItems: 'center',
  },
  info: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  date: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    columnGap: 16,
    rowGap: 6,
    marginTop: 10,
  },
  detail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detailText: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
});
