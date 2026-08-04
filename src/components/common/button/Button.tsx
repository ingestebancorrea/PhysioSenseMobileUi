// src/components/common/Button/Button.tsx
import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';

export interface ButtonProps {
  title: string;
  onPress: () => void;
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'ghost' | 'link';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  style?: any;
  testID?: string;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  loading = false,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  style,
  testID,
}) => {
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      style={[styles.base, styles[variant], styles[size], isDisabled && styles.disabled, style]}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.8}
      testID={testID}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? '#fff' : '#007AFF'} size="small" />
      ) : (
        <Text style={[styles.text, styles[`text${variant.charAt(0).toUpperCase() + variant.slice(1)}`], styles[`text${size.charAt(0).toUpperCase() + size.slice(1)}`]}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: { borderRadius: 8, alignItems: 'center', justifyContent: 'center', flexDirection: 'row' },
  primary: { backgroundColor: '#007AFF' },
  secondary: { backgroundColor: '#f0f0f0', borderWidth: 1, borderColor: '#ddd' },
  ghost: { backgroundColor: 'transparent' },
  link: { backgroundColor: 'transparent', padding: 0 },
  small: { paddingVertical: 8, paddingHorizontal: 16 },
  medium: { paddingVertical: 12, paddingHorizontal: 24 },
  large: { paddingVertical: 16, paddingHorizontal: 32 },
  disabled: { opacity: 0.6 },
  text: { fontWeight: '600' },
  textPrimary: { color: '#fff' },
  textSecondary: { color: '#333' },
  textGhost: { color: '#007AFF' },
  textLink: { color: '#007AFF', textDecorationLine: 'underline' },
  textSmall: { fontSize: 13 },
  textMedium: { fontSize: 15 },
  textLarge: { fontSize: 17 },
});