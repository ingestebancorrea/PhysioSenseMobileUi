import React, { useCallback, useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ICONS } from '@/constants/icons';
import { CARD, COLORS } from '@/constants/theme';
import { usePrivateTabBar } from '@/context/PrivateTabBarContext';
import { useAppAlert } from '@/hooks/useAppAlert';
import { AppLoader } from '@/components/common/appLoader/AppLoader';
import { Button } from '@/components/common/button/Button';
import { GuideFooterButton } from '@/components/exercise-guide/GuideFooterButton';
import { GuideStepItem } from '@/components/exercise-guide/GuideStepItem';
import { getExerciseGuide } from '@/services/exercise/exerciseDetail.service';
import { ApiClientError } from '@/services/api/client';
import type { ExerciseFlowParamList } from '@/navigation/types/exerciseFlowParams';
import type { ExerciseGuide } from '@/types/exerciseGuide';
import { describeError } from '@/utils/describeError';

interface ExerciseGuideScreenProps {
  /** Guía en memoria. Se usa cuando la pantalla no recibe `exerciseId`. */
  guide?: ExerciseGuide;
  /**
   * Código estable del ejercicio ("exercise_01").
   *
   * La guía sale del mismo endpoint que el detalle, así que el código alcanza
   * para pedirla.
   */
  exerciseId?: string;
  onStart?: () => void;
}

const LOAD_ERROR_MESSAGE = 'No se pudo cargar la guía del ejercicio.';
const SESSION_EXPIRED_MESSAGE =
  'Inicia sesión de nuevo para ver la guía del ejercicio.';

export const ExerciseGuideScreen: React.FC<ExerciseGuideScreenProps> = ({
  guide,
  exerciseId,
  onStart,
}) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<ExerciseFlowParamList>>();
  const { hide, show } = usePrivateTabBar();
  const { alertModal, showAlert } = useAppAlert();

  const [remoteGuide, setRemoteGuide] = useState<ExerciseGuide | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadGuide = useCallback(async () => {
    if (!exerciseId) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      setRemoteGuide(await getExerciseGuide(exerciseId));
    } catch (loadError) {
      const message = describeError(loadError);

      setError(message);

      if (loadError instanceof ApiClientError && loadError.status === 401) {
        showAlert({
          title: 'Sesión expirada',
          message: SESSION_EXPIRED_MESSAGE,
          variant: 'error',
        });
      } else {
        showAlert({
          title: 'No se pudo cargar la guía del ejercicio',
          message,
          variant: 'error',
        });
      }
    } finally {
      setLoading(false);
    }
  }, [exerciseId, showAlert]);

  useEffect(() => {
    loadGuide();
  }, [loadGuide]);

  useEffect(() => {
    hide();

    return show;
  }, [hide, show]);

  const ChevronLeftIcon = ICONS.chevronLeft;

  const handleStart = () => {
    if (onStart) {
      onStart();
    } else {
      navigation.goBack();
    }
  };

  const currentGuide = exerciseId ? remoteGuide : guide;

  // Mientras carga no se pinta la guía en memoria: sería un flash de datos
  // que no son los del ejercicio pedido.
  if (exerciseId && loading) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        <View style={styles.centered}>
          <AppLoader />
        </View>
      </SafeAreaView>
    );
  }

  if (!currentGuide) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        <View style={styles.centered}>
          <Text style={styles.errorText}>{error ?? LOAD_ERROR_MESSAGE}</Text>
          {exerciseId ? (
            <Button title="Reintentar" onPress={loadGuide} variant="primary" />
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
        <Text
          style={styles.headerTitle}
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={0.8}
        >
          Cómo realizarlo
        </Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={[CARD, styles.stepsCard]}>
          {currentGuide.steps.map((step, index) => (
            <GuideStepItem
              key={step.id}
              stepNumber={index + 1}
              title={step.title}
              description={step.description}
              imageUri={step.imageUri}
            />
          ))}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <GuideFooterButton onPress={handleStart} />
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
  scroll: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  stepsCard: {
    gap: 20,
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
