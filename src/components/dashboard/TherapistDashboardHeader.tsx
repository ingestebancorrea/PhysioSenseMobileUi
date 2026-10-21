import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Bell, Menu } from 'lucide-react-native';
import { COLORS } from '@/constants/theme';

interface TherapistDashboardHeaderProps {
  name: string;
  subtitle?: string;
  notificationCount?: number;
  onMenuPress?: () => void;
  onNotificationsPress?: () => void;
}

export const TherapistDashboardHeader: React.FC<TherapistDashboardHeaderProps> = ({
  name,
  subtitle = 'Aquí tienes un resumen de tu actividad',
  notificationCount = 0,
  onMenuPress,
  onNotificationsPress,
}) => (
  <View style={styles.container}>
    <TouchableOpacity
      style={styles.menuButton}
      activeOpacity={0.8}
      onPress={onMenuPress}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
    >
      <Menu size={24} color={COLORS.textPrimary} />
    </TouchableOpacity>
    <View style={styles.greetingContainer}>
      <Text style={styles.greeting} numberOfLines={2}>
        ¡Hola, {name}! 👋
      </Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
    </View>
    <TouchableOpacity
      style={styles.bellButton}
      activeOpacity={0.8}
      onPress={onNotificationsPress}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
    >
      <Bell size={24} color={COLORS.textPrimary} />
      {notificationCount > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{notificationCount}</Text>
        </View>
      )}
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingTop: 16,
    paddingBottom: 20,
  },
  greetingContainer: {
    flex: 1,
    paddingHorizontal: 12,
  },
  menuButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
  },
  greeting: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textSubtitle,
    marginTop: 4,
  },
  bellButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    minWidth: 20,
    height: 20,
    paddingHorizontal: 5,
    borderRadius: 10,
    backgroundColor: COLORS.violet,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: COLORS.backgroundMuted,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.white,
  },
});
