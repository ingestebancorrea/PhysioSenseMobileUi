import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { LucideIcon } from 'lucide-react-native';

import { ICONS } from '@/constants/icons';
import { COLORS } from '@/constants/theme';

interface RecommendationCardProps {
  qualityScore: number;
}

interface CardConfig {
  title: string;
  message: string;
  backgroundColor: string;
  accentColor: string;
  circleBg: string;
  IconComponent: LucideIcon;
}

const getCardConfig = (qualityScore: number): CardConfig => {
  if (qualityScore >= 85) {
    return {
      title: '¡Buen trabajo!',
      message: 'Tu desempeño fue excelente. Sigue así con tu rutina.',
      backgroundColor: '#E8F8EE',
      accentColor: COLORS.success,
      circleBg: '#D1F2DD',
      IconComponent: ICONS.circleCheck,
    };
  }

  if (qualityScore >= 70) {
    return {
      title: 'Sugerencia',
      message: 'Intenta aumentar lentamente el rango de movimiento.',
      backgroundColor: '#F0EDFF',
      accentColor: COLORS.primary,
      circleBg: '#E1D9FF',
      IconComponent: ICONS.triangleAlert,
    };
  }

  return {
    title: 'Importante',
    message: 'No olvides realizar los ejercicios de estiramiento y descansar.',
    backgroundColor: '#EBF3FF',
    accentColor: COLORS.blue,
    circleBg: '#D6E6FF',
    IconComponent: ICONS.clock,
  };
};

export const RecommendationCard: React.FC<RecommendationCardProps> = ({
  qualityScore,
}) => {
  const config = getCardConfig(qualityScore);
  const Icon = config.IconComponent;

  return (
    <View style={[styles.cardContainer, { backgroundColor: config.backgroundColor }]}>
      <View style={[styles.iconCircle, { backgroundColor: config.circleBg }]}>
        <Icon color={config.accentColor} size={26} />
      </View>

      <View style={styles.textContainer}>
        <Text style={[styles.title, { color: config.accentColor }]}>
          {config.title}
        </Text>
        <Text style={styles.message}>{config.message}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 36,
    borderRadius: 16,
    marginBottom: 20,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 4,
  },
  message: {
    fontSize: 12,
    lineHeight: 18,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
});