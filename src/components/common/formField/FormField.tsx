// src/components/common/formField/FormField.tsx
import React from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  type TextInputProps,
} from 'react-native';
import type { LucideIcon } from 'lucide-react-native';
import { Eye, EyeOff } from 'lucide-react-native';

import { COLORS } from '@/constants/theme';

export interface FormFieldProps {
  label: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  icon?: LucideIcon;
  secureTextEntry?: boolean;
  showSecureToggle?: boolean;
  keyboardType?: TextInputProps['keyboardType'];
  autoCapitalize?: TextInputProps['autoCapitalize'];
  textContentType?: TextInputProps['textContentType'];
  autoCorrect?: boolean;
  maxLength?: number;
  error?: string;
  rightElement?: React.ReactNode;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  placeholder,
  value,
  onChangeText,
  icon: Icon,
  secureTextEntry = false,
  showSecureToggle = false,
  keyboardType,
  autoCapitalize,
  textContentType,
  autoCorrect,
  maxLength,
  error,
  rightElement,
}) => {
  const [hidden, setHidden] = React.useState(secureTextEntry);

  const effectiveSecure = secureTextEntry ? hidden : false;

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.wrapper, error && styles.wrapperError]}>
        {Icon && (
          <View style={styles.leftIcon}>
            <Icon size={20} color={COLORS.textMuted} strokeWidth={2} />
          </View>
        )}
        <TextInput
          style={[styles.input, Icon && styles.inputWithIcon]}
          placeholder={placeholder}
          placeholderTextColor={COLORS.textMuted}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={effectiveSecure}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          autoCorrect={autoCorrect}
          textContentType={textContentType}
          maxLength={maxLength}
        />
        {showSecureToggle && (
          <TouchableOpacity
            style={styles.rightAction}
            activeOpacity={0.7}
            onPress={() => setHidden(prev => !prev)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            {hidden ? (
              <EyeOff size={20} color={COLORS.textMuted} strokeWidth={2} />
            ) : (
              <Eye size={20} color={COLORS.textMuted} strokeWidth={2} />
            )}
          </TouchableOpacity>
        )}
        {rightElement}
      </View>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 52,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },
  wrapperError: {
    borderColor: '#E74C3C',
  },
  leftIcon: {
    paddingLeft: 16,
  },
  input: {
    flex: 1,
    height: '100%',
    paddingHorizontal: 16,
    fontSize: 15,
    color: COLORS.textPrimary,
  },
  inputWithIcon: {
    paddingLeft: 10,
  },
  rightAction: {
    paddingHorizontal: 14,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    fontSize: 12,
    color: '#E74C3C',
    marginTop: 6,
  },
});
