import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Bell, Menu } from 'lucide-react-native';
import { COLORS } from '@/constants/theme';

interface ScreenHeaderProps {
  title: string;
  onMenuPress?: () => void;
  onNotificationsPress?: () => void;
  showNotificationDot?: boolean;
}

export const ScreenHeader: React.FC<ScreenHeaderProps> = ({
  title,
  onMenuPress,
  onNotificationsPress,
  showNotificationDot = true,
}) => (
  <View style={styles.header}>
    <TouchableOpacity
      style={styles.roundButton}
      activeOpacity={0.8}
      onPress={onMenuPress}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
    >
      <Menu size={24} color={COLORS.textPrimary} />
    </TouchableOpacity>

    <Text style={styles.title} numberOfLines={1}>
      {title}
    </Text>

    <TouchableOpacity
      style={styles.roundButton}
      activeOpacity={0.7}
      onPress={onNotificationsPress}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
    >
      <Bell size={22} color={COLORS.textPrimary} />
      {showNotificationDot && <View style={styles.notificationDot} />}
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
    gap: 12,
  },
  roundButton: {
    position: 'relative',
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
  },
  title: {
    flex: 1,
    fontSize: 26,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  notificationDot: {
    position: 'absolute',
    top: 10,
    right: 12,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.danger,
  },
});