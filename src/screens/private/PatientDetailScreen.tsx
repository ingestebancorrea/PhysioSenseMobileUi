import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  CircleCheck,
  Ellipsis,
} from 'lucide-react-native';
import { COLORS, CARD } from '@/constants/theme';
import { getPatientById } from '@/mock/patientData';
import type { Patient } from '@/types/patient';
import { StatusBadge } from '@/components/patients/StatusBadge';
import { ProgressRing } from '@/components/patients/ProgressRing';
import { Button } from '@/components/common/button/Button';

type DetailTab = 'Resumen' | 'Progreso' | 'Sesiones' | 'Evaluaciones';

interface PatientDetailScreenProps {
  patientId: string;
  onBack: () => void;
  onCreateSession?: () => void;
}

const DETAIL_TABS: DetailTab[] = ['Resumen', 'Progreso', 'Sesiones', 'Evaluaciones'];

export const PatientDetailScreen: React.FC<PatientDetailScreenProps> = ({
  patientId,
  onBack,
  onCreateSession,
}) => {
  const [activeTab, setActiveTab] = useState<DetailTab>('Resumen');
  const patient: Patient | undefined = getPatientById(patientId);

  if (!patient) {
    return (
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <View style={styles.centered}>
          <Text style={styles.emptyText}>Paciente no encontrado</Text>
          <Button title="Volver" onPress={onBack} variant="primary" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.backButton}
          activeOpacity={0.7}
          onPress={onBack}
        >
          <ArrowLeft size={22} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.topBarTitle} numberOfLines={1}>
          {patient.name}
        </Text>
        <TouchableOpacity style={styles.menuButton} activeOpacity={0.7}>
          <Ellipsis size={22} color={COLORS.textPrimary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.profileCard}>
          <View style={styles.avatarLarge}>
            <Text style={styles.avatarInitial}>
              {patient.name.charAt(0)}
            </Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{patient.name}</Text>
            <Text style={styles.profileSubtitle}>
              ID: {patient.id} • {patient.age} años
            </Text>
            <View style={styles.badgeRow}>
              <StatusBadge status={patient.status} />
            </View>
          </View>
        </View>

        <View style={styles.tabBar}>
          {DETAIL_TABS.map(tab => {
            const isActive = tab === activeTab;
            return (
              <TouchableOpacity
                key={tab}
                style={[styles.tab, isActive && styles.tabActive]}
                activeOpacity={0.7}
                onPress={() => setActiveTab(tab)}
              >
                <Text
                  style={[styles.tabText, isActive && styles.tabTextActive]}
                >
                  {tab}
                </Text>
                {isActive && <View style={styles.tabIndicator} />}
              </TouchableOpacity>
            );
          })}
        </View>

        {activeTab === 'Resumen' && (
          <>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Información general</Text>
              <View style={styles.infoCard}>
                <InfoRow label="Diagnóstico" value={patient.diagnosis ?? '—'} />
                <InfoRow label="Fecha de inicio" value={patient.startDate ?? '—'} />
                <InfoRow
                  label="Fisioterapeuta"
                  value={patient.therapistName ?? '—'}
                  last
                />
              </View>
            </View>

            {patient.metrics && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Resumen de progreso</Text>
                <View style={styles.metricsCard}>
                  <ProgressRing
                    value={patient.metrics.compliance}
                    label="Cumplimiento"
                    color={COLORS.violet}
                  />
                  <ProgressRing
                    value={patient.metrics.rom}
                    label="Rango de\nmovimiento"
                    color={COLORS.orange}
                  />
                  <ProgressRing
                    value={patient.metrics.strength}
                    label="Fuerza"
                    color={COLORS.violet}
                  />
                </View>
              </View>
            )}

            {patient.lastSessionDetail && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Última sesión</Text>
                <View style={styles.lastSessionCard}>
                  <View style={styles.sessionCheckIcon}>
                    <CircleCheck size={20} color={COLORS.success} />
                  </View>
                  <View style={styles.sessionInfo}>
                    <Text style={styles.sessionTime}>{patient.lastSession}</Text>
                    <Text style={styles.sessionDetail}>
                      Ejercicios completados:{' '}
                      {patient.lastSessionDetail.completedExercises}/
                      {patient.lastSessionDetail.totalExercises}
                    </Text>
                  </View>
                </View>
              </View>
            )}
          </>
        )}

        {activeTab !== 'Resumen' && (
          <View style={styles.section}>
            <View style={styles.placeholderContainer}>
              <Text style={styles.placeholderText}>
                Contenido de {activeTab} próximamente
              </Text>
            </View>
          </View>
        )}
      </ScrollView>

      <View style={styles.bottomAction}>
        <Button
          title="Nueva sesión"
          onPress={onCreateSession ?? (() => {})}
          variant="primary"
          size="large"
          style={styles.newSessionButton}
        />
      </View>
    </SafeAreaView>
  );
};

const InfoRow: React.FC<{
  label: string;
  value: string;
  last?: boolean;
}> = ({ label, value, last }) => (
  <View style={[styles.infoRow, !last && styles.infoRowBorder]}>
    <Text style={styles.infoLabel}>{label}</Text>
    <Text style={styles.infoValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.backgroundMuted,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    gap: 16,
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.textMuted,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
  },
  topBarTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginHorizontal: 8,
  },
  menuButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  profileCard: {
    ...CARD,
    marginHorizontal: 20,
    marginTop: 4,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  avatarLarge: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: COLORS.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitial: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.violet,
  },
  profileInfo: {
    flex: 1,
    marginLeft: 14,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  profileSubtitle: {
    fontSize: 13,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  badgeRow: {
    marginTop: 8,
    alignSelf: 'flex-start',
  },
  tabBar: {
    flexDirection: 'row',
    marginTop: 16,
    marginHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderSubtle,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    position: 'relative',
  },
  tabActive: {},
  tabText: {
    fontSize: 13,
    fontWeight: '500',
    color: COLORS.textMuted,
  },
  tabTextActive: {
    fontWeight: '700',
    color: COLORS.violet,
  },
  tabIndicator: {
    position: 'absolute',
    bottom: -1,
    left: '20%',
    right: '20%',
    height: 3,
    borderRadius: 2,
    backgroundColor: COLORS.violet,
  },
  section: {
    marginTop: 20,
    marginHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 12,
  },
  infoCard: {
    ...CARD,
    paddingVertical: 4,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 4,
  },
  infoRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderSubtle,
  },
  infoLabel: {
    fontSize: 13,
    color: COLORS.textMuted,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textPrimary,
    flexShrink: 1,
    textAlign: 'right',
    marginLeft: 12,
  },
  metricsCard: {
    ...CARD,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-start',
    paddingVertical: 20,
  },
  lastSessionCard: {
    ...CARD,
    flexDirection: 'row',
    alignItems: 'center',
  },
  sessionCheckIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.successSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  sessionInfo: {
    flex: 1,
  },
  sessionTime: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  sessionDetail: {
    fontSize: 13,
    color: COLORS.textSubtitle,
    marginTop: 2,
  },
  placeholderContainer: {
    ...CARD,
    alignItems: 'center',
    paddingVertical: 40,
  },
  placeholderText: {
    fontSize: 14,
    color: COLORS.textMuted,
  },
  bottomAction: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingBottom: 24,
    paddingTop: 12,
    backgroundColor: COLORS.backgroundMuted,
  },
  newSessionButton: {
    borderRadius: 14,
    backgroundColor: COLORS.violet,
  },
});
