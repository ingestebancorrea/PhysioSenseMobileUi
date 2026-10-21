import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { COLORS } from '@/constants/theme';

interface GuideFooterButtonProps {
  onPress: () => void;
  label?: string;
}

export const GuideFooterButton: React.FC<GuideFooterButtonProps> = ({
  onPress,
  label = 'Entendido, comenzar',
}) => (
  <TouchableOpacity style={styles.button} activeOpacity={0.85} onPress={onPress}>
    <Text style={styles.label}>{label}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  button: {
    height: 54,
    borderRadius: 14,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  label: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.white,
  },
});
