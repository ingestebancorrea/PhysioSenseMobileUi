import React, { memo } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import type { ImageSourcePropType } from 'react-native';
import { COLORS } from '@/constants/theme';
import { ICONS } from '@/constants/icons';

export interface ExerciseItem {
  id: string;
  title: string;
  description: string;
  series: string;
  reps: string;
  duration: string;
  imageUrl?: string;
}

interface ExerciseCardProps {
  exercise: ExerciseItem;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onPlay?: (id: string) => void;
}

const PLACEHOLDER_IMAGE = require('../../../assets/glove.png') as ImageSourcePropType;

export const ExerciseCard: React.FC<ExerciseCardProps> = memo(
  ({ exercise, onEdit, onDelete, onPlay }) => {
    const EditIcon = ICONS.edit;
    const TrashIcon = ICONS.trash;
    const PlayIcon = ICONS.play;
    const hasActions = Boolean(onEdit || onDelete);
    const source: ImageSourcePropType = exercise.imageUrl
      ? { uri: exercise.imageUrl }
      : PLACEHOLDER_IMAGE;

    return (
      <View style={styles.cardContainer}>
        <View style={styles.imageWrapper}>
          <Image source={source} style={styles.image} resizeMode="cover" />
          {PlayIcon && (
            <TouchableOpacity
              style={styles.playButton}
              activeOpacity={0.8}
              onPress={() => onPlay?.(exercise.id)}
            >
              <PlayIcon size={14} color={COLORS.primary} />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.infoContainer}>
          <Text numberOfLines={1} style={styles.title}>
            {exercise.title}
          </Text>
          <Text numberOfLines={2} style={styles.description}>
            {exercise.description}
          </Text>

          <View style={styles.badgeRow}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{exercise.series}</Text>
            </View>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{exercise.reps}</Text>
            </View>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{exercise.duration}</Text>
            </View>
          </View>
        </View>

        {hasActions && (
          <View style={styles.actionsContainer}>
            <TouchableOpacity
              style={styles.actionButton}
              activeOpacity={0.7}
              onPress={() => onEdit?.(exercise.id)}
            >
              {EditIcon && <EditIcon size={18} color="#6451ed" />}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              activeOpacity={0.7}
              onPress={() => onDelete?.(exercise.id)}
            >
              {TrashIcon && <TrashIcon size={18} color="#6451ed" />}
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  },
);

const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F0F1F5',
    alignItems: 'center',
  },
  imageWrapper: {
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: '#F5F6F8',
    overflow: 'hidden',
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  playButton: {
    position: 'absolute',
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
  },
  infoContainer: {
    flex: 1,
    paddingHorizontal: 12,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1A1C20',
    marginBottom: 3,
  },
  description: {
    fontSize: 11,
    color: '#6B7280',
    lineHeight: 15,
    marginBottom: 8,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 6,
  },
  badge: {
    backgroundColor: '#F0EDFF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#4538B0',
  },
  actionsContainer: {
    justifyContent: 'space-between',
    gap: 10,
  },
  actionButton: {
    width: 38,
    height: 38,
    borderRadius: 11,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
});