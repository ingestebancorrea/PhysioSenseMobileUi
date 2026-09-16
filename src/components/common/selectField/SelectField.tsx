// src/components/common/selectField/SelectField.tsx
import React, { useState } from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Check, ChevronDown, type LucideIcon } from 'lucide-react-native';

import { COLORS } from '@/constants/theme';

export interface SelectFieldProps {
  label: string;
  value: string;
  onSelect: (value: string) => void;
  options: string[];
  icon?: LucideIcon;
  placeholder?: string;
}

export const SelectField: React.FC<SelectFieldProps> = ({
  label,
  value,
  onSelect,
  options,
  icon: Icon,
  placeholder,
}) => {
  const [open, setOpen] = useState(false);

  const handleSelect = (option: string) => {
    onSelect(option);
    setOpen(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity
        style={styles.wrapper}
        activeOpacity={0.7}
        onPress={() => setOpen(true)}
      >
        {Icon && (
          <View style={styles.leftIcon}>
            <Icon size={20} color={COLORS.textMuted} strokeWidth={2} />
          </View>
        )}
        <Text
          style={[
            styles.value,
            Icon && styles.valueWithIcon,
            !value && styles.placeholder,
          ]}
          numberOfLines={1}
        >
          {value || placeholder || 'Selecciona una opción'}
        </Text>
        <View style={styles.rightIcon}>
          <ChevronDown size={20} color={COLORS.textMuted} strokeWidth={2} />
        </View>
      </TouchableOpacity>

      <Modal
        visible={open}
        transparent
        animationType="fade"
        onRequestClose={() => setOpen(false)}
      >
        <Pressable style={styles.backdrop} onPress={() => setOpen(false)}>
          <Pressable style={styles.sheet}>
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>{label}</Text>
              <TouchableOpacity
                onPress={() => setOpen(false)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Text style={styles.closeText}>Cerrar</Text>
              </TouchableOpacity>
            </View>
            {options.map(option => {
              const selected = option === value;
              return (
                <TouchableOpacity
                  key={option}
                  style={[styles.option, selected && styles.optionSelected]}
                  activeOpacity={0.7}
                  onPress={() => handleSelect(option)}
                >
                  <Text
                    style={[
                      styles.optionText,
                      selected && styles.optionTextSelected,
                    ]}
                  >
                    {option}
                  </Text>
                  {selected && <Check size={20} color={COLORS.primary} />}
                </TouchableOpacity>
              );
            })}
          </Pressable>
        </Pressable>
      </Modal>
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
  leftIcon: {
    paddingLeft: 16,
  },
  value: {
    flex: 1,
    paddingHorizontal: 16,
    fontSize: 15,
    color: COLORS.textPrimary,
  },
  valueWithIcon: {
    paddingLeft: 10,
  },
  placeholder: {
    color: COLORS.textMuted,
  },
  rightIcon: {
    paddingHorizontal: 14,
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    paddingBottom: 34,
    paddingHorizontal: 20,
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  sheetTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  closeText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 8,
    borderRadius: 10,
  },
  optionSelected: {
    backgroundColor: COLORS.primarySoft,
  },
  optionText: {
    fontSize: 16,
    color: COLORS.textPrimary,
  },
  optionTextSelected: {
    color: COLORS.primaryDark,
    fontWeight: '600',
  },
});
