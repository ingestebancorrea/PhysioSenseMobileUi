import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { COLORS } from '@/constants/theme';
import { useDrawer } from '@/context/DrawerContext';
import { useNavigate } from '@/context/PrivateNavigationContext';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { CategoryTabs } from '@/components/exercises/CategoryTabs';
import { ExerciseCard, type ExerciseItem } from '@/components/exercises/ExerciseCard';
import type { ExerciseFlowParamList } from '@/navigation/types/exerciseFlowParams';
import type { ExerciseCategory } from '@/types/exercise';
import { listExercises } from '@/services/exercise/exerciseList.service';
import { ApiClientError } from '@/services/api/client';
import { useAppAlert } from '@/hooks/useAppAlert';
import { AppLoader } from '@/components/common/appLoader/AppLoader';

type EjercicioListScreenProps = NativeStackScreenProps<
  ExerciseFlowParamList,
  'ExerciseList'
>;

const EXERCISE_ROUTES: Record<string, keyof ExerciseFlowParamList> = {
  exercise_01: 'CerrarMano',
  exercise_02: 'AbrirMano',
  exercise_03: 'Pinza',
  exercise_04: 'OposicionPulgar',
};

// Tiempo mínimo visible del loader para que nunca quede instantáneo
const MIN_LOADING_MS = 600;

const ItemSeparator = () => <View style={styles.separator} />;

export const EjercicioListScreen: React.FC<EjercicioListScreenProps> = ({
  navigation,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<ExerciseCategory>(
    'Todos',
  );
  const [exercises, setExercises] = useState<ExerciseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showLoader, setShowLoader] = useState(true);
  const { open } = useDrawer();
  const navigate = useNavigate();
  const { showAlert } = useAppAlert();

  const loadExercises = useCallback(async () => {
    setLoading(true);
    setShowLoader(true);
    try {
      // category === 'Todos' => no se envía filtro (catálogo completo)
      const category =
        selectedCategory === 'Todos' ? undefined : selectedCategory;
      const start = Date.now();
      const items = await listExercises({ category });
      setExercises(items);

      // Mantener el loader al menos MIN_LOADING_MS para que se aprecie
      const elapsed = Date.now() - start;
      const remaining = Math.max(0, MIN_LOADING_MS - elapsed);
      await new Promise<void>((resolve) => setTimeout(() => resolve(), remaining));
    } catch (err) {
      if (err instanceof ApiClientError && err.status === 401) {
        // 401: el cliente ya limpió la sesión y emitió sessionExpired.
        // El AuthContext / navegador se encarga de redirigir al login.
        showAlert({
          title: 'Sesión expirada',
          message: 'Inicia sesión de nuevo para ver los ejercicios.',
          variant: 'error',
        });
      } else {
        showAlert({
          title: 'No se pudieron cargar los ejercicios',
          message: err instanceof Error ? err.message : 'Error inesperado.',
          variant: 'error',
        });
      }
    } finally {
      setLoading(false);
      setShowLoader(false);
    }
  }, [selectedCategory, showAlert]);

  useEffect(() => {
    loadExercises();
  }, [loadExercises]);

  const renderExerciseItem = useCallback(
    ({ item }: { item: ExerciseItem }) => (
      <ExerciseCard
        exercise={item}
        onPlay={() => {
          const route = EXERCISE_ROUTES[item.id];
          if (route) {
            navigation.navigate(route as never);
          }
        }}
      />
    ),
    [navigation],
  );

  const keyExtractor = useCallback((item: ExerciseItem) => item.id, []);

  if (showLoader) {
    return (
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <View style={styles.loadingWrapper}>
          <AppLoader />
          <View style={styles.loadingContent}>
            <Text style={styles.loadingTitle}>Cargando tus ejercicios</Text>
            <Text style={styles.loadingSubtitle}>
              Un momento mientras traemos tu catálogo
            </Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <View>
        <View style={styles.header}>
          <DashboardHeader
            title="Ejercicios"
            onMenuPress={open}
            onNotificationsPress={() => navigate('notifications')}
          />
        </View>
        <CategoryTabs
          selected={selectedCategory}
          onSelect={setSelectedCategory}
        />
        <FlatList
          data={exercises}
          keyExtractor={keyExtractor}
          renderItem={renderExerciseItem}
          ItemSeparatorComponent={ItemSeparator}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
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
    paddingHorizontal: 20,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  separator: {
    height: 12,
  },
  loadingWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  loadingContent: {
    marginTop: 16,
    alignItems: 'center',
  },
  loadingTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1A1C20',
  },
  loadingSubtitle: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
    textAlign: 'center',
  },
});
