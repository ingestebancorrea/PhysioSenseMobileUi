import React, { memo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { CARD, COLORS } from '@/constants/theme';
import { ICONS } from '@/constants/icons';
import type { SessionExercise } from '@/types/dashboard';

interface ExerciseCardProps {
  exercise: SessionExercise;
  onPress?: () => void;
}

export const ExerciseCard = memo(({ exercise, onPress }: ExerciseCardProps) => {
  const Icon = ICONS[exercise.icon];

  return (
    <TouchableOpacity
      style={[styles.card]}
      activeOpacity={0.8}
      onPress={onPress}
    >
      <View style={styles.iconContainer}>
        <Icon size={26} color={COLORS.primary} />
      </View>
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>{exercise.name}</Text>
        <Text style={styles.detail} numberOfLines={2}>{exercise.detail}</Text>
      </View>
      <Text style={styles.progress}>{`${exercise.progress}%`}</Text>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  card: {
    ...CARD,
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardDisabled: {
    opacity: 0.6,
  },
  iconContainer: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: COLORS.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: {
    flex: 1,
    marginLeft: 12,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  detail: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  progress: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
});
