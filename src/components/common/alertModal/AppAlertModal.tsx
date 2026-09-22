import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  CheckCircle2,
  Info,
  TriangleAlert,
  X,
  XCircle,
} from 'lucide-react-native';

import { COLORS } from '@/constants/theme';

export type AlertVariant = 'info' | 'success' | 'warning' | 'error';

export interface AppAlertModalProps {
  visible: boolean;
  title: string;
  message?: string;
  variant?: AlertVariant;
  confirmText?: string;
  onConfirm?: () => void;
  cancelText?: string;
  onCancel?: () => void;
}

const VARIANT_META = {
  info: { Icon: Info, accent: COLORS.primaryViolet, soft: COLORS.primaryVioletSoft },
  success: { Icon: CheckCircle2, accent: COLORS.success, soft: COLORS.successSoft },
  warning: { Icon: TriangleAlert, accent: COLORS.warningAmber, soft: COLORS.warningAmberSoft },
  error: { Icon: XCircle, accent: COLORS.dangerRed, soft: COLORS.dangerRedSoft },
} as const;

export const AppAlertModal: React.FC<AppAlertModalProps> = ({
  visible,
  title,
  message,
  variant = 'info',
  confirmText = 'Aceptar',
  onConfirm,
  cancelText,
  onCancel,
}) => {
  const { Icon, accent, soft } = VARIANT_META[variant];
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.86)).current;

  useEffect(() => {
    if (visible) {
      opacity.setValue(0);
      scale.setValue(0.86);
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 180,
          useNativeDriver: true,
        }),
        Animated.spring(scale, {
          toValue: 1,
          friction: 7,
          tension: 70,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, opacity, scale]);

  const handleClose = () => {
    onCancel?.();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <View style={styles.backdrop}>
        <Animated.View
          style={[styles.card, { opacity, transform: [{ scale }] }]}
        >
          <View style={styles.header}>
            <Image
              source={require('../../../assets/images/drawer_logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
            <TouchableOpacity
              style={styles.closeButton}
              onPress={handleClose}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel="Cerrar"
            >
              <X size={20} color={COLORS.textMuted} />
            </TouchableOpacity>
          </View>

          <View style={styles.body}>
            <View style={[styles.iconBadge, { backgroundColor: soft }]}>
              <Icon size={28} color={accent} />
            </View>
            <Text style={styles.title}>{title}</Text>
            {message ? <Text style={styles.message}>{message}</Text> : null}
          </View>

          <View style={styles.footer}>
            {cancelText ? (
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={handleClose}
                activeOpacity={0.8}
                accessibilityRole="button"
              >
                <Text style={styles.cancelButtonText}>{cancelText}</Text>
              </TouchableOpacity>
            ) : null}
            <TouchableOpacity
              style={[styles.confirmButton, { backgroundColor: accent }, !cancelText && styles.confirmButtonFull]}
              onPress={onConfirm ?? handleClose}
              activeOpacity={0.85}
              accessibilityRole="button"
            >
              <Text style={styles.confirmButtonText}>{confirmText}</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: COLORS.blackOverlay,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  card: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 24,
    backgroundColor: COLORS.surface,
    paddingTop: 16,
    paddingBottom: 20,
    paddingHorizontal: 20,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.25,
    shadowRadius: 24,
    elevation: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logo: {
    width: 174,
    height: 74,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.surfaceSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    alignItems: 'center',
    paddingHorizontal: 8,
    marginTop: 8,
  },
  iconBadge: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 19,
    fontWeight: '700',
    color: COLORS.textStrong,
    textAlign: 'center',
  },
  message: {
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.textNeutral,
    textAlign: 'center',
    marginTop: 8,
  },
  footer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  cancelButton: {
    flex: 1,
    borderRadius: 14,
    backgroundColor: COLORS.surfaceSoft,
    borderWidth: 1,
    borderColor: COLORS.dividerLight,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  confirmButton: {
    flex: 1,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmButtonFull: {
    flex: 0,
    minWidth: '100%',
  },
  confirmButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.white,
  },
});