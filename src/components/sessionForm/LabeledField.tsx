import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface LabeledFieldProps {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}

export const LabeledField: React.FC<LabeledFieldProps> = ({
  label,
  required,
  error,
  children,
}) => (
  <View style={styles.container}>
    <Text style={styles.label}>
      {label}
      {required && <Text style={styles.required}> *</Text>}
    </Text>
    {children}
    {error ? <Text style={styles.error}>{error}</Text> : null}
  </View>
);

const styles = StyleSheet.create({
  container: {
    gap: 6,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1A1C20',
    marginTop: 6,
  },
  required: {
    color: '#E5484D',
  },
  error: {
    fontSize: 12,
    color: '#E5484D',
    marginTop: 2,
  },
});
