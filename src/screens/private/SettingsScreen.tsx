import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LogOut, Menu } from 'lucide-react-native';

import { COLORS } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';
import { useDrawer } from '@/context/DrawerContext';
import { SettingsProfileCard } from '@/components/settings/SettingsProfileCard';
import { SettingsListItem } from '@/components/settings/SettingsListItem';
import {
  THERAPIST_SETTING_OPTIONS,
  THERAPIST_SETTINGS_PROFILE,
} from '@/mock/settingsData';

export const SettingsScreen: React.FC = () => {
  const { logout } = useAuth();
  const { open } = useDrawer();

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.menuButton}
          activeOpacity={0.8}
          onPress={open}
          accessibilityRole="button"
          accessibilityLabel="Abrir menú"
        >
          <Menu size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Configuración</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <SettingsProfileCard profile={THERAPIST_SETTINGS_PROFILE} />

        <View style={styles.optionsCard}>
          {THERAPIST_SETTING_OPTIONS.map((option, index) => (
            <SettingsListItem
              key={option.id}
              option={option}
              showDivider={index < THERAPIST_SETTING_OPTIONS.length - 1}
            />
          ))}
        </View>

        <TouchableOpacity
          style={styles.logoutCard}
          activeOpacity={0.85}
          onPress={logout}
          accessibilityRole="button"
          accessibilityLabel="Cerrar sesión"
        >
          <LogOut size={22} color={COLORS.danger} />
          <Text style={styles.logoutText}>Cerrar sesión</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.backgroundMuted,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  menuButton: {
    position: 'absolute',
    left: 20,
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 4,
    paddingBottom: 24,
    rowGap: 16,
  },
  optionsCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 18,
    paddingVertical: 6,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  logoutCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.dangerSoft,
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.danger,
    marginLeft: 14,
  },
});

export default SettingsScreen;