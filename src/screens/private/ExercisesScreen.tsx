import React, { useCallback, useMemo, useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '@/constants/theme';
import { ICONS } from '@/constants/icons';
import { useDrawer } from '@/context/DrawerContext';
import { useNavigate } from '@/context/PrivateNavigationContext';
import { ExerciseCard, type ExerciseItem } from '@/components/exercises/ExerciseCard';
import { THERAPIST_EXERCISES } from '@/mock/therapistExercisesData';
import { ScreenHeader } from '@/components/common/screenHeader/ScreenHeader';
import { SearchBar } from '@/components/common/searchBar/SearchBar';
import { FabButton } from '@/components/common/fabButton/FabButton';

export const ExercisesScreen: React.FC = () => {
  const [exercises, setExercises] = useState<ExerciseItem[]>(THERAPIST_EXERCISES);
  const [search, setSearch] = useState('');
  const { open } = useDrawer();
  const navigate = useNavigate();

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
    Alert.alert('Crear ejercicio', 'La creación de ejercicios estará disponible próximamente.');
  }, []);

  const handleEdit = useCallback(
    (id: string) => {
      Alert.alert('Editar ejercicio', `Próximamente: editar el ejercicio ${id}.`);
    },
    [],
  );

  const handleDelete = useCallback((id: string) => {
    setExercises(prev => prev.filter(item => item.id !== id));
  }, []);

  const handlePlay = useCallback(
    (id: string) => {
      const exercise = exercises.find(item => item.id === id);
      Alert.alert('Reproducir ejercicio', exercise?.title ?? id);
    },
    [exercises],
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