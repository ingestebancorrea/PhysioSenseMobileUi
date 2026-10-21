import React, { useCallback, useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ICONS } from '@/constants/icons';
import { COLORS } from '@/constants/theme';
import { usePrivateTabBar } from '@/context/PrivateTabBarContext';
import { useAppAlert } from '@/hooks/useAppAlert';
import { AppLoader } from '@/components/common/appLoader/AppLoader';
import { Button } from '@/components/common/button/Button';
import { ContinuarButton } from '@/components/exercise-detail/ContinuarButton';
import { ExerciseSpecsCard } from '@/components/exercise-detail/ExerciseSpecsCard';
import { ExerciseVideoPreview } from '@/components/exercise-detail/ExerciseVideoPreview';
import { TargetMusclesCard } from '@/components/exercise-detail/TargetMusclesCard';
import { getExerciseDetail } from '@/services/exercise/exerciseDetail.service';
import { ApiClientError } from '@/services/api/client';
import type { ExerciseFlowParamList } from '@/navigation/types/exerciseFlowParams';
import type { ExerciseDetail } from '@/types/exerciseDetail';
import { describeError } from '@/utils/describeError';

interface ExerciseDetailScreenProps {
  /** Detalle en memoria. Se usa cuando la pantalla no recibe `exerciseId`. */
  detail?: ExerciseDetail;
  /**
   * Código estable del ejercicio ("exercise_01").
   *
   * Si viene, el detalle se pide a la API; si no, la pantalla sigue siendo
   * presentacional y usa lo que le pasan por prop.
   */
  exerciseId?: string;
  stepBadge?: string;
  onContinue?: () => void;
}

const LOAD_ERROR_MESSAGE = 'No se pudo cargar el ejercicio.';
const SESSION_EXPIRED_MESSAGE = 'Inicia sesión de nuevo para ver el ejercicio.';

export const ExerciseDetailScreen: React.FC<ExerciseDetailScreenProps> = ({
  detail,
  exerciseId,
  stepBadge,
  onContinue,
}) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<ExerciseFlowParamList>>();
  const { hide, show } = usePrivateTabBar();
  const { alertModal, showAlert } = useAppAlert();

  const [remoteDetail, setRemoteDetail] = useState<ExerciseDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadDetail = useCallback(async () => {
    if (!exerciseId) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      setRemoteDetail(await getExerciseDetail(exerciseId));
    } catch (loadError) {
      const message = describeError(loadError);

      setError(message);

      if (loadError instanceof ApiClientError && loadError.status === 401) {
        // 401: el cliente ya limpió la sesión y emitió sessionExpired.
        showAlert({
          title: 'Sesión expirada',
          message: SESSION_EXPIRED_MESSAGE,
          variant: 'error',
        });
      } else {
        showAlert({
          title: 'No se pudo cargar el ejercicio',
          message,
          variant: 'error',
        });
      }
    } finally {
      setLoading(false);
    }
  }, [exerciseId, showAlert]);

  useEffect(() => {
    loadDetail();
  }, [loadDetail]);

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

  const currentDetail = exerciseId ? remoteDetail : detail;

  // Mientras carga no se pinta el detalle en memoria: sería un flash de
  // datos que no son los del ejercicio pedido.
  if (exerciseId && loading) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        <View style={styles.centered}>
          <AppLoader />
        </View>
      </SafeAreaView>
    );
  }

  if (!currentDetail) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        <View style={styles.centered}>
          <Text style={styles.errorText}>{error ?? LOAD_ERROR_MESSAGE}</Text>
          {exerciseId ? (
            <Button title="Reintentar" onPress={loadDetail} variant="primary" />
          ) : null}
          <Button
            title="Volver"
            onPress={() => navigation.goBack()}
            variant="secondary"
          />
        </View>
        {alertModal}
      </SafeAreaView>
    );
  }

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
          thumbnail={currentDetail.videoThumbnailUri}
          duration={currentDetail.videoDuration}
        />

        <Text style={styles.title}>{currentDetail.title}</Text>
        <Text style={styles.description}>{currentDetail.description}</Text>

        <View style={styles.section}>
          <ExerciseSpecsCard specs={currentDetail.specs} />
        </View>

        <View style={styles.section}>
          <TargetMusclesCard muscles={currentDetail.targetMuscles} />
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <ContinuarButton onPress={handleContinue} />
      </View>
      {alertModal}
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
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingHorizontal: 24,
  },
  errorText: {
    fontSize: 15,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
});
