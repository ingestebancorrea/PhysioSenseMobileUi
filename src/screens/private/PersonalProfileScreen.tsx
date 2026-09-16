import React, { useMemo, useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
  type TextInputProps,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Camera, ChevronLeft, Pencil } from 'lucide-react-native';

import { getInitials } from '@/utils/helpers/nameInitials';
import {
  THERAPIST_SETTINGS_PROFILE,
} from '@/mock/settingsData';
import { COLORS } from '@/constants/theme';

const DESIGN_WIDTH = 390;

const PROFILE_NAME = THERAPIST_SETTINGS_PROFILE.name;
const PROFILE_ROLE = THERAPIST_SETTINGS_PROFILE.role;

type FieldKey = 'fullName' | 'email' | 'phone' | 'specialty' | 'license';

interface ProfileFieldConfig {
  key: FieldKey;
  label: string;
  keyboardType?: TextInputProps['keyboardType'];
}

const PROFILE_FIELDS: ProfileFieldConfig[] = [
  { key: 'fullName', label: 'Nombre completo' },
  { key: 'email', label: 'Correo electrónico', keyboardType: 'email-address' },
  { key: 'phone', label: 'Teléfono', keyboardType: 'phone-pad' },
  { key: 'specialty', label: 'Especialidad' },
  { key: 'license', label: 'Licencia profesional' },
];

const INITIAL_FORM: Record<FieldKey, string> = {
  fullName: 'María López',
  email: 'maria.lopez@fisioapp.com',
  phone: '+57 300 123 4567',
  specialty: 'Fisioterapia de mano',
  license: 'LP-123456',
};

interface PersonalProfileScreenProps {
  onBack?: () => void;
}

export const PersonalProfileScreen: React.FC<PersonalProfileScreenProps> = ({
  onBack,
}) => {
  const [form, setForm] = useState<Record<FieldKey, string>>(INITIAL_FORM);
  const { width } = useWindowDimensions();
  const scale = Math.min(Math.max(width / DESIGN_WIDTH, 0.8), 1);
  const styles = useMemo(() => createStyles(scale), [scale]);

  const handleChange = (key: FieldKey, value: string) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    Alert.alert('Éxito', 'Perfil actualizado correctamente', [
      { text: 'OK', onPress: onBack },
    ]);
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
        <Text style={styles.headerTitle}>Perfil personal</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarInitials}>{getInitials(PROFILE_NAME)}</Text>
            </View>
            <View style={styles.cameraBadge}>
              <Camera size={14} color={COLORS.background} />
            </View>
          </View>

          <View style={styles.profileInfo}>
            <Text style={styles.profileName} numberOfLines={1}>
              {PROFILE_NAME}
            </Text>
            <View style={styles.roleBadge}>
              <Text style={styles.roleBadgeText}>{PROFILE_ROLE}</Text>
            </View>
          </View>
        </View>

        <View style={styles.form}>
          {PROFILE_FIELDS.map(field => (
            <View key={field.key} style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>{field.label}</Text>
              <View style={styles.fieldBox}>
                <TextInput
                  style={styles.fieldInput}
                  value={form[field.key]}
                  onChangeText={text => handleChange(field.key, text)}
                  keyboardType={field.keyboardType}
                  autoCapitalize="none"
                  placeholder={field.label}
                  placeholderTextColor={COLORS.textMuted}
                />
                <TouchableOpacity
                  style={styles.editButton}
                  activeOpacity={0.7}
                  accessibilityRole="button"
                  accessibilityLabel={`Editar ${field.label}`}
                >
                  <Pencil size={18} color={COLORS.textMuted} />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        <TouchableOpacity
          style={styles.saveButton}
          activeOpacity={0.85}
          onPress={handleSave}
          accessibilityRole="button"
          accessibilityLabel="Guardar cambios"
        >
          <Text style={styles.saveButtonText}>Guardar cambios</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const createStyles = (scale: number) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: COLORS.backgroundLight,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 20 * scale,
      paddingVertical: 12 * scale,
      backgroundColor: COLORS.backgroundLight,
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
      paddingHorizontal: 20 * scale,
      paddingTop: 8 * scale,
      paddingBottom: 32 * scale,
    },
    profileHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 24 * scale,
    },
    avatarContainer: {
      width: 72 * scale,
      height: 72 * scale,
    },
    avatar: {
      width: 72 * scale,
      height: 72 * scale,
      borderRadius: 36 * scale,
      backgroundColor: COLORS.primaryVioletSoft,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 2,
      borderColor: COLORS.background,
    },
    avatarInitials: {
      fontSize: 26 * scale,
      fontWeight: '700',
      color: COLORS.primaryViolet,
    },
    cameraBadge: {
      position: 'absolute',
      bottom: 0,
      right: 0,
      width: 26 * scale,
      height: 26 * scale,
      borderRadius: 13 * scale,
      backgroundColor: COLORS.primaryViolet,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 2,
      borderColor: COLORS.backgroundLight,
    },
    profileInfo: {
      flex: 1,
      marginLeft: 16 * scale,
    },
    profileName: {
      fontSize: 20 * scale,
      fontWeight: '700',
      color: COLORS.textStrong,
    },
    roleBadge: {
      alignSelf: 'flex-start',
      backgroundColor: COLORS.primaryVioletSoft,
      paddingVertical: 4 * scale,
      paddingHorizontal: 12 * scale,
      borderRadius: 12 * scale,
      marginTop: 8 * scale,
    },
    roleBadgeText: {
      fontSize: 12 * scale,
      fontWeight: '600',
      color: COLORS.primaryViolet,
    },
    form: {
      gap: 18 * scale,
    },
    fieldContainer: {
      marginBottom: 2 * scale,
    },
    fieldLabel: {
      fontSize: 13 * scale,
      fontWeight: '600',
      color: COLORS.textMuted,
      marginBottom: 8 * scale,
    },
    fieldBox: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: COLORS.background,
      borderRadius: 12 * scale,
      borderWidth: 1,
      borderColor: COLORS.divider,
      paddingHorizontal: 16 * scale,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.04,
      shadowRadius: 4,
      elevation: 1,
    },
    fieldInput: {
      flex: 1,
      paddingVertical: 14 * scale,
      fontSize: 15 * scale,
      color: COLORS.textStrong,
    },
    editButton: {
      padding: 6 * scale,
      marginLeft: 8 * scale,
    },
    saveButton: {
      backgroundColor: COLORS.primaryViolet,
      borderRadius: 12,
      paddingVertical: 16 * scale,
      alignItems: 'center',
      marginTop: 28 * scale,
    },
    saveButtonText: {
      fontSize: 16 * scale,
      fontWeight: '700',
      color: COLORS.background,
    },
  });

export default PersonalProfileScreen;