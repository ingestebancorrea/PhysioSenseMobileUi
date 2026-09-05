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
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChangeText,
  placeholder = 'Buscar...',
  onFilterPress,
  showFilterButton = true,
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
        style={styles.filterButton}
        activeOpacity={0.7}
        onPress={onFilterPress}
      >
        <SlidersHorizontal size={20} color={COLORS.textPrimary} />
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
  },
});