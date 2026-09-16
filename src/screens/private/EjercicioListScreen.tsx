import React, { useCallback, useMemo, useState } from 'react';
import { FlatList, Image, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { COLORS } from '@/constants/theme';
import { useDrawer } from '@/context/DrawerContext';
import { useNavigate } from '@/context/PrivateNavigationContext';
import { EXERCISES } from '@/mock/exerciseData';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { CategoryTabs } from '@/components/exercises/CategoryTabs';
import { ExerciseCard, type ExerciseItem } from '@/components/exercises/ExerciseCard';
import type { ExerciseFlowParamList } from '@/navigation/types/exerciseFlowParams';
import type { ExerciseCategory, ExerciseListItem } from '@/types/exercise';

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

const toCardItem = (item: ExerciseListItem): ExerciseItem => ({
  id: item.id,
  title: item.title,
  description: item.description,
  series: `${item.series} series`,
  reps: `${item.reps} rep.`,
  duration: item.duration,
  imageUrl: Image.resolveAssetSource(item.imageUri)?.uri,
});

const ItemSeparator = () => <View style={styles.separator} />;

export const EjercicioListScreen: React.FC<EjercicioListScreenProps> = ({
  navigation,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<ExerciseCategory>('Todos');
  const { open } = useDrawer();
  const navigate = useNavigate();

  const filteredExercises = useMemo(() => {
    const result =
      selectedCategory === 'Todos'
        ? EXERCISES
        : EXERCISES.filter(item => item.category === selectedCategory);

    return result.map(toCardItem);
  }, [selectedCategory]);

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
        <CategoryTabs selected={selectedCategory} onSelect={setSelectedCategory} />
        <FlatList
          data={filteredExercises}
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
});