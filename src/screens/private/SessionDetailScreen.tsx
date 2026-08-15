import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS } from '@/constants/theme';
import { MOCK_SESSION_DETAIL } from '@/mock/sessionDetailData';
import type { ProgressFlowParamList } from '@/navigation/types/progressFlowParams';
import type { Exercise, SessionDetail } from '@/types/progress';

type SessionDetailScreenProps = NativeStackScreenProps<
  ProgressFlowParamList,
  'SessionDetail'
>;

type IconName = React.ComponentProps<typeof MaterialCommunityIcons>['name'];

const STATUS_COLORS: Record<
  SessionDetail['status'],
  { color: string; backgroundColor: string }
> = {
  Completada: { color: '#1E8449', backgroundColor: '#E8F8F0' },
  Pendiente: { color: COLORS.warning, backgroundColor: '#FEF5E5' },
  Incompleta: { color: COLORS.textSecondary, backgroundColor: COLORS.progressTrack },
};

const ExerciseRow: React.FC<{ exercise: Exercise }> = ({ exercise }) => (
  <View style={styles.exerciseRow}>
    <View style={styles.exerciseHeader}>
      <View style={styles.exerciseInfo}>
        <Text style={styles.exerciseName}>{exercise.name}</Text>
        <Text style={styles.exerciseDetail}>{exercise.setsAndReps}</Text>
      </View>
      <Text style={styles.exercisePercentage}>
        {`${exercise.progressPercentage}%`}
      </Text>
    </View>
    <View style={styles.progressTrack}>
      <View
        style={[
          styles.progressFill,
          { width: `${exercise.progressPercentage}%` },
        ]}
      />
    </View>
  </View>
);

export const SessionDetailScreen: React.FC<SessionDetailScreenProps> = ({
  navigation,
}) => {
  const detail: SessionDetail = MOCK_SESSION_DETAIL;

  const statusStyle = STATUS_COLORS[detail.status];

  const metrics = [
    {
      key: 'time',
      label: 'Tiempo total',
      value: detail.totalTime,
      icon: 'timer-outline' as IconName,
    },
    {
      key: 'reps',
      label: 'Repeticiones',
      value: String(detail.totalReps),
      icon: 'repeat' as IconName,
    },
    {
      key: 'progress',
      label: 'Progreso',
      value: `${detail.overallProgress}%`,
      icon: 'chart-bar' as IconName,
    },
  ];

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerButton}
          activeOpacity={0.7}
          onPress={() => navigation.goBack()}
        >
          <MaterialCommunityIcons
            name="arrow-left"
            size={24}
            color={COLORS.textPrimary}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detalle de sesión</Text>
        <TouchableOpacity style={styles.headerButton} activeOpacity={0.7}>
          <MaterialCommunityIcons
            name="share-variant"
            size={22}
            color={COLORS.textPrimary}
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.statusRow}>
          <Text style={styles.dateText}>{detail.date}</Text>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: statusStyle.backgroundColor },
            ]}
          >
            <Text style={[styles.statusBadgeText, { color: statusStyle.color }]}>
              {detail.status}
            </Text>
          </View>
        </View>

        <View style={styles.metricsCard}>
          {metrics.map(metric => (
            <View key={metric.key} style={styles.metricColumn}>
              <MaterialCommunityIcons
                name={metric.icon}
                size={20}
                color={COLORS.primary}
              />
              <Text style={styles.metricValue}>{metric.value}</Text>
              <Text style={styles.metricLabel}>{metric.label}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Ejercicios realizados</Text>
        <View style={styles.exercisesCard}>
          {detail.exercises.map(exercise => (
            <ExerciseRow key={exercise.id} exercise={exercise} />
          ))}
        </View>

        <Text style={styles.sectionTitle}>Observaciones</Text>
        <View style={styles.observationsBox}>
          <Text style={styles.observationsText}>
            {detail.observations ?? 'Sin observaciones.'}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FAF9FE',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  headerButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    textAlign: 'center',
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  dateText: {
    flex: 1,
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  metricsCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    paddingVertical: 18,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  metricColumn: {
    flex: 1,
    alignItems: 'center',
    gap: 6,
  },
  metricValue: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  metricLabel: {
    fontSize: 12,
    color: COLORS.textMuted,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginTop: 24,
    marginBottom: 12,
  },
  exercisesCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    paddingHorizontal: 16,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  exerciseRow: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  exerciseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  exerciseInfo: {
    flex: 1,
    marginRight: 12,
  },
  exerciseName: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  exerciseDetail: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  exercisePercentage: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.success,
  },
  progressTrack: {
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.progressTrack,
    marginTop: 10,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
    backgroundColor: COLORS.success,
  },
  observationsBox: {
    backgroundColor: COLORS.progressTrack,
    borderRadius: 12,
    padding: 14,
  },
  observationsText: {
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.textSecondary,
  },
  bottomNav: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 10,
    paddingBottom: 6,
    paddingHorizontal: 8,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 4,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navLabel: {
    fontSize: 11,
    marginTop: 4,
    fontWeight: '500',
  },
  navLabelActive: {
    fontWeight: 'bold',
  },
});
