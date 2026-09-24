// src/screens/register/AdditionalInfoScreen.tsx
import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  Camera,
  ChevronLeft,
  Phone,
  Upload,
  User,
} from 'lucide-react-native';

import { useRegistration } from '@/context/RegistrationContext';
import { FormField } from '@/components/common/formField/FormField';
import { RegisterFlowParamList } from '@/navigation/types/registerFlowParams';
import { COLORS } from '@/constants/theme';

type AdditionalInfoScreenProps = NativeStackScreenProps<
  RegisterFlowParamList,
  'AdditionalInfo'
>;

const NOTES_MAX_LENGTH = 200;

const AdditionalInfoScreen: React.FC<AdditionalInfoScreenProps> = ({
  navigation,
}) => {
  const { data, updateField } = useRegistration();
  const [notes, setNotes] = useState<string>(data.notes);

  const handleUploadPhoto = () => {
    updateField('photoName', 'perfil.jpg');
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Text style={styles.title}>Información adicional</Text>
            <Text style={styles.subtitle}>Esta información es opcional.</Text>
          </View>

          <FormField
            label="Teléfono (opcional)"
            placeholder="Ej. 300 123 4567"
            value={data.phone}
            onChangeText={text => updateField('phone', text)}
            icon={Phone}
            keyboardType="phone-pad"
            maxLength={15}
          />

          <View style={styles.photoSection}>
            <Text style={styles.photoLabel}>Foto de perfil (opcional)</Text>
            <View style={styles.photoRow}>
              <View style={styles.photoAvatar}>
                <User size={34} color={COLORS.textMuted} strokeWidth={1.5} />
                <View style={styles.photoBadge}>
                  <Camera size={12} color={COLORS.white} strokeWidth={2.5} />
                </View>
              </View>
              <View style={styles.photoInfo}>
                <TouchableOpacity
                  style={styles.uploadButton}
                  activeOpacity={0.8}
                  onPress={handleUploadPhoto}
                >
                  <Upload size={18} color={COLORS.primary} strokeWidth={2} />
                  <Text style={styles.uploadButtonText}>
                    {data.photoName || 'Subir foto'}
                  </Text>
                </TouchableOpacity>
                <Text style={styles.uploadHint}>JPG o PNG, máx. 5MB</Text>
              </View>
            </View>
          </View>

          <View style={styles.notesSection}>
            <Text style={styles.notesLabel}>Notas (opcional)</Text>
            <TextInput
              style={styles.notesInput}
              placeholder="Cuéntanos algo más sobre ti..."
              placeholderTextColor={COLORS.textMuted}
              multiline
              maxLength={NOTES_MAX_LENGTH}
              value={notes}
              onChangeText={text => {
                setNotes(text);
                updateField('notes', text);
              }}
              textAlignVertical="top"
            />
            <Text style={styles.notesCounter}>
              {notes.length}/{NOTES_MAX_LENGTH}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.primaryButton}
            activeOpacity={0.85}
            onPress={() => navigation.navigate('ReviewInformation')}
          >
            <Text style={styles.primaryButtonText}>Continuar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.backButton}
            activeOpacity={0.7}
            onPress={() => navigation.goBack()}
          >
            <ChevronLeft size={20} color={COLORS.textSecondary} strokeWidth={2.2} />
            <Text style={styles.backText}>Volver</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  flex: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 48,
    paddingBottom: 32,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  subtitle: {
    fontSize: 15,
    color: COLORS.textSecondary,
    marginTop: 6,
  },
  photoSection: {
    marginBottom: 20,
  },
  photoLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 12,
  },
  photoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  photoAvatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderStyle: 'dashed',
    backgroundColor: '#F5F6FA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: COLORS.primary,
    borderWidth: 2,
    borderColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoInfo: {
    marginLeft: 18,
    flex: 1,
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 42,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primarySoft,
    paddingHorizontal: 16,
    alignSelf: 'flex-start',
  },
  uploadButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary,
  },
  uploadHint: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 8,
  },
  notesSection: {
    marginBottom: 8,
  },
  notesLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  notesInput: {
    height: 120,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
    paddingHorizontal: 16,
    paddingTop: 14,
    fontSize: 15,
    color: COLORS.textPrimary,
  },
  notesCounter: {
    alignSelf: 'flex-end',
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 6,
  },
  primaryButton: {
    height: 54,
    borderRadius: 14,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 14,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  primaryButtonText: {
    color: COLORS.white,
    fontSize: 17,
    fontWeight: '700',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 16,
  },
  backText: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
});

export default AdditionalInfoScreen;
