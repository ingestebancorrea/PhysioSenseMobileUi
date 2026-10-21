import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ICONS, type IconName } from '@/constants/icons';
import { CARD, COLORS } from '@/constants/theme';

interface DeviceMetricCardProps {
  icon: IconName;
  label: string;
  value: string;
  tone?: 'default' | 'success' | 'error';
}

export const DeviceMetricCard: React.FC<DeviceMetricCardProps> = ({
  icon,
  label,
  value,
  tone = 'default',
}) => {
  const Icon = ICONS[icon];
  const isError = tone === 'error';
  const isSuccess = tone === 'success';

  const iconColor = isError
    ? COLORS.danger
    : isSuccess
      ? COLORS.success
      : COLORS.primary;

  return (
    <View style={[CARD, styles.card]}>
      <View
        style={[
          styles.iconContainer,
          isError && styles.iconContainerError,
          isSuccess && styles.iconContainerSuccess,
        ]}
      >
        <Icon size={20} color={iconColor} />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.label}>{label}</Text>
        <Text
          style={[
            styles.value,
            isError && styles.valueError,
            isSuccess && styles.valueSuccess,
          ]}
        >
          {value}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: COLORS.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainerError: {
    backgroundColor: COLORS.dangerSoft,
  },
  iconContainerSuccess: {
    backgroundColor: COLORS.successSoft,
  },
  textContainer: {
    flex: 1,
    marginLeft: 12,
  },
  label: {
    fontSize: 13,
    color: COLORS.textMuted,
  },
  value: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginTop: 2,
  },
  valueError: {
    color: COLORS.danger,
  },
  valueSuccess: {
    color: COLORS.success,
  },
});
