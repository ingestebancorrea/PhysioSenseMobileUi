import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import {
  BellOff,
  RefreshCcw,
  TriangleAlert,
  type LucideIcon,
} from 'lucide-react-native';
import { CARD, COLORS } from '@/constants/theme';

type ActivityFeedStateTone = 'empty' | 'error';

interface ActivityFeedStateProps {
  tone: ActivityFeedStateTone;
  /** Mensaje del backend cuando falla la consulta. */
  message?: string;
  onRetry?: () => void;
}

const DEFAULT_MESSAGES: Record<ActivityFeedStateTone, string> = {
  empty:
    'Aún no se registra actividad reciente. Cuando tus pacientes completen sesiones o recibas notificaciones, aparecerán aquí.',
  error: 'No pudimos cargar la actividad reciente. Intenta de nuevo.',
};

/**
 * Estado compacto para la sección "Actividad reciente" del home: icono, texto y
 * acción de reintento cuando la consulta falla.
 */
export const ActivityFeedState: React.FC<ActivityFeedStateProps> = ({
  tone,
  message,
  onRetry,
}) => {
  const isError = tone === 'error';
  const Icon: LucideIcon = isError ? TriangleAlert : BellOff;
  const title = isError ? 'No se pudo cargar' : 'Sin actividad reciente';

  return (
    <View style={styles.card}>
      <View style={[styles.iconWrapper, isError && styles.iconWrapperError]}>
        <Icon
          size={26}
          color={isError ? COLORS.danger : COLORS.primary}
          strokeWidth={1.9}
        />
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.message}>{message ?? DEFAULT_MESSAGES[tone]}</Text>
      </View>

      {isError && onRetry ? (
        <TouchableOpacity
          style={styles.retry}
          activeOpacity={0.85}
          onPress={onRetry}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <RefreshCcw size={18} color={COLORS.primary} strokeWidth={2.4} />
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    ...CARD,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    marginBottom: 12,
  },
  iconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primarySoft,
  },
  iconWrapperError: {
    backgroundColor: COLORS.dangerSoft,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  message: {
    marginTop: 3,
    fontSize: 13,
    lineHeight: 19,
    color: COLORS.textSubtitle,
  },
  retry: {
    padding: 8,
  },
});
