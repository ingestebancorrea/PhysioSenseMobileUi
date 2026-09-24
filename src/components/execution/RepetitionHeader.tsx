import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { COLORS } from '@/constants/theme';

interface RepetitionHeaderProps {
  currentRepetition: number;
  totalRepetitions: number;
}

export const RepetitionHeader: React.FC<RepetitionHeaderProps> = ({
  currentRepetition,
  totalRepetitions,
}) => (
  <View style={styles.container}>
    <Text style={styles.label}>Repetición</Text>
    <View style={styles.badge}>
      <Text style={styles.badgeText}>
        {currentRepetition} / {totalRepetitions}
      </Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  badge: {
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 12,
    backgroundColor: COLORS.primarySoft,
  },
  badgeText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.primary,
  },
});
