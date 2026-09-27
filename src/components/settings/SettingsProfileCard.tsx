import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { COLORS } from '@/constants/theme';
import { getInitials } from '@/utils/helpers/nameInitials';
import type { TherapistProfile } from '@/types/settings';

interface SettingsProfileCardProps {
  profile: TherapistProfile;
  onPress?: () => void;
}

export const SettingsProfileCard: React.FC<SettingsProfileCardProps> = ({
  profile,
  onPress,
}) => {
  const { name, role, avatarUrl } = profile;

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.85}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Perfil de ${name}`}
    >
      {avatarUrl ? (
        <Image source={{ uri: avatarUrl }} style={styles.avatar} />
      ) : (
        <View style={styles.avatar}>
          <Text style={styles.avatarInitials}>{getInitials(name)}</Text>
        </View>
      )}

      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>
          {name}
        </Text>
        <View style={styles.roleBadge}>
          <Text style={styles.roleBadgeText}>{role}</Text>
        </View>
      </View>

      <ChevronRight size={22} color={COLORS.textMuted} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 18,
    padding: 16,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitials: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.primary,
  },
  info: {
    flex: 1,
    marginHorizontal: 14,
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  roleBadge: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.primarySoft,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
    marginTop: 6,
  },
  roleBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.primary,
  },
});

export default SettingsProfileCard;