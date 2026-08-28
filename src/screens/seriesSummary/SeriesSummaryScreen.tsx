import React, { useCallback, useRef } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
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

  const finishedRef = useRef(false);

  React.useEffect(() => {
    hide();
    return show;
  }, [hide, show]);

  const exerciseName = getExerciseConfig(exerciseId).name;
  const totalRepetitions = getExerciseConfig(exerciseId).totalReps;

  const handleFinish = useCallback(() => {
    finishedRef.current = true;
    navigation.popToTop();
  }, [navigation]);

  const handleSkip = useCallback(() => {
    if (finishedRef.current) {
      return;
    }
    const nextSeries = currentSeries + 1;
    if (nextSeries <= totalSeries) {
      navigation.replace('Countdown', {
        exerciseId,
        currentSeries: nextSeries,
        totalSeries,
      });
    } else {
      navigation.popToTop();
    }
  }, [navigation, exerciseId, currentSeries, totalSeries]);

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
          onNextSeries={handleSkip}
          onTimerComplete={handleTimerEnd}
        />

        <TouchableOpacity
          style={styles.finishButton}
          activeOpacity={0.8}
          onPress={handleFinish}
        >
          <Text style={styles.finishButtonText}>Finalizar serie</Text>
        </TouchableOpacity>
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
  finishButton: {
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    backgroundColor: COLORS.surface,
    paddingVertical: 14,
    alignItems: 'center',
  },
  finishButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.primary,
  },
});
