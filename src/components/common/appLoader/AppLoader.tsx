import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Image,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { COLORS } from '@/constants/theme';

interface AppLoaderProps {
  size?: number;
}

const createBraidPath = (startAngle: number, endAngle: number, phaseShift = 0) => {
  const center = 60;
  const radius = 38;
  const numLoops = 10;
  const waveAmplitude = 4.5;
  const steps = 60;
  let path = '';

  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const angle = startAngle + t * (endAngle - startAngle);
    const r = radius + waveAmplitude * Math.sin(numLoops * angle + phaseShift);

    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);

    if (i === 0) {
      path += `M ${x.toFixed(2)} ${y.toFixed(2)}`;
    } else {
      path += ` L ${x.toFixed(2)} ${y.toFixed(2)}`;
    }
  }
  return path;
};

// Tres cuartos: morados actuales
const BRAID_DARK_1 = createBraidPath(0, (3 * Math.PI) / 2, 0);
const BRAID_DARK_2 = createBraidPath(0, (3 * Math.PI) / 2, Math.PI);

// Un cuarto: morados más claros/pastel
const BRAID_PASTEL_1 = createBraidPath((3 * Math.PI) / 2, 2 * Math.PI, 0);
const BRAID_PASTEL_2 = createBraidPath((3 * Math.PI) / 2, 2 * Math.PI, Math.PI);

export const AppLoader: React.FC<AppLoaderProps> = ({ size }) => {
  const { width } = useWindowDimensions();
  const computedSize =
    size ??
    Math.max(
      80,
      width > 0 ? Math.min(Math.round(width * 0.32), 160) : 120,
    );

  // Rotación del trenzado interior
  const rotation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    let frame: number;
    const start = Date.now();
    const animate = () => {
      const elapsed = (Date.now() - start) % 5000;
      rotation.setValue(elapsed / 5000);
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [rotation]);

  const rotate = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const iconWidth = Math.round(computedSize * 0.55);
  const iconHeight = Math.round(computedSize * 0.2);

  return (
    <View
      style={[
        styles.container,
        { width: computedSize, height: computedSize },
        styles.shadow,
      ]}
    >
            <Animated.View
        style={[
          styles.innerBraid,
          { transform: [{ rotate }] },
        ]}
        pointerEvents="none"
      >
        <Svg viewBox="0 0 120 120" width={computedSize} height={computedSize}>
          {/* Tres cuartos: morados actuales */}
          <Path
            d={BRAID_DARK_1}
            stroke={COLORS.primaryViolet}
            strokeWidth={2.4}
            strokeOpacity={0.25}
            fill="none"
          />
          <Path
            d={BRAID_DARK_1}
            stroke={COLORS.primaryViolet}
            strokeWidth={2.4}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <Path
            d={BRAID_DARK_2}
            stroke={COLORS.primaryVioletDeep}
            strokeWidth={2.4}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Un cuarto: morados más claros/pastel */}
          <Path
            d={BRAID_PASTEL_1}
            stroke={COLORS.primaryVioletSoft}
            strokeWidth={2.4}
            strokeOpacity={0.4}
            fill="none"
          />
          <Path
            d={BRAID_PASTEL_1}
            stroke={COLORS.primaryVioletSoft}
            strokeWidth={2.4}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <Path
            d={BRAID_PASTEL_2}
            stroke={COLORS.primaryVioletDeep}
            strokeWidth={2.4}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity={0.7}
          />
        </Svg>
      </Animated.View>

      <View style={styles.iconWrapper} pointerEvents="none">
        <Image
          source={require('../../../assets/images/drawer_logo.png')}
          style={{ width: iconWidth, height: iconHeight }}
          resizeMode="contain"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerBraid: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  shadow: {
    shadowColor: COLORS.primaryViolet,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
  },
  iconWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AppLoader;