import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '@/constants/theme';
import { ICONS } from '@/constants/icons';
import type { HomeTabItem } from '@/types/therapistDashboard';

const TABS: HomeTabItem[] = [
  { key: 'inicio', label: 'Inicio', icon: 'house' },
  { key: 'pacientes', label: 'Pacientes', icon: 'users' },
  { key: 'sesiones', label: 'Sesiones', icon: 'calendarDays' },
  { key: 'ejercicios', label: 'Ejercicios', icon: 'dumbbell' },
];

interface HomeTabBarProps {
  activeTab?: string;
  onTabPress?: (tabKey: string) => void;
}

export const HomeTabBar: React.FC<HomeTabBarProps> = ({
  activeTab = 'inicio',
  onTabPress,
}) => (
  <SafeAreaView edges={['bottom']} style={styles.safeArea}>
    <View style={styles.container}>
      {TABS.map(({ key, label, icon }) => {
        const Icon = ICONS[icon];
        const isActive = key === activeTab;
        const color = isActive ? COLORS.violet : COLORS.textMuted;

        return (
          <TouchableOpacity
            key={key}
            style={styles.item}
            activeOpacity={0.7}
            onPress={() => onTabPress?.(key)}
          >
            <Icon size={22} color={color} strokeWidth={isActive ? 2.5 : 2} />
            <Text style={[styles.label, { color }, isActive && styles.labelActive]}>
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  </SafeAreaView>
);

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: COLORS.surface,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderSubtle,
    paddingTop: 10,
    paddingBottom: 6,
    paddingHorizontal: 4,
  },
  item: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 11,
    marginTop: 4,
    fontWeight: '500',
  },
  labelActive: {
    fontWeight: '700',
  },
});
