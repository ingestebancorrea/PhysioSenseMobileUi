import React from 'react';
import { ImageBackground, StyleSheet, Text, View } from 'react-native';
import type { ImageSourcePropType } from 'react-native';
import { ICONS } from '@/constants/icons';
import { COLORS, CARD } from '@/constants/theme';

interface ExerciseVideoPreviewProps {
  thumbnail: ImageSourcePropType;
  duration: string;
}

export const ExerciseVideoPreview: React.FC<ExerciseVideoPreviewProps> = ({
  thumbnail,
  duration,
}) => {
  const PlayIcon = ICONS.play;

  return (
    <View style={[CARD, styles.card]}>
      <ImageBackground
        source={thumbnail}
        style={styles.thumbnail}
        imageStyle={styles.thumbnailImage}
        resizeMode="cover"
      >
        <View style={styles.container}>
          <View style={styles.centerArea}>
            <View style={styles.playButton}>
              <PlayIcon size={26} color={COLORS.primary} />
            </View>
          </View>
          <View style={styles.badgeRow}>
            <View style={styles.durationBadge}>
              <Text style={styles.durationText}>{duration}</Text>
            </View>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 0,
    overflow: 'hidden',
  },
  thumbnail: {
    aspectRatio: 16 / 9,
    backgroundColor: COLORS.progressTrack,
  },
  thumbnailImage: {
    borderRadius: CARD.borderRadius,
  },
  container: {
    flex: 1,
  },
  centerArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playButton: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  badgeRow: {
    alignItems: 'flex-end',
    padding: 12,
  },
  durationBadge: {
    borderRadius: 6,
    paddingVertical: 3,
    paddingHorizontal: 8,
    backgroundColor: COLORS.blackOverlay,
  },
  durationText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.white,
  },
});
