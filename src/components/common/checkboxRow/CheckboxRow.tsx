// src/components/common/checkboxRow/CheckboxRow.tsx
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Check } from 'lucide-react-native';

import { COLORS } from '@/constants/theme';

interface CheckboxRowProps {
  checked: boolean;
  onToggle: () => void;
  text: string;
  highlight?: string;
  error?: string;
}

export const CheckboxRow: React.FC<CheckboxRowProps> = ({
  checked,
  onToggle,
  text,
  highlight,
  error,
}) => (
  <View style={styles.container}>
    <TouchableOpacity
      style={styles.row}
      activeOpacity={0.7}
      onPress={onToggle}
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
    >
      <View style={[styles.box, checked && styles.boxChecked]}>
        {checked && <Check size={14} color={COLORS.white} strokeWidth={3} />}
      </View>
      <Text style={styles.text}>
        {text}
        {highlight ? (
          <Text style={styles.highlight}> {highlight}</Text>
        ) : null}
      </Text>
    </TouchableOpacity>
    {error ? <Text style={styles.errorText}>{error}</Text> : null}
  </View>
);

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  box: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    marginTop: 1,
  },
  boxChecked: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary,
  },
  text: {
    flex: 1,
    fontSize: 13,
    lineHeight: 19,
    color: COLORS.textSecondary,
  },
  highlight: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  errorText: {
    fontSize: 12,
    color: COLORS.dangerRed,
    marginTop: 6,
    marginLeft: 32,
  },
});