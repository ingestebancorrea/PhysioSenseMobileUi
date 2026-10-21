import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ChevronDown, X, type LucideIcon } from 'lucide-react-native';
import { COLORS } from '@/constants/theme';

export interface PickerFieldProps {
  label: string;
  /** Texto principal de la selección (nombre del paciente / título de la sesión). */
  value?: string;
  /** Texto secundario de la selección (ID, fecha, estado...). */
  subtitle?: string;
  placeholder: string;
  onPress: () => void;
  onClear?: () => void;
  icon?: LucideIcon;
  required?: boolean;
}

/**
 * Campo de formulario que abre un selector (bottom sheet) en vez de aceptar
 * texto libre. Muestra la selección actual y permite limpiarla.
 */
export const PickerField: React.FC<PickerFieldProps> = ({
  label,
  value,
  subtitle,
  placeholder,
  onPress,
  onClear,
  icon: Icon,
  required = false,
}) => (
  <View style={styles.container}>
    <Text style={styles.label}>
      {label}
      {required ? <Text style={styles.requiredAsterisk}> *</Text> : null}
    </Text>

    <TouchableOpacity
      style={styles.wrapper}
      activeOpacity={0.7}
      onPress={onPress}
    >
      {Icon ? (
        <View style={styles.leftIcon}>
          <Icon size={20} color={COLORS.textMuted} strokeWidth={2} />
        </View>
      ) : null}

      <View style={styles.valueContainer}>
        <Text
          style={[styles.value, !value ? styles.placeholder : null]}
          numberOfLines={1}
        >
          {value || placeholder}
        </Text>
        {value && subtitle ? (
          <Text style={styles.subtitle} numberOfLines={1}>
            {subtitle}
          </Text>
        ) : null}
      </View>

      {value && onClear ? (
        <TouchableOpacity
          onPress={onClear}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          style={styles.clearButton}
          accessibilityLabel="Quitar selección"
        >
          <X size={16} color={COLORS.textMuted} strokeWidth={2.4} />
        </TouchableOpacity>
      ) : null}

      <View style={styles.rightIcon}>
        <ChevronDown size={20} color={COLORS.textMuted} strokeWidth={2} />
      </View>
    </TouchableOpacity>
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
  requiredAsterisk: {
    color: COLORS.danger,
  },
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 52,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
    paddingRight: 14,
  },
  leftIcon: {
    paddingLeft: 16,
  },
  valueContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  value: {
    fontSize: 15,
    color: COLORS.textPrimary,
  },
  placeholder: {
    color: COLORS.textMuted,
  },
  subtitle: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  clearButton: {
    paddingHorizontal: 6,
  },
  rightIcon: {
    paddingLeft: 6,
  },
});
