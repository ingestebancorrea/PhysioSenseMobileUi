import React, { useEffect } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ICONS } from '@/constants/icons';
import { COLORS } from '@/constants/theme';
import { usePrivateTabBar } from '@/context/PrivateTabBarContext';
import { ContinuarButton } from '@/components/exercise-detail/ContinuarButton';
import { ExerciseSpecsCard } from '@/components/exercise-detail/ExerciseSpecsCard';
import { ExerciseVideoPreview } from '@/components/exercise-detail/ExerciseVideoPreview';
import { TargetMusclesCard } from '@/components/exercise-detail/TargetMusclesCard';
import type { ExerciseFlowParamList } from '@/navigation/types/exerciseFlowParams';
import type { ExerciseDetail } from '@/types/exerciseDetail';

interface ExerciseDetailScreenProps {
  detail: ExerciseDetail;
  stepBadge?: string;
  onContinue?: () => void;
}

export const ExerciseDetailScreen: React.FC<ExerciseDetailScreenProps> = ({
  detail,
  stepBadge,
  onContinue,
}) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<ExerciseFlowParamList>>();
  const { hide, show } = usePrivateTabBar();

  useEffect(() => {
    hide();

    return show;
  }, [hide, show]);

  const ChevronLeftIcon = ICONS.chevronLeft;

  const handleContinue = () => {
    if (onContinue) {
      onContinue();
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
        <Text style={styles.headerTitle}>Información del ejercicio</Text>
        {stepBadge ? (
          <View style={styles.stepBadge}>
            <Text style={styles.stepBadgeText}>{stepBadge}</Text>
          </View>
        ) : null}
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <ExerciseVideoPreview
          thumbnail={detail.videoThumbnailUri}
          duration={detail.videoDuration}
        />

        <Text style={styles.title}>{detail.title}</Text>
        <Text style={styles.description}>{detail.description}</Text>

        <View style={styles.section}>
          <ExerciseSpecsCard specs={detail.specs} />
        </View>

        <View style={styles.section}>
          <TargetMusclesCard muscles={detail.targetMuscles} />
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <ContinuarButton onPress={handleContinue} />
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
    paddingHorizontal: 20,
    paddingVertical: 12,
    columnGap: 12,
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
  content: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginTop: 20,
  },
  description: {
    fontSize: 14,
    lineHeight: 21,
    color: COLORS.textSecondary,
    marginTop: 8,
  },
  section: {
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
