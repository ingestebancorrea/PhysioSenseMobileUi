import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { ICONS } from '@/constants/icons';
import { COLORS } from '@/constants/theme';

const COLORS_CONFETTI = ['#5C3BFF', '#34C759', '#FF9500', '#007AFF', '#FFCC00'];

const CONFETTI_PARTICLES = Array.from({ length: 60 }, (_, i) => ({
  id: i,
  top: Math.random() * 160,
  left: Math.random() * 340,
  color: COLORS_CONFETTI[i % COLORS_CONFETTI.length],
  size: 6 + Math.floor(Math.random() * 3),
}));

export const SuccessBadge: React.FC = () => {
  const CheckIcon = ICONS.check;
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnims = useRef(
    CONFETTI_PARTICLES.map(() => new Animated.Value(0)),
  ).current;

  useEffect(() => {
    Animated.sequence([
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 60,
        friction: 7,
      }),
      Animated.parallel(
        fadeAnims.map((anim, i) =>
          Animated.sequence([
            Animated.delay(i * 15),
            Animated.timing(anim, {
              toValue: 1,
              duration: 300,
              useNativeDriver: true,
            }),
          ]),
        ),
      ),
    ]).start();
  }, [scaleAnim, fadeAnims]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>¡Serie completada!</Text>

      <View style={styles.badgeWrapper}>
        {CONFETTI_PARTICLES.map((p, i) => (
          <Animated.View
            key={p.id}
            style={[
              styles.particle,
              {
                top: p.top,
                left: p.left,
                width: p.size,
                height: p.size,
                borderRadius: p.size / 2,
                backgroundColor: p.color,
                opacity: fadeAnims[i],
                transform: [{ scale: fadeAnims[i] }],
              },
            ]}
          />
        ))}

        <Animated.View
          style={[
            styles.greenCircle,
            { transform: [{ scale: scaleAnim }] },
          ]}
        >
          <CheckIcon color="#FFFFFF" size={36} strokeWidth={3} />
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 16,
    textAlign: 'center',
  },
  badgeWrapper: {
    width: 360,
    height: 160,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  particle: {
    position: 'absolute',
  },
  greenCircle: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: COLORS.success,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
    elevation: 2,
  },
});
