import React, { useEffect, useMemo, useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import {
  Check,
  Moon,
  Sun,
  X,
  type LucideIcon,
} from 'lucide-react-native';

import { lightPalette } from '@/theme/palettes';
import { AppAlertModal } from '@/components/common/alertModal/AppAlertModal';

export type ThemeOption = 'light' | 'dark';

interface ThemePalette {
  background: string;
  surface: string;
  text: string;
  textMuted: string;
  divider: string;
  accent: string;
  accentSoft: string;
}

interface ThemeCardOption {
  key: ThemeOption;
  label: string;
  icon: LucideIcon;
  palette: ThemePalette;
}

const LIGHT_PALETTE: ThemePalette = {
  background: '#FFFFFF',
  surface: '#F1F4F8',
  text: '#1E1E2C',
  textMuted: '#8E8E93',
  divider: '#E2E8F0',
  accent: '#6C5CE7',
  accentSoft: '#EFEDFF',
};

const DARK_PALETTE: ThemePalette = {
  background: '#17181F',
  surface: '#24252E',
  text: '#F4F4F6',
  textMuted: '#9CA3AF',
  divider: '#33343D',
  accent: '#8B7CFF',
  accentSoft: '#2B2845',
};

const THEME_OPTIONS: ThemeCardOption[] = [
  { key: 'light', label: 'Claro', icon: Sun, palette: LIGHT_PALETTE },
  { key: 'dark', label: 'Oscuro', icon: Moon, palette: DARK_PALETTE },
];

interface ThemePreferenceModalProps {
  visible: boolean;
  selected: ThemeOption;
  onClose: () => void;
  onApply: (value: ThemeOption) => void;
}

const createModalStyles = (scale: (px: number) => number) =>
  StyleSheet.create({
    backdrop: {
      flex: 1,
      backgroundColor: lightPalette.blackOverlay,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: scale(24),
    },
    card: {
      width: '100%',
      maxWidth: 430,
      maxHeight: '84%',
      backgroundColor: lightPalette.surface,
      borderRadius: scale(24),
      paddingTop: scale(20),
      paddingBottom: scale(24),
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: 0.25,
      shadowRadius: 24,
      elevation: 12,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: scale(20),
      paddingBottom: scale(14),
    },
    headerText: {
      flex: 1,
      marginRight: scale(12),
    },
    headerTitle: {
      fontSize: scale(17),
      fontWeight: '700',
      color: lightPalette.textPrimary,
    },
    headerSubtitle: {
      fontSize: scale(13),
      color: lightPalette.textMuted,
      marginTop: scale(2),
    },
    closeButton: {
      width: scale(36),
      height: scale(36),
      borderRadius: scale(18),
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: lightPalette.surfaceSoft,
    },
    scroll: {
      flexGrow: 0,
      flexShrink: 1,
    },
    content: {
      paddingHorizontal: scale(20),
      paddingTop: scale(6),
      paddingBottom: scale(4),
    },
    optionsWrap: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: scale(12),
      justifyContent: 'center',
    },
    themeCard: {
      flexGrow: 1,
      flexBasis: '44%',
      minWidth: scale(130),
      backgroundColor: lightPalette.surfaceSoft,
      borderRadius: scale(16),
      borderWidth: 2,
      borderColor: 'transparent',
      padding: scale(8),
      paddingBottom: scale(12),
    },
    themeCardSelected: {
      borderColor: lightPalette.primary,
    },
    previewPhone: {
      borderRadius: scale(12),
      borderWidth: 1,
      padding: scale(10),
      gap: scale(6),
    },
    previewHeader: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    previewSpacer: {
      flex: 1,
    },
    previewHeaderIcon: {
      width: scale(18),
      height: scale(18),
      borderRadius: scale(9),
      alignItems: 'center',
      justifyContent: 'center',
    },
    previewHeaderIconDot: {
      width: scale(8),
      height: scale(8),
      borderRadius: scale(4),
    },
    previewBell: {
      width: scale(14),
      height: scale(14),
      borderRadius: scale(7),
    },
    previewGreeting: {
      borderRadius: scale(8),
      flexDirection: 'row',
      alignItems: 'center',
      gap: scale(6),
      padding: scale(8),
    },
    previewGreetingDot: {
      width: scale(16),
      height: scale(16),
      borderRadius: scale(8),
    },
    previewCard: {
      borderRadius: scale(8),
      flexDirection: 'row',
      alignItems: 'center',
      gap: scale(6),
      padding: scale(8),
    },
    previewCardIcon: {
      width: scale(22),
      height: scale(22),
      borderRadius: scale(6),
      alignItems: 'center',
      justifyContent: 'center',
    },
    previewCardIconBar: {
      width: scale(10),
      height: scale(10),
      borderRadius: scale(2),
    },
    previewBarStack: {
      flex: 1,
      gap: scale(4),
    },
    previewLine: {
      height: scale(4),
      borderRadius: scale(2),
      width: '75%',
    },
    previewLineShort: {
      height: scale(3),
      borderRadius: scale(1.5),
      width: '50%',
    },
    previewButton: {
      borderRadius: scale(8),
      alignItems: 'center',
      paddingVertical: scale(8),
    },
    previewButtonText: {
      height: scale(4),
      borderRadius: scale(2),
      width: '30%',
    },
    themeLabelRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: scale(10),
      paddingHorizontal: scale(2),
    },
    themeLabelLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: scale(6),
    },
    themeLabel: {
      fontSize: scale(14),
      fontWeight: '700',
      color: lightPalette.textPrimary,
    },
    radio: {
      width: scale(20),
      height: scale(20),
      borderRadius: scale(10),
      borderWidth: 2,
      borderColor: lightPalette.textMuted,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: lightPalette.surfaceSoft,
    },
    radioSelected: {
      borderColor: lightPalette.primary,
      backgroundColor: lightPalette.primary,
    },
    footer: {
      flexDirection: 'row',
      gap: scale(12),
      paddingHorizontal: scale(20),
      paddingTop: scale(14),
    },
    secondaryButton: {
      flex: 1,
      height: scale(50),
      borderRadius: scale(14),
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: lightPalette.surfaceSoft,
      borderWidth: 1,
      borderColor: lightPalette.border,
    },
    secondaryButtonText: {
      fontSize: scale(15),
      fontWeight: '600',
      color: lightPalette.textPrimary,
    },
    primaryButton: {
      flex: 1,
      height: scale(50),
      borderRadius: scale(14),
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: lightPalette.primary,
    },
    primaryButtonText: {
      fontSize: scale(15),
      fontWeight: '700',
      color: lightPalette.white,
    },
  });

const ThemePreview: React.FC<{ palette: ThemePalette }> = ({ palette }) => {
  const { width } = useWindowDimensions();
  const factor = Math.min(Math.max(width / 390, 0.8), 1.2);
  const styles = useMemo(() => createModalStyles(px => px * factor), [factor]);

  return (
    <View
      style={[
        styles.previewPhone,
        { backgroundColor: palette.background, borderColor: palette.divider },
      ]}
    >
      <View style={styles.previewHeader}>
        <View
          style={[
            styles.previewHeaderIcon,
            { backgroundColor: palette.accentSoft },
          ]}
        >
          <View
            style={[styles.previewHeaderIconDot, { backgroundColor: palette.accent }]}
          />
        </View>
        <View style={styles.previewSpacer} />
        <View style={[styles.previewBell, { backgroundColor: palette.divider }]} />
      </View>

      <View
        style={[
          styles.previewGreeting,
          { backgroundColor: palette.surface },
        ]}
      >
        <View style={[styles.previewGreetingDot, { backgroundColor: palette.accent }]} />
        <View style={styles.previewBarStack}>
          <View style={[styles.previewLine, { backgroundColor: palette.text }]} />
          <View
            style={[styles.previewLineShort, { backgroundColor: palette.textMuted }]}
          />
        </View>
      </View>

      <View
        style={[styles.previewCard, { backgroundColor: palette.surface }]}
      >
        <View
          style={[
            styles.previewCardIcon,
            { backgroundColor: palette.accentSoft },
          ]}
        >
          <View style={[styles.previewCardIconBar, { backgroundColor: palette.accent }]} />
        </View>
        <View style={styles.previewBarStack}>
          <View style={[styles.previewLine, { backgroundColor: palette.text }]} />
          <View
            style={[styles.previewLineShort, { backgroundColor: palette.textMuted }]}
          />
        </View>
      </View>

      <View style={[styles.previewButton, { backgroundColor: palette.accent }]}>
        <View
          style={[styles.previewButtonText, { backgroundColor: palette.background }]}
        />
      </View>
    </View>
  );
};

export const ThemePreferenceModal: React.FC<ThemePreferenceModalProps> = ({
  visible,
  selected,
  onClose,
  onApply,
}) => {
  const { width } = useWindowDimensions();
  const factor = Math.min(Math.max(width / 390, 0.8), 1.2);
  const styles = useMemo(() => createModalStyles(px => px * factor), [factor]);

  const [draft, setDraft] = useState<ThemeOption>(selected);
  const [noticeVisible, setNoticeVisible] = useState(false);

  useEffect(() => {
    if (visible) {
      setDraft(selected);
    }
  }, [visible, selected]);

  const handleApply = () => {
    onApply(draft);
    onClose();
    setNoticeVisible(true);
  };

  return (
    <>
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={styles.card} onPress={() => {}}>
          <View style={styles.header}>
            <View style={styles.headerText}>
              <Text style={styles.headerTitle}>Tema de la aplicación</Text>
              <Text style={styles.headerSubtitle}>
                Elige el estilo visual de la aplicación.
              </Text>
            </View>
            <TouchableOpacity
              style={styles.closeButton}
              activeOpacity={0.7}
              onPress={onClose}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <X size={22} color={lightPalette.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
            bounces={false}
          >
            <View style={styles.optionsWrap}>
              {THEME_OPTIONS.map(option => {
                const Icon = option.icon;
                const isSelected = draft === option.key;

                return (
                  <TouchableOpacity
                    key={option.key}
                    style={[
                      styles.themeCard,
                      isSelected && styles.themeCardSelected,
                    ]}
                    activeOpacity={0.8}
                    onPress={() => setDraft(option.key)}
                    accessibilityRole="radio"
                    accessibilityState={{ checked: isSelected }}
                    accessibilityLabel={`Tema ${option.label}`}
                  >
                    <ThemePreview palette={option.palette} />

                    <View style={styles.themeLabelRow}>
                      <View style={styles.themeLabelLeft}>
                        <Icon size={16} color={lightPalette.textSecondary} />
                        <Text style={styles.themeLabel}>{option.label}</Text>
                      </View>
                      <View
                        style={[
                          styles.radio,
                          isSelected && styles.radioSelected,
                        ]}
                      >
                        {isSelected && (
                          <Check size={12} color={lightPalette.white} strokeWidth={3} />
                        )}
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.secondaryButton}
              activeOpacity={0.8}
              onPress={onClose}
            >
              <Text style={styles.secondaryButtonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.primaryButton}
              activeOpacity={0.8}
              onPress={handleApply}
            >
              <Text style={styles.primaryButtonText}>Aplicar</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
    <AppAlertModal
      visible={noticeVisible}
      title="¡Casi listo!"
      message="Estamos afinando este tema para que luzca espectacular. Tu elección queda guardada y muy pronto la podrás disfrutar. ¡Gracias por hacer de la app un mejor lugar!"
      variant="info"
      confirmText="Entendido"
      onCancel={() => setNoticeVisible(false)}
      onConfirm={() => setNoticeVisible(false)}
    />
    </>
  );
};

export default ThemePreferenceModal;