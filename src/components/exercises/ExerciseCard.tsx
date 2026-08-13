import React, { memo } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { CARD, COLORS } from '@/constants/theme';
import type { ExerciseListItem } from '@/types/exercise';

interface ExerciseCardProps {
  exercise: ExerciseListItem;
  onPress?: () => void;
}

export const ExerciseCard = memo(({ exercise, onPress }: ExerciseCardProps) => (
  <TouchableOpacity style={styles.card} activeOpacity={0.85} onPress={onPress}>
    <View style={styles.imageContainer}>
      <Image source={exercise.imageUri} style={styles.image} resizeMode="cover" />
    </View>
    <View style={styles.info}>
      <Text style={styles.title} numberOfLines={1}>
        {exercise.title}
      </Text>
      <Text style={styles.description} numberOfLines={2}>
        {exercise.description}
      </Text>
      <View style={styles.footer}>
        <Text style={styles.detail}>{`${exercise.series} series - ${exercise.reps} rep`}</Text>
        <TouchableOpacity style={styles.startButton} activeOpacity={0.8} onPress={onPress}>
          <Text style={styles.startButtonText}>Iniciar</Text>
        </TouchableOpacity>
      </View>
    </View>
  </TouchableOpacity>
));

const styles = StyleSheet.create({
  card: {
    ...CARD,
    flexDirection: 'row',
    alignItems: 'center',
  },
  imageContainer: {
    width: 64,
    height: 64,
    borderRadius: 12,
    backgroundColor: COLORS.primarySoft,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  info: {
    flex: 1,
    marginLeft: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  description: {
    fontSize: 13,
    lineHeight: 18,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  detail: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textMuted,
  },
  startButton: {
    backgroundColor: COLORS.success,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  startButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.white,
  },
});
