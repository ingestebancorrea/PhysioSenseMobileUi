import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COLORS } from '@/constants/theme';

interface SectionHeaderProps {
  title: string;
  link?: string;
  onLinkPress?: () => void;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  link,
  onLinkPress,
}) => {
  const isLinkEnabled = link !== undefined && onLinkPress !== undefined;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {link !== undefined && (
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={onLinkPress}
          disabled={!isLinkEnabled}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Text style={[styles.link, !isLinkEnabled && styles.linkDisabled]}>{link}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 24,
    marginBottom: 12,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  link: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary,
  },
  linkDisabled: {
    opacity: 0.5,
  },
});
