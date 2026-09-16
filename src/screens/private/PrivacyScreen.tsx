import React, { useMemo } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, Lock } from 'lucide-react-native';

import { InfoBanner } from '@/components/settings/InfoBanner';
import { PreferenceRowItem } from '@/components/settings/PreferenceRowItem';
import { PRIVACY_OPTIONS } from '@/mock/settingsData';
import { ICONS, type IconName } from '@/constants/icons';
import { COLORS } from '@/constants/theme';
import type { PrivacyOption } from '@/types/settings';

const DESIGN_WIDTH = 390;
const PAGE_BACKGROUND = '#f1f4f8';
const SUBTITLE_COLOR = '#6B7280';

interface PrivacyScreenProps {
  onBack?: () => void;
}

export const PrivacyScreen: React.FC<PrivacyScreenProps> = ({ onBack }) => {
  const { width } = useWindowDimensions();
  const scale = Math.min(Math.max(width / DESIGN_WIDTH, 0.8), 1);
  const styles = useMemo(() => createStyles(scale), [scale]);

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          activeOpacity={0.8}
          onPress={onBack}
          accessibilityRole="button"
          accessibilityLabel="Volver"
        >
          <ChevronLeft size={24} color={COLORS.textStrong} />
        </TouchableOpacity>

        <View style={styles.headerText}>
          <Text style={styles.headerTitle}>Privacidad</Text>
        </View>
      </View>

      <View style={styles.headerSubtitleWrapper}>
        <Text style={styles.headerSubtitle}>
          Controla cómo se usa y se protege tu información personal.
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {PRIVACY_OPTIONS.map((option: PrivacyOption) => {
          const Icon = ICONS[option.iconName as IconName];

          return (
            <View key={option.id} style={styles.itemWrapper}>
              <PreferenceRowItem
                icon={Icon}
                title={option.title}
                value={option.subtitle}
              />
            </View>
          );
        })}

        <InfoBanner
          icon={Lock}
          title="Tu privacidad es importante"
          description="Nos comprometemos a proteger tus datos personales y darte el control sobre ellos."
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const createStyles = (scale: number) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: PAGE_BACKGROUND,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 20 * scale,
      paddingVertical: 14 * scale,
    },
    backButton: {
      position: 'absolute',
      left: 20 * scale,
      width: 44 * scale,
      height: 44 * scale,
      borderRadius: 14 * scale,
      backgroundColor: COLORS.surface,
      borderWidth: 1,
      borderColor: COLORS.dividerLight,
      alignItems: 'center',
      justifyContent: 'center',
    },
    headerText: {
      alignItems: 'center',
      marginHorizontal: 56 * scale,
    },
    headerTitle: {
      fontSize: 22 * scale,
      fontWeight: '700',
      color: COLORS.textStrong,
    },
    headerSubtitleWrapper: {
      width: `${70 * scale}%`,
      alignSelf: 'baseline',
      paddingHorizontal: 30 * scale,
      paddingVertical: 10 * scale,
    },
    headerSubtitle: {
      fontSize: 13 * scale,
      color: SUBTITLE_COLOR,
      marginTop: 4 * scale,
      lineHeight: 18 * scale,
    },
    content: {
      flexGrow: 1,
      paddingHorizontal: 20 * scale,
      paddingTop: 8 * scale,
      paddingBottom: 32 * scale,
      gap: 12 * scale,
    },
    itemWrapper: {
      flex: 1,
      borderRadius: 14 * scale,
    },
  });

export default PrivacyScreen;