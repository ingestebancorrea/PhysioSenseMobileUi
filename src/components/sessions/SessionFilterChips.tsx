import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COLORS } from '@/constants/theme';

type FilterTab = 'Todas' | 'Activas' | 'Completadas' | 'Borradores';

interface SessionFilterChipsProps {
  activeFilter: FilterTab;
  counts: Record<FilterTab, number>;
  onFilterChange: (filter: FilterTab) => void;
}

const FILTERS: FilterTab[] = ['Todas', 'Activas', 'Completadas', 'Borradores'];

export const SessionFilterChips: React.FC<SessionFilterChipsProps> = ({
  activeFilter,
  counts,
  onFilterChange,
}) => (
  <View style={styles.container}>
    {FILTERS.map(filter => {
      const isActive = filter === activeFilter;
      return (
        <TouchableOpacity
          key={filter}
          style={[styles.chip, isActive && styles.chipActive]}
          activeOpacity={0.7}
          onPress={() => onFilterChange(filter)}
        >
          <Text style={[styles.chipText, isActive && styles.chipTextActive]}>
            {filter} ({counts[filter]})
          </Text>
        </TouchableOpacity>
      );
    })}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 8,
  },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: COLORS.progressTrack,
  },
  chipActive: {
    backgroundColor: COLORS.violet,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  chipTextActive: {
    color: COLORS.white,
  },
});
