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
import { ChevronLeft, Fingerprint, History, Lock, ShieldCheck } from 'lucide-react-native';

import { PreferenceRowItem } from '@/components/settings/PreferenceRowItem';
import { COLORS } from '@/constants/theme';

const DESIGN_WIDTH = 390;
const PAGE_BACKGROUND = '#f1f4f8';
const SUBTITLE_COLOR = '#6B7280';

interface PatientSecurityScreenProps {
  onBack?: () => void;
}

export const PatientSecurityScreen: React.FC<PatientSecurityScreenProps> = ({
  onBack,
}) => {
  const [isBiometricsEnabled, setIsBiometricsEnabled] = useState(true);

  const { width } = useWindowDimensions();
  const scale = Math.min(Math.max(width / DESIGN_WIDTH, 0.8), 1);
  const styles = useMemo(() => createStyles(scale), [scale]);
  const insets = useSafeAreaInsets();

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
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + 24 * scale },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.itemWrapper}>
          <PreferenceRowItem
            icon={Fingerprint}
            title="Biometría"
            value="Inicia sesión con tu huella dactilar o reconocimiento facial."
            accessory="switch"
            switchValue={isBiometricsEnabled}
            onSwitchChange={setIsBiometricsEnabled}
          />
        </View>

        <View style={styles.itemWrapper}>
          <PreferenceRowItem
            icon={Lock}
            title="Cambiar contraseña"
            value="Actualiza tu contraseña regularmente para mayor seguridad."
            accessory="chevron"
          />
        </View>

        <View style={styles.itemWrapper}>
          <PreferenceRowItem
            icon={ShieldCheck}
            title="Verificación en dos pasos"
            value="Añade una capa extra de seguridad a tu cuenta."
            accessory="chevron"
          />
        </View>

        <View style={styles.itemWrapper}>
          <PreferenceRowItem
            icon={History}
            title="Actividad de seguridad"
            value="Revisa los últimos accesos a tu cuenta."
            accessory="chevron"
          />
        </View>
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

export default PatientSecurityScreen;