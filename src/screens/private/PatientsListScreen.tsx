import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '@/constants/theme';
import { useDrawer } from '@/context/DrawerContext';
import { useNavigate } from '@/context/PrivateNavigationContext';
import { ApiClientError } from '@/services/api/client';
import { patientService } from '@/services/patientService';
import type { Patient } from '@/types/patient';
import { PatientCard } from '@/components/patients/PatientCard';
import { PatientFilterChips } from '@/components/patients/PatientFilterChips';
import { ScreenHeader } from '@/components/common/screenHeader/ScreenHeader';
import { SearchBar } from '@/components/common/searchBar/SearchBar';
import { Button } from '@/components/common/button/Button';

type FilterTab = 'Todos' | 'Activos' | 'Inactivos';

interface PatientsListScreenProps {
  onSelectPatient: (patient: Patient) => void;
}

const LOAD_ERROR_MESSAGE = 'No se pudo cargar la lista de pacientes.';

export const PatientsListScreen: React.FC<PatientsListScreenProps> = ({
  onSelectPatient,
}) => {
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterTab>('Todos');
  const [patients, setPatients] = useState<Patient[]>([]);
  const [emptyMessage, setEmptyMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { open } = useDrawer();
  const navigate = useNavigate();

  const loadPatients = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await patientService.getMyPatients();
      setPatients(result.patients);
      setEmptyMessage(result.message);
    } catch (loadError) {
      setError(
        loadError instanceof ApiClientError
          ? loadError.message
          : LOAD_ERROR_MESSAGE,
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPatients();
  }, [loadPatients]);

  const counts = useMemo(
    () => ({
      Todos: patients.length,
      Activos: patients.filter(p => p.status === 'Activo').length,
      Inactivos: patients.filter(p => p.status === 'Inactivo').length,
    }),
    [patients],
  );

  const filteredPatients = useMemo(() => {
    let result = patients;

    if (activeFilter === 'Activos') {
      result = result.filter(p => p.status === 'Activo');
    } else if (activeFilter === 'Inactivos') {
      result = result.filter(p => p.status === 'Inactivo');
    }

    if (search.trim()) {
      const query = search.toLowerCase();
      result = result.filter(
        p =>
          p.name.toLowerCase().includes(query) ||
          p.id.toLowerCase().includes(query),
      );
    }

    return result;
  }, [activeFilter, patients, search]);

  const renderItem = useCallback(
    ({ item }: { item: Patient }) => (
      <PatientCard patient={item} onPress={onSelectPatient} />
    ),
    [onSelectPatient],
  );

  const keyExtractor = useCallback((item: Patient) => item.id, []);

  const renderEmpty = () => {
    if (loading) {
      return (
        <View style={styles.emptyContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <Button title="Reintentar" onPress={loadPatients} size="small" />
        </View>
      );
    }

    const hasActiveFilter = activeFilter !== 'Todos' || search.trim();
    const message = hasActiveFilter
      ? 'No se encontraron pacientes'
      : emptyMessage ?? 'No se encontraron pacientes';

    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>{message}</Text>
      </View>
    );
  };

  const listHeader = (
    <View>
      <ScreenHeader
        title="Pacientes"
        onMenuPress={open}
        onNotificationsPress={() => navigate('notifications')}
      />

      <SearchBar
        value={search}
        onChangeText={setSearch}
        placeholder="Buscar pacientes..."
      />

      <PatientFilterChips
        activeFilter={activeFilter}
        counts={counts}
        onFilterChange={setActiveFilter}
      />
    </View>
  );

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <FlatList
        data={filteredPatients}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        ListHeaderComponent={listHeader}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmpty()}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.backgroundMuted,
  },
  listContent: {
    paddingBottom: 100,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingTop: 60,
    gap: 12,
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.textMuted,
  },
  errorText: {
    fontSize: 14,
    color: COLORS.danger,
    textAlign: 'center',
    paddingHorizontal: 32,
  },
});
