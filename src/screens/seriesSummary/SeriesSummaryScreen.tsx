import React, { useCallback } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  useNavigation,
  useRoute,
  type RouteProp,
} from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SuccessBadge } from '@/components/seriesSummary/SuccessBadge';
import { SeriesMetricsRow } from '@/components/seriesSummary/SeriesMetricsRow';
import { RestTimerCard } from '@/components/seriesSummary/RestTimerCard';
import { COLORS } from '@/constants/theme';
import { usePrivateTabBar } from '@/context/PrivateTabBarContext';
import { getExerciseConfig } from '@/screens/execution/exerciseConfig';
import type { ExerciseFlowParamList } from '@/navigation/types/exerciseFlowParams';
import type { QualityLevel } from '@/types/execution';

const REST_DURATION = 30;

export const SeriesSummaryScreen: React.FC = () => {
  const route = useRoute<RouteProp<ExerciseFlowParamList, 'SeriesSummary'>>();
  const navigation =
    useNavigation<NativeStackNavigationProp<ExerciseFlowParamList>>();
  const { hide, show } = usePrivateTabBar();

  const { exerciseId, currentSeries, totalSeries, averageForce, averageQuality } =
    route.params;

  React.useEffect(() => {
    hide();
    return show;
  }, [hide, show]);

  const exerciseName = getExerciseConfig(exerciseId).name;
  const totalRepetitions = getExerciseConfig(exerciseId).totalReps;

  const goToProgress = useCallback(() => {
    navigation.replace('ExerciseProgress', {
      exerciseId,
      completedSeries: currentSeries,
      completedReps: totalRepetitions,
      averageForce,
      averageQuality,
    });
  }, [navigation, exerciseId, currentSeries, totalRepetitions, averageForce, averageQuality]);

  const handleSkip = useCallback(() => {
    const nextSeries = currentSeries + 1;
    if (nextSeries <= totalSeries) {
      navigation.replace('Countdown', {
        exerciseId,
        currentSeries: nextSeries,
        totalSeries,
      });
    } else {
      goToProgress();
    }
  }, [navigation, exerciseId, currentSeries, totalSeries, goToProgress]);

  const handleTimerEnd = useCallback(() => {
    handleSkip();
  }, [handleSkip]);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <View style={styles.content}>
        <View style={styles.centerContent}>
          <SuccessBadge />

          <Text style={styles.subtitle}>
            {exerciseName} — Serie {currentSeries} de {totalSeries}
          </Text>

          <SeriesMetricsRow
            completedReps={totalRepetitions}
            totalReps={totalRepetitions}
            averageQuality={averageQuality as QualityLevel}
            averageForce={averageForce}
          />
        </View>

        <RestTimerCard
          initialSeconds={REST_DURATION}
          isLastSeries={currentSeries >= totalSeries}
          onNextSeries={handleSkip}
          onTimerComplete={handleTimerEnd}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 20,
    justifyContent: 'space-between',
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 28,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.textSecondary,
  },
});
