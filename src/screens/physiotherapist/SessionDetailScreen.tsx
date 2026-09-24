import React, { useMemo } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import {
  CalendarDays,
  CheckCircle2,
  Clock,
  Dumbbell,
  ListChecks,
  Target,
  TrendingUp,
} from 'lucide-react-native';
import { COLORS } from '@/constants/theme';
import { ScreenHeader } from '@/components/common/screenHeader/ScreenHeader';
import { SessionStatusBadge } from '@/components/sessions/SessionStatusBadge';
import { getInitials } from '@/utils/helpers/nameInitials';
import { useDrawer } from '@/context/DrawerContext';
import { useNavigate } from '@/context/PrivateNavigationContext';
import type { Session, SessionStatus } from '@/types/session';

const STATUS_GRADIENT: Record<SessionStatus, readonly [string, string]> = {
  Activa: ['#7C6FF0', '#4538B0'],
  Programada: ['#3B82F6', '#1E40AF'],
  Borrador: ['#98A1B3', '#64748B'],
  Completada: ['#34D399', '#047857'],
};

interface SessionDetailScreenProps {
  session: Session;
  onBack: () => void;
}

const clampProgress = (value: number): number =>
  Math.min(100, Math.max(0, value));

export const SessionDetailScreen: React.FC<SessionDetailScreenProps> = ({
  session,
  onBack,
}) => {
  const { open } = useDrawer();
  const navigate = useNavigate();

  const progress = clampProgress(session.progress ?? 0);
  const exercises = session.exercises ?? [];
  const gradient = STATUS_GRADIENT[session.status];

  const progressColor = useMemo(() => {
    if (progress === 100) return COLORS.success;
    if (progress >= 50) return COLORS.primary;
    if (progress > 0) return COLORS.warning;
    return COLORS.inactive;
  }, [progress]);

  const accentColors = [
    COLORS.primarySoft,
    COLORS.skyBlueSoft,
    COLORS.successSoft,
    COLORS.violetSoft,
  ];

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <ScreenHeader
        title="Detalle de la sesión"
        onMenuPress={open}
        onNotificationsPress={() => navigate('notifications')}
      />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <LinearGradient
          colors={[...gradient]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.hero}
        >
          <View style={styles.heroTopRow}>
            <View style={styles.avatarBadge}>
              {session.patientAvatarUrl ? (
                <Image
                  source={{ uri: session.patientAvatarUrl }}
                  style={styles.avatarImage}
                />
              ) : (
                <Text style={styles.avatarInitials}>
                  {getInitials(session.patientName)}
                </Text>
              )}
            </View>
            <View style={styles.badgeWrapper}>
              <SessionStatusBadge status={session.status} />
            </View>
          </View>

          <Text style={styles.heroTitle} numberOfLines={2}>
            {session.title}
          </Text>
          <Text style={styles.heroPatient}>
            Paciente: {session.patientName}
          </Text>

          <View style={styles.heroMetaRow}>
            <View style={styles.heroMetaItem}>
              <CalendarDays size={14} color="rgba(255,255,255,0.95)" />
              <Text style={styles.heroMetaText}>{session.dateText}</Text>
            </View>
          </View>
        </LinearGradient>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <ListChecks size={20} color={COLORS.primary} />
            <Text style={styles.statValue}>{session.exerciseCount}</Text>
            <Text style={styles.statLabel}>Ejercicios</Text>
          </View>
          <View style={styles.statCard}>
            <Clock size={20} color={COLORS.primary} />
            <Text style={styles.statValue}>{session.durationMinutes}</Text>
            <Text style={styles.statLabel}>Minutos</Text>
          </View>
          <View style={styles.statCard}>
            <TrendingUp size={20} color={progressColor} />
            <Text style={[styles.statValue, { color: progressColor }]}>
              {progress}%
            </Text>
            <Text style={styles.statLabel}>Progreso</Text>
          </View>
        </View>

        {!!session.objective && (
          <View style={styles.objectiveCard}>
            <View style={styles.objectiveIcon}>
              <Target size={18} color={COLORS.primary} />
            </View>
            <View style={styles.objectiveBody}>
              <Text style={styles.objectiveTitle}>Objetivo de la sesión</Text>
              <Text style={styles.objectiveText}>{session.objective}</Text>
            </View>
          </View>
        )}

        <View style={styles.progressBlock}>
          <View style={styles.progressHeader}>
            <Text style={styles.sectionTitle}>Progreso general</Text>
            <Text style={[styles.progressPercent, { color: progressColor }]}>
              {progress}%
            </Text>
          </View>
          <View style={styles.progressTrack}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${progress}%`,
                  backgroundColor: progressColor,
                },
              ]}
            />
          </View>
          <Text style={styles.progressHelper}>
            {progress === 100
              ? 'Sesión completada satisfactoriamente.'
              : progress > 0
                ? `Sesión en curso, ${progress}% de avance registrado.`
                : 'La sesión aún no ha comenzado.'}
          </Text>
        </View>

        <Text style={styles.sectionTitle}>Ejercicios de la sesión</Text>
        <View style={styles.exercisesCard}>
          {exercises.length === 0 ? (
            <View style={styles.emptyExercises}>
              <Dumbbell size={22} color={COLORS.textMuted} />
              <Text style={styles.emptyExercisesText}>
                Aún no se han asignado ejercicios.
              </Text>
            </View>
          ) : (
            exercises.map((exercise, index) => {
              const accent = accentColors[index % accentColors.length];
              return (
                <View
                  key={exercise.id}
                  style={[
                    styles.exerciseRow,
                    index === exercises.length - 1 && styles.exerciseRowLast,
                  ]}
                >
                  <View
                    style={[styles.exerciseIcon, { backgroundColor: accent }]}
                  >
                    {exercise.imageUrl ? (
                      <Image
                        source={{ uri: exercise.imageUrl }}
                        style={styles.exerciseImage}
                        resizeMode="cover"
                      />
                    ) : (
                      <Dumbbell size={18} color={COLORS.primary} />
                    )}
                  </View>
                  <View style={styles.exerciseInfo}>
                    <Text style={styles.exerciseName} numberOfLines={1}>
                      {exercise.title}
                    </Text>
                    <Text style={styles.exerciseMeta}>
                      {exercise.sessions} • {exercise.repetitions}
                    </Text>
                  </View>
                </View>
              );
            })
          )}
        </View>

        <TouchableOpacity
          style={styles.primaryButton}
          activeOpacity={0.8}
          onPress={onBack}
        >
          <CheckCircle2 size={18} color={COLORS.white} />
          <Text style={styles.primaryButtonText}>Volver a sesiones</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.backgroundMuted,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 4,
    paddingBottom: 24,
  },
  hero: {
    borderRadius: 18,
    padding: 18,
  },
  heroTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  avatarBadge: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.6)',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  avatarInitials: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.white,
  },
  badgeWrapper: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    paddingHorizontal: 2,
    paddingVertical: 2,
  },
  heroTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.white,
    lineHeight: 24,
  },
  heroPatient: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: 4,
  },
  heroMetaRow: {
    marginTop: 12,
    flexDirection: 'row',
  },
  heroMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    borderRadius: 10,
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  heroMetaText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.white,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 14,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    gap: 4,
  },
  statValue: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  statLabel: {
    fontSize: 11,
    color: COLORS.textMuted,
  },
  objectiveCard: {
    flexDirection: 'row',
    gap: 12,
    backgroundColor: COLORS.primarySoft,
    borderRadius: 14,
    padding: 14,
    marginTop: 14,
  },
  objectiveIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  objectiveBody: {
    flex: 1,
  },
  objectiveTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.primaryDark,
  },
  objectiveText: {
    fontSize: 13,
    lineHeight: 19,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  progressBlock: {
    marginTop: 20,
  },
  progressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 10,
  },
  progressPercent: {
    fontSize: 15,
    fontWeight: '700',
  },
  progressTrack: {
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.progressTrack,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressHelper: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 8,
  },
  exercisesCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    paddingHorizontal: 8,
  },
  exerciseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  exerciseRowLast: {
    borderBottomWidth: 0,
  },
  exerciseIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  exerciseImage: {
    width: '100%',
    height: '100%',
  },
  exerciseInfo: {
    flex: 1,
    marginLeft: 12,
  },
  exerciseName: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  exerciseMeta: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  emptyExercises: {
    alignItems: 'center',
    paddingVertical: 26,
    gap: 8,
  },
  emptyExercisesText: {
    fontSize: 13,
    color: COLORS.textMuted,
  },
  primaryButton: {
    height: 50,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: COLORS.primary,
    marginTop: 24,
  },
  primaryButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.white,
  },
});