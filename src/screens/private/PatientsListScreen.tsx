import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Animated,
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
import { EmptyState } from '@/components/common/emptyState/EmptyState';

type FilterTab = 'Todos' | 'Activos' | 'Inactivos';

interface PatientsListScreenProps {
  onSelectPatient: (patient: Patient) => void;
  onAddPatient?: () => void;
}

const LOAD_ERROR_MESSAGE = 'No se pudo cargar la lista de pacientes.';

export const PatientsListScreen: React.FC<PatientsListScreenProps> = ({
  onSelectPatient,
  onAddPatient,
}) => {
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterTab>('Todos');
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { open } = useDrawer();
  const navigate = useNavigate();

  /** Animación de rotación del spinner de carga. */
  const spin = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(spin, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      }),
    ).start();
  }, [spin]);

  const loadPatients = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Se captura el rol y el id del usuario autenticado por consistencia con
      // SessionsScreen. El endpoint /therapists/patients infiere al terapeuta
      // autenticado a través del token Bearer, por lo que no viaja en query.
      const result = await patientService.getMyPatients();
      setPatients(result.patients);
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

  const hasActiveFilter = activeFilter !== 'Todos' || search.trim().length > 0;

  const renderEmpty = () => {
    if (error) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <Button title="Reintentar" onPress={loadPatients} size="small" />
        </View>
      );
    }

    if (hasActiveFilter) {
      return (
        <EmptyState
          title="No se encontraron resultados"
          message="Ajusta la búsqueda o los filtros para encontrar lo que buscas."
        />
      );
    }

    return (
      <EmptyState
        illustration="people"
        title="No se encontraron pacientes"
        message="Aún no tienes pacientes registrados. Puedes agregar un nuevo paciente o esperar a que se asigne uno."
        actionLabel="Agregar paciente"
        onAction={onAddPatient}
      />
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


  const rotate = spin.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      {listHeader}

      {loading ? (
        <View style={styles.loadingWrapper}>
          <Animated.View
            style={[
              styles.spinner,
              { transform: [{ rotate }] },
            ]}
          >
            <View style={styles.spinnerRing} />
            <View style={styles.spinnerDot} />
          </Animated.View>

          <View style={styles.loadingContent}>
            <Text style={styles.loadingTitle}>
              Cargando tus pacientes
            </Text>
            <Text style={styles.loadingSubtitle}>
              Un momento mientras traemos tu listado
            </Text>
          </View>
        </View>
      ) : (
        <FlatList
          data={filteredPatients}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={renderEmpty()}
        />
      )}
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
  errorText: {
    fontSize: 14,
    color: COLORS.danger,
    textAlign: 'center',
    paddingHorizontal: 32,
  },
  loadingWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.backgroundMuted,
    paddingHorizontal: 24,
  },
  spinner: {
    width: 64,
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
  },
  spinnerRing: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 4,
    borderColor: COLORS.borderSubtle,
    borderTopColor: COLORS.primary,
  },
  spinnerDot: {
    position: 'absolute',
    top: -4,
    left: 25,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: COLORS.primary,
  },
  loadingContent: {
    alignItems: 'center',
    marginTop: 20,
  },
  loadingTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.textStrong,
    marginBottom: 6,
  },
  loadingSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    maxWidth: 260,
    lineHeight: 20,
  },
});
