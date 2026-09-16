import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '@/constants/theme';
import { useDrawer } from '@/context/DrawerContext';
import { useNavigate } from '@/context/PrivateNavigationContext';
import { THERAPIST_DASHBOARD_DATA } from '@/mock/therapistDashboardData';
import { ActivityItem } from '@/components/dashboard/ActivityItem';
import { SectionHeader } from '@/components/dashboard/SectionHeader';
import { StatCard } from '@/components/dashboard/StatCard';
import { TherapistDashboardHeader } from '@/components/dashboard/TherapistDashboardHeader';

export const TherapistHomeScreen: React.FC = () => {
  const { therapist, stats, activities } = THERAPIST_DASHBOARD_DATA;
  const { open } = useDrawer();
  const navigate = useNavigate();

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <TherapistDashboardHeader
          name={therapist.name}
          notificationCount={therapist.unreadNotifications}
          onMenuPress={open}
          onNotificationsPress={() => navigate('notifications')}
        />

        <ScrollView
          horizontal
          contentContainerStyle={styles.carousel}
          showsHorizontalScrollIndicator={false}
        >
          {stats.map(stat => (
            <StatCard key={stat.id} stat={stat} />
          ))}
        </ScrollView>

        <SectionHeader title="Actividad reciente" link="Ver todo" />
        <View>
          {activities.map(activity => (
            <ActivityItem key={activity.id} activity={activity} />
          ))}
        </View>
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
    paddingBottom: 24,
  },
  carousel: {
    gap: 12,
    paddingRight: 20,
  },
});
