import React, { useMemo } from 'react';
import {
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Headphones,
  HelpCircle,
  BookOpen,
  Video,
  MessageSquare,
  type LucideIcon,
} from 'lucide-react-native';

import { COLORS } from '@/constants/theme';

const DESIGN_WIDTH = 390;

interface HelpOption {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
}

const HELP_OPTIONS: HelpOption[] = [
  {
    id: 'faq',
    title: 'Preguntas frecuentes',
    description: 'Resuelve tus dudas más comunes.',
    icon: HelpCircle,
  },
  {
    id: 'guide',
    title: 'Guía del usuario',
    description: 'Aprende a usar la aplicación.',
    icon: BookOpen,
  },
  {
    id: 'tutorials',
    title: 'Tutoriales en video',
    description: 'Mira videos de ayuda y mejores prácticas.',
    icon: Video,
  },
  {
    id: 'support',
    title: 'Contacto soporte',
    description: 'Escríbenos o comunícate con nuestro equipo.',
    icon: MessageSquare,
  },
];

interface HelpSupportScreenProps {
  onBack?: () => void;
}

export const HelpSupportScreen: React.FC<HelpSupportScreenProps> = ({
  onBack,
}) => {
  const { width } = useWindowDimensions();
  const scale = Math.min(Math.max(width / DESIGN_WIDTH, 0.8), 1);
  const styles = useMemo(() => createStyles(scale), [scale]);

  const handleCallNow = () => {
    Linking.openURL('tel:123456789');
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
        <Text style={styles.headerTitle}>Ayuda y soporte</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.banner}>
          <View style={styles.bannerIconContainer}>
            <Headphones size={28} color={COLORS.primaryViolet} />
          </View>
          <View style={styles.bannerText}>
            <Text style={styles.bannerTitle}>¿Necesitas ayuda?</Text>
            <Text style={styles.bannerSubtitle}>
              Estamos aquí para ayudarte. Encuentra respuestas rápidas o
              contáctanos.
            </Text>
          </View>
        </View>

        <View style={styles.list}>
          {HELP_OPTIONS.map((option, index) => {
            const Icon = option.icon;

            return (
              <View key={option.id}>
                <TouchableOpacity
                  style={styles.optionRow}
                  activeOpacity={0.7}
                  accessibilityRole="button"
                  accessibilityLabel={option.title}
                >
                  <View style={styles.optionIconContainer}>
                    <Icon size={20} color={COLORS.primaryViolet} />
                  </View>

                  <View style={styles.rowText}>
                    <Text style={styles.rowTitle}>{option.title}</Text>
                    <Text style={styles.rowDescription}>
                      {option.description}
                    </Text>
                  </View>

                  <ChevronRight
                    size={20}
                    color={COLORS.textMuted}
                    style={styles.chevron}
                  />
                </TouchableOpacity>
                {index < HELP_OPTIONS.length - 1 && (
                  <View style={styles.divider} />
                )}
              </View>
            );
          })}
        </View>

        <View style={styles.emergencyCard}>
          <View style={styles.emergencyHeader}>
            <View style={styles.emergencyIconContainer}>
              <AlertCircle size={24} color={COLORS.primaryViolet} />
            </View>
            <View style={styles.emergencyText}>
              <Text style={styles.emergencyTitle}>¿Tienes una emergencia?</Text>
              <Text style={styles.emergencyDescription}>
                Si es un caso urgente, comunícate directamente con el equipo de
                soporte.
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.callButton}
            activeOpacity={0.8}
            onPress={handleCallNow}
            accessibilityRole="button"
            accessibilityLabel="Llamar ahora"
          >
            <Text style={styles.callButtonText}>Llamar ahora</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const createStyles = (scale: number) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: COLORS.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 20 * scale,
      paddingVertical: 12 * scale,
    },
    backButton: {
      position: 'absolute',
      left: 20 * scale,
      width: 44 * scale,
      height: 44 * scale,
      borderRadius: 14 * scale,
      backgroundColor: COLORS.background,
      borderWidth: 1,
      borderColor: COLORS.dividerLight,
      alignItems: 'center',
      justifyContent: 'center',
    },
    headerTitle: {
      fontSize: 20 * scale,
      fontWeight: '700',
      color: COLORS.textStrong,
    },
    content: {
      paddingBottom: 32 * scale,
    },
    banner: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: COLORS.surfaceSoft,
      borderRadius: 16 * scale,
      padding: 16 * scale,
      marginHorizontal: 20 * scale,
    },
    bannerIconContainer: {
      width: 56 * scale,
      height: 56 * scale,
      borderRadius: 28 * scale,
      backgroundColor: COLORS.primaryVioletSoft,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 14 * scale,
    },
    bannerText: {
      flex: 1,
      paddingVertical: 20 * scale,
    },
    bannerTitle: {
      fontSize: 17 * scale,
      fontWeight: '700',
      color: COLORS.textStrong,
    },
    bannerSubtitle: {
      fontSize: 13 * scale,
      color: COLORS.textMuted,
      marginTop: 4 * scale,
      lineHeight: 18 * scale,
    },
    list: {
      marginTop: 16 * scale,
    },
    optionRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 20 * scale,
      paddingVertical: 33 * scale,
    },
    optionIconContainer: {
      width: 40 * scale,
      height: 40 * scale,
      borderRadius: 20 * scale,
      backgroundColor: COLORS.primaryVioletSoft,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 14 * scale,
    },
    rowText: {
      flex: 1,
      marginRight: 8 * scale,
    },
    rowTitle: {
      fontSize: 15 * scale,
      fontWeight: '700',
      color: COLORS.textStrong,
    },
    rowDescription: {
      fontSize: 13 * scale,
      color: COLORS.textMuted,
      marginTop: 2 * scale,
    },
    chevron: {
      marginLeft: 8 * scale,
    },
    divider: {
      height: 1,
      backgroundColor: COLORS.dividerLight,
      marginHorizontal: 20 * scale,
    },
    emergencyCard: {
      backgroundColor: COLORS.surfaceSoft,
      borderRadius: 16 * scale,
      padding: 16 * scale,
      marginHorizontal: 20 * scale,
      marginTop: 24 * scale,
    },
    emergencyHeader: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    emergencyIconContainer: {
      width: 44 * scale,
      height: 44 * scale,
      borderRadius: 22 * scale,
      backgroundColor: COLORS.primaryVioletSoft,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 14 * scale,
    },
    emergencyText: {
      flex: 1,
    },
    emergencyTitle: {
      fontSize: 16 * scale,
      fontWeight: '700',
      color: COLORS.primaryViolet,
    },
    emergencyDescription: {
      fontSize: 13 * scale,
      color: COLORS.textMuted,
      marginTop: 4 * scale,
      lineHeight: 18 * scale,
    },
    callButton: {
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 12 * scale,
      borderWidth: 1,
      borderColor: COLORS.primaryViolet,
      paddingVertical: 12 * scale,
      marginTop: 16 * scale,
    },
    callButtonText: {
      fontSize: 15 * scale,
      fontWeight: '700',
      color: COLORS.primaryViolet,
    },
  });

export default HelpSupportScreen;