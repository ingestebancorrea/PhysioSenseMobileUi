// src/components/common/Input/Input.tsx
import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { Controller, ControllerProps } from 'react-hook-form';

export interface InputProps extends Omit<ControllerProps, 'control' | 'name' | 'render'> {
  label: string;
  placeholder?: string;
  error?: string;
  secureTextEntry?: boolean;
  keyboardType?: TextInput['keyboardType'];
  autoCapitalize?: TextInput['autoCapitalize'];
  textContentType?: TextInput['textContentType'];
  control: ControllerProps['control'];
  name: ControllerProps['name'];
}

export const Input: React.FC<InputProps> = ({
  label,
  placeholder,
  error,
  secureTextEntry = false,
  keyboardType,
  autoCapitalize,
  textContentType,
  control,
  name,
  ...rest
}) => (
  <View style={styles.container}>
    <Text style={styles.label}>{label}</Text>
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <TextInput
          style={[styles.input, error && styles.inputError, rest.style]}
          placeholder={placeholder}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          textContentType={textContentType}
          onChangeText={field.onChange}
          onBlur={field.onBlur}
          value={field.value}
          {...rest}
        />
      )}
    />
    {error && <Text style={styles.errorText}>{error}</Text>}
  </View>
);

const styles = StyleSheet.create({
  container: { gap: 6 },
  label: { fontSize: 14, fontWeight: '600', color: '#333' },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 14,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  inputError: { borderColor: '#e74c3c' },
  errorText: { fontSize: 12, color: '#e74c3c' },
});