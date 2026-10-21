import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { COLORS } from '@/constants/theme';

const STEPS = [
  { number: 1, label: 'Información' },
  { number: 2, label: 'Requisitos' },
  { number: 3, label: 'Revisión' },
];

interface StepIndicatorProps {
  currentStep: number;
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep }) => (
  <View style={styles.container}>
    {STEPS.map((step, index) => {
      const isActive = currentStep >= step.number;

      return (
        <React.Fragment key={step.number}>
          <View style={styles.stepItem}>
            <View style={[styles.stepBadge, isActive && styles.stepBadgeActive]}>
              <Text style={[styles.stepBadgeText, isActive && styles.stepBadgeTextActive]}>
                {step.number}
              </Text>
            </View>
            <Text style={[styles.stepLabel, isActive && styles.stepLabelActive]} numberOfLines={1}>
              {step.label}
            </Text>
          </View>

          {index < STEPS.length - 1 && (
            <View
              style={[styles.stepDivider, currentStep > step.number && styles.stepDividerActive]}
            />
          )}
        </React.Fragment>
      );
    })}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F1F5',
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexShrink: 1,
  },
  stepBadge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#EBECEF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepBadgeActive: {
    backgroundColor: COLORS.primary,
  },
  stepBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#6B7280',
  },
  stepBadgeTextActive: {
    color: '#FFFFFF',
  },
  stepLabel: {
    fontSize: 12,
    color: '#8E94A0',
    fontWeight: '500',
    flexShrink: 1,
  },
  stepLabelActive: {
    color: COLORS.primary,
    fontWeight: '700',
  },
  stepDivider: {
    width: 24,
    height: 1,
    backgroundColor: '#EBECEF',
    marginHorizontal: 8,
    flexShrink: 0,
  },
  stepDividerActive: {
    backgroundColor: COLORS.primary,
  },
});