import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Plus, Trash2 } from 'lucide-react-native';
import { COLORS } from '@/constants/theme';
import { getExerciseImage } from './exerciseImages';
import type { SessionExercise } from '@/types/session';

export interface SessionExercisesStepProps {
  exercises: SessionExercise[];
  onAdd: () => void;
  onRemove: (id: string) => void;
}

const exerciseDetails = (item: SessionExercise): string =>
  `${item.sessions} sesiones x ${item.repetitions} repeticiones`;

export const SessionExercisesStep: React.FC<SessionExercisesStepProps> = ({
  exercises,
  onAdd,
  onRemove,
}) => (
  <View style={styles.container}>
    <View style={styles.headerRow}>
      <Text style={styles.title}>Ejercicios seleccionados</Text>
      <TouchableOpacity style={styles.addButton} activeOpacity={0.8} onPress={onAdd}>
        <Plus color={COLORS.primary} size={16} strokeWidth={2.5} />
        <Text style={styles.addText}>Agregar ejercicio</Text>
      </TouchableOpacity>
    </View>

    {exercises.length === 0 && (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>No hay ejercicios seleccionados.</Text>
      </View>
    )}

    {exercises.map((item) => (
      <View key={item.id} style={styles.card}>
        <View style={styles.imageWrap}>
          <Image source={getExerciseImage(item.imageUrl)} style={styles.image} resizeMode="cover" />
        </View>

        <View style={styles.info}>
          <Text style={styles.cardTitle}>{item.title}</Text>
          <Text style={styles.cardDetails}>{exerciseDetails(item)}</Text>
        </View>

        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => onRemove(item.id)}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          activeOpacity={0.7}
        >
          <Trash2 color="#8E94A0" size={20} />
        </TouchableOpacity>
      </View>
    ))}
  </View>
);

const styles = StyleSheet.create({
  container: {
    gap: 14,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1C20',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F0EDFF',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
  },
  addText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.primary,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 20,
    borderWidth: 1,
    borderColor: '#F0F1F5',
  },
  imageWrap: {
    width: 68,
    height: 68,
    borderRadius: 12,
    backgroundColor: '#F5F6F8',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  info: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1A1C20',
  },
  cardDetails: {
    fontSize: 13,
    color: '#8E94A0',
    marginTop: 3,
  },
  deleteButton: {
    padding: 8,
  },
  empty: {
    paddingVertical: 32,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 13,
    color: '#8E94A0',
  },
});
