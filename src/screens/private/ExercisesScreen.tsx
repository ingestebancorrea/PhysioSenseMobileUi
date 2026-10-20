import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '@/constants/theme';
import { ICONS } from '@/constants/icons';
import { useDrawer } from '@/context/DrawerContext';
import { useNavigate } from '@/context/PrivateNavigationContext';
import { ExerciseCard, type ExerciseItem } from '@/components/exercises/ExerciseCard';
import { ScreenHeader } from '@/components/common/screenHeader/ScreenHeader';
import { SearchBar } from '@/components/common/searchBar/SearchBar';
import { FabButton } from '@/components/common/fabButton/FabButton';
import { AppLoader } from '@/components/common/appLoader/AppLoader';
import { useAppAlert } from '@/hooks/useAppAlert';
import { listExercises } from '@/services/exercise/exerciseList.service';
import { ApiClientError } from '@/services/api/client';

export interface ExercisesScreenProps {
  exercises: ExerciseItem[];
  onExercisesChange: (updater: (prev: ExerciseItem[]) => ExerciseItem[]) => void;
  onCreate?: () => void;
  onEditExercise?: (exercise: ExerciseItem) => void;
}

export const ExercisesScreen: React.FC<ExercisesScreenProps> = ({
  exercises: initialExercises,
  onExercisesChange,
  onCreate,
  onEditExercise,
}) => {
  const [search, setSearch] = useState('');
  const [exercises, setExercises] = useState<ExerciseItem[]>(initialExercises);
  const [loading, setLoading] = useState(true);
  const { open } = useDrawer();
  const navigate = useNavigate();
  const { alertModal, showAlert } = useAppAlert();

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

  const handleDelete = useCallback(
    (id: string) => {
      const exercise = exercises.find(item => item.id === id);
      showAlert({
        title: 'Eliminar ejercicio',
        message: exercise
          ? `Se eliminará "${exercise.title}". ¿Deseas continuar?`
          : 'Se eliminará este ejercicio. ¿Deseas continuar?',
        variant: 'error',
        cancelText: 'Cancelar',
        confirmText: 'Eliminar',
        onConfirm: () => {
          setExercises(prev => prev.filter(item => item.id !== id));
          onExercisesChange?.(prev => prev.filter(item => item.id !== id));
        },
      });
    },
    [exercises, onExercisesChange, showAlert],
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
        onDelete={handleDelete}
        onPlay={handlePlay}
      />
    ),
    [handleDelete, handleEdit, handlePlay],
  );

  const keyExtractor = useCallback((item: ExerciseItem) => item.id, []);

  const isEmptyBank = exercises.length === 0;

  if (loading) {
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

      <FlatList
        data={filteredExercises}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
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

      <FabButton onPress={handleCreate} />
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
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.backgroundMuted,
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
