import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COLORS } from '@/constants/theme';
import { ICONS } from '@/constants/icons';
import type { SessionExercise } from '@/types/dashboard';

interface ExerciseCardProps {
  exercise: SessionExercise;
  onPress?: () => void;
}

export const ExerciseCard: React.FC<ExerciseCardProps> = ({
  exercise,
  onPress,
}) => {
  const Icon = ICONS[exercise.icon];

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.8}
      onPress={onPress}
    >
      <View style={styles.iconContainer}>
        <Icon size={26} color={COLORS.primary} />
      </View>
      <View style={styles.info}>
        <Text style={styles.name}>{exercise.name}</Text>
        <Text style={styles.detail}>{exercise.detail}</Text>
      </View>
      <Text style={styles.progress}>{`${exercise.progress}%`}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 16,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
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
    fontSize: 15,
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
