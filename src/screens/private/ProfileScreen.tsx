import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Settings } from 'lucide-react-native';

import { COLORS } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';
import { InfoRow } from '@/components/profile/InfoRow';
import { ProfileSectionCard } from '@/components/profile/ProfileSectionCard';
import { UserCard } from '@/components/profile/UserCard';
import { PATIENT_PROFILE } from '@/mock/patientProfileData';

export const ProfileScreen: React.FC = () => {
  const { logout } = useAuth();
  const { birthDate, dominantHand, diagnosis, assignedTherapist } =
    PATIENT_PROFILE;

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Perfil</Text>
          <TouchableOpacity style={styles.headerButton} activeOpacity={0.8}>
            <Settings size={24} color={COLORS.textPrimary} />
          </TouchableOpacity>
        </View>

        <UserCard profile={PATIENT_PROFILE} />

        <ProfileSectionCard title="Paciente">
          <InfoRow label="Fecha de nacimiento" value={birthDate} showDivider />
          <InfoRow label="Mano dominante" value={dominantHand} showDivider />
          <InfoRow label="Diagnóstico" value={diagnosis} />
        </ProfileSectionCard>

        <View style={styles.therapistCard}>
          <InfoRow
            label="Terapeuta asignado"
            value={assignedTherapist}
            highlightValue
            inline
          />
        </View>

        <TouchableOpacity
          style={styles.logoutButton}
          activeOpacity={0.85}
          onPress={logout}
        >
          <Text style={styles.logoutButtonText}>Cerrar sesión</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FAF9FE',
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 24,
    rowGap: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingVertical: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.textPrimary,
    position: 'absolute',
    left: 0,
    right: 0,
    textAlign: 'center',
  },
  headerButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  therapistCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 16,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
  },
  logoutButton: {
    width: '100%',
    height: 52,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 'auto',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  logoutButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '700',
  },
});

export default ProfileScreen;
