import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { COLORS, CARD } from '@/constants/theme';
import type { ExerciseGuideStep } from '@/types/exerciseGuide';
import { GuideStepItem } from './GuideStepItem';

interface GuideStepsCardProps {
  title?: string;
  steps: ExerciseGuideStep[];
  emptyMessage?: string;
}

export const GuideStepsCard: React.FC<GuideStepsCardProps> = ({
  title = 'Cómo realizarlo',
  steps,
  emptyMessage = 'Aún no se agregaron instrucciones.',
}) => (
  <View style={[CARD, styles.card]}>
    <Text style={styles.title}>{title}</Text>
    {steps.length > 0 ? (
      <View style={styles.steps}>
        {steps.map((step, index) => (
          <GuideStepItem
            key={step.id}
            stepNumber={index + 1}
            title={step.title}
            description={step.description}
            imageUri={step.imageUri}
          />
        ))}
      </View>
    ) : (
      <Text style={styles.empty}>{emptyMessage}</Text>
    )}
  </View>
);

const styles = StyleSheet.create({
  card: {
    gap: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  steps: {
    gap: 4,
  },
  empty: {
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.textSecondary,
  },
});