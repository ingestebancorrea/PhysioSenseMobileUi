// src/components/common/segmentedControl/SegmentedControl.tsx
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { COLORS } from '@/constants/theme';

interface SegmentedControlProps {
  label?: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export const SegmentedControl: React.FC<SegmentedControlProps> = ({
  label,
  options,
  value,
  onChange,
  error,
}) => (
  <View style={styles.container}>
    {label && <Text style={styles.label}>{label}</Text>}
    <View style={[styles.segment, error && styles.segmentError]}>
      {options.map((option, index) => {
        const selected = option === value;
        return (
          <React.Fragment key={option}>
            {index > 0 && <View style={styles.separator} />}
            <TouchableOpacity
              style={[styles.option, selected && styles.optionSelected]}
              activeOpacity={0.7}
              onPress={() => onChange(option)}
            >
              <Text
                style={[
                  styles.optionText,
                  selected && styles.optionTextSelected,
                ]}
              >
                {option}
              </Text>
            </TouchableOpacity>
          </React.Fragment>
        );
      })}
    </View>
    {error ? <Text style={styles.errorText}>{error}</Text> : null}
  </View>
);

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
  segment: {
    flexDirection: 'row',
    height: 50,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: '#F5F6FA',
    overflow: 'hidden',
  },
  segmentError: {
    borderColor: COLORS.dangerRed,
  },
  separator: {
    width: 1,
    backgroundColor: COLORS.border,
  },
  option: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionSelected: {
    backgroundColor: COLORS.primary,
  },
  optionText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  optionTextSelected: {
    color: COLORS.white,
  },
  errorText: {
    fontSize: 12,
    color: COLORS.dangerRed,
    marginTop: 6,
  },
});