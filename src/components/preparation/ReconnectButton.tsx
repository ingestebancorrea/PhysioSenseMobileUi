import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { ICONS } from '@/constants/icons';
import { COLORS } from '@/constants/theme';

interface ReconnectButtonProps {
  onPress: () => void;
  label?: string;
}

export const ReconnectButton: React.FC<ReconnectButtonProps> = ({
  onPress,
  label = 'Reconectar',
}) => {
  const RepeatIcon = ICONS.repeat;

  return (
    <TouchableOpacity style={styles.button} activeOpacity={0.85} onPress={onPress}>
      <RepeatIcon size={18} color={COLORS.white} />
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    borderRadius: 14,
    backgroundColor: COLORS.primary,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
    gap: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.white,
  },
});
