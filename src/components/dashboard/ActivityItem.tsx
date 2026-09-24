import React, { memo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { CARD, COLORS } from '@/constants/theme';
import { ICONS } from '@/constants/icons';
import type {
  ActivityStatus,
  ActivityTone,
  TherapistActivity,
} from '@/types/therapistDashboard';

interface ActivityItemProps {
  activity: TherapistActivity;
  onPress?: () => void;
}

const TONES: Record<ActivityTone, { color: string; background: string }> = {
  user: { color: COLORS.blue, background: COLORS.blueSoft },
  warning: { color: COLORS.warningAmber, background: COLORS.warningAmberSoft },
  device: { color: COLORS.skyBlue, background: COLORS.skyBlueSoft },
};

const STATUS_ICONS: Record<ActivityStatus, keyof typeof ICONS> = {
  completed: 'circleCheck',
  open: 'chevronRight',
};

const STATUS_COLORS: Record<ActivityStatus, string> = {
  completed: COLORS.success,
  open: COLORS.textMuted,
};

export const ActivityItem = memo(({ activity, onPress }: ActivityItemProps) => {
  const Icon = ICONS[activity.icon];
  const StatusIcon = ICONS[STATUS_ICONS[activity.status]];
  const tone = TONES[activity.tone];

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={onPress ? 0.8 : 1}
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={[styles.iconContainer, { backgroundColor: tone.background }]}>
        <Icon size={20} color={tone.color} />
      </View>
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          <Text style={styles.titleHighlight}>{activity.titleHighlight}</Text>
          {activity.titleRest !== undefined && (
            <Text style={styles.titleRest}>{activity.titleRest}</Text>
          )}
        </Text>
        <Text style={styles.subtitlePrimary}>{activity.subtitlePrimary}</Text>
        {activity.subtitleSecondary !== undefined && (
          <Text style={styles.subtitleSecondary}>{activity.subtitleSecondary}</Text>
        )}
      </View>
      <StatusIcon
        size={activity.status === 'completed' ? 22 : 20}
        color={STATUS_COLORS[activity.status]}
      />
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  card: {
    ...CARD,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    marginBottom: 12,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 15,
    lineHeight: 21,
    color: COLORS.textPrimary,
  },
  titleHighlight: {
    fontWeight: '700',
  },
  titleRest: {
    fontWeight: '400',
  },
  subtitlePrimary: {
    fontSize: 13,
    color: COLORS.textSubtitle,
    marginTop: 3,
  },
  subtitleSecondary: {
    fontSize: 13,
    color: COLORS.textSubtitle,
    marginTop: 2,
  },
});
