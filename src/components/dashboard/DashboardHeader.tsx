import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Bell, Menu } from 'lucide-react-native';
import { COLORS } from '@/constants/theme';

interface DashboardHeaderProps {
  title: string;
  onMenuPress?: () => void;
  onNotificationsPress?: () => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  title,
  onMenuPress,
  onNotificationsPress,
}) => (
  <View style={styles.header}>
    <TouchableOpacity style={styles.headerButton} activeOpacity={0.8} onPress={onMenuPress}>
      <Menu size={24} color={COLORS.textPrimary} />
    </TouchableOpacity>
    <Text style={styles.headerTitle}>{title}</Text>
    <TouchableOpacity
      style={styles.headerButton}
      activeOpacity={0.8}
      onPress={onNotificationsPress}
    >
      <Bell size={27} color={COLORS.textPrimary} />
      <View style={styles.bellBadge} />
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  headerButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  bellBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 12,
    height: 12,
    borderRadius: 7,
    backgroundColor: COLORS.primary,
    borderWidth: 1.5,
    borderColor: COLORS.background,
  },
});
