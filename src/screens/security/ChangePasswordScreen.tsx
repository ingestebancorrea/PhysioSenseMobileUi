import React, { useMemo, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Check,
  ChevronLeft,
  Eye,
  EyeOff,
  Lock,
  TriangleAlert,
} from 'lucide-react-native';

import { useAppAlert } from '@/hooks/useAppAlert';
import { COLORS } from '@/constants/theme';

const DESIGN_WIDTH = 390;
const PAGE_BACKGROUND = '#f1f4f8';
const SUBTITLE_COLOR = '#6B7280';

type StrengthLevel = 'weak' | 'medium' | 'strong';

const STRENGTH_META: Record<StrengthLevel, { label: string; color: string }> = {
  weak: { label: 'Débil', color: COLORS.dangerRed },
  medium: { label: 'Media', color: COLORS.warningAmber },
  strong: { label: 'Fuerte', color: COLORS.success },
};

interface PasswordRule {
  id: string;
  label: string;
  test: (value: string) => boolean;
}

const PASSWORD_RULES: PasswordRule[] = [
  { id: 'length', label: 'Al menos 8 caracteres', test: v => v.length >= 8 },
  {
    id: 'case',
    label: 'Incluye mayúsculas y minúsculas',
    test: v => /[a-z]/.test(v) && /[A-Z]/.test(v),
  },
  { id: 'number', label: 'Al menos un número', test: v => /\d/.test(v) },
  {
    id: 'symbol',
    label: 'Al menos un símbolo',
    test: v => /[^A-Za-z0-9]/.test(v),
  },
];

const evaluateStrength = (value: string): StrengthLevel => {
  let score = 0;
  if (value.length >= 8) score += 1;
  if (/[a-z]/.test(value) && /[A-Z]/.test(value)) score += 1;
  if (/\d/.test(value)) score += 1;
  if (/[^A-Za-z0-9]/.test(value)) score += 1;
  if (value.length >= 12) score += 1;
  if (score <= 1) return 'weak';
  if (score <= 3) return 'medium';
  return 'strong';
};

type ScreenStyles = ReturnType<typeof createStyles>;

interface TextInputFieldProps {
  styles: ScreenStyles;
  value: string;
  placeholder: string;
  secureTextEntry?: boolean;
  onChangeText: (text: string) => void;
}

const TextInputField: React.FC<TextInputFieldProps> = ({
  styles,
  value,
  placeholder,
  secureTextEntry,
  onChangeText,
}) => (
  <TextInput
    style={styles.fieldInput}
    value={value}
    placeholder={placeholder}
    placeholderTextColor={COLORS.textMuted}
    secureTextEntry={secureTextEntry}
    autoCapitalize="none"
    onChangeText={onChangeText}
  />
);

interface PasswordFieldProps {
  styles: ScreenStyles;
  label: string;
  value: string;
  placeholder: string;
  isVisible: boolean;
  onChangeText: (text: string) => void;
  onToggleVisibility: () => void;
  error?: string;
}

const PasswordField: React.FC<PasswordFieldProps> = ({
  styles,
  label,
  value,
  placeholder,
  isVisible,
  onChangeText,
  onToggleVisibility,
  error,
}) => {
  const EyeIcon = isVisible ? EyeOff : Eye;

  return (
    <View style={styles.fieldContainer}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <View style={[styles.fieldBox, error && styles.fieldBoxError]}>
        <Lock size={18} color={COLORS.textMuted} />
        <TextInputField
          styles={styles}
          value={value}
          placeholder={placeholder}
          secureTextEntry={!isVisible}
          onChangeText={onChangeText}
        />
        <TouchableOpacity
          style={styles.eyeButton}
          activeOpacity={0.7}
          onPress={onToggleVisibility}
          accessibilityRole="button"
          accessibilityLabel={`${isVisible ? 'Ocultar' : 'Mostrar'} ${label}`}
        >
          <EyeIcon size={20} color={COLORS.textMuted} />
        </TouchableOpacity>
      </View>
      {error ? <Text style={styles.fieldError}>{error}</Text> : null}
    </View>
  );
};

interface ChangePasswordScreenProps {
  onBack?: () => void;
}

export const ChangePasswordScreen: React.FC<ChangePasswordScreenProps> = ({
  onBack,
}) => {
  const { width } = useWindowDimensions();
  const scale = Math.min(Math.max(width / DESIGN_WIDTH, 0.8), 1);
  const styles = useMemo(() => createStyles(scale), [scale]);
  const { alertModal, showAlert } = useAppAlert();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [visibleFields, setVisibleFields] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [logoutOthers, setLogoutOthers] = useState(true);
  const [dirty, setDirty] = useState(false);

  const strength = evaluateStrength(newPassword);
  const strengthMeta = STRENGTH_META[strength];
  const rulesMet = PASSWORD_RULES.filter(rule => rule.test(newPassword)).length;
  const allRulesMet = rulesMet === PASSWORD_RULES.length;

  const toggleVisibility = (field: 'current' | 'new' | 'confirm') => {
    setVisibleFields(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const validate = (): string | null => {
    if (!currentPassword) return 'Ingresa tu contraseña actual.';
    if (newPassword.length < 8)
      return 'La nueva contraseña debe tener al menos 8 caracteres.';
    if (!allRulesMet)
      return 'La nueva contraseña no cumple todos los requisitos de seguridad.';
    if (newPassword !== confirmPassword)
      return 'Las contraseñas nuevas no coinciden.';
    return null;
  };

  const handleSave = () => {
    setDirty(true);
    const error = validate();
    if (error) {
      showAlert({
        title: 'No se pudo actualizar',
        message: error,
        variant: 'warning',
        confirmText: 'Entendido',
      });
      return;
    }
    showAlert({
      title: 'Contraseña actualizada',
      message: logoutOthers
        ? 'Tu contraseña fue cambiada y cerramos la sesión en los demás dispositivos.'
        : 'Tu contraseña fue actualizada correctamente. Úsala la próxima vez que inicies sesión.',
      variant: 'success',
      confirmText: 'Listo',
      onConfirm: onBack,
    });
  };

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
          <Text style={styles.headerTitle}>Cambiar contraseña</Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.warningBanner}>
          <View style={styles.warningIcon}>
            <TriangleAlert size={24} color={COLORS.primaryViolet} />
          </View>
          <View style={styles.warningTexts}>
            <Text style={styles.warningTitle}>Advertencia de seguridad</Text>
            <Text style={styles.warningDescription}>
              Al cambiar tu contraseña, cerraremos tu sesión en otros
              dispositivos para proteger tu cuenta.
            </Text>
          </View>
        </View>

        <PasswordField
          styles={styles}
          label="Contraseña actual"
          value={currentPassword}
          placeholder="Ingresa tu contraseña actual"
          isVisible={visibleFields.current}
          onChangeText={setCurrentPassword}
          onToggleVisibility={() => toggleVisibility('current')}
          error={dirty && !currentPassword ? 'Campo requerido' : undefined}
        />

        <PasswordField
          styles={styles}
          label="Nueva contraseña"
          value={newPassword}
          placeholder="Crea una contraseña segura"
          isVisible={visibleFields.new}
          onChangeText={setNewPassword}
          onToggleVisibility={() => toggleVisibility('new')}
        />

        <View style={styles.strengthCard}>
          <View style={styles.strengthHeader}>
            <Text style={styles.strengthLabel}>Nivel de seguridad</Text>
            {newPassword ? (
              <Text style={[styles.strengthValue, { color: strengthMeta.color }]}>
                {strengthMeta.label}
              </Text>
            ) : null}
          </View>
          <View style={styles.strengthBars}>
            {(['weak', 'medium', 'strong'] as StrengthLevel[]).map(level => {
              const order = { weak: 0, medium: 1, strong: 2 }[level];
              const filled =
                newPassword &&
                ({ weak: 1, medium: 2, strong: 3 }[strength] ?? 0) > order;
              return (
                <View
                  key={level}
                  style={[
                    styles.strengthBar,
                    filled && { backgroundColor: strengthMeta.color },
                  ]}
                />
              );
            })}
          </View>
        </View>

        <View style={styles.rulesCard}>
          <Text style={styles.rulesTitle}>Requisitos de seguridad</Text>
          <View style={styles.rulesList}>
            {PASSWORD_RULES.map(rule => {
              const met = rule.test(newPassword);
              return (
                <View key={rule.id} style={styles.ruleRow}>
                  <View
                    style={[styles.ruleCheck, met && styles.ruleCheckMet]}
                  >
                    {met && (
                      <Check size={14} color={COLORS.white} strokeWidth={3} />
                    )}
                  </View>
                  <Text
                    style={[
                      styles.ruleLabel,
                      met && styles.ruleLabelMet,
                    ]}
                  >
                    {rule.label}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>

        <PasswordField
          styles={styles}
          label="Confirmar nueva contraseña"
          value={confirmPassword}
          placeholder="Repite la nueva contraseña"
          isVisible={visibleFields.confirm}
          onChangeText={setConfirmPassword}
          onToggleVisibility={() => toggleVisibility('confirm')}
          error={
            dirty && !!confirmPassword && newPassword !== confirmPassword
              ? 'Las contraseñas no coinciden'
              : undefined
          }
        />

        <View style={styles.logoutRow}>
          <View style={styles.logoutTexts}>
            <Text style={styles.logoutTitle}>
              Cerrar sesión en otros dispositivos
            </Text>
            <Text style={styles.logoutDescription}>
              Mantiene tu sesión activa solo en este dispositivo.
            </Text>
          </View>
          <Switch
            value={logoutOthers}
            onValueChange={setLogoutOthers}
            trackColor={{ false: COLORS.switchOff, true: COLORS.primaryViolet }}
            thumbColor={COLORS.background}
          />
        </View>

        <TouchableOpacity
          style={styles.saveButton}
          activeOpacity={0.85}
          onPress={handleSave}
          accessibilityRole="button"
          accessibilityLabel="Actualizar contraseña"
        >
          <Text style={styles.saveButtonText}>Actualizar contraseña</Text>
        </TouchableOpacity>
      </ScrollView>
      {alertModal}
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
    content: {
      paddingHorizontal: 20 * scale,
      paddingTop: 8 * scale,
      paddingBottom: 32 * scale,
      gap: 16 * scale,
    },
    warningBanner: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: COLORS.primaryVioletSoft,
      borderRadius: 16 * scale,
      paddingVertical: 16 * scale,
      paddingHorizontal: 16 * scale,
      gap: 12 * scale,
      borderWidth: 1,
      borderColor: 'rgba(108, 92, 231, 0.35)',
    },
    warningIcon: {
      width: 44 * scale,
      height: 44 * scale,
      borderRadius: 22 * scale,
      backgroundColor: COLORS.surface,
      alignItems: 'center',
      justifyContent: 'center',
    },
    warningTexts: {
      flex: 1,
    },
    warningTitle: {
      fontSize: 14 * scale,
      fontWeight: '700',
      color: COLORS.primaryDark,
    },
    warningDescription: {
      fontSize: 12 * scale,
      lineHeight: 17 * scale,
      color: COLORS.textNeutral,
      marginTop: 3 * scale,
    },
    fieldContainer: {
      gap: 0,
    },
    fieldLabel: {
      fontSize: 13 * scale,
      fontWeight: '600',
      color: SUBTITLE_COLOR,
      marginBottom: 8 * scale,
    },
    fieldBox: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: COLORS.surface,
      borderRadius: 14 * scale,
      borderWidth: 1,
      borderColor: COLORS.dividerLight,
      paddingHorizontal: 16 * scale,
    },
    fieldBoxError: {
      borderColor: COLORS.dangerRed,
    },
    fieldInput: {
      flex: 1,
      paddingVertical: 15 * scale,
      fontSize: 15 * scale,
      color: COLORS.textStrong,
      marginLeft: 10 * scale,
    },
    eyeButton: {
      padding: 6 * scale,
      marginLeft: 8 * scale,
    },
    fieldError: {
      fontSize: 12 * scale,
      color: COLORS.dangerRed,
      marginTop: 6 * scale,
    },
    strengthCard: {
      backgroundColor: COLORS.surface,
      borderRadius: 16 * scale,
      paddingVertical: 16 * scale,
      paddingHorizontal: 16 * scale,
    },
    strengthHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    strengthLabel: {
      fontSize: 13 * scale,
      fontWeight: '600',
      color: SUBTITLE_COLOR,
    },
    strengthValue: {
      fontSize: 13 * scale,
      fontWeight: '700',
    },
    strengthBars: {
      flexDirection: 'row',
      gap: 6 * scale,
      marginTop: 12 * scale,
    },
    strengthBar: {
      flex: 1,
      height: 6 * scale,
      borderRadius: 3 * scale,
      backgroundColor: COLORS.dividerLight,
    },
    rulesCard: {
      backgroundColor: COLORS.surface,
      borderRadius: 16 * scale,
      paddingVertical: 16 * scale,
      paddingHorizontal: 16 * scale,
    },
    rulesTitle: {
      fontSize: 13 * scale,
      fontWeight: '700',
      color: COLORS.textStrong,
      textTransform: 'uppercase',
      marginBottom: 12 * scale,
    },
    rulesList: {
      gap: 10 * scale,
    },
    ruleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10 * scale,
    },
    ruleCheck: {
      width: 20 * scale,
      height: 20 * scale,
      borderRadius: 10 * scale,
      borderWidth: 2,
      borderColor: COLORS.dividerLight,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: COLORS.surface,
    },
    ruleCheckMet: {
      backgroundColor: COLORS.success,
      borderColor: COLORS.success,
    },
    ruleLabel: {
      flex: 1,
      fontSize: 13 * scale,
      color: COLORS.textMuted,
    },
    ruleLabelMet: {
      color: COLORS.textStrong,
    },
    logoutRow: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: COLORS.surface,
      borderRadius: 16 * scale,
      paddingVertical: 16 * scale,
      paddingHorizontal: 16 * scale,
      gap: 12 * scale,
    },
    logoutTexts: {
      flex: 1,
    },
    logoutTitle: {
      fontSize: 14 * scale,
      fontWeight: '700',
      color: COLORS.textStrong,
    },
    logoutDescription: {
      fontSize: 12 * scale,
      lineHeight: 17 * scale,
      color: COLORS.textMuted,
      marginTop: 3 * scale,
    },
    saveButton: {
      backgroundColor: COLORS.primaryViolet,
      borderRadius: 14 * scale,
      paddingVertical: 16 * scale,
      alignItems: 'center',
      marginTop: 4 * scale,
    },
    saveButtonText: {
      fontSize: 15 * scale,
      fontWeight: '700',
      color: COLORS.white,
    },
  });

export default ChangePasswordScreen;