import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LayoutGrid } from 'lucide-react-native';
import { COLORS } from '@/constants/theme';

interface PlaceholderScreenProps {
  title: string;
  message?: string;
}

export const PlaceholderScreen: React.FC<PlaceholderScreenProps> = ({
  title,
  message = 'Esta pantalla estará disponible próximamente',
}) => (
  <SafeAreaView edges={['top']} style={styles.safeArea}>
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <LayoutGrid size={28} color={COLORS.violet} />
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
    </View>
  </SafeAreaView>
);

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.backgroundMuted,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: COLORS.violetSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  message: {
    fontSize: 14,
    color: COLORS.textSubtitle,
    textAlign: 'center',
    marginTop: 8,
  },
});
