import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export const ExercisesScreen: React.FC = () => (
  <View style={styles.container}>
    <Text style={styles.title}>Ejercicios</Text>
    <Text style={styles.subtitle}>Pantalla en construcción</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF9FE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#1A1C20',
  },
  subtitle: {
    fontSize: 14,
    color: '#6C757D',
    marginTop: 6,
  },
});
