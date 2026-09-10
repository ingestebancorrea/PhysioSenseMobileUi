import React, { useMemo } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, ChevronRight, LogOut } from 'lucide-react-native';

import { getInitials } from '@/utils/helpers/nameInitials';
import { useAuth } from '@/context/AuthContext';
import {
  THERAPIST_SETTING_OPTIONS,
  THERAPIST_SETTINGS_PROFILE,
} from '@/mock/settingsData';
import { ICONS, type IconName } from '@/constants/icons';
import { COLORS } from '@/constants/theme';
import type { SettingOption } from '@/types/settings';

const DESIGN_WIDTH = 390;

interface SettingsScreenProps {
  onBack?: () => void;
  onOptionPress?: (route: string) => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  onBack,
  onOptionPress,
}) => {
  const { logout } = useAuth();
  const { width } = useWindowDimensions();
  const scale = Math.min(Math.max(width / DESIGN_WIDTH, 0.8), 1);
  const styles = useMemo(() => createStyles(scale), [scale]);

  const { name, role, avatarUrl } = THERAPIST_SETTINGS_PROFILE;

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
        <Text style={styles.headerTitle}>Configuración</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity
          style={styles.profileCard}
          activeOpacity={0.85}
          accessibilityRole="button"
          accessibilityLabel={`Perfil de ${name}`}
        >
          {avatarUrl ? (
            <Image source={{ uri: avatarUrl }} style={styles.avatar} />
          ) : (
            <View style={styles.avatar}>
              <Text style={styles.avatarInitials}>{getInitials(name)}</Text>
            </View>
          )}

          <View style={styles.profileInfo}>
            <Text style={styles.profileName} numberOfLines={1}>
              {name}
            </Text>
            <View style={styles.roleBadge}>
              <Text style={styles.roleBadgeText}>{role}</Text>
            </View>
          </View>

          <ChevronRight size={22} color={COLORS.textMuted} />
        </TouchableOpacity>

        <View>
          {THERAPIST_SETTING_OPTIONS.map((option: SettingOption) => {
            const Icon = ICONS[option.iconName as IconName];

            return (
              <TouchableOpacity
                key={option.id}
                style={styles.optionItem}
                activeOpacity={0.7}
                onPress={() => onOptionPress?.(option.route)}
                accessibilityRole="button"
                accessibilityLabel={option.title}
              >
                <Icon size={22} color={COLORS.textNeutral} />

                <View style={styles.optionInfo}>
                  <Text style={styles.optionTitle}>{option.title}</Text>
                  <Text style={styles.optionSubtitle} numberOfLines={1}>
                    {option.subtitle}
                  </Text>
                </View>

                <ChevronRight size={20} color={COLORS.textMuted} />
              </TouchableOpacity>
            );
          })}
        </View>

        <TouchableOpacity
          style={styles.logoutButton}
          activeOpacity={0.85}
          onPress={logout}
          accessibilityRole="button"
          accessibilityLabel="Cerrar sesión"
        >
          <LogOut size={22} color={COLORS.dangerRed} />
          <Text style={styles.logoutText}>Cerrar sesión</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const createStyles = (scale: number) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: COLORS.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 20 * scale,
      paddingVertical: 12 * scale,
    },
    backButton: {
      position: 'absolute',
      left: 20 * scale,
      width: 44 * scale,
      height: 44 * scale,
      borderRadius: 14 * scale,
      backgroundColor: COLORS.background,
      borderWidth: 1,
      borderColor: COLORS.dividerLight,
      alignItems: 'center',
      justifyContent: 'center',
    },
    headerTitle: {
      fontSize: 20 * scale,
      fontWeight: '700',
      color: COLORS.textStrong,
    },
    content: {
      flexGrow: 1,
      justifyContent: 'space-between',
      paddingTop: 4 * scale,
      paddingBottom: 24 * scale,
    },
    profileCard: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: COLORS.surfaceSoft,
      borderRadius: 16 * scale,
      padding: 16 * scale,
      marginHorizontal: 20 * scale,
    },
    avatar: {
      width: 60 * scale,
      height: 60 * scale,
      borderRadius: 30 * scale,
      backgroundColor: COLORS.primaryVioletSoft,
      alignItems: 'center',
      justifyContent: 'center',
    },
    avatarInitials: {
      fontSize: 22 * scale,
      fontWeight: '700',
      color: COLORS.primaryViolet,
    },
    profileInfo: {
      flex: 1,
      marginHorizontal: 14 * scale,
    },
    profileName: {
      fontSize: 18 * scale,
      fontWeight: '700',
      color: COLORS.textStrong,
    },
    roleBadge: {
      alignSelf: 'flex-start',
      backgroundColor: COLORS.primaryVioletSoft,
      paddingVertical: 4 * scale,
      paddingHorizontal: 10 * scale,
      borderRadius: 12 * scale,
      marginTop: 6 * scale,
    },
    roleBadgeText: {
      fontSize: 12 * scale,
      fontWeight: '600',
      color: COLORS.primaryViolet,
    },
    optionItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 28 * scale,
      paddingHorizontal: 40 * scale,
    },
    optionInfo: {
      flex: 1,
      marginLeft: 14 * scale,
    },
    optionTitle: {
      fontSize: 16 * scale,
      fontWeight: '700',
      color: COLORS.textNeutral,
    },
    optionSubtitle: {
      fontSize: 13 * scale,
      color: COLORS.textMuted,
      marginTop: 2 * scale,
    },
    logoutButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: COLORS.dangerRedSoft,
      borderRadius: 16 * scale,
      paddingVertical: 16 * scale,
      paddingHorizontal: 16 * scale,
      marginHorizontal: 20 * scale,
    },
    logoutText: {
      fontSize: 16 * scale,
      fontWeight: '700',
      color: COLORS.dangerRed,
      marginLeft: 14 * scale,
    },
  });

export default SettingsScreen;