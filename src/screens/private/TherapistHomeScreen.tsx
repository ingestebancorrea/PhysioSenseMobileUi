import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';
import { useDrawer } from '@/context/DrawerContext';
import { useNavigate } from '@/context/PrivateNavigationContext';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { THERAPIST_DASHBOARD_DATA } from '@/mock/therapistDashboardData';
import { fetchRecentActivity } from '@/services/notifications/recentActivity';
import type { TherapistActivity } from '@/types/therapistDashboard';
import { ActivityFeedState } from '@/components/dashboard/ActivityFeedState';
import { ActivityItem } from '@/components/dashboard/ActivityItem';
import { SectionHeader } from '@/components/dashboard/SectionHeader';
import { StatCard } from '@/components/dashboard/StatCard';
import { TherapistDashboardHeader } from '@/components/dashboard/TherapistDashboardHeader';

export const TherapistHomeScreen: React.FC = () => {
  const { stats } = THERAPIST_DASHBOARD_DATA;
  const { user } = useAuth();
  const userId = user?.id ?? null;
  const { open } = useDrawer();
  const navigate = useNavigate();
  const currentUser = useCurrentUser();

  const [activities, setActivities] = useState<TherapistActivity[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoadingActivity, setIsLoadingActivity] = useState(true);
  const [activityError, setActivityError] = useState<string | null>(null);

  const loadActivity = useCallback(async () => {
    if (userId === null) {
      setActivities([]);
      setUnreadCount(0);
      setActivityError(null);
      setIsLoadingActivity(false);
      return;
    }

    setIsLoadingActivity(true);

    try {
      const result = await fetchRecentActivity(userId);
      setActivities(result.activities);
      setUnreadCount(result.unreadCount);
      setActivityError(null);
    } catch (error) {
      setActivities([]);
      setUnreadCount(0);
      setActivityError(
        error instanceof Error
          ? error.message
          : 'No pudimos cargar la actividad reciente. Intenta de nuevo.',
      );
    } finally {
      setIsLoadingActivity(false);
    }
  }, [userId]);

  useEffect(() => {
    loadActivity();
  }, [loadActivity]);

  const renderActivity = () => {
    if (isLoadingActivity) {
      return (
        <View style={styles.loading}>
          <ActivityIndicator color={COLORS.primary} />
        </View>
      );
    }

    if (activityError !== null) {
      return (
        <ActivityFeedState
          tone="error"
          message={activityError}
          onRetry={loadActivity}
        />
      );
    }

    if (activities.length === 0) {
      return <ActivityFeedState tone="empty" />;
    }

    return (
      <View>
        {activities.map(activity => (
          <ActivityItem
            key={activity.id}
            activity={activity}
            onPress={() => navigate('notifications')}
          />
        ))}
      </View>
    );
  };

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <TherapistDashboardHeader
          name={currentUser.firstName}
          notificationCount={unreadCount}
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

        <SectionHeader
          title="Actividad reciente"
          link="Ver todo"
          onLinkPress={() => navigate('notifications')}
        />
        {renderActivity()}
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
  loading: {
    paddingVertical: 32,
    alignItems: 'center',
  },
});
