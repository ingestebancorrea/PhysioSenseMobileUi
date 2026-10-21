import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COLORS } from '@/constants/theme';
import type { ProgressPeriod } from '@/types/progress';

const PERIODS: ProgressPeriod[] = ['Día', 'Semana', 'Mes', 'Año'];

interface PeriodSelectorTabsProps {
  selected: ProgressPeriod;
  onSelect: (period: ProgressPeriod) => void;
}

export const PeriodSelectorTabs: React.FC<PeriodSelectorTabsProps> = ({
  selected,
  onSelect,
}) => (
  <ScrollView
    showsHorizontalScrollIndicator={false}
    contentContainerStyle={styles.container}
  >
    {PERIODS.map(period => {
      const isActive = period === selected;

      return (
        <TouchableOpacity
          key={period}
          style={styles.tab}
          activeOpacity={0.7}
          onPress={() => onSelect(period)}
        >
          <Text style={[styles.label, isActive && styles.labelActive]}>
            {period}
          </Text>
          <View style={[styles.indicator, isActive && styles.indicatorActive]} />
        </TouchableOpacity>
      );
    })}
  </ScrollView>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    columnGap: 16,
  },
  tab: {
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  labelActive: {
    color: COLORS.primary,
    fontWeight: '700',
  },
  indicator: {
    width: 24,
    height: 3,
    borderRadius: 2,
    marginTop: 6,
    backgroundColor: 'transparent',
  },
  indicatorActive: {
    backgroundColor: COLORS.primary,
  },
});
