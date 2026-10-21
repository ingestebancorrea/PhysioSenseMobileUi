import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COLORS, CARD } from '@/constants/theme';
import type { Patient } from '@/types/patient';
import { StatusBadge } from '@/components/patients/StatusBadge';
import { getInitials } from '@/utils/helpers/nameInitials';

interface PatientCardProps {
  patient: Patient;
  onPress: (patient: Patient) => void;
}

export const PatientCard: React.FC<PatientCardProps> = React.memo(
  ({ patient, onPress }) => (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.7}
      onPress={() => onPress(patient)}
    >
      {patient.avatarUrl ? (
        <Image source={{ uri: patient.avatarUrl }} style={styles.avatar} />
      ) : (
        <View style={[styles.avatar, styles.avatarCenter]}>
          <Text style={styles.avatarInitials}>{getInitials(patient.name)}</Text>
        </View>
      )}
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>
          {patient.name}
        </Text>
        <Text style={styles.subtitle}>
          ID: {patient.id} • {patient.age} años
        </Text>
        {patient.lastSession ? (
          <Text style={styles.lastSession}>
            Última sesión: {patient.lastSession}
          </Text>
        ) : null}
      </View>
      <StatusBadge status={patient.status} />
    </TouchableOpacity>
  ),
);

const styles = StyleSheet.create({
  card: {
    ...CARD,
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 10,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.primarySoft,
  },
  avatarCenter: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitials: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.primaryDark,
  },
  info: {
    flex: 1,
    marginLeft: 12,
    marginRight: 8,
  },
  name: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  subtitle: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  lastSession: {
    fontSize: 12,
    color: COLORS.textSubtitle,
    marginTop: 2,
  },
});
