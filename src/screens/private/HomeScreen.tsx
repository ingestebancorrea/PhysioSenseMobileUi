import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '@/constants/theme';
import { DASHBOARD_DATA } from '@/mock/dashboardData';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { ExerciseCard } from '@/components/dashboard/ExerciseCard';
import { MetricCard } from '@/components/dashboard/MetricCard';
import { SectionHeader } from '@/components/dashboard/SectionHeader';
import { SessionStatusBadge } from '@/components/dashboard/SessionStatusBadge';
import { WelcomeBanner } from '@/components/dashboard/WelcomeBanner';

export const HomeScreen: React.FC = () => {
  const { user, summary, lastSession } = DASHBOARD_DATA;

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <DashboardHeader title="Dashboard" />

        <WelcomeBanner firstName={user.firstName} />

        <SectionHeader title="Resumen de hoy" link="Ver más" />
        <View style={styles.grid}>
          {summary.map(metric => (
            <MetricCard key={metric.id} metric={metric} />
          ))}
        </View>

        <SectionHeader title="Última sesión" />
        <View style={styles.sessionMeta}>
          <Text style={styles.sessionDate}>{lastSession.date}</Text>
          <SessionStatusBadge status={lastSession.status} />
        </View>

        {lastSession.exercises.map(exercise => (
          <ExerciseCard key={exercise.id} exercise={exercise} />
        ))}
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
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    rowGap: 12,
    columnGap: 12,
  },
  sessionMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sessionDate: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
});
