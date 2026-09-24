import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { SectionHeader } from '@/components/dashboard/SectionHeader';
import { COLORS } from '@/constants/theme';
import { CompletedSessionsChartCard } from '@/components/progress/CompletedSessionsChartCard';
import { DateRangeHeader } from '@/components/progress/DateRangeHeader';
import { PeriodSelectorTabs } from '@/components/progress/PeriodSelectorTabs';
import { ProgressMetricCard } from '@/components/progress/ProgressMetricCard';
import { RangeMotionChartCard } from '@/components/progress/RangeMotionChartCard';
import { MOCK_PROGRESS_DATA, PROGRESS_WINDOWS } from '@/mock/progressData';
import { useDrawer } from '@/context/DrawerContext';
import { useNavigate } from '@/context/PrivateNavigationContext';
import type { ProgressFlowParamList } from '@/navigation/types/progressFlowParams';
import type { ProgressPeriod } from '@/types/progress';

type ProgressScreenProps = NativeStackScreenProps<
  ProgressFlowParamList,
  'ProgressMain'
>;

export const ProgressScreen: React.FC<ProgressScreenProps> = ({
  navigation,
}) => {
  const [selectedPeriod, setSelectedPeriod] = useState<ProgressPeriod>(
    MOCK_PROGRESS_DATA.activePeriod,
  );
  const [windowIndex, setWindowIndex] = useState(0);
  const { open } = useDrawer();
  const navigate = useNavigate();

  const windows = PROGRESS_WINDOWS[selectedPeriod];
  const { dateRange, motionPoints, metrics, completedSessions } =
    windows[windowIndex];

  const handleSelectPeriod = (period: ProgressPeriod) => {
    setSelectedPeriod(period);
    setWindowIndex(0);
  };

  const canGoPrevious = windowIndex > 0;
  const canGoNext = windowIndex < windows.length - 1;

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <DashboardHeader title="Progreso" onMenuPress={open} onNotificationsPress={() => navigate('notifications')} />

        <PeriodSelectorTabs
          selected={selectedPeriod}
          onSelect={handleSelectPeriod}
        />

        <DateRangeHeader
          dateRange={dateRange}
          canGoPrevious={canGoPrevious}
          canGoNext={canGoNext}
          onPrevious={() => setWindowIndex(index => index - 1)}
          onNext={() => setWindowIndex(index => index + 1)}
        />

        <View style={styles.section}>
          <RangeMotionChartCard points={motionPoints} />
        </View>

        <View style={styles.metricsGrid}>
          {metrics.map(metric => (
            <ProgressMetricCard key={metric.title} metric={metric} />
          ))}
        </View>

        <View style={styles.section}>
          <SectionHeader
            title="Sesiones completadas"
            link="Ver historial"
            onLinkPress={() => navigation.navigate('SessionHistory')}
          />
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
});
