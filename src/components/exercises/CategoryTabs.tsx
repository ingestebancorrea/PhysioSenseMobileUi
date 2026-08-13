import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COLORS } from '@/constants/theme';
import type { ExerciseCategory } from '@/types/exercise';

const CATEGORIES: ExerciseCategory[] = ['Todos', 'Mano', 'Dedos', 'Muñeca'];

interface CategoryTabsProps {
  selected: ExerciseCategory;
  onSelect: (category: ExerciseCategory) => void;
}

export const CategoryTabs: React.FC<CategoryTabsProps> = ({ selected, onSelect }) => (
  <ScrollView
    showsHorizontalScrollIndicator={false}
    contentContainerStyle={styles.container}
  >
    {CATEGORIES.map(category => {
      const isActive = category === selected;

      return (
        <TouchableOpacity
          key={category}
          style={styles.tab}
          activeOpacity={0.7}
          onPress={() => onSelect(category)}
        >
          <Text style={[styles.label, isActive && styles.labelActive]}>{category}</Text>
          <View style={[styles.indicator, isActive && styles.indicatorActive]} />
        </TouchableOpacity>
      );
    })}
  </ScrollView>
);

const styles = StyleSheet.create({
  container: {
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
