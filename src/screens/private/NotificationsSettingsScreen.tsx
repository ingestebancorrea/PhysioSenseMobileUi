import React, { useMemo, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Bell, ChevronLeft, Mail, Smartphone, type LucideIcon } from 'lucide-react-native';

import { COLORS } from '@/constants/theme';

const DESIGN_WIDTH = 390;

type NotificationMethod = 'push' | 'email' | 'sms';

interface ToggleOption {
  id: string;
  title: string;
  description: string;
}

interface MethodOption {
  id: NotificationMethod;
  title: string;
  description: string;
  icon: LucideIcon;
}

const TOGGLE_OPTIONS: ToggleOption[] = [
  {
    id: 'general',
    title: 'Notificaciones generales',
    description: 'Recibe alertas importantes de la aplicación.',
  },
  {
    id: 'assignments',
    title: 'Asignación de sesiones',
    description: 'Cuando se te asigne una nueva sesión.',
  },
  {
    id: 'reminders',
    title: 'Recordatorios de sesiones',
    description: 'Notificaciones de sesiones próximas.',
  },
  {
    id: 'patientUpdates',
    title: 'Actualizaciones de pacientes',
    description: 'Cambios en la información de tus pacientes.',
  },
  {
    id: 'messages',
    title: 'Mensajes',
    description: 'Nuevos mensajes de pacientes o equipo de salud.',
  },
];

const INITIAL_TOGGLES: Record<string, boolean> = {
  general: true,
  assignments: true,
  reminders: true,
  patientUpdates: true,
  messages: false,
};

const METHOD_OPTIONS: MethodOption[] = [
  {
    id: 'push',
    title: 'Notificaciones push',
    description: 'En la aplicación y en tu dispositivo.',
    icon: Bell,
  },
  {
    id: 'email',
    title: 'Correo electrónico',
    description: 'En tu correo registrado.',
    icon: Mail,
  },
  {
    id: 'sms',
    title: 'SMS',
    description: 'En tu número de teléfono.',
    icon: Smartphone,
  },
];

interface NotificationsSettingsScreenProps {
  onBack?: () => void;
}

export const NotificationsSettingsScreen: React.FC<
  NotificationsSettingsScreenProps
> = ({ onBack }) => {
  const [toggles, setToggles] = useState<Record<string, boolean>>(
    INITIAL_TOGGLES,
  );
  const [method, setMethod] = useState<NotificationMethod>('push');

  const { width } = useWindowDimensions();
  const scale = Math.min(Math.max(width / DESIGN_WIDTH, 0.8), 1);
  const styles = useMemo(() => createStyles(scale), [scale]);

  const handleToggle = (id: string) => {
    setToggles(prev => ({ ...prev, [id]: !prev[id] }));
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
        <Text style={styles.headerTitle}>Notificaciones</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View>
          {TOGGLE_OPTIONS.map((option, index) => (
            <View key={option.id}>
              <View style={styles.toggleRow}>
                <View style={styles.rowText}>
                  <Text style={styles.rowTitle}>{option.title}</Text>
                  <Text style={styles.rowDescription}>
                    {option.description}
                  </Text>
                </View>
                <Switch
                  value={toggles[option.id]}
                  onValueChange={() => handleToggle(option.id)}
                  trackColor={{
                    false: COLORS.switchOff,
                    true: COLORS.primaryViolet,
                  }}
                  thumbColor={COLORS.background}
                />
              </View>
              {index < TOGGLE_OPTIONS.length - 1 && (
                <View style={styles.divider} />
              )}
            </View>
          ))}

          <View style={styles.divider} />
          <Text style={styles.sectionTitle}>Método de notificación</Text>

          {METHOD_OPTIONS.map((option, index) => {
            const Icon = option.icon;
            const isSelected = method === option.id;

            return (
              <View key={option.id}>
                <TouchableOpacity
                  style={styles.methodRow}
                  activeOpacity={0.7}
                  onPress={() => setMethod(option.id)}
                  accessibilityRole="radio"
                  accessibilityState={{ checked: isSelected }}
                >
                  <View style={styles.methodIconContainer}>
                    <Icon size={20} color={COLORS.primaryViolet} />
                  </View>

                  <View style={styles.rowText}>
                    <Text style={styles.rowTitle}>{option.title}</Text>
                    <Text style={styles.rowDescription}>
                      {option.description}
                    </Text>
                  </View>

                  <View
                    style={[styles.radio, isSelected && styles.radioSelected]}
                  >
                    {isSelected && <View style={styles.radioDot} />}
                  </View>
                </TouchableOpacity>
                {index < METHOD_OPTIONS.length - 1 && (
                  <View style={styles.divider} />
                )}
              </View>
            );
          })}
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
      paddingVertical: 22 * scale,
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
      paddingTop: 8 * scale,
      paddingBottom: 32 * scale,
      flexGrow: 1,
    },
    toggleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 20 * scale,
      paddingVertical: 22 * scale,
    },
    methodRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 20 * scale,
      paddingVertical: 22 * scale,
    },
    rowText: {
      flex: 1,
      marginRight: 12 * scale,
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
    divider: {
      height: 1,
      backgroundColor: COLORS.dividerLight,
      marginHorizontal: 20 * scale,
    },
    sectionTitle: {
      fontSize: 13 * scale,
      fontWeight: '700',
      color: COLORS.textMuted,
      textTransform: 'uppercase',
      marginTop: 24 * scale,
      marginBottom: 4 * scale,
      paddingHorizontal: 20 * scale,
    },
    methodIconContainer: {
      width: 38 * scale,
      height: 38 * scale,
      borderRadius: 12 * scale,
      backgroundColor: COLORS.primaryVioletSoft,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 12 * scale,
    },
    radio: {
      width: 22 * scale,
      height: 22 * scale,
      borderRadius: 11 * scale,
      borderWidth: 2,
      borderColor: COLORS.textMuted,
      alignItems: 'center',
      justifyContent: 'center',
    },
    radioSelected: {
      borderColor: COLORS.primaryViolet,
    },
    radioDot: {
      width: 12 * scale,
      height: 12 * scale,
      borderRadius: 6 * scale,
      backgroundColor: COLORS.primaryViolet,
    },
  });

export default NotificationsSettingsScreen;