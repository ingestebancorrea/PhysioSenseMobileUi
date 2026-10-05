import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ICONS } from '@/constants/icons';
import { COLORS } from '@/constants/theme';

interface DateRangeHeaderProps {
  dateRange: string;
  onPrevious?: () => void;
  onNext?: () => void;
  canGoPrevious?: boolean;
  canGoNext?: boolean;
}

export const DateRangeHeader: React.FC<DateRangeHeaderProps> = ({
  dateRange,
  onPrevious,
  onNext,
  canGoPrevious = true,
  canGoNext = true,
}) => {
  const ChevronLeftIcon = ICONS.chevronLeft;
  const ChevronRightIcon = ICONS.chevronRight;

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.arrowButton, !canGoPrevious && styles.arrowButtonDisabled]}
        activeOpacity={0.7}
        disabled={!canGoPrevious}
        onPress={onPrevious}
      >
        <ChevronLeftIcon
          size={20}
          color={
            canGoPrevious ? COLORS.textSecondary : COLORS.textMuted
          }
        />
      </TouchableOpacity>
      <Text style={styles.dateRange}>{dateRange}</Text>
      <TouchableOpacity
        style={[styles.arrowButton, !canGoNext && styles.arrowButtonDisabled]}
        activeOpacity={0.7}
        disabled={!canGoNext}
        onPress={onNext}
      >
        <ChevronRightIcon
          size={20}
          color={canGoNext ? COLORS.textSecondary : COLORS.textMuted}
        />
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
  arrowButtonDisabled: {
    opacity: 0.4,
  },
  dateRange: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.textPrimary,
    textAlign: 'center',
  },
});
