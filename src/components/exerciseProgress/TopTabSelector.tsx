import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { COLORS } from '@/constants/theme';
import type { ProgressTab } from '@/types/exerciseProgress';

interface TopTabSelectorProps {
  activeTab: ProgressTab;
  onChange: (tab: ProgressTab) => void;
}

const TABS: ProgressTab[] = ['Resumen', 'Detalle'];

export const TopTabSelector: React.FC<TopTabSelectorProps> = ({
  activeTab,
  onChange,
}) => (
  <View style={styles.container}>
    {TABS.map(tab => {
      const selected = tab === activeTab;
      return (
        <TouchableOpacity
          key={tab}
          style={[styles.tab, selected && styles.tabSelected]}
          activeOpacity={0.7}
          onPress={() => onChange(tab)}
          accessibilityRole="tab"
          accessibilityState={{ selected }}
        >
          <Text style={[styles.tabText, selected && styles.tabTextSelected]}>
            {tab}
          </Text>
        </TouchableOpacity>
      );
    })}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabSelected: {
    borderBottomColor: COLORS.primary,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  tabTextSelected: {
    fontWeight: '700',
    color: COLORS.primary,
  },
});