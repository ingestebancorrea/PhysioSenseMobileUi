import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { COLORS } from '@/constants/theme';

interface WelcomeBannerProps {
  firstName: string;
}

export const WelcomeBanner: React.FC<WelcomeBannerProps> = ({ firstName }) => (
  <LinearGradient
    colors={[COLORS.primary, COLORS.primaryDark]}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 1 }}
    style={styles.banner}
  >
    <View style={styles.avatar}>
      <Text style={styles.avatarText}>{firstName.charAt(0)}</Text>
    </View>
    <View style={styles.bannerTexts}>
      <Text style={styles.bannerTitle}>Hola, {firstName}</Text>
      <Text style={styles.bannerSubtitle}>¡Vamos por tu recuperación!</Text>
    </View>
  </LinearGradient>
);

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    padding: 40,
    marginTop: 8,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 4,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.whiteOverlay,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.white,
  },
  bannerTexts: {
    flex: 1,
    marginLeft: 14,
  },
  bannerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.white,
  },
  bannerSubtitle: {
    fontSize: 13,
    color: COLORS.whiteSoft,
    marginTop: 4,
  },
});
