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
  ChevronLeft,
  Copy,
  KeyRound,
  Mail,
  RefreshCcw,
  Shield,
  Smartphone,
  TriangleAlert,
} from 'lucide-react-native';

import { useAppAlert } from '@/hooks/useAppAlert';
import { COLORS } from '@/constants/theme';

const DESIGN_WIDTH = 390;
const PAGE_BACKGROUND = '#f1f4f8';

type VerificationMethod = 'sms' | 'email';

interface MethodOption {
  id: VerificationMethod;
  label: string;
  detail: string;
  icon: typeof Smartphone;
}

const RECOVERY_CODE_SOURCE = 'FISIO-SENSE-SEGURO';

const generateRecoveryCodes = (): string[] => {
  const codes: string[] = [];
  for (let i = 0; i < 8; i += 1) {
    let code = '';
    for (let j = 0; j < 4; j += 1) {
      const seed =
        (RECOVERY_CODE_SOURCE.charCodeAt((i + j) % RECOVERY_CODE_SOURCE.length) +
          i * 7 +
          j * 13) %
        26;
      code += String.fromCharCode(65 + seed);
    }
    const numeric = String(Math.floor(((i + 1) * 48271) % 9000) + 1000);
    codes.push(`${code}-${numeric}`);
  }
  return codes;
};

interface TwoStepVerificationScreenProps {
  onBack?: () => void;
  phone?: string;
  email?: string;
}

export const TwoStepVerificationScreen: React.FC<
  TwoStepVerificationScreenProps
> = ({ onBack, phone = '+57 300 123 4567', email = 'usuario@fisiosense.com' }) => {
  const { width } = useWindowDimensions();
  const scale = Math.min(Math.max(width / DESIGN_WIDTH, 0.8), 1);
  const styles = useMemo(() => createStyles(scale), [scale]);
  const { alertModal, showAlert } = useAppAlert();

  const [enabled, setEnabled] = useState(false);
  const [method, setMethod] = useState<VerificationMethod>('sms');
  const [code, setCode] = useState('');
  const [verified, setVerified] = useState(false);
  const [recoveryCodes, setRecoveryCodes] = useState<string[]>([]);
  const [codeCopied, setCodeCopied] = useState(false);

  const METHODS: MethodOption[] = [
    { id: 'sms', label: 'Código por mensaje de texto (SMS)', detail: phone, icon: Smartphone },
    { id: 'email', label: 'Código por correo electrónico', detail: email, icon: Mail },
  ];

  const methodDetail =
    method === 'sms'
      ? `a tu teléfono ${phone}`
      : `a tu correo ${email}`;

  const handleToggle = (value: boolean) => {
    setEnabled(value);
    if (value) {
      showAlert({
        title: 'Refuerza tu seguridad',
        message:
          'Cada vez que inicies sesión desde un dispositivo nuevo, te pediremos un código de verificación adicional.',
        variant: 'warning',
        confirmText: 'Continuar',
      });
    }
  };

  const handleVerify = () => {
    const normalized = code.trim();
    if (normalized.length !== 6) {
      showAlert({
        title: 'Código incompleto',
        message: 'Ingresa el código de 6 dígitos que enviamos.',
        variant: 'warning',
        confirmText: 'Entendido',
      });
      return;
    }
    if (normalized === '000000') {
      showAlert({
        title: 'Código inválido',
        message: 'El código no coincide. Vuelve a intentarlo o solicita uno nuevo.',
        variant: 'warning',
        confirmText: 'Entendido',
      });
      return;
    }
    setVerified(true);
    setRecoveryCodes(generateRecoveryCodes());
    showAlert({
      title: '¡Verificación en dos pasos activada!',
      message:
        'Guardamos tus códigos de recuperación. Guárdalos en un lugar seguro por si pierdes el acceso.',
      variant: 'success',
      confirmText: 'Guardar códigos',
    });
  };

  const handleCopyCodes = () => {
    const payload = recoveryCodes.join('\n');
    const globalNavigator = (globalThis as {
      navigator?: { clipboard?: { writeText: (text: string) => void } };
    }).navigator;
    if (globalNavigator?.clipboard) {
      globalNavigator.clipboard.writeText(payload);
    }
    setCodeCopied(true);
    setTimeout(() => setCodeCopied(false), 2000);
  };

  const handleResend = () => {
    setCode('');
    showAlert({
      title: 'Código reenviado',
      message: `Enviamos un nuevo código ${methodDetail}. Revisa tu ${method === 'sms' ? 'teléfono' : 'correo'}.`,
      variant: 'info',
      confirmText: 'Entendido',
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
          <Text style={styles.headerTitle}>Verificación en dos pasos</Text>
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
              Con esta opción activa no podrás iniciar sesión en un dispositivo
              nuevo sin el código de verificación. Guarda tus códigos de
              recuperación.
            </Text>
          </View>
        </View>

        <View style={styles.toggleCard}>
          <View style={styles.toggleIcon}>
            <Shield size={24} color={COLORS.primaryViolet} />
          </View>
          <View style={styles.toggleTexts}>
            <Text style={styles.toggleTitle}>Verificación en dos pasos</Text>
            <Text style={styles.toggleDescription}>
              Añade una capa extra de seguridad a tu cuenta.
            </Text>
          </View>
          <Switch
            value={enabled}
            onValueChange={handleToggle}
            trackColor={{ false: COLORS.switchOff, true: COLORS.primaryViolet }}
            thumbColor={COLORS.background}
          />
        </View>

        {enabled ? (
          verified ? (
            <View style={styles.recoveryCard}>
              <View style={styles.recoveryHeader}>
                <View style={styles.recoveryIcon}>
                  <KeyRound size={24} color={COLORS.success} />
                </View>
                <View style={styles.recoveryTexts}>
                  <Text style={styles.recoveryTitle}>Códigos de recuperación</Text>
                  <Text style={styles.recoveryDescription}>
                    Úsalos para recuperar tu cuenta si pierdes el acceso.
                  </Text>
                </View>
              </View>

              <View style={styles.codesGrid}>
                {recoveryCodes.map(recoveryCode => (
                  <View key={recoveryCode} style={styles.codeChip}>
                    <Text style={styles.codeText}>{recoveryCode}</Text>
                  </View>
                ))}
              </View>

              <TouchableOpacity
                style={styles.copyButton}
                activeOpacity={0.8}
                onPress={handleCopyCodes}
                accessibilityRole="button"
                accessibilityLabel="Copiar códigos"
              >
                {codeCopied ? (
                  <Text style={styles.copyButtonText}>Códigos copiados</Text>
                ) : (
                  <>
                    <Copy size={18} color={COLORS.primaryViolet} />
                    <Text style={styles.copyButtonText}>Copiar códigos</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          ) : (
            <>
              <View style={styles.methodCard}>
                <Text style={styles.methodTitle}>
                  Elige cómo recibir tu código
                </Text>
                {METHODS.map((option, index) => {
                  const Icon = option.icon;
                  const selected = method === option.id;
                  return (
                    <View key={option.id}>
                      <TouchableOpacity
                        style={[
                          styles.methodRow,
                          selected && styles.methodRowSelected,
                        ]}
                        activeOpacity={0.7}
                        onPress={() => setMethod(option.id)}
                        accessibilityRole="radio"
                        accessibilityState={{ checked: selected }}
                      >
                        <View style={styles.methodIcon}>
                          <Icon size={20} color={COLORS.primaryViolet} />
                        </View>
                        <View style={styles.methodTexts}>
                          <Text style={styles.methodLabel}>{option.label}</Text>
                          <Text style={styles.methodDetail}>{option.detail}</Text>
                        </View>
                        <View
                          style={[
                            styles.methodRadio,
                            selected && styles.methodRadioSelected,
                          ]}
                        >
                          {selected && <View style={styles.methodRadioDot} />}
                        </View>
                      </TouchableOpacity>
                      {index < METHODS.length - 1 ? (
                        <View style={styles.divider} />
                      ) : null}
                    </View>
                  );
                })}
              </View>

              <View style={styles.codeCard}>
                <Text style={styles.codeTitle}>
                  Ingresa el código de 6 dígitos
                </Text>
                <Text style={styles.codeDescription}>
                  Te enviamos un código {methodDetail}.
                </Text>
                <TextInput
                  style={styles.codeInput}
                  value={code}
                  onChangeText={text =>
                    setCode(text.replace(/[^0-9]/g, '').slice(0, 6))
                  }
                  placeholder="000000"
                  placeholderTextColor={COLORS.textMuted}
                  keyboardType="number-pad"
                  maxLength={6}
                />
                <TouchableOpacity
                  style={styles.verifyButton}
                  activeOpacity={0.85}
                  onPress={handleVerify}
                  accessibilityRole="button"
                  accessibilityLabel="Verificar código"
                >
                  <Text style={styles.verifyButtonText}>Verificar código</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.resendButton}
                  activeOpacity={0.7}
                  onPress={handleResend}
                  accessibilityRole="button"
                >
                  <RefreshCcw size={16} color={COLORS.primaryViolet} />
                  <Text style={styles.resendButtonText}>Reenviar código</Text>
                </TouchableOpacity>
              </View>
            </>
          )
        ) : (
          <View style={styles.offCard}>
            <Text style={styles.offTitle}>Cuenta sin verificación en dos pasos</Text>
            <Text style={styles.offDescription}>
              Cuando la actives, recibirás un código cada vez que uses un
              dispositivo o navegador nuevo.
            </Text>
          </View>
        )}
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
    toggleCard: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: COLORS.surface,
      borderRadius: 16 * scale,
      paddingVertical: 16 * scale,
      paddingHorizontal: 16 * scale,
      gap: 12 * scale,
    },
    toggleIcon: {
      width: 44 * scale,
      height: 44 * scale,
      borderRadius: 22 * scale,
      backgroundColor: COLORS.primaryVioletSoft,
      alignItems: 'center',
      justifyContent: 'center',
    },
    toggleTexts: {
      flex: 1,
    },
    toggleTitle: {
      fontSize: 14 * scale,
      fontWeight: '700',
      color: COLORS.textStrong,
    },
    toggleDescription: {
      fontSize: 12 * scale,
      lineHeight: 17 * scale,
      color: COLORS.textMuted,
      marginTop: 3 * scale,
    },
    offCard: {
      backgroundColor: COLORS.surface,
      borderRadius: 16 * scale,
      paddingVertical: 18 * scale,
      paddingHorizontal: 16 * scale,
      gap: 6 * scale,
    },
    offTitle: {
      fontSize: 14 * scale,
      fontWeight: '700',
      color: COLORS.textStrong,
    },
    offDescription: {
      fontSize: 13 * scale,
      lineHeight: 18 * scale,
      color: COLORS.textMuted,
    },
    methodCard: {
      backgroundColor: COLORS.surface,
      borderRadius: 16 * scale,
      paddingVertical: 8 * scale,
      paddingHorizontal: 16 * scale,
    },
    methodTitle: {
      fontSize: 13 * scale,
      fontWeight: '700',
      color: COLORS.textStrong,
      textTransform: 'uppercase',
      marginTop: 10 * scale,
      marginBottom: 8 * scale,
    },
    methodRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 14 * scale,
      gap: 12 * scale,
    },
    methodRowSelected: {
      borderRadius: 12 * scale,
    },
    methodIcon: {
      width: 40 * scale,
      height: 40 * scale,
      borderRadius: 12 * scale,
      backgroundColor: COLORS.primaryVioletSoft,
      alignItems: 'center',
      justifyContent: 'center',
    },
    methodTexts: {
      flex: 1,
    },
    methodLabel: {
      fontSize: 14 * scale,
      fontWeight: '600',
      color: COLORS.textStrong,
    },
    methodDetail: {
      fontSize: 12 * scale,
      color: COLORS.textMuted,
      marginTop: 2 * scale,
    },
    methodRadio: {
      width: 22 * scale,
      height: 22 * scale,
      borderRadius: 11 * scale,
      borderWidth: 2,
      borderColor: COLORS.dividerLight,
      alignItems: 'center',
      justifyContent: 'center',
    },
    methodRadioSelected: {
      borderColor: COLORS.primaryViolet,
    },
    methodRadioDot: {
      width: 12 * scale,
      height: 12 * scale,
      borderRadius: 6 * scale,
      backgroundColor: COLORS.primaryViolet,
    },
    divider: {
      height: 1,
      backgroundColor: COLORS.dividerLight,
      marginLeft: 52 * scale,
    },
    codeCard: {
      backgroundColor: COLORS.surface,
      borderRadius: 16 * scale,
      paddingVertical: 18 * scale,
      paddingHorizontal: 16 * scale,
      gap: 10 * scale,
    },
    codeTitle: {
      fontSize: 14 * scale,
      fontWeight: '700',
      color: COLORS.textStrong,
    },
    codeDescription: {
      fontSize: 13 * scale,
      lineHeight: 18 * scale,
      color: COLORS.textMuted,
    },
    codeInput: {
      backgroundColor: COLORS.surfaceSoft,
      borderRadius: 14 * scale,
      paddingVertical: 16 * scale,
      fontSize: 22 * scale,
      letterSpacing: 12 * scale,
      textAlign: 'center',
      fontWeight: '700',
      color: COLORS.textStrong,
      marginTop: 4 * scale,
    },
    verifyButton: {
      backgroundColor: COLORS.primaryViolet,
      borderRadius: 14 * scale,
      paddingVertical: 15 * scale,
      alignItems: 'center',
      marginTop: 6 * scale,
    },
    verifyButtonText: {
      fontSize: 15 * scale,
      fontWeight: '700',
      color: COLORS.white,
    },
    resendButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 6 * scale,
      paddingVertical: 8 * scale,
    },
    resendButtonText: {
      fontSize: 13 * scale,
      fontWeight: '600',
      color: COLORS.primaryViolet,
    },
    recoveryCard: {
      backgroundColor: COLORS.surface,
      borderRadius: 16 * scale,
      paddingVertical: 18 * scale,
      paddingHorizontal: 16 * scale,
      gap: 14 * scale,
      borderWidth: 1,
      borderColor: COLORS.successSoft,
    },
    recoveryHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12 * scale,
    },
    recoveryIcon: {
      width: 44 * scale,
      height: 44 * scale,
      borderRadius: 22 * scale,
      backgroundColor: COLORS.successSoft,
      alignItems: 'center',
      justifyContent: 'center',
    },
    recoveryTexts: {
      flex: 1,
    },
    recoveryTitle: {
      fontSize: 14 * scale,
      fontWeight: '700',
      color: COLORS.textStrong,
    },
    recoveryDescription: {
      fontSize: 12 * scale,
      lineHeight: 17 * scale,
      color: COLORS.textMuted,
      marginTop: 3 * scale,
    },
    codesGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8 * scale,
    },
    codeChip: {
      backgroundColor: COLORS.surfaceSoft,
      borderRadius: 10 * scale,
      paddingVertical: 10 * scale,
      paddingHorizontal: 12 * scale,
      minWidth: '45%',
      flexGrow: 1,
    },
    codeText: {
      fontSize: 13 * scale,
      fontWeight: '700',
      color: COLORS.textStrong,
      letterSpacing: 1 * scale,
    },
    copyButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8 * scale,
      borderRadius: 14 * scale,
      borderWidth: 1,
      borderColor: COLORS.primaryViolet,
      paddingVertical: 13 * scale,
    },
    copyButtonText: {
      fontSize: 14 * scale,
      fontWeight: '700',
      color: COLORS.primaryViolet,
    },
  });

export default TwoStepVerificationScreen;