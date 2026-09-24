import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  useNavigation,
  useRoute,
  type RouteProp,
} from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RepetitionHeader } from '@/components/execution/RepetitionHeader';
import { AngleProgressRing } from '@/components/execution/AngleProgressRing';
import { MetricsGrid } from '@/components/execution/MetricsGrid';
import { TargetRangeBar } from '@/components/execution/TargetRangeBar';
import { ICONS } from '@/constants/icons';
import { COLORS } from '@/constants/theme';
import { usePrivateTabBar } from '@/context/PrivateTabBarContext';
import { getExerciseConfig } from '@/screens/execution/exerciseConfig';
import type { ExerciseFlowParamList } from '@/navigation/types/exerciseFlowParams';
import type { QualityLevel } from '@/types/execution';

const TICK_MS = 60;

export const ExecutionScreen: React.FC = () => {
  const route = useRoute<RouteProp<ExerciseFlowParamList, 'Execution'>>();
  const navigation =
    useNavigation<NativeStackNavigationProp<ExerciseFlowParamList>>();
  const { hide, show } = usePrivateTabBar();

  const exerciseId = route.params?.exerciseId;
  const config = getExerciseConfig(exerciseId);

  const [currentAngle, setCurrentAngle] = useState(0);
  const [force, setForce] = useState(20);
  const [quality, setQuality] = useState<QualityLevel>('Buena');
  const [repetition, setRepetition] = useState(route.params?.currentRepetition ?? 1);
  const currentSeries = route.params?.currentSeries ?? 1;

  const forceSumRef = useRef(0);
  const qualityCountRef = useRef<Record<QualityLevel, number>>({
    Buena: 0,
    Regular: 0,
    Mala: 0,
  });

  const phaseRef = useRef(0);
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const prevCycleRef = useRef(0);
  const navigatedRef = useRef(false);

  useEffect(() => {
    hide();
    return show;
  }, [hide, show]);

  useEffect(() => {
    phaseRef.current = 0;

    tickRef.current = setInterval(() => {
      phaseRef.current += TICK_MS;

      const t = phaseRef.current / 1000;
      const cycle = Math.sin(t * 2.2);
      const mid = (config.targetRange.min + config.targetRange.max) / 2;
      const halfRange = (config.targetRange.max - config.targetRange.min) / 2;
      const angle = mid + cycle * halfRange * 1.2;
      setCurrentAngle(angle);

      if (prevCycleRef.current > 0 && cycle <= 0) {
        setRepetition((prev) => Math.min(prev + 1, config.totalReps));
      }
      prevCycleRef.current = cycle;

      const baseForce = 18 + Math.sin(t * 3.1) * 12;
      const currentForce = Math.round(baseForce);
      setForce(currentForce);

      const inRange =
        angle >= config.targetRange.min && angle <= config.targetRange.max;
      const aboveThreshold = angle >= config.targetRange.max * 0.8;
      const currentQuality: QualityLevel =
        inRange || aboveThreshold ? 'Buena' : angle >= 20 ? 'Regular' : 'Mala';
      setQuality(currentQuality);

      forceSumRef.current += currentForce;
      qualityCountRef.current[currentQuality] += 1;
    }, TICK_MS);

    return () => {
      if (tickRef.current) {
        clearInterval(tickRef.current);
      }
    };
  }, [config.targetRange.min, config.targetRange.max, config.totalReps]);

  const handleFinishSeries = useCallback(() => {
    if (tickRef.current) {
      clearInterval(tickRef.current);
    }

    const totalSamples = Object.values(qualityCountRef.current).reduce(
      (a, b) => a + b,
      0,
    );
    const avgForce = totalSamples > 0
      ? Math.round(forceSumRef.current / totalSamples)
      : 0;
    const dominantQuality = (Object.entries(qualityCountRef.current) as [QualityLevel, number][])
      .reduce((best, entry) => (entry[1] > best[1] ? entry : best), ['Buena' as QualityLevel, 0])[0];

    navigation.replace('SeriesSummary', {
      exerciseId,
      currentSeries,
      totalSeries: config.series,
      averageForce: avgForce,
      averageQuality: dominantQuality,
      currentRepetition: repetition,
    });
  }, [navigation, exerciseId, currentSeries, config.series, repetition]);

  useEffect(() => {
    if (repetition >= config.totalReps && !navigatedRef.current) {
      navigatedRef.current = true;
      handleFinishSeries();
    }
  }, [repetition, config.totalReps, handleFinishSeries]);

  const ChevronLeftIcon = ICONS.chevronLeft;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerButton}
          activeOpacity={0.8}
          onPress={() => navigation.goBack()}
        >
          <ChevronLeftIcon size={22} color={COLORS.textPrimary} />
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Text
            style={styles.headerTitle}
            numberOfLines={1}
            adjustsFontSizeToFit
            minimumFontScale={0.8}
          >
            {config.name}
          </Text>
          <View style={styles.headerBadge}>
            <Text style={styles.headerBadgeText}>
              Serie {currentSeries} de {config.series}
            </Text>
          </View>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <RepetitionHeader
          currentRepetition={repetition}
          totalRepetitions={config.totalReps}
        />

        <AngleProgressRing
          progress={currentAngle / 120}
          gloveImage={config.gloveImage}
        />

        <View style={styles.angleTextContainer}>
          <Text style={styles.angleValue}>{Math.round(currentAngle)}°</Text>
          <Text style={styles.angleLabel}>Ángulo de flexión</Text>
        </View>

        <MetricsGrid force={force} quality={quality} />

        <TargetRangeBar
          currentAngle={currentAngle}
          minTargetAngle={config.targetRange.min}
          maxTargetAngle={config.targetRange.max}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.progressTrack,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textPrimary,
    textAlign: 'center',
  },
  headerBadge: {
    marginTop: 2,
    borderRadius: 12,
    paddingVertical: 2,
    paddingHorizontal: 10,
    backgroundColor: COLORS.primarySoft,
  },
  headerBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.primary,
  },
  scroll: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 20,
  },
  angleTextContainer: {
    alignItems: 'center',
    marginTop: -8,
  },
  angleValue: {
    fontSize: 34,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  angleLabel: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
});
