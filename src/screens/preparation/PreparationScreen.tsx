import React, { useEffect } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ICONS } from '@/constants/icons';
import { CARD, COLORS } from '@/constants/theme';
import { usePrivateTabBar } from '@/context/PrivateTabBarContext';
import { DeviceMetricCard } from '@/components/preparation/DeviceMetricCard';
import { GloveConnectionStatus } from '@/components/preparation/GloveConnectionStatus';
import { ReconnectButton } from '@/components/preparation/ReconnectButton';
import { StartSeriesButton } from '@/components/preparation/StartSeriesButton';
import { getExerciseConfig } from '@/screens/execution/exerciseConfig';
import type { ExerciseFlowParamList } from '@/navigation/types/exerciseFlowParams';
import type { GloveConnectionState } from '@/types/preparation';
import {
  BUTTON_LABELS,
  DESCRIPTIONS,
  METRICS,
  TITLES,
} from '@/screens/preparation/data';

interface PreparationScreenProps {
  exerciseId?: string;
  status?: GloveConnectionState;
  onStart?: () => void;
  onRetry?: () => void;
}

export const PreparationScreen: React.FC<PreparationScreenProps> = ({
  exerciseId,
  status = 'connected',
  onStart,
  onRetry,
}) => {
  const route = useRoute<RouteProp<ExerciseFlowParamList, 'Preparation'>>();
  const navigation =
    useNavigation<NativeStackNavigationProp<ExerciseFlowParamList>>();
  const { hide, show } = usePrivateTabBar();

  useEffect(() => {
    hide();

    return show;
  }, [hide, show]);

  const ChevronLeftIcon = ICONS.chevronLeft;

  const currentExerciseId = exerciseId ?? route.params?.exerciseId;
  const isConnected = status === 'connected';

  const handleAction = () => {
    if (!isConnected) {
      onRetry?.();
      return;
    }

    if (onStart) {
      onStart();
      return;
    }

    if (currentExerciseId) {
      const config = getExerciseConfig(currentExerciseId);
      navigation.navigate('Countdown', {
        exerciseId: currentExerciseId,
        currentSeries: 1,
        totalSeries: config.series,
      });
    } else {
      navigation.goBack();
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          activeOpacity={0.8}
          onPress={() => navigation.goBack()}
        >
          <ChevronLeftIcon size={22} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text
          style={styles.headerTitle}
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={0.8}
        >
          Preparación
        </Text>
        <View style={styles.stepBadge}>
          <Text style={styles.stepBadgeText}>Paso 3 de 3</Text>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <GloveConnectionStatus state={status} />

        <Text style={styles.title}>
          {TITLES[status]}
        </Text>
        <Text style={styles.description}>{DESCRIPTIONS[status]}</Text>

        <View style={[CARD, styles.metricsCard]}>
          <DeviceMetricCard
            icon="bluetooth"
            label={METRICS[status].device.label}
            value={METRICS[status].device.value}
            tone={METRICS[status].device.tone}
          />
          <DeviceMetricCard
            icon="wifi"
            label={METRICS[status].signal.label}
            value={METRICS[status].signal.value}
            tone={METRICS[status].signal.tone}
          />
        </View>

        {status === 'disconnected' ? (
          <View style={styles.reconnectContainer}>
            <ReconnectButton onPress={() => onRetry?.()} />
          </View>
        ) : null}
      </ScrollView>

      <View style={styles.footer}>
        {isConnected ? (
          <StartSeriesButton label={BUTTON_LABELS.connected} onPress={handleAction} />
        ) : status === 'connecting' ? (
          <StartSeriesButton
            label={BUTTON_LABELS.connecting}
            disabled
            onPress={handleAction}
          />
        ) : null}
      </View>
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
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.progressTrack,
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textPrimary,
    textAlign: 'center',
  },
  stepBadge: {
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 10,
    backgroundColor: COLORS.primarySoft,
  },
  stepBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.primary,
  },
  scroll: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginTop: 20,
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    lineHeight: 21,
    color: COLORS.textSecondary,
    marginTop: 8,
    textAlign: 'center',
  },
  metricsCard: {
    marginTop: 24,
    gap: 12,
  },
  reconnectContainer: {
    marginTop: 20,
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
    backgroundColor: COLORS.background,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
});
