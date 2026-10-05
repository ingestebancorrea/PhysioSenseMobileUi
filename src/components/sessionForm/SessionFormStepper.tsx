import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { COLORS } from '@/constants/theme';

const STEPS = [
  { number: 1, label: 'Información' },
  { number: 2, label: 'Ejercicios' },
  { number: 3, label: 'Revisión' },
];

interface SessionFormStepperProps {
  currentStep: number;
}

export const SessionFormStepper: React.FC<SessionFormStepperProps> = ({
  currentStep,
}) => (
  <View style={styles.container}>
    {STEPS.map((step, index) => {
      const isActive = currentStep >= step.number;
      const isCurrent = currentStep === step.number;

      return (
        <React.Fragment key={step.number}>
          <View style={styles.stepItem}>
            <View style={[styles.circle, isActive && styles.circleActive]}>
              <Text style={[styles.number, isActive && styles.numberActive]}>
                {step.number}
              </Text>
            </View>
            <Text
              style={[styles.label, isCurrent && styles.labelActive]}
              numberOfLines={1}
            >
              {step.label}
            </Text>
          </View>

          {index < STEPS.length - 1 && (
            <View style={[styles.line, currentStep > index && styles.lineActive]} />
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
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F1F5',
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexShrink: 1,
  },
  circle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#EBECEF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleActive: {
    backgroundColor: COLORS.primary,
  },
  number: {
    fontSize: 12,
    fontWeight: '700',
    color: '#8E94A0',
  },
  numberActive: {
    color: '#FFFFFF',
  },
  label: {
    fontSize: 13,
    color: '#8E94A0',
    fontWeight: '500',
    flexShrink: 1,
  },
  labelActive: {
    color: COLORS.primary,
    fontWeight: '700',
  },
  line: {
    width: 24,
    height: 2,
    backgroundColor: '#EBECEF',
    marginHorizontal: 8,
    flexShrink: 0,
  },
  lineActive: {
    backgroundColor: COLORS.primary,
  },
});
