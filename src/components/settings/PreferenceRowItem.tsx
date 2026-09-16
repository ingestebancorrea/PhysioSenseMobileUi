import React from 'react';
import { StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { ChevronRight, type LucideIcon } from 'lucide-react-native';
import { COLORS } from '@/constants/theme';

interface PreferenceRowItemProps {
  icon: LucideIcon;
  title: string;
  value: string;
  onPress?: () => void;
  accessory?: 'chevron' | 'switch';
  switchValue?: boolean;
  onSwitchChange?: (value: boolean) => void;
}

export const PreferenceRowItem: React.FC<PreferenceRowItemProps> = ({
  icon: Icon,
  title,
  value,
  onPress,
  accessory = 'chevron',
  switchValue = false,
  onSwitchChange,
}) => (
  <TouchableOpacity
    style={styles.card}
    activeOpacity={0.7}
    onPress={onPress}
    accessibilityRole="button"
    accessibilityLabel={title}
  >
    <View style={styles.item}>
      <View style={styles.iconContainer}>
        <Icon size={24} color={COLORS.primaryViolet} />
      </View>

      <View style={styles.texts}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>

        <Text style={styles.description} numberOfLines={2}>
          {value}
        </Text>
      </View>

      {accessory === 'switch' ? (
        <Switch
          value={switchValue}
          onValueChange={onSwitchChange}
          disabled={!onSwitchChange}
          trackColor={{ false: COLORS.switchOff, true: COLORS.primaryViolet }}
          thumbColor={COLORS.background}
        />
      ) : (
        <ChevronRight size={22} color={COLORS.textMuted} />
      )}
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 18,
    borderWidth: 1,
    borderColor:'#f7f8fa1b',
    shadowColor: '#f7f8fa1b',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 13,
  },
  iconContainer: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: COLORS.primaryVioletSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  texts: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textStrong,
  },
  description: {
    fontSize: 13,
    color: COLORS.textMuted,
    marginTop: 8,
    lineHeight: 18,
  },
});

export default PreferenceRowItem;