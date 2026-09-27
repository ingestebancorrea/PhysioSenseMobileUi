import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Plus, type LucideIcon } from 'lucide-react-native';
import { COLORS } from '@/constants/theme';

interface FabButtonProps {
  onPress?: () => void;
  icon?: LucideIcon;
  color?: string;
}

export const FabButton: React.FC<FabButtonProps> = ({
  onPress,
  icon: Icon = Plus,
  color = COLORS.white,
}) => (
  <TouchableOpacity style={styles.fab} activeOpacity={0.8} onPress={onPress}>
    <Icon size={24} color={color} />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.violet,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
});