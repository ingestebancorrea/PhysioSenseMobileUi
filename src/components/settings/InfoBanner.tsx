import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { LucideIcon } from 'lucide-react-native';
import { COLORS } from '@/constants/theme';

interface InfoBannerProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

export const InfoBanner: React.FC<InfoBannerProps> = ({
  icon: Icon,
  title,
  description,
}) => (
  <View style={styles.banner}>
    <View style={styles.iconContainer}>
      <Icon size={26} color={COLORS.primaryViolet} />
    </View>

    <View style={styles.texts}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primaryVioletSoft,
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 18,
    gap: 14,
  },
  iconContainer: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  texts: {
    flex: 1,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.primaryViolet,
  },
  description: {
    fontSize: 13,
    color: COLORS.textNeutral,
    marginTop: 4,
    lineHeight: 18,
  },
});

export default InfoBanner;