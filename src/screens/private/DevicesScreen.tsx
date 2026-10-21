import React from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronRight } from 'lucide-react-native';

import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { COLORS, CARD } from '@/constants/theme';
import { useDrawer } from '@/context/DrawerContext';

type DeviceStatus = 'connected' | 'connecting' | 'disconnected';

interface Device {
  id: string;
  name: string;
  status: DeviceStatus;
  batteryLevel: number;
}

const SMART_GLOVE: Device = {
  id: 'glove-001',
  name: 'Smart Glove',
  status: 'connected',
  batteryLevel: 82,
};

const STATUS_LABELS: Record<DeviceStatus, string> = {
  connected: 'Conectado',
  connecting: 'Conectando...',
  disconnected: 'Desconectado',
};

const STATUS_COLORS: Record<DeviceStatus, string> = {
  connected: COLORS.success,
  connecting: COLORS.warning,
  disconnected: COLORS.danger,
};

export const DevicesScreen: React.FC = () => {
  const { open } = useDrawer();
  const { name, status, batteryLevel } = SMART_GLOVE;

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <DashboardHeader title="Dispositivos" onMenuPress={open} />

        <TouchableOpacity
          style={styles.deviceCard}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel={`${name}, ${STATUS_LABELS[status]}, batería ${batteryLevel}%`}
        >
          <Image
            source={require('../../../assets/glove.png')}
            style={styles.deviceImage}
            resizeMode="contain"
          />

          <View style={styles.deviceInfo}>
            <Text style={styles.deviceName}>{name}</Text>

            <View style={styles.statusRow}>
              <View
                style={[
                  styles.statusDot,
                  { backgroundColor: STATUS_COLORS[status] },
                ]}
              />
              <Text style={styles.statusText}>{STATUS_LABELS[status]}</Text>
            </View>

            <Text style={styles.batteryLabel}>Batería {batteryLevel}%</Text>
            <View style={styles.batteryTrack}>
              <View
                style={[
                  styles.batteryFill,
                  { width: `${batteryLevel}%` as unknown as number },
                ]}
              />
            </View>
          </View>

          <ChevronRight size={20} color={COLORS.textMuted} />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FAF9FE',
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  deviceCard: {
    ...CARD,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  deviceImage: {
    width: 72,
    height: 72,
    borderRadius: 12,
    backgroundColor: COLORS.cardSoft,
  },
  deviceInfo: {
    flex: 1,
    marginLeft: 14,
  },
  deviceName: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 13,
    color: COLORS.success,
    fontWeight: '500',
  },
  batteryLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 8,
  },
  batteryTrack: {
    height: 5,
    borderRadius: 3,
    backgroundColor: COLORS.progressTrack,
    marginTop: 4,
    overflow: 'hidden',
  },
  batteryFill: {
    height: '100%',
    borderRadius: 3,
    backgroundColor: COLORS.success,
  },
});
