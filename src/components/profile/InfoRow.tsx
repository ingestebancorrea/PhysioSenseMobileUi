import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { COLORS } from '@/constants/theme';

interface InfoRowProps {
  label: string;
  value: string;
  highlightValue?: boolean;
  showDivider?: boolean;
  inline?: boolean;
}

export const InfoRow: React.FC<InfoRowProps> = ({
  label,
  value,
  highlightValue = false,
  showDivider = false,
  inline = false,
}) => (
  <View style={[styles.container, inline && styles.containerInline]}>
    <Text style={styles.label}>{label}</Text>
    <Text
      style={[
        styles.value,
        highlightValue && styles.valueHighlight,
        inline && styles.valueInline,
      ]}
      numberOfLines={2}
    >
      {value}
    </Text>
    {showDivider && <View style={styles.divider} />}
  </View>
);

const styles = StyleSheet.create({
  container: {
    paddingVertical: 13,
  },
  containerInline: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  label: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  value: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
    color: COLORS.textPrimary,
    marginTop: 4,
  },
  valueHighlight: {
    color: COLORS.primary,
    fontWeight: 'bold',
    marginTop: 0,
    textAlign: 'right',
  },
  valueInline: {
    marginTop: 0,
    textAlign: 'right',
    marginLeft: 16,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
});
