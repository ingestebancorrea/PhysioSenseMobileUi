import React, { useCallback, useMemo, useState } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '@/constants/theme';
import { useDrawer } from '@/context/DrawerContext';
import { useNavigate } from '@/context/PrivateNavigationContext';
import { PATIENTS } from '@/mock/patientData';
import type { Patient } from '@/types/patient';
import { PatientCard } from '@/components/patients/PatientCard';
import { PatientFilterChips } from '@/components/patients/PatientFilterChips';
import { ScreenHeader } from '@/components/common/screenHeader/ScreenHeader';
import { SearchBar } from '@/components/common/searchBar/SearchBar';
import { FabButton } from '@/components/common/fabButton/FabButton';

type FilterTab = 'Todos' | 'Activos' | 'Inactivos';

interface PatientsListScreenProps {
  onSelectPatient: (patientId: string) => void;
}

export const PatientsListScreen: React.FC<PatientsListScreenProps> = ({
  onSelectPatient,
}) => {
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterTab>('Todos');
  const { open } = useDrawer();
  const navigate = useNavigate();

  const counts = useMemo(
    () => ({
      Todos: PATIENTS.length,
      Activos: PATIENTS.filter(p => p.status === 'Activo').length,
      Inactivos: PATIENTS.filter(p => p.status === 'Inactivo').length,
    }),
    [],
  );

  const filteredPatients = useMemo(() => {
    let result = PATIENTS;

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
  }, [activeFilter, search]);

  const renderItem = useCallback(
    ({ item }: { item: Patient }) => (
      <PatientCard patient={item} onPress={onSelectPatient} />
    ),
    [onSelectPatient],
  );

  const keyExtractor = useCallback((item: Patient) => item.id, []);

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
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No se encontraron pacientes</Text>
          </View>
        }
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
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.textMuted,
  },
});
