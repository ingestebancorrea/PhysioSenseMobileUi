import React, { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { COLORS } from '@/constants/theme';
import type { TherapistStat } from '@/types/therapistDashboard';

interface StatCardProps {
  stat: TherapistStat;
}

export const StatCard = memo(({ stat }: StatCardProps) => (
  <View style={styles.card}>
    <Text style={styles.value}>{stat.value}</Text>
    <Text style={styles.label} numberOfLines={2}>
      {stat.label}
    </Text>
  </View>
));

const styles = StyleSheet.create({
  card: {
    width: 140,
    backgroundColor: COLORS.violetSoft,
    borderRadius: 16,
    padding: 16,
    justifyContent: 'center',
  },
  value: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.violet,
  },
  label: {
    fontSize: 13,
    color: COLORS.textSubtitle,
    marginTop: 6,
  },
});
