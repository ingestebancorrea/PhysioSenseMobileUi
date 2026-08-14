import React, { useMemo, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { COLORS } from '@/constants/theme';
import { EXERCISES } from '@/mock/exerciseData';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { CategoryTabs } from '@/components/exercises/CategoryTabs';
import { ExerciseCard } from '@/components/exercises/ExerciseCard';
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

const ItemSeparator = () => <View style={styles.separator} />;

export const EjercicioListScreen: React.FC<EjercicioListScreenProps> = ({
  navigation,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<ExerciseCategory>('Todos');

  const filteredExercises = useMemo(
    () =>
      selectedCategory === 'Todos'
        ? EXERCISES
        : EXERCISES.filter(item => item.category === selectedCategory),
    [selectedCategory],
  );

  const renderExerciseItem = ({ item }: { item: ExerciseListItem }) => (
    <ExerciseCard
      exercise={item}
      onPress={() => {
        const route = EXERCISE_ROUTES[item.id];
        if (route) {
          navigation.navigate(route);
        }
      }}
    />
  );

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <DashboardHeader title="Ejercicios" />
        </View>
        <CategoryTabs selected={selectedCategory} onSelect={setSelectedCategory} />
        <FlatList
          data={filteredExercises}
          keyExtractor={item => item.id}
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
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
  },
  separator: {
    height: 12,
  },
});
