import React, { useCallback, useState } from 'react';
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

import { ExerciseDetailTab } from '@/components/exerciseProgress/ExerciseDetailTab';
import { MetricsListCard } from '@/components/exerciseProgress/MetricsListCard';
import { RecommendationCard } from '@/components/exerciseProgress/RecommendationCard';
import { SummaryCardsGrid } from '@/components/exerciseProgress/SummaryCardsGrid';
import { TopTabSelector } from '@/components/exerciseProgress/TopTabSelector';
import { ICONS } from '@/constants/icons';
import { COLORS } from '@/constants/theme';
import { useNavigate } from '@/context/PrivateNavigationContext';
import { usePrivateTabBar } from '@/context/PrivateTabBarContext';
import type { ExerciseFlowParamList } from '@/navigation/types/exerciseFlowParams';
import { getExerciseConfig } from '@/screens/execution/exerciseConfig';
import type { AverageMetric, ProgressTab, SummaryMetric } from '@/types/exerciseProgress';

const H_PADDING = 20;
const QUALITY_SCORE = 91;

const SUMMARY_METRICS: SummaryMetric[] = [
  { id: 'series', title: 'Series', value: '3 / 3' },
  { id: 'reps', title: 'Repeticiones', value: '45 / 45' },
  { id: 'quality', title: 'Calidad promedio', value: `${QUALITY_SCORE}%` },
];

const AVERAGE_METRICS: AverageMetric[] = [
  { id: 'force', label: 'Fuerza promedio', value: '25 N' },
  { id: 'angle', label: 'Ángulo promedio', value: '82°' },
  { id: 'range', label: 'Rango de movimiento', value: '60° - 90°' },
  { id: 'time', label: 'Tiempo total', value: '08:45' },
];

export const ExerciseProgressScreen: React.FC = () => {
  const route = useRoute<RouteProp<ExerciseFlowParamList, 'ExerciseProgress'>>();
  const navigation =
    useNavigation<NativeStackNavigationProp<ExerciseFlowParamList>>();
  const { hide, show } = usePrivateTabBar();
  const navigatePrivate = useNavigate();

  const [activeTab, setActiveTab] = useState<ProgressTab>('Resumen');

  const { exerciseId } = route.params;
  const config = getExerciseConfig(exerciseId);
  const BackIcon = ICONS.arrowLeft;

  React.useEffect(() => {
    hide();
    return show;
  }, [hide, show]);

  const handleViewDetail = useCallback(() => {
    setActiveTab('Detalle');
  }, []);

  const handleExit = useCallback(() => {
    navigation.popToTop();
  }, [navigation]);

  const handleFinish = useCallback(() => {
    navigatePrivate('home');
  }, [navigatePrivate]);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          activeOpacity={0.7}
          onPress={handleExit}
        >
          <BackIcon size={22} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {config.name}
        </Text>
        <View style={styles.headerRightPlaceholder} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <TopTabSelector activeTab={activeTab} onChange={setActiveTab} />

        {activeTab === 'Resumen' && (
          <>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Resumen del ejercicio</Text>
              <Text style={styles.sectionSubtitle}>
                Hoy, 17 Mayo 2025 - 10:30 a. m.
              </Text>
            </View>

            <SummaryCardsGrid metrics={SUMMARY_METRICS} />
            <MetricsListCard title="Métricas promedio" metrics={AVERAGE_METRICS} />
            <RecommendationCard qualityScore={QUALITY_SCORE} />
          </>
        )}

        {activeTab === 'Detalle' && <ExerciseDetailTab onFinish={handleFinish} />}
      </ScrollView>

      {activeTab === 'Resumen' && (
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.primaryButton}
            activeOpacity={0.85}
            onPress={handleViewDetail}
          >
            <Text style={styles.buttonText}>Ver detalle</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.backgroundMuted,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: H_PADDING,
    paddingVertical: 14,
    gap: 12,
  },
  backButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    flex: 1,
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.textPrimary,
    textAlign: 'center',
  },
  headerRightPlaceholder: {
    width: 32,
  },
  scroll: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: H_PADDING,
    paddingBottom: 20,
  },
  sectionHeader: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  sectionSubtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  footer: {
    paddingHorizontal: H_PADDING,
    paddingTop: 8,
    paddingBottom: 16,
    backgroundColor: COLORS.backgroundMuted,
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '700',
  },
});