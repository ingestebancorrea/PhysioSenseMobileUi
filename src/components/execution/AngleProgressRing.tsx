import React from 'react';
import { Image, ImageSourcePropType, StyleSheet, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { COLORS } from '@/constants/theme';

const TRACK_PATH = 'M 12 72 A 44 44 0 1 1 88 72';
const ARC_LENGTH = 180;

interface AngleProgressRingProps {
  progress: number;
  gloveImage?: ImageSourcePropType;
}

export const AngleProgressRing: React.FC<AngleProgressRingProps> = ({
  progress,
  gloveImage = require('../../../assets/countdownCero.png'),
}) => {
  const clamped = Math.min(Math.max(progress, 0), 1);
  const offset = ARC_LENGTH * (1 - clamped);

  return (
    <View style={styles.container}>
      <Svg height="280" viewBox="0 0 100 100" width="320">
        <Path
          d={TRACK_PATH}
          fill="none"
          stroke="#F0F2F7"
          strokeLinecap="round"
          strokeWidth="5"
        />
        <Path
          d={TRACK_PATH}
          fill="none"
          stroke={COLORS.primary}
          strokeLinecap="round"
          strokeWidth="5"
          strokeDasharray={ARC_LENGTH}
          strokeDashoffset={offset}
        />
      </Svg>

      <View style={styles.imageOverlay}>
        <Image
          resizeMode="contain"
          source={gloveImage}
          style={styles.gloveImage}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 320,
    height: 280,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  imageOverlay: {
    position: 'absolute',
    width: 180,
    height: 180,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gloveImage: {
    width: '100%',
    height: '100%',
  },
});
