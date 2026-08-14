import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ICONS } from '@/constants/icons';
import { COLORS } from '@/constants/theme';

interface DateRangeHeaderProps {
  dateRange: string;
  onPrevious?: () => void;
  onNext?: () => void;
}

export const DateRangeHeader: React.FC<DateRangeHeaderProps> = ({
  dateRange,
  onPrevious,
  onNext,
}) => {
  const ChevronLeftIcon = ICONS.chevronLeft;
  const ChevronRightIcon = ICONS.chevronRight;

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.arrowButton}
        activeOpacity={0.7}
        onPress={onPrevious}
      >
        <ChevronLeftIcon size={20} color={COLORS.textSecondary} />
      </TouchableOpacity>
      <Text style={styles.dateRange}>{dateRange}</Text>
      <TouchableOpacity
        style={styles.arrowButton}
        activeOpacity={0.7}
        onPress={onNext}
      >
        <ChevronRightIcon size={20} color={COLORS.textSecondary} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  arrowButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.progressTrack,
  },
  dateRange: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.textPrimary,
    textAlign: 'center',
  },
});
