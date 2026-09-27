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
}

export const CheckboxRow: React.FC<CheckboxRowProps> = ({
  checked,
  onToggle,
  text,
  highlight,
}) => (
  <TouchableOpacity
    style={styles.container}
    activeOpacity={0.7}
    onPress={onToggle}
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
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
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
});
