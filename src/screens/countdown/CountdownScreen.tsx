import React, { useEffect, useState } from 'react';
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
import { AnimatedHandTimer } from '@/components/countdown/AnimatedHandTimer';
import { TipCard } from '@/components/countdown/TipCard';
import { ICONS } from '@/constants/icons';
import { COLORS } from '@/constants/theme';
import { usePrivateTabBar } from '@/context/PrivateTabBarContext';
import type { ExerciseFlowParamList } from '@/navigation/types/exerciseFlowParams';

const TOTAL_SECONDS = 5;
const FINISH_DELAY_MS = 800;

const EXERCISE_NAMES: Record<string, string> = {
  exercise_01: 'Cerrar la mano',
  exercise_02: 'Abrir la mano',
  exercise_03: 'Pinza',
  exercise_04: 'Oposición del pulgar',
};

export const CountdownScreen: React.FC = () => {
  const route = useRoute<RouteProp<ExerciseFlowParamList, 'Countdown'>>();
  const navigation =
    useNavigation<NativeStackNavigationProp<ExerciseFlowParamList>>();
  const { hide, show } = usePrivateTabBar();

  const [secondsLeft, setSecondsLeft] = useState(TOTAL_SECONDS);

  const exerciseId = route.params?.exerciseId;

  useEffect(() => {
    hide();

    let remaining = TOTAL_SECONDS;
    const interval = setInterval(() => {
      remaining -= 1;
      setSecondsLeft(remaining);

      if (remaining <= 0) {
        clearInterval(interval);
      }
    }, 1000);

    return () => {
      clearInterval(interval);
      show();
    };
  }, [hide, show]);

  useEffect(() => {
    if (secondsLeft > 0) {
      return undefined;
    }

    const timer = setTimeout(() => {
      if (exerciseId) {
        navigation.navigate('Execution', { exerciseId });
      }
    }, FINISH_DELAY_MS);

    return () => clearTimeout(timer);
  }, [secondsLeft, exerciseId, navigation]);

  const ChevronLeftIcon = ICONS.chevronLeft;
  const XIcon = ICONS.x;
  const exerciseName = EXERCISE_NAMES[exerciseId ?? ''] ?? 'Ejercicio';

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
            {exerciseName}
          </Text>
          <View style={styles.headerBadge}>
            <Text style={styles.headerBadgeText}>Serie 1 de 3</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.headerButton}
          activeOpacity={0.8}
          onPress={() => navigation.navigate('ExerciseList')}
        >
          <XIcon size={22} color={COLORS.textPrimary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <AnimatedHandTimer secondsLeft={secondsLeft} />
        <TipCard />
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
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 24,
    gap: 28,
  },
});
