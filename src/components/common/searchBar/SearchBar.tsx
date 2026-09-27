import React from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { Search, SlidersHorizontal } from 'lucide-react-native';
import { COLORS } from '@/constants/theme';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onFilterPress?: () => void;
  showFilterButton?: boolean;
  filterActive?: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChangeText,
  placeholder = 'Buscar...',
  onFilterPress,
  showFilterButton = true,
  filterActive = false,
}) => (
  <View style={styles.row}>
    <View style={styles.searchInput}>
      <Search size={18} color={COLORS.textMuted} />
      <TextInput
        style={styles.searchText}
        placeholder={placeholder}
        placeholderTextColor={COLORS.textMuted}
        value={value}
        onChangeText={onChangeText}
      />
    </View>

    {showFilterButton && (
      <TouchableOpacity
        style={[
          styles.filterButton,
          filterActive && styles.filterButtonActive,
        ]}
        activeOpacity={0.7}
        onPress={onFilterPress}
      >
        <SlidersHorizontal
          size={20}
          color={filterActive ? COLORS.primary : COLORS.textPrimary}
        />
        {filterActive && <View style={styles.filterDot} />}
      </TouchableOpacity>
    )}
  </View>
);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 12,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    gap: 8,
  },
  searchText: {
    flex: 1,
    fontSize: 14,
    color: COLORS.textPrimary,
    padding: 0,
  },
  filterButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    position: 'relative',
  },
  filterButtonActive: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primarySoft,
  },
  filterDot: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: COLORS.white,
    backgroundColor: COLORS.primary,
  },
});