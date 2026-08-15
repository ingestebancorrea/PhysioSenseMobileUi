import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { COLORS } from '@/constants/theme';

const GLOVE_STAGES: Record<number, number> = {
  5: require('../../../assets/countdownFive.png') as number,
  4: require('../../../assets/countdownFour.png') as number,
  3: require('../../../assets/countdownThree.png') as number,
  2: require('../../../assets/countdownTwo.png') as number,
  1: require('../../../assets/countdownOne.png') as number,
  0: require('../../../assets/countdownCero.png') as number,
};

const TOTAL_SECONDS = 5;
const RING_STROKE = 10;

interface AnimatedHandTimerProps {
  secondsLeft: number;
}

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export const AnimatedHandTimer: React.FC<AnimatedHandTimerProps> = ({
  secondsLeft,
}) => {
  const { width } = useWindowDimensions();

  const circleSize = Math.min(Math.round(width * 0.75), 280);
  const strokeWidth = RING_STROKE;
  const ringCenter = circleSize / 2;
  const ringRadius = (circleSize - strokeWidth) / 2;
  const ringCircumference = 2 * Math.PI * ringRadius;

  const progress = useRef(new Animated.Value(0)).current;
  const ringOffset = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [ringCircumference, 0],
  });

  const opacity = useRef(new Animated.Value(1)).current;
  const scale = useRef(new Animated.Value(1)).current;
  const [imageSource, setImageSource] = useState(GLOVE_STAGES[5]);
  const isFirstRender = useRef(true);

  useEffect(() => {
    Animated.timing(progress, {
      toValue: 1,
      duration: TOTAL_SECONDS * 1000,
      useNativeDriver: false,
    }).start();

    return () => {
      progress.stopAnimation();
    };
  }, [progress]);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const next = GLOVE_STAGES[secondsLeft] ?? GLOVE_STAGES[5];

    Animated.sequence([
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 1.1,
          duration: 150,
          useNativeDriver: true,
        }),
      ]),
    ]).start(({ finished }) => {
      if (!finished) {
        return;
      }

      setImageSource(next);
      scale.setValue(0.92);

      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 220,
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 1,
          duration: 220,
          useNativeDriver: true,
        }),
      ]).start();
    });
  }, [secondsLeft, opacity, scale]);

  return (
    <View style={styles.container}>
      <View style={[styles.ringWrapper, { width: circleSize, height: circleSize }]}>
        <View style={StyleSheet.absoluteFill}>
          <View style={styles.ringRotation}>
            <Svg width={circleSize} height={circleSize}>
              <Circle
                cx={ringCenter}
                cy={ringCenter}
                r={ringRadius}
                stroke={COLORS.progressTrack}
                strokeWidth={strokeWidth}
                fill="none"
              />
              <AnimatedCircle
                cx={ringCenter}
                cy={ringCenter}
                r={ringRadius}
                stroke={COLORS.primary}
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeDasharray={`${ringCircumference} ${ringCircumference}`}
                strokeDashoffset={ringOffset}
                fill="none"
              />
            </Svg>
          </View>
        </View>

        <View
          style={[
            styles.circleInner,
            {
              width: circleSize - strokeWidth * 2,
              height: circleSize - strokeWidth * 2,
              borderRadius: (circleSize - strokeWidth * 2) / 2,
            },
          ]}
        >
          <Text style={styles.topText}>Comenzamos en</Text>

          <View style={styles.gloveArea}>
            <View style={styles.gloveContainer}>
              <Animated.Image
                source={imageSource}
                style={[
                  styles.gloveImage,
                  { opacity, transform: [{ scale }] },
                ]}
                resizeMode="contain"
              />
            </View>
          </View>

          <Text style={[styles.bottomText, secondsLeft === 0 && styles.textYa]}>
            {secondsLeft === 0 ? '¡Ya!' : 'Prepárate'}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  ringWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  ringRotation: {
    transform: [{ rotate: '-90deg' }],
  },
  circleInner: {
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 20,
    backgroundColor: COLORS.background,
  },
  topText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  gloveArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'stretch',
  },
  gloveContainer: {
    width: 168,
    height: 168,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gloveImage: {
    width: '100%',
    height: '100%',
  },
  bottomText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  textYa: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.success,
  },
});
