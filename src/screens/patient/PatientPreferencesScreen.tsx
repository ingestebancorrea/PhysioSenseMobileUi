import React, { useMemo, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Bell, ChevronLeft, Sun, Type } from 'lucide-react-native';

import { PreferenceRowItem } from '@/components/settings/PreferenceRowItem';
import {
  ThemePreferenceModal,
  type ThemeOption,
} from '@/components/settings/ThemePreferenceModal';
import {
  TextSizePreferenceModal,
  type TextSizeOption,
} from '@/components/settings/TextSizePreferenceModal';
import { COLORS } from '@/constants/theme';

const DESIGN_WIDTH = 390;
const PAGE_BACKGROUND = '#f1f4f8';
const SUBTITLE_COLOR = '#6B7280';

interface PatientPreferencesScreenProps {
  onBack?: () => void;
  onOpenNotifications?: () => void;
}

export const PatientPreferencesScreen: React.FC<
  PatientPreferencesScreenProps
> = ({ onBack, onOpenNotifications }) => {
  const { width } = useWindowDimensions();
  const scale = Math.min(Math.max(width / DESIGN_WIDTH, 0.8), 1);
  const styles = useMemo(() => createStyles(scale), [scale]);
  const insets = useSafeAreaInsets();

  const [themeModalVisible, setThemeModalVisible] = useState(false);
  const [textSizeModalVisible, setTextSizeModalVisible] = useState(false);
  const [themeValue, setThemeValue] = useState<ThemeOption>('light');
  const [textSizeValue, setTextSizeValue] = useState<TextSizeOption>('normal');

  const themeLabel = themeValue === 'light' ? 'Claro' : 'Oscuro';
  const textSizeLabel =
    textSizeValue === 'small'
      ? 'Pequeño'
      : textSizeValue === 'normal'
        ? 'Normal'
        : 'Grande';

  const openThemeModal = () => setThemeModalVisible(true);
  const openTextSizeModal = () => setTextSizeModalVisible(true);

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
          <Text style={styles.headerTitle}>Preferencias</Text>
        </View>
      </View>

      <View style={styles.headerSubtitleWrapper}>
        <Text style={styles.headerSubtitle}>
          Personaliza la apariencia de tu aplicación.
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + 24 * scale },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.itemWrapper}>
          <PreferenceRowItem
            icon={Sun}
            title="Tema de la aplicación"
            value={themeLabel}
            onPress={openThemeModal}
            accessory="chevron"
          />
        </View>

        <View style={styles.itemWrapper}>
          <PreferenceRowItem
            icon={Type}
            title="Tamaño de texto"
            value={textSizeLabel}
            onPress={openTextSizeModal}
            accessory="chevron"
          />
        </View>

        <View style={styles.itemWrapper}>
          <PreferenceRowItem
            icon={Bell}
            title="Notificaciones"
            value="Gestiona tus preferencias de notificaciones."
            onPress={onOpenNotifications}
            accessory="chevron"
          />
        </View>

        <ThemePreferenceModal
          visible={themeModalVisible}
          selected={themeValue}
          onClose={() => setThemeModalVisible(false)}
          onApply={value => {
            setThemeValue(value);
            setThemeModalVisible(false);
          }}
        />

        <TextSizePreferenceModal
          visible={textSizeModalVisible}
          selected={textSizeValue}
          onClose={() => setTextSizeModalVisible(false)}
          onApply={value => {
            setTextSizeValue(value);
            setTextSizeModalVisible(false);
          }}
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
      paddingHorizontal: 20 * scale,
      paddingTop: 4 * scale,
      paddingBottom: 8 * scale,
    },
    headerSubtitle: {
      fontSize: 13 * scale,
      color: SUBTITLE_COLOR,
      lineHeight: 18 * scale,
    },
    content: {
      paddingHorizontal: 20 * scale,
      paddingTop: 8 * scale,
      gap: 12 * scale,
    },
    itemWrapper: {
      borderRadius: 14 * scale,
    },
  });

export default PatientPreferencesScreen;