import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { COLORS } from '@/constants/theme';
import { ICONS } from '@/constants/icons';

interface RestTimerCardProps {
  initialSeconds?: number;
  isLastSeries?: boolean;
  onNextSeries?: () => void;
  onTimerComplete?: () => void;
}

export const RestTimerCard: React.FC<RestTimerCardProps> = ({
  initialSeconds = 30,
  isLastSeries = false,
  onNextSeries,
  onTimerComplete,
}) => {
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);
  const completedRef = useRef(false);

  useEffect(() => {
    if (secondsLeft <= 0) {
      if (!completedRef.current) {
        completedRef.current = true;
        onTimerComplete?.();
      }
      return;
    }

    const timer = setInterval(() => {
      setSecondsLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [secondsLeft, onTimerComplete]);

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const radius = 26;
  const strokeWidth = 5;
  const circumference = 2 * Math.PI * radius;
  const progressRatio = secondsLeft / initialSeconds;
  const strokeDashoffset = circumference * (1 - progressRatio);

  const ChevronRightIcon = ICONS.chevronRight;

  return (
    <View style={styles.outerContainer}>
      <View style={styles.cardContainer}>
        <View style={styles.textColumn}>
          <Text style={styles.headerTitle}>Descanso</Text>
          <Text style={styles.timerText}>{formatTime(secondsLeft)}</Text>
          <Text style={styles.subTitle}>Tiempo restante</Text>
        </View>

        <View style={styles.ringWrapper}>
          <Svg height="64" viewBox="0 0 64 64" width="64">
            <Circle
              cx="32"
              cy="32"
              fill="none"
              r={radius}
              stroke="#F0F2F7"
              strokeWidth={strokeWidth}
            />
            <Circle
              cx="32"
              cy="32"
              fill="none"
              r={radius}
              stroke={COLORS.primary}
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              transform="rotate(-90 32 32)"
            />
          </Svg>
        </View>
      </View>

      <TouchableOpacity
        activeOpacity={0.85}
        onPress={onNextSeries}
        style={styles.nextButton}
      >
        {isLastSeries ? (
          <View style={styles.nextButtonRow}>
            <Text style={styles.nextButtonText}>Siguiente</Text>
            <ChevronRightIcon size={18} color={COLORS.white} />
          </View>
        ) : (
          <Text style={styles.nextButtonText}>Siguiente serie</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    width: '100%',
    gap: 20,
    marginVertical: 12,
  },
  cardContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F0F2F7',
  },
  textColumn: {
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  timerText: {
    fontSize: 32,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginVertical: 2,
  },
  subTitle: {
    fontSize: 12,
    fontWeight: '500',
    color: COLORS.textSecondary,
  },
  ringWrapper: {
    width: 64,
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 14,
    paddingVertical: 16,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  nextButtonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
});
