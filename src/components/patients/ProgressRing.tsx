import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { COLORS } from '@/constants/theme';

const RING_SIZE = 72;
const STROKE_WIDTH = 6;
const RADIUS = (RING_SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

interface ProgressRingProps {
  value: number;
  label: string;
  color?: string;
}

export const ProgressRing: React.FC<ProgressRingProps> = ({
  value,
  label,
  color = COLORS.violet,
}) => {
  const clamped = Math.min(Math.max(value, 0), 100);
  const offset = CIRCUMFERENCE * (1 - clamped / 100);

  return (
    <View style={styles.container}>
      <Svg width={RING_SIZE} height={RING_SIZE}>
        <Circle
          cx={RING_SIZE / 2}
          cy={RING_SIZE / 2}
          r={RADIUS}
          fill="none"
          stroke={COLORS.progressTrack}
          strokeWidth={STROKE_WIDTH}
        />
        <Circle
          cx={RING_SIZE / 2}
          cy={RING_SIZE / 2}
          r={RADIUS}
          fill="none"
          stroke={color}
          strokeWidth={STROKE_WIDTH}
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${RING_SIZE / 2} ${RING_SIZE / 2})`}
        />
      </Svg>
      <View style={styles.valueContainer}>
        <Text style={[styles.value, { color }]}>{clamped}%</Text>
      </View>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  valueContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: RING_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  value: {
    fontSize: 16,
    fontWeight: '700',
  },
  label: {
    fontSize: 11,
    color: COLORS.textSubtitle,
    marginTop: 6,
    textAlign: 'center',
  },
});
