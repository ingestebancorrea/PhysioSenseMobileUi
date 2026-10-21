import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '@/constants/theme';
import { ICONS } from '@/constants/icons';
import { useDrawer } from '@/context/DrawerContext';
import { useNavigate } from '@/context/PrivateNavigationContext';
import { useAuth } from '@/context/AuthContext';
import { useAppToast } from '@/context/ToastContext';
import { ExerciseCard, type ExerciseItem } from '@/components/exercises/ExerciseCard';
import { ScreenHeader } from '@/components/common/screenHeader/ScreenHeader';
import { SearchBar } from '@/components/common/searchBar/SearchBar';
import { FabButton } from '@/components/common/fabButton/FabButton';
import { AppLoader } from '@/components/common/appLoader/AppLoader';
import { useAppAlert } from '@/hooks/useAppAlert';
import { listExercises } from '@/services/exercise/exerciseList.service';
import { exerciseService } from '@/services/exerciseService';
import { ApiClientError } from '@/services/api/client';
import { describeError } from '@/utils/describeError';

export interface ExercisesScreenProps {
  onCreate?: () => void;
  onEditExercise?: (exercise: ExerciseItem) => void;
  /**
   * Cambia cuando el fisioterapeuta vuelve de crear o editar un ejercicio.
   * Fuerza a releer `GET /exercises` para que la lista refleje el catálogo
   * sin depender de que la pantalla se vuelva a montar.
   */
  refreshToken?: number;
}

export const ExercisesScreen: React.FC<ExercisesScreenProps> = ({
  onCreate,
  onEditExercise,
  refreshToken,
}) => {
  const [search, setSearch] = useState('');
  const [exercises, setExercises] = useState<ExerciseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  /** Id del ejercicio cuya baja está en vuelo, para no aceptar dos veces. */
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const { open } = useDrawer();
  const navigate = useNavigate();
  const { alertModal, showAlert } = useAppAlert();
  const { showToast } = useAppToast();
  const { role } = useAuth();

  // Sólo el fisioterapeuta puede dar de baja ejercicios: el backend exige el
  // rol FIS y responde 403 para el resto.
  const isTherapist = role === 'fisioterapeuta';

  const loadExercises = useCallback(async () => {
    setLoading(true);
    try {
      const items = await listExercises();
      setExercises(items);
    } catch (err) {
      if (err instanceof ApiClientError && err.status === 401) {
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
    }
  }, [showAlert]);

  useEffect(() => {
    loadExercises();
  }, [loadExercises, refreshToken]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadExercises();
    setRefreshing(false);
  }, [loadExercises]);

  const filteredExercises = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) {
      return exercises;
    }
    return exercises.filter(
      item =>
        item.title.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query),
    );
  }, [exercises, search]);

  const handleCreate = useCallback(() => {
    onCreate?.();
  }, [onCreate]);

  const handleEdit = useCallback(
    (id: string) => {
      const exercise = exercises.find(item => item.id === id);
      if (exercise) {
        onEditExercise?.(exercise);
      }
    },
    [exercises, onEditExercise],
  );

  /**
   * Da de baja el ejercicio en el backend.
   *
   * No hay borrado optimista: la lista se vuelve a pedir con el
   * `GET /exercises` de `loadExercises()` y se repinta con la respuesta del
   * servidor.
   */
  const runDeactivate = useCallback(
    async (exercise: ExerciseItem) => {
      setDeletingId(exercise.id);

      try {
        await exerciseService.deactivateExercise(exercise.id);

        showToast({
          title: 'Ejercicio dado de baja',
          message: `"${exercise.title}" ya no aparece en el catálogo.`,
          variant: 'success',
        });

        await loadExercises();
      } catch (err) {
        showAlert({
          title: 'No se pudo dar de baja el ejercicio',
          message: describeError(err),
          variant: 'error',
        });
      } finally {
        setDeletingId(null);
      }
    },
    [loadExercises, showAlert, showToast],
  );

  const handleDelete = useCallback(
    (id: string) => {
      // Una baja en vuelo bloquea las demás: evita el doble submit.
      if (deletingId) {
        return;
      }

      const exercise = exercises.find(item => item.id === id);

      if (!exercise) {
        return;
      }

      showAlert({
        title: 'Dar de baja el ejercicio',
        message: `"${exercise.title}" dejará de estar disponible en el catálogo. Las sesiones que ya lo usen conservan su historial. ¿Deseas continuar?`,
        variant: 'error',
        cancelText: 'Cancelar',
        confirmText: 'Dar de baja',
        onConfirm: () => {
          // `runDeactivate` resuelve siempre: los errores van al modal.
          runDeactivate(exercise);
        },
      });
    },
    [deletingId, exercises, runDeactivate, showAlert],
  );

  const handlePlay = useCallback(
    (id: string) => {
      const exercise = exercises.find(item => item.id === id);
      showAlert({
        title: 'Reproducir ejercicio',
        message: exercise?.title ?? id,
        variant: 'info',
      });
    },
    [exercises, showAlert],
  );

  const renderItem = useCallback(
    ({ item }: { item: ExerciseItem }) => (
      <ExerciseCard
        exercise={item}
        onEdit={handleEdit}
        onDelete={isTherapist ? handleDelete : undefined}
        onPlay={handlePlay}
      />
    ),
    [handleDelete, handleEdit, handlePlay, isTherapist],
  );

  const keyExtractor = useCallback((item: ExerciseItem) => item.id, []);

  const isEmptyBank = exercises.length === 0;

  // La cabecera se mantiene visible mientras carga, igual que en pacientes y
  // sesiones: el precargador no tiene que comerse toda la pantalla.
  const listHeader = (
    <View>
      <ScreenHeader
        title="Ejercicios"
        onMenuPress={open}
        onNotificationsPress={() => navigate('notifications')}
      />

      <SearchBar
        value={search}
        onChangeText={setSearch}
        placeholder="Buscar ejercicios..."
      />
    </View>
  );

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      {listHeader}

      {loading ? (
        <View style={styles.loadingWrapper}>
          <AppLoader />

          <View style={styles.loadingContent}>
            <Text style={styles.loadingTitle}>Cargando tus ejercicios</Text>
            <Text style={styles.loadingSubtitle}>
              Un momento mientras traemos tus ejercicios
            </Text>
          </View>
        </View>
      ) : (
        <FlatList
          data={filteredExercises}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor={COLORS.primary}
            />
          }
          ListEmptyComponent={
            isEmptyBank ? (
              <EmptyStateCard />
            ) : (
              <View style={styles.noResults}>
                <Text style={styles.noResultsText}>No se encontraron ejercicios</Text>
              </View>
            )
          }
        />
      )}

      {!loading ? <FabButton onPress={handleCreate} /> : null}
      {alertModal}
    </SafeAreaView>
  );
};

const EmptyStateCard: React.FC = () => {
  const ClipboardIcon = ICONS.clipboard;

  return (
    <View style={styles.emptyCard}>
      <View style={styles.emptyIconCircle}>
        {ClipboardIcon && <ClipboardIcon size={24} color={COLORS.primary} />}
      </View>
      <Text style={styles.emptyTitle}>Aún no tienes ejercicios</Text>
      <Text style={styles.emptySubtitle}>
        Crea tu primer ejercicio para comenzar a trabajar con tus pacientes.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.backgroundMuted,
  },
  loadingWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.backgroundMuted,
    paddingHorizontal: 24,
  },
  loadingContent: {
    alignItems: 'center',
    marginTop: 20,
  },
  loadingTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.textStrong,
    marginBottom: 6,
  },
  loadingSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    maxWidth: 260,
    lineHeight: 20,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingTop: 4,
    paddingBottom: 100,
  },
  noResults: {
    alignItems: 'center',
    paddingTop: 60,
  },
  noResultsText: {
    fontSize: 14,
    color: COLORS.textMuted,
  },
  emptyCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F0F1F5',
    paddingVertical: 28,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  emptyIconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#F0EDFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1A1C20',
    textAlign: 'center',
    marginTop: 14,
  },
  emptySubtitle: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 17,
    marginTop: 6,
  },
});
