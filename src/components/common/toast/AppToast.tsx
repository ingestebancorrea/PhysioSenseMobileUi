import React, { useCallback, useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Check,
  Info,
  TriangleAlert,
  X,
  XCircle,
  type LucideIcon,
} from 'lucide-react-native';

import { COLORS } from '@/constants/theme';
import type { AppToastProps, AppToastVariant } from '@/types/toast';

/**
 * Cada variante tiene su color pastel de fondo, su color fuerte para el
 * texto y el ícono, y un borde del mismo tono. Nada satura: el aviso se lee
 * sin robarle protagonismo a la pantalla.
 */
const VARIANT_META: Record<
  AppToastVariant,
  {
    Icon: LucideIcon;
    background: string;
    accent: string;
    border: string;
  }
> = {
  success: {
    Icon: Check,
    background: COLORS.successSoft,
    accent: COLORS.active,
    border: 'rgba(46, 204, 113, 0.32)',
  },
  error: {
    Icon: XCircle,
    background: COLORS.dangerSoft,
    accent: COLORS.dangerRed,
    border: 'rgba(231, 76, 60, 0.28)',
  },
  warning: {
    Icon: TriangleAlert,
    background: COLORS.warningAmberSoft,
    accent: '#B45309',
    border: 'rgba(245, 158, 11, 0.32)',
  },
  info: {
    Icon: Info,
    background: COLORS.primarySoft,
    accent: COLORS.primaryDark,
    border: 'rgba(90, 79, 207, 0.22)',
  },
};

/** Distancia desde abajo de la que entra el aviso. */
const ENTER_OFFSET = 28;

/**
 * Aviso flotante para confirmaciones.
 *
 * A diferencia del modal de alerta (que frena la pantalla), esto entra desde
 * abajo, se queda un rato y se va solo: sirve para decir "listo, ya pasó" sin
 * obligar a tocar nada.
 */
export const AppToast: React.FC<AppToastProps> = ({
  visible,
  message,
  title,
  variant = 'success',
  duration = 2800,
  id,
  onHide,
}) => {
  const insets = useSafeAreaInsets();
  const progress = useRef(new Animated.Value(0)).current;
  const iconScale = useRef(new Animated.Value(0.5)).current;
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const onHideRef = useRef(onHide);

  useEffect(() => {
    onHideRef.current = onHide;
  }, [onHide]);

  /** Salida: se desliza hacia abajo y recién ahí avisa que se oculte. */
  const dismiss = useCallback(() => {
    Animated.timing(progress, {
      toValue: 0,
      duration: 220,
      easing: Easing.in(Easing.cubic),
      useNativeDriver: true,
    }).start(() => onHideRef.current?.());
  }, [progress]);

  useEffect(() => {
    if (!visible) {
      progress.setValue(0);
      iconScale.setValue(0.5);

      return undefined;
    }

    progress.setValue(0);
    iconScale.setValue(0.5);

    Animated.parallel([
      Animated.spring(progress, {
        toValue: 1,
        friction: 10,
        tension: 70,
        useNativeDriver: true,
      }),
      Animated.spring(iconScale, {
        toValue: 1,
        friction: 6,
        tension: 90,
        useNativeDriver: true,
      }),
    ]).start();

    timer.current = setTimeout(dismiss, duration);

    return () => {
      if (timer.current) {
        clearTimeout(timer.current);
        timer.current = null;
      }
    };
  }, [visible, duration, id, dismiss, progress, iconScale]);

  const { Icon, background, accent, border } = VARIANT_META[variant];

  const translateY = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [ENTER_OFFSET, 0],
  });

  return (
    <Animated.View
      pointerEvents="box-none"
      style={[
        styles.wrapper,
        { bottom: insets.bottom + 88 },
        { opacity: progress, transform: [{ translateY }] },
      ]}
    >
      <View
        style={[
          styles.card,
          { backgroundColor: background, borderColor: border },
        ]}
      >
        <Animated.View
          style={[
            styles.badge,
            { backgroundColor: accent, transform: [{ scale: iconScale }] },
          ]}
        >
          <Icon size={16} color={COLORS.white} strokeWidth={3} />
        </Animated.View>

        <View style={styles.content}>
          {title ? (
            <Text style={[styles.title, { color: accent }]}>{title}</Text>
          ) : null}
          <Text style={styles.message}>{message}</Text>
        </View>

        <TouchableOpacity
          onPress={dismiss}
          activeOpacity={0.6}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          style={styles.closeButton}
          accessibilityRole="button"
          accessibilityLabel="Cerrar aviso"
        >
          <X size={16} color={COLORS.textMuted} strokeWidth={2.4} />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    left: 16,
    right: 16,
    zIndex: 100,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderRadius: 16,
    borderWidth: 1,
    paddingVertical: 12,
    paddingLeft: 12,
    paddingRight: 8,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
  },
  badge: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 2,
  },
  message: {
    color: COLORS.textNeutral,
    fontSize: 13,
    lineHeight: 18,
  },
  closeButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default AppToast;
