import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ICONS } from '@/constants/icons';
import { COLORS } from '@/constants/theme';

interface TipCardProps {
  title?: string;
  description?: string;
}

export const TipCard: React.FC<TipCardProps> = ({
  title = 'Consejo',
  description = 'Realiza el movimiento de forma lenta y controlada.',
}) => {
  const LightbulbIcon = ICONS.lightbulb;

  return (
    <View style={styles.card}>
      <View style={styles.iconContainer}>
        <LightbulbIcon size={20} color={COLORS.primary} />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cardSoft,
    borderRadius: 16,
    padding: 26,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: COLORS.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    flex: 1,
    marginLeft: 12,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  description: {
    fontSize: 13,
    lineHeight: 19,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
});
