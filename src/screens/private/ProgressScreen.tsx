import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { ICONS } from '@/constants/icons';
import { COLORS } from '@/constants/theme';
import { CompletedSessionsChartCard } from '@/components/progress/CompletedSessionsChartCard';
import { DateRangeHeader } from '@/components/progress/DateRangeHeader';
import { PeriodSelectorTabs } from '@/components/progress/PeriodSelectorTabs';
import { ProgressMetricCard } from '@/components/progress/ProgressMetricCard';
import { RangeMotionChartCard } from '@/components/progress/RangeMotionChartCard';
import { MOCK_PROGRESS_DATA } from '@/mock/progressData';
import type { ProgressPeriod } from '@/types/progress';

const ACTIVE_TAB_KEY = 'progreso';

const TAB_ITEMS = [
  { key: 'inicio', label: 'Inicio', icon: 'house' as const },
  { key: 'ejercicios', label: 'Ejercicios', icon: 'hand' as const },
  { key: 'progreso', label: 'Progreso', icon: 'chart' as const },
  { key: 'perfil', label: 'Perfil', icon: 'user' as const },
];

export const ProgressScreen: React.FC = () => {
  const { dateRange, motionPoints, metrics, completedSessions } =
    MOCK_PROGRESS_DATA;
  const [selectedPeriod, setSelectedPeriod] = useState<ProgressPeriod>(
    MOCK_PROGRESS_DATA.activePeriod,
  );

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <DashboardHeader title="Progreso" />

        <PeriodSelectorTabs
          selected={selectedPeriod}
          onSelect={setSelectedPeriod}
        />

        <DateRangeHeader dateRange={dateRange} />

        <View style={styles.section}>
          <RangeMotionChartCard points={motionPoints} />
        </View>

        <View style={styles.metricsGrid}>
          {metrics.map(metric => (
            <ProgressMetricCard key={metric.title} metric={metric} />
          ))}
        </View>

        <View style={styles.section}>
          <CompletedSessionsChartCard sessions={completedSessions} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 12,
  },
  section: {
    marginTop: 24,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    rowGap: 12,
    columnGap: 12,
    marginTop: 24,
  },
  tabBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: COLORS.surface,
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
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabLabel: {
    fontSize: 11,
    marginTop: 4,
    fontWeight: '500',
  },
  tabLabelActive: {
    fontWeight: 'bold',
  },
});
