import React from 'react';
import { Image, StyleSheet, useWindowDimensions, View } from 'react-native';
import { ICONS } from '@/constants/icons';
import { COLORS } from '@/constants/theme';
import type { GloveConnectionState } from '@/types/preparation';

const GLOVE_IMAGE = require('../../../assets/glove-Preparation.png') as number;

interface GloveConnectionStatusProps {
  state?: GloveConnectionState;
}

const BADGE_ICONS: Record<GloveConnectionState, typeof ICONS.check> = {
  connected: ICONS.check,
  connecting: ICONS.clock,
  disconnected: ICONS.x,
};

const BADGE_COLORS: Record<GloveConnectionState, string> = {
  connected: COLORS.success,
  connecting: COLORS.success,
  disconnected: COLORS.danger,
};

export const GloveConnectionStatus: React.FC<GloveConnectionStatusProps> = ({
  state = 'connected',
}) => {
  const { width } = useWindowDimensions();

  const circleSize = Math.min(Math.round(width * 0.6), 260);
  const gloveSize = Math.round(circleSize * 0.7);
  const badgeSize = Math.round(circleSize * 0.2);
  const iconSize = Math.round(badgeSize * 0.45);

  const BadgeIcon = BADGE_ICONS[state];

  return (
    <View
      style={[
        styles.circle,
        {
          width: circleSize,
          height: circleSize,
          borderRadius: circleSize / 2,
        },
      ]}
    >
      <View style={styles.gloveArea}>
        <Image
          source={GLOVE_IMAGE}
          style={[styles.glove, { width: gloveSize, height: gloveSize }]}
          resizeMode="contain"
        />
      </View>
      <View
        style={[
          styles.checkBadge,
          {
            width: badgeSize,
            height: badgeSize,
            borderRadius: badgeSize / 2,
            backgroundColor: BADGE_COLORS[state],
          },
        ]}
      >
        <BadgeIcon size={iconSize} color={COLORS.white} strokeWidth={3} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  circle: {
    backgroundColor: COLORS.background,
    borderWidth: 3,
    borderColor: COLORS.border,
    alignSelf: 'center',
  },
  gloveArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'stretch',
  },
  glove: {
    flex: 1,
  },
  checkBadge: {
    position: 'absolute',
    right: 10,
    bottom: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: COLORS.background,
  },
});
