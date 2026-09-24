import React, { useMemo, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ChevronLeft,
  Laptop,
  LogOut,
  MapPin,
  ShieldCheck,
  Smartphone,
  Tablet,
  TriangleAlert,
  type LucideIcon,
} from 'lucide-react-native';

import { useAppAlert } from '@/hooks/useAppAlert';
import { COLORS } from '@/constants/theme';

const DESIGN_WIDTH = 390;
const PAGE_BACKGROUND = '#f1f4f8';
const SUBTITLE_COLOR = '#6B7280';

type DeviceKind = 'smartphone' | 'laptop' | 'tablet';

interface SessionDevice {
  id: string;
  deviceType: DeviceKind;
  deviceName: string;
  os: string;
  browser?: string;
  location: string;
  lastActive: string;
  isCurrent?: boolean;
  isExpired?: boolean;
}

const INITIAL_CURRENT: SessionDevice = {
  id: 'current',
  deviceType: 'smartphone',
  deviceName: 'iPhone 16',
  os: 'iOS 26.5',
  location: 'Bogotá, Colombia',
  lastActive: 'Ahora mismo',
  isCurrent: true,
};

const INITIAL_SESSIONS: SessionDevice[] = [
  {
    id: 'session_macbook',
    deviceType: 'laptop',
    deviceName: 'MacBook Pro',
    os: 'macOS 14.6',
    browser: 'Chrome',
    location: 'Bogotá, Colombia',
    lastActive: 'Hoy, 8:12 a. m.',
  },
  {
    id: 'session_ipad',
    deviceType: 'tablet',
    deviceName: 'iPad Air',
    os: 'iPadOS 17.5',
    browser: 'Safari',
    location: 'Medellín, Colombia',
    lastActive: 'Ayer, 11:03 p. m.',
  },
  {
    id: 'session_android',
    deviceType: 'smartphone',
    deviceName: 'Samsung Galaxy S24',
    os: 'Android 15',
    location: 'Cali, Colombia',
    lastActive: '12 sep 2026',
    isExpired: true,
  },
];

const DEVICE_ICONS: Record<DeviceKind, LucideIcon> = {
  smartphone: Smartphone,
  laptop: Laptop,
  tablet: Tablet,
};

interface SecurityActivityScreenProps {
  onBack?: () => void;
  location?: string;
}

export const SecurityActivityScreen: React.FC<SecurityActivityScreenProps> = ({
  onBack,
  location = 'Bogotá, Colombia',
}) => {
  const { width } = useWindowDimensions();
  const scale = Math.min(Math.max(width / DESIGN_WIDTH, 0.8), 1);
  const styles = useMemo(() => createStyles(scale), [scale]);
  const { alertModal, showAlert } = useAppAlert();

  const currentSession: SessionDevice = useMemo(
    () => ({ ...INITIAL_CURRENT, location }),
    [location],
  );
  const [sessions, setSessions] = useState<SessionDevice[]>(INITIAL_SESSIONS);

  const handleLogoutSession = (session: SessionDevice) => {
    showAlert({
      title: '¿Cerrar esta sesión?',
      message: `${session.deviceName} se desconectará de tu cuenta. Deberás ingresar nuevamente con tu contraseña.`,
      variant: 'warning',
      confirmText: 'Cerrar sesión',
      cancelText: 'Cancelar',
      onConfirm: () => {
        setSessions(prev => prev.filter(item => item.id !== session.id));
        showAlert({
          title: 'Sesión cerrada',
          message: `${session.deviceName} fue desconectado correctamente.`,
          variant: 'success',
          confirmText: 'Listo',
        });
      },
    });
  };

  const handleLogoutAll = () => {
    showAlert({
      title: '¿Cerrar todas las sesiones?',
      message:
        'Se cerrará la sesión en todos sus dispositivos, excepto en el que estás usando ahora.',
      variant: 'warning',
      confirmText: 'Cerrar todo',
      cancelText: 'Cancelar',
      onConfirm: () => {
        setSessions([]);
        showAlert({
          title: 'Sesiones cerradas',
          message:
            'Tus otras sesiones fueron cerradas. Puedes volver a iniciar sesión cuando quieras.',
          variant: 'success',
          confirmText: 'Listo',
        });
      },
    });
  };

  const renderSession = (session: SessionDevice) => {
    const Icon = DEVICE_ICONS[session.deviceType];

    return (
      <View key={session.id} style={styles.sessionCard}>
        <View style={styles.sessionIcon}>
          <Icon
            size={24}
            color={session.isCurrent ? COLORS.primaryViolet : COLORS.textNeutral}
          />
        </View>

        <View style={styles.sessionTexts}>
          <View style={styles.sessionTitleRow}>
            <Text style={styles.sessionName} numberOfLines={1}>
              {session.deviceName}
            </Text>
            {session.isCurrent ? (
              <View style={styles.currentBadge}>
                <Text style={styles.currentBadgeText}>Este dispositivo</Text>
              </View>
            ) : session.isExpired ? (
              <View style={styles.expiredBadge}>
                <Text style={styles.expiredBadgeText}>Expirada</Text>
              </View>
            ) : (
              <View style={styles.activeBadge}>
                <Text style={styles.activeBadgeText}>Activa</Text>
              </View>
            )}
          </View>

          <Text style={styles.sessionMeta} numberOfLines={1}>
            {session.browser ? `${session.browser} · ` : ''}
            {session.os}
          </Text>

          <View style={styles.sessionLocationRow}>
            <MapPin size={12} color={COLORS.textMuted} />
            <Text style={styles.sessionLocation} numberOfLines={1}>
              {session.location} · {session.lastActive}
            </Text>
          </View>

          {!session.isCurrent && (
            <TouchableOpacity
              style={styles.logoutLink}
              activeOpacity={0.7}
              onPress={() => handleLogoutSession(session)}
              accessibilityRole="button"
              accessibilityLabel={`Cerrar sesión en ${session.deviceName}`}
            >
              <LogOut size={14} color={COLORS.dangerRed} />
              <Text style={styles.logoutLinkText}>
                {session.isExpired ? 'Descartar registro' : 'Cerrar sesión'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          activeOpacity={0.8}
          onPress={onBack}
          accessibilityRole="button"
          accessibilityLabel="Volver"
        >
          <ChevronLeft size={24} color={COLORS.textStrong} />
        </TouchableOpacity>

        <View style={styles.headerText}>
          <Text style={styles.headerTitle}>Actividad de seguridad</Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.warningBanner}>
          <View style={styles.warningIcon}>
            <TriangleAlert size={24} color={COLORS.primaryViolet} />
          </View>
          <View style={styles.warningTexts}>
            <Text style={styles.warningTitle}>Advertencia de seguridad</Text>
            <Text style={styles.warningDescription}>
              Si ves un acceso que no reconoces, cierra esa sesión y cambia tu
              contraseña de inmediato.
            </Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Dispositivo actual</Text>
        {renderSession(currentSession)}

        <Text style={styles.sectionTitle}>
          Otras sesiones activas ({sessions.length})
        </Text>

        {sessions.length === 0 ? (
          <View style={styles.emptyCard}>
            <View style={styles.emptyIcon}>
              <ShieldCheck size={26} color={COLORS.success} />
            </View>
            <Text style={styles.emptyTitle}>Sin otras sesiones activas</Text>
            <Text style={styles.emptyDescription}>
              No hay dispositivos conectados además del que estás usando ahora.
            </Text>
          </View>
        ) : (
          sessions.map(session => renderSession(session))
        )}

        {sessions.length > 0 && (
          <TouchableOpacity
            style={styles.logoutAllButton}
            activeOpacity={0.85}
            onPress={handleLogoutAll}
            accessibilityRole="button"
            accessibilityLabel="Cerrar todas las sesiones"
          >
            <LogOut size={18} color={COLORS.dangerRed} />
            <Text style={styles.logoutAllText}>Cerrar todas las sesiones</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
      {alertModal}
    </SafeAreaView>
  );
};

const createStyles = (scale: number) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: PAGE_BACKGROUND,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 20 * scale,
      paddingVertical: 14 * scale,
    },
    backButton: {
      position: 'absolute',
      left: 20 * scale,
      width: 44 * scale,
      height: 44 * scale,
      borderRadius: 14 * scale,
      backgroundColor: COLORS.surface,
      borderWidth: 1,
      borderColor: COLORS.dividerLight,
      alignItems: 'center',
      justifyContent: 'center',
    },
    headerText: {
      alignItems: 'center',
      marginHorizontal: 56 * scale,
    },
    headerTitle: {
      fontSize: 22 * scale,
      fontWeight: '700',
      color: COLORS.textStrong,
    },
    content: {
      paddingHorizontal: 20 * scale,
      paddingTop: 8 * scale,
      paddingBottom: 32 * scale,
      gap: 12 * scale,
    },
    warningBanner: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: COLORS.primaryVioletSoft,
      borderRadius: 16 * scale,
      paddingVertical: 16 * scale,
      paddingHorizontal: 16 * scale,
      gap: 12 * scale,
      borderWidth: 1,
      borderColor: 'rgba(108, 92, 231, 0.35)',
    },
    warningIcon: {
      width: 44 * scale,
      height: 44 * scale,
      borderRadius: 22 * scale,
      backgroundColor: COLORS.surface,
      alignItems: 'center',
      justifyContent: 'center',
    },
    warningTexts: {
      flex: 1,
    },
    warningTitle: {
      fontSize: 14 * scale,
      fontWeight: '700',
      color: COLORS.primaryDark,
    },
    warningDescription: {
      fontSize: 12 * scale,
      lineHeight: 17 * scale,
      color: COLORS.textNeutral,
      marginTop: 3 * scale,
    },
    sectionTitle: {
      fontSize: 13 * scale,
      fontWeight: '700',
      color: SUBTITLE_COLOR,
      textTransform: 'uppercase',
      marginTop: 6 * scale,
    },
    sessionCard: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: COLORS.surface,
      borderRadius: 16 * scale,
      paddingVertical: 16 * scale,
      paddingHorizontal: 16 * scale,
      gap: 12 * scale,
    },
    sessionIcon: {
      width: 46 * scale,
      height: 46 * scale,
      borderRadius: 23 * scale,
      backgroundColor: COLORS.primaryVioletSoft,
      alignItems: 'center',
      justifyContent: 'center',
    },
    sessionTexts: {
      flex: 1,
    },
    sessionTitleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8 * scale,
    },
    sessionName: {
      flexShrink: 1,
      fontSize: 14 * scale,
      fontWeight: '700',
      color: COLORS.textStrong,
    },
    currentBadge: {
      backgroundColor: COLORS.primaryVioletSoft,
      borderRadius: 8 * scale,
      paddingVertical: 3 * scale,
      paddingHorizontal: 8 * scale,
    },
    currentBadgeText: {
      fontSize: 10 * scale,
      fontWeight: '700',
      color: COLORS.primaryViolet,
    },
    activeBadge: {
      backgroundColor: COLORS.successSoft,
      borderRadius: 8 * scale,
      paddingVertical: 3 * scale,
      paddingHorizontal: 8 * scale,
    },
    activeBadgeText: {
      fontSize: 10 * scale,
      fontWeight: '700',
      color: COLORS.success,
    },
    expiredBadge: {
      backgroundColor: COLORS.inactiveSoft,
      borderRadius: 8 * scale,
      paddingVertical: 3 * scale,
      paddingHorizontal: 8 * scale,
    },
    expiredBadgeText: {
      fontSize: 10 * scale,
      fontWeight: '700',
      color: COLORS.inactive,
    },
    sessionMeta: {
      fontSize: 12 * scale,
      color: COLORS.textMuted,
      marginTop: 4 * scale,
    },
    sessionLocationRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4 * scale,
      marginTop: 2 * scale,
    },
    sessionLocation: {
      fontSize: 12 * scale,
      color: COLORS.textMuted,
      flex: 1,
    },
    logoutLink: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6 * scale,
      marginTop: 10 * scale,
      alignSelf: 'flex-start',
    },
    logoutLinkText: {
      fontSize: 13 * scale,
      fontWeight: '700',
      color: COLORS.dangerRed,
    },
    emptyCard: {
      alignItems: 'center',
      backgroundColor: COLORS.surface,
      borderRadius: 16 * scale,
      paddingVertical: 28 * scale,
      paddingHorizontal: 20 * scale,
      gap: 8 * scale,
    },
    emptyIcon: {
      width: 52 * scale,
      height: 52 * scale,
      borderRadius: 26 * scale,
      backgroundColor: COLORS.successSoft,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 4 * scale,
    },
    emptyTitle: {
      fontSize: 15 * scale,
      fontWeight: '700',
      color: COLORS.textStrong,
    },
    emptyDescription: {
      fontSize: 13 * scale,
      lineHeight: 18 * scale,
      color: COLORS.textMuted,
      textAlign: 'center',
    },
    logoutAllButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8 * scale,
      borderRadius: 14 * scale,
      borderWidth: 1,
      borderColor: COLORS.dangerRed,
      backgroundColor: COLORS.dangerRedSoft,
      paddingVertical: 14 * scale,
      marginTop: 8 * scale,
    },
    logoutAllText: {
      fontSize: 14 * scale,
      fontWeight: '700',
      color: COLORS.dangerRed,
    },
  });

export default SecurityActivityScreen;