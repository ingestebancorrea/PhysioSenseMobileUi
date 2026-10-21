import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Minus, Plus } from 'lucide-react-native';
import { COLORS } from '@/constants/theme';

export interface NumberPickerFieldProps {
  label: string;
  value: string;
  onSelect: (value: string) => void;
  placeholder?: string;
  min?: number;
  max?: number;
  step?: number;
  suffix?: string;
  format?: (value: number) => string;
  editable?: boolean;
  required?: boolean;
}

const stripNonNumeric = (raw: string) => raw.replace(/[^0-9]/g, '');

export const NumberPickerField: React.FC<NumberPickerFieldProps> = ({
  label,
  value,
  onSelect,
  placeholder,
  min = 1,
  max = 99,
  step = 1,
  suffix,
  format,
  editable = false,
  required = false,
}) => {
  const [focused, setFocused] = useState(false);

  const num = parseInt(value, 10);
  const current = Number.isNaN(num) ? min : num;

  const change = (delta: number) => {
    let next: number;
    if (delta > 0) {
      next = Math.ceil((current + 1) / step) * step;
    } else {
      next = Math.floor((current - 1) / step) * step;
    }
    next = Math.min(max, Math.max(min, next));
    onSelect(String(next));
  };

  const handleTextChange = (raw: string) => {
    const digits = stripNonNumeric(raw);
    onSelect(digits);
  };

  const clamp = () => {
    if (value === '') return;
    const next = Math.min(max, Math.max(min, current));
    onSelect(String(next));
  };

  const displayNumber =
    format && !focused ? format(current) : value || placeholder || String(min);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        {label}
        {required && <Text style={styles.required}> *</Text>}
      </Text>
      <View style={styles.wrapper}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => change(-step)}
          activeOpacity={0.7}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Minus size={18} color={current <= min ? COLORS.divider : COLORS.primary} />
        </TouchableOpacity>

        <View style={styles.valueContainer}>
          {editable ? (
            <View style={styles.inputWrap}>
              <TextInput
                style={styles.input}
                value={displayNumber}
                onChangeText={handleTextChange}
                onFocus={() => setFocused(true)}
                onBlur={() => {
                  setFocused(false);
                  clamp();
                }}
                keyboardType="number-pad"
                placeholder={placeholder || String(min)}
                placeholderTextColor={COLORS.textMuted}
                maxLength={String(max).length + 1}
                selectTextOnFocus
              />
              {suffix ? <Text style={styles.suffix}>{suffix}</Text> : null}
            </View>
          ) : (
            <Text style={[styles.value, !value && styles.placeholder]} numberOfLines={1}>
              {displayNumber}
              {suffix ? ` ${suffix}` : ''}
            </Text>
          )}
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={() => change(step)}
          activeOpacity={0.7}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Plus size={18} color={current >= max ? COLORS.divider : COLORS.primary} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 6,
  },
  required: {
    color: '#E5484D',
  },
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 44,
    gap: 8,
  },
  button: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },
  valueContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  value: {
    fontSize: 14,
    color: COLORS.textPrimary,
    fontWeight: '600',
  },
  placeholder: {
    color: COLORS.textMuted,
    fontWeight: '400',
  },
  inputWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    height: '100%',
    justifyContent: 'center',
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingHorizontal: 10,
    gap: 4,
  },
  input: {
    flex: 1,
    minWidth: 0,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textPrimary,
    padding: 0,
    maxWidth: 72,
  },
  suffix: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textMuted,
  },
});
