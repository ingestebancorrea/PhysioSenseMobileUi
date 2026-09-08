import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { LucideIcon } from 'lucide-react-native';
import { ICONS } from '@/constants/icons';
import { COLORS, CARD } from '@/constants/theme';

interface TargetMusclesCardProps {
  muscles: string[];
  muscleIcons?: Record<string, LucideIcon>;
}

export const TargetMusclesCard: React.FC<TargetMusclesCardProps> = ({
  muscles,
  muscleIcons,
}) => {
  const ActivityIcon = ICONS.activity;

  return (
    <View style={[CARD, styles.card]}>
      <Text style={styles.title}>Músculos objetivo</Text>

      <View style={styles.list}>
        {muscles.map(muscle => {
          const MuscleIcon = muscleIcons?.[muscle] ?? ActivityIcon;
          return (
            <View key={muscle} style={styles.row}>
              <View style={styles.iconCircle}>
                <MuscleIcon size={18} color={COLORS.primary} />
              </View>
              <Text style={styles.muscleName}>{muscle}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    gap: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  list: {
    gap: 14,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: COLORS.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  muscleName: {
    flex: 1,
    fontSize: 13,
    fontWeight: '500',
    color: COLORS.textSecondary,
  },
});
