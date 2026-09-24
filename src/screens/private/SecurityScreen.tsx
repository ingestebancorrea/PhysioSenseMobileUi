import React, { useMemo, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, ShieldCheck } from 'lucide-react-native';

import { InfoBanner } from '@/components/settings/InfoBanner';
import { PreferenceRowItem } from '@/components/settings/PreferenceRowItem';
import { SECURITY_OPTIONS } from '@/mock/settingsData';
import { ICONS, type IconName } from '@/constants/icons';
import { COLORS } from '@/constants/theme';
import { useAppAlert } from '@/hooks/useAppAlert';
import type { SecurityOption } from '@/types/settings';

import { ChangePasswordScreen } from '@/screens/security/ChangePasswordScreen';
import { TwoStepVerificationScreen } from '@/screens/security/TwoStepVerificationScreen';
import { SecurityActivityScreen } from '@/screens/security/SecurityActivityScreen';

const DESIGN_WIDTH = 390;
const PAGE_BACKGROUND = '#f1f4f8';
const SUBTITLE_COLOR = '#6B7280';

type SecurityRoute = 'list' | 'changePassword' | 'twoStep' | 'activity';

interface SecurityScreenProps {
  onBack?: () => void;
}

export const SecurityScreen: React.FC<SecurityScreenProps> = ({ onBack }) => {
  const [route, setRoute] = useState<SecurityRoute>('list');
  const [isBiometricsEnabled, setIsBiometricsEnabled] = useState(true);
  const { alertModal, showAlert } = useAppAlert();

  const { width } = useWindowDimensions();
  const scale = Math.min(Math.max(width / DESIGN_WIDTH, 0.8), 1);
  const styles = useMemo(() => createStyles(scale), [scale]);

  if (route === 'changePassword') {
    return <ChangePasswordScreen onBack={() => setRoute('list')} />;
  }
  if (route === 'twoStep') {
    return <TwoStepVerificationScreen onBack={() => setRoute('list')} />;
  }
  if (route === 'activity') {
    return <SecurityActivityScreen onBack={() => setRoute('list')} />;
  }

  const handleOptionPress = (option: SecurityOption) => {
    if (option.id === 'sec_contrasena') {
      setRoute('changePassword');
    }
    if (option.id === 'sec_verificacion') {
      setRoute('twoStep');
    }
    if (option.id === 'sec_actividad') {
      setRoute('activity');
    }
  };

  const handleBiometricsToggle = (value: boolean) => {
    setIsBiometricsEnabled(value);
    showAlert({
      title: value ? 'Biometría activada' : 'Biometría desactivada',
      message: value
        ? 'Ahora puedes iniciar sesión con tu huella dactilar o reconocimiento facial.'
        : 'Desactivaste la biometría. Tu cuenta queda protegida únicamente con tu contraseña.',
      variant: value ? 'success' : 'warning',
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
          <Text style={styles.headerTitle}>Seguridad</Text>
        </View>
      </View>

      <View style={styles.headerSubtitleWrapper}>
        <Text style={styles.headerSubtitle}>
          Protege tu cuenta y mantén tu información segura.
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {SECURITY_OPTIONS.map((option: SecurityOption) => {
          const Icon = ICONS[option.iconName as IconName];
          const isBiometrics = option.id === 'sec_biometria';

          return (
            <View key={option.id} style={styles.itemWrapper}>
              <PreferenceRowItem
                icon={Icon}
                title={option.title}
                value={option.subtitle}
                accessory={option.accessory}
                onPress={
                  isBiometrics ? undefined : () => handleOptionPress(option)
                }
                switchValue={isBiometrics ? isBiometricsEnabled : option.switchValue}
                onSwitchChange={
                  isBiometrics ? handleBiometricsToggle : undefined
                }
              />
            </View>
          );
        })}

        <InfoBanner
          icon={ShieldCheck}
          title="Tu cuenta está protegida"
          description="Usamos los más altos estándares de seguridad para cuidar tu información."
        />
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
    banner: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: COLORS.primaryVioletSoft,
      borderRadius: 16,
      paddingVertical: 20 * scale,
      paddingHorizontal: 18 * scale,
      gap: 14 * scale,
    },
  });

export default SecurityScreen;