// src/screens/auth/RegisterScreen.tsx
import React from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { AuthStackParamList } from '@/navigation/types/authStackParams';

type RegisterScreenProps = NativeStackScreenProps<AuthStackParamList, 'Register'>;

const RegisterScreen: React.FC<RegisterScreenProps> = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.content}>
        <Text style={styles.title}>Registro</Text>
        <Text style={styles.subtitle}>Próximamente</Text>
        <TouchableOpacity
          style={styles.button}
          activeOpacity={0.8}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.buttonText}>Volver</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FAF9FE',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#1A1C20',
  },
  subtitle: {
    fontSize: 14,
    color: '#6C757D',
    marginTop: 8,
  },
  button: {
    marginTop: 24,
    height: 48,
    paddingHorizontal: 24,
    borderRadius: 12,
    backgroundColor: '#5B46E8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
});

export default RegisterScreen;
