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
import { Check, X } from 'lucide-react-native';

import { lightPalette } from '@/theme/palettes';
import { AppAlertModal } from '@/components/common/alertModal/AppAlertModal';

export type TextSizeOption = 'small' | 'normal' | 'large';

interface TextSizeOptionDef {
  key: TextSizeOption;
  label: string;
  previewSize: number;
}

const TEXT_SIZE_OPTIONS: TextSizeOptionDef[] = [
  { key: 'small', label: 'Pequeño', previewSize: 12 },
  { key: 'normal', label: 'Normal', previewSize: 16 },
  { key: 'large', label: 'Grande', previewSize: 21 },
];

const PREVIEW_TEXT =
  'Así se verá el texto en la aplicación cuando elijas esta opción.';

interface TextSizePreferenceModalProps {
  visible: boolean;
  selected: TextSizeOption;
  onClose: () => void;
  onApply: (value: TextSizeOption) => void;
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
      gap: scale(8),
    },
    optionsList: {
      gap: scale(8),
    },
    optionRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: lightPalette.surfaceSoft,
      borderRadius: scale(16),
      borderWidth: 2,
      borderColor: 'transparent',
      paddingVertical: scale(14),
      paddingHorizontal: scale(16),
    },
    optionRowSelected: {
      borderColor: lightPalette.primary,
    },
    optionLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
      marginRight: scale(12),
    },
    optionLetter: {
      fontWeight: '800',
      color: lightPalette.primary,
      marginRight: scale(14),
    },
    optionPreview: {
      flex: 1,
    },
    optionLabel: {
      fontWeight: '700',
      color: lightPalette.textPrimary,
    },
    optionSample: {
      color: lightPalette.textMuted,
      marginTop: scale(2),
      lineHeight: scale(18),
    },
    radio: {
      width: scale(22),
      height: scale(22),
      borderRadius: scale(11),
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

export const TextSizePreferenceModal: React.FC<
  TextSizePreferenceModalProps
> = ({ visible, selected, onClose, onApply }) => {
  const { width } = useWindowDimensions();
  const factor = Math.min(Math.max(width / 390, 0.8), 1.2);
  const styles = useMemo(() => createModalStyles(px => px * factor), [factor]);

  const [draft, setDraft] = useState<TextSizeOption>(selected);
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
              <Text style={styles.headerTitle}>Tamaño de texto</Text>
              <Text style={styles.headerSubtitle}>
                Ajusta el tamaño de la letra en toda la aplicación.
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
            <View style={styles.optionsList}>
              {TEXT_SIZE_OPTIONS.map(option => {
                const isSelected = draft === option.key;

                return (
                  <TouchableOpacity
                    key={option.key}
                    style={[
                      styles.optionRow,
                      isSelected && styles.optionRowSelected,
                    ]}
                    activeOpacity={0.7}
                    onPress={() => setDraft(option.key)}
                    accessibilityRole="radio"
                    accessibilityState={{ checked: isSelected }}
                    accessibilityLabel={`Tamaño de texto ${option.label}`}
                  >
                    <View style={styles.optionLeft}>
                      <Text
                        style={[
                          styles.optionLetter,
                          { fontSize: option.previewSize + 6, lineHeight: option.previewSize + 10 },
                        ]}
                      >
                        Aa
                      </Text>
                      <View style={styles.optionPreview}>
                        <Text style={[styles.optionLabel, { fontSize: option.previewSize }]}>
                          {option.label}
                        </Text>
                        <Text
                          style={[
                            styles.optionSample,
                            { fontSize: option.previewSize - 2 },
                          ]}
                          numberOfLines={2}
                        >
                          {PREVIEW_TEXT}
                        </Text>
                      </View>
                    </View>

                    <View
                      style={[styles.radio, isSelected && styles.radioSelected]}
                    >
                      {isSelected && (
                        <Check size={12} color={lightPalette.white} strokeWidth={3} />
                      )}
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
      title="¡Gran elección!"
      message="Estamos calibrando el tamaño del texto para que se sienta perfecto en cada pantalla. Tu preferencia queda guardada y muy pronto la tendrás lista. ¡Sigue así!"
      variant="info"
      confirmText="Entendido"
      onCancel={() => setNoticeVisible(false)}
      onConfirm={() => setNoticeVisible(false)}
    />
    </>
  );
};

export default TextSizePreferenceModal;