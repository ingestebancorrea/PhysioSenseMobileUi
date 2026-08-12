import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import { Bell, Menu } from 'lucide-react-native';
import { COLORS } from '@/constants/theme';
import { DASHBOARD_DATA } from '@/mock/dashboardData';
import { ExerciseCard } from '@/components/dashboard/ExerciseCard';
import { MetricCard } from '@/components/dashboard/MetricCard';
import { SectionHeader } from '@/components/dashboard/SectionHeader';

export const HomeScreen: React.FC = () => {
  const { user, summary, lastSession } = DASHBOARD_DATA;

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <TouchableOpacity style={styles.headerButton} activeOpacity={0.8}>
            <Menu size={24} color={COLORS.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Dashboard</Text>
          <TouchableOpacity style={styles.headerButton} activeOpacity={0.8}>
            <Bell size={27} color={COLORS.textPrimary} />
            <View style={styles.bellBadge} />
          </TouchableOpacity>
        </View>

        <LinearGradient
          colors={[COLORS.primary, COLORS.primaryDark]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.banner}
        >
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{user.firstName.charAt(0)}</Text>
          </View>
          <View style={styles.bannerTexts}>
            <Text style={styles.bannerTitle}>Hola, {user.firstName}</Text>
            <Text style={styles.bannerSubtitle}>¡Vamos por tu recuperación!</Text>
          </View>
        </LinearGradient>

        <SectionHeader title="Resumen de hoy" link="Ver más" />
        <View style={styles.grid}>
          {summary.map(metric => (
            <MetricCard key={metric.id} metric={metric} />
          ))}
        </View>

        <SectionHeader title="Última sesión" />
        <View style={styles.sessionMeta}>
          <Text style={styles.sessionDate}>{lastSession.date}</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>Completada</Text>
          </View>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  headerButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  bellBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 12,
    height: 12,
    borderRadius: 7,
    backgroundColor: COLORS.primary,
    borderWidth: 1.5,
    borderColor: COLORS.background,
  },
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    padding: 40,
    marginTop: 8,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 4,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.whiteOverlay,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.white,
  },
  bannerTexts: {
    flex: 1,
    marginLeft: 14,
  },
  bannerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.white,
  },
  bannerSubtitle: {
    fontSize: 13,
    color: COLORS.whiteSoft,
    marginTop: 4,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 12,
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
  badge: {
    backgroundColor: COLORS.successSoft,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.success,
  },
});
