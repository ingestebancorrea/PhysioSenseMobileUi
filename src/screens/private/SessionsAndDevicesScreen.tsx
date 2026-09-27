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
  ChevronRight,
  Laptop,
  LogOut,
  MonitorSmartphone,
  MoreVertical,
  Smartphone,
  Tablet,
  type LucideIcon,
} from 'lucide-react-native';

import { PreferenceRowItem } from '@/components/settings/PreferenceRowItem';
import { ACTIVE_DEVICES, CURRENT_SESSION } from '@/mock/settingsData';
import { COLORS } from '@/constants/theme';
import { useAppAlert } from '@/hooks/useAppAlert';
import type { ActiveDevice, DeviceKind } from '@/types/settings';

const DESIGN_WIDTH = 390;
const PAGE_BACKGROUND = '#f1f4f8';
const SUBTITLE_COLOR = '#6B7280';

const DEVICE_ICONS: Record<DeviceKind, LucideIcon> = {
  smartphone: Smartphone,
  laptop: Laptop,
  tablet: Tablet,
};

interface ActiveSessionItemProps {
  device: ActiveDevice;
  onMenuPress: (device: ActiveDevice) => void;
}

const ActiveSessionItem: React.FC<ActiveSessionItemProps> = ({
  device,
  onMenuPress,
}) => {
  const { width } = useWindowDimensions();
  const scale = Math.min(Math.max(width / DESIGN_WIDTH, 0.8), 1);
  const styles = useMemo(() => createStyles(scale), [scale]);
  const Icon = DEVICE_ICONS[device.deviceType];

  return (
    <View style={styles.deviceCard}>
      <View style={styles.deviceIconContainer}>
        <Icon size={24} color={COLORS.primaryViolet} />
      </View>

      <View style={styles.deviceTexts}>
        <Text style={styles.deviceName} numberOfLines={1}>
          {device.deviceName}
        </Text>
        <Text style={styles.deviceMeta} numberOfLines={1}>
          {device.os}
          {device.browser ? ` • ${device.browser}` : ''}
        </Text>
        <Text style={styles.deviceMeta} numberOfLines={1}>
          {device.location} • {device.lastActive}
        </Text>
      </View>

      <TouchableOpacity
        style={styles.menuButton}
        activeOpacity={0.7}
        onPress={() => onMenuPress(device)}
        accessibilityRole="button"
        accessibilityLabel={`Opciones de ${device.deviceName}`}
      >
        <MoreVertical size={22} color={COLORS.textMuted} />
      </TouchableOpacity>
    </View>
  );
};

interface SessionsAndDevicesScreenProps {
  onBack?: () => void;
}

export const SessionsAndDevicesScreen: React.FC<
  SessionsAndDevicesScreenProps
> = ({ onBack }) => {
  const [devices, setDevices] = useState<ActiveDevice[]>(ACTIVE_DEVICES);

  const { width } = useWindowDimensions();
  const scale = Math.min(Math.max(width / DESIGN_WIDTH, 0.8), 1);
  const styles = useMemo(() => createStyles(scale), [scale]);
  const { alertModal, showAlert } = useAppAlert();

  const handleMenuPress = (device: ActiveDevice) => {
    showAlert({
      title: device.deviceName,
      message: '¿Qué quieres hacer con este dispositivo?',
      variant: 'error',
      confirmText: 'Cerrar sesión',
      cancelText: 'Cancelar',
      onConfirm: () =>
        setDevices(prev => prev.filter(item => item.id !== device.id)),
    });
  };

  const handleCloseAllSessions = () => {
    showAlert({
      title: 'Cerrar todas las sesiones',
      message:
        '¿Seguro que quieres finalizar tu sesión en todos los dispositivos?',
      variant: 'error',
      confirmText: 'Cerrar todas',
      cancelText: 'Cancelar',
      onConfirm: () => setDevices([]),
    });
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
          <Text style={styles.headerTitle}>Sesión y dispositivos</Text>
        </View>
      </View>

      <View style={styles.headerSubtitleWrapper}>
        <Text style={styles.headerSubtitle}>
          Gestiona tus sesiones activas y los dispositivos donde tienes acceso
          a tu cuenta.
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.currentSessionCard}>
          <View style={styles.deviceIconContainer}>
            <Smartphone size={24} color={COLORS.primaryViolet} />
          </View>

          <View style={styles.deviceTexts}>
            <Text style={styles.sessionBadge}>Sesión actual</Text>
            <Text style={styles.deviceName} numberOfLines={1}>
              {CURRENT_SESSION.deviceName} • {CURRENT_SESSION.os}
            </Text>
            <Text style={styles.deviceMeta} numberOfLines={1}>
              {CURRENT_SESSION.location} • {CURRENT_SESSION.lastActive}
            </Text>
          </View>

          <ChevronRight size={22} color={COLORS.textMuted} />
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Otras sesiones activas</Text>
          {devices.length > 0 && (
            <View style={styles.sectionBadge}>
              <Text style={styles.sectionBadgeText}>{devices.length}</Text>
            </View>
          )}
        </View>

        {devices.map(device => (
          <ActiveSessionItem
            key={device.id}
            device={device}
            onMenuPress={handleMenuPress}
          />
        ))}

        <TouchableOpacity
          style={styles.closeAllButton}
          activeOpacity={0.85}
          onPress={handleCloseAllSessions}
          accessibilityRole="button"
          accessibilityLabel="Cerrar todas las sesiones"
        >
          <LogOut size={22} color={COLORS.primaryViolet} />
          <View style={styles.closeAllTexts}>
            <Text style={styles.closeAllTitle}>Cerrar todas las sesiones</Text>
            <Text style={styles.closeAllSubtitle}>
              Finaliza tu sesión en todos los dispositivos.
            </Text>
          </View>
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>Administrar dispositivos</Text>
        <PreferenceRowItem
          icon={MonitorSmartphone}
          title="Dispositivos autorizados"
          value="Revisa y elimina dispositivos que han accedido a tu cuenta."
        />
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
    headerSubtitleWrapper: {
      width: `${70 * scale}%`,
      alignSelf: 'baseline',
      paddingHorizontal: 30 * scale,
      paddingVertical: 10 * scale,
    },
    headerSubtitle: {
      fontSize: 13 * scale,
      color: SUBTITLE_COLOR,
      marginTop: 4 * scale,
      lineHeight: 18 * scale,
    },
    content: {
      flexGrow: 1,
      paddingHorizontal: 20 * scale,
      paddingTop: 8 * scale,
      paddingBottom: 32 * scale,
      gap: 12 * scale,
    },
    currentSessionCard: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: COLORS.surface,
      borderRadius: 16,
      paddingVertical: 18 * scale,
      paddingHorizontal: 16 * scale,
      borderWidth: 1,
      borderColor: COLORS.borderSubtle,
      gap: 12 * scale,
    },
    deviceIconContainer: {
      width: 46,
      height: 46,
      borderRadius: 23,
      backgroundColor: COLORS.primaryVioletSoft,
      alignItems: 'center',
      justifyContent: 'center',
    },
    deviceTexts: {
      flex: 1,
    },
    sessionBadge: {
      fontSize: 11 * scale,
      fontWeight: '700',
      color: COLORS.primaryViolet,
      textTransform: 'uppercase',
      marginBottom: 3 * scale,
    },
    deviceName: {
      fontSize: 16,
      fontWeight: '700',
      color: COLORS.textStrong,
    },
    deviceMeta: {
      fontSize: 12 * scale,
      color: SUBTITLE_COLOR,
      marginTop: 3 * scale,
      lineHeight: 16 * scale,
    },
    deviceCard: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: COLORS.surface,
      borderRadius: 16,
      paddingVertical: 16 * scale,
      paddingHorizontal: 16 * scale,
      borderWidth: 1,
      borderColor: '#f7f8fa1b',
      shadowColor: '#f7f8fa1b',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 6,
      elevation: 2,
      gap: 12 * scale,
    },
    menuButton: {
      width: 40,
      height: 40,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
    },
    sectionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: 6 * scale,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: '700',
      color: COLORS.textStrong,
    },
    sectionBadge: {
      minWidth: 26,
      height: 26,
      borderRadius: 13,
      paddingHorizontal: 6,
      backgroundColor: COLORS.primaryVioletSoft,
      alignItems: 'center',
      justifyContent: 'center',
    },
    sectionBadgeText: {
      fontSize: 13,
      fontWeight: '700',
      color: COLORS.primaryViolet,
    },
    closeAllButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: COLORS.surface,
      borderRadius: 16,
      paddingVertical: 16 * scale,
      paddingHorizontal: 16 * scale,
      borderWidth: 1,
      borderColor: COLORS.primaryViolet,
      gap: 14 * scale,
    },
    closeAllTexts: {
      flex: 1,
    },
    closeAllTitle: {
      fontSize: 15 * scale,
      fontWeight: '700',
      color: COLORS.primaryViolet,
    },
    closeAllSubtitle: {
      fontSize: 12 * scale,
      color: SUBTITLE_COLOR,
      marginTop: 3 * scale,
      lineHeight: 16 * scale,
    },
  });

export default SessionsAndDevicesScreen;