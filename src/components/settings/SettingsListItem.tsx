import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { COLORS } from '@/constants/theme';
import { ICONS, type IconName } from '@/constants/icons';
import type { SettingOption } from '@/types/settings';

const ICON_TONES: Record<string, { background: string; color: string }> = {
  user: { background: COLORS.violetSoft, color: COLORS.violet },
  bell: { background: '#FFF4E0', color: COLORS.warningAmber },
  settings: { background: COLORS.blueSoft, color: COLORS.blue },
  shieldCheck: { background: COLORS.primarySoft, color: COLORS.primary },
  monitor: { background: COLORS.successSoft, color: COLORS.success },
  lock: { background: COLORS.skyBlueSoft, color: COLORS.skyBlue },
};

interface SettingsListItemProps {
  option: SettingOption;
  showDivider?: boolean;
  onPress?: () => void;
}

export const SettingsListItem: React.FC<SettingsListItemProps> = ({
  option,
  showDivider = false,
  onPress,
}) => {
  const Icon = ICONS[option.iconName as IconName];
  const tone = ICON_TONES[option.iconName];

  return (
    <View>
      <TouchableOpacity
        style={styles.item}
        activeOpacity={0.7}
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={option.title}
      >
        {Icon && (
          <View style={[styles.iconContainer, { backgroundColor: tone?.background }]}>
            <Icon size={20} color={tone?.color ?? COLORS.primary} />
          </View>
        )}

        <View style={styles.info}>
          <Text style={styles.title}>{option.title}</Text>
          <Text style={styles.subtitle} numberOfLines={1}>
            {option.subtitle}
          </Text>
        </View>

        <ChevronRight size={20} color={COLORS.textMuted} />
      </TouchableOpacity>

      {showDivider && <View style={styles.divider} />}
    </View>
  );
};

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: {
    flex: 1,
    marginLeft: 14,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  subtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.divider,
    marginLeft: 70,
  },
});

export default SettingsListItem;