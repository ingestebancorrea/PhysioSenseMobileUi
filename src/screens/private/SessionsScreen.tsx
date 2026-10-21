import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '@/constants/theme';
import { useDrawer } from '@/context/DrawerContext';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from '@/context/PrivateNavigationContext';
import { useTherapistId } from '@/hooks/useTherapistId';
import type { Session } from '@/types/session';
import type {
  QuerySessionsParams,
  SessionsPageResult,
} from '@/types/session';
import { sessionService } from '@/services/sessionService';
import { SessionCard } from '@/components/sessions/SessionCard';
import {
  SessionFiltersModal,
  EMPTY_FILTERS,
  getActiveFilterCount,
  type SessionFilters,
} from '@/components/sessions/SessionFiltersModal';
import { SessionFilterChips } from '@/components/sessions/SessionFilterChips';
import { ScreenHeader } from '@/components/common/screenHeader/ScreenHeader';
import { SearchBar } from '@/components/common/searchBar/SearchBar';
import { FabButton } from '@/components/common/fabButton/FabButton';
import { EmptyState } from '@/components/common/emptyState/EmptyState';
import { AppLoader } from '@/components/common/appLoader/AppLoader';

type FilterTab = 'Todas' | 'Activas' | 'Completadas' | 'Borradores';

// (loader is now the reusable AppLoader component)

interface SessionsScreenProps {
  onSelectSession?: (session: Session) => void;
  onCreateSession?: () => void;
}

export const SessionsScreen: React.FC<SessionsScreenProps> = ({
  onSelectSession,
  onCreateSession,
}) => {
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterTab>('Todas');
  const [filters, setFilters] = useState<SessionFilters>(EMPTY_FILTERS);
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { open } = useDrawer();
  const navigate = useNavigate();
  const { user, role } = useAuth();
  const { therapistId, resolved: therapistIdResolved } = useTherapistId(
    role === 'fisioterapeuta' ? user?.id ?? null : null,
  );

  const patientOptions = useMemo(
    () =>
      Array.from(new Set(sessions.map(session => session.patientName))).sort(
        (a, b) => a.localeCompare(b),
      ),
    [sessions],
  );

  const activeFilterCount = getActiveFilterCount(filters);

  /** Indica si hay búsqueda o filtros activos que puedan estar ocultando registros. */
  const hasActiveFilter =
    activeFilter !== 'Todas' ||
    search.trim().length > 0 ||
    activeFilterCount > 0;

  const handleOpenSessionDetail = useCallback(
    (sessionId: string) => {
      const session = sessions.find(item => item.id === sessionId);
      if (session) {
        onSelectSession?.(session);
      }
    },
    [sessions, onSelectSession],
  );

  const counts = useMemo(
    () => ({
      Todas: sessions.length,
      Activas: sessions.filter(s => s.status === 'Activa').length,
      Completadas: sessions.filter(s => s.status === 'Completada').length,
      Borradores: sessions.filter(s => s.status === 'Borrador').length,
    }),
    [sessions],
  );

  const loadSessions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params: QuerySessionsParams = { page: 1, limit: 20 };

      // Captura el rol y el id del usuario autenticado y los envía como
      // query params para que el backend filtre las sesiones del dueño.
      // El therapist_id viene del token JWT (no es el mismo que user.id).
      if (user && role) {
        if (role === 'fisioterapeuta' && therapistId !== null) {
          params.therapist_id = therapistId;
        } else if (role === 'paciente') {
          params.patient_id = user.id;
        }
      }

      const result: SessionsPageResult = await sessionService.getSessions(
        params,
      );
      setSessions(result.sessions);
    } catch (err: any) {
      setError(
        err.message ||
          'No se pudieron cargar las sesiones. Intenta de nuevo más tarde.',
      );
    } finally {
      setLoading(false);
    }
  }, [user, role, therapistId]);

  useEffect(() => {
    // Si es fisioterapeuta, esperar a que el token se haya procesado antes de
    // cargar. Una vez resuelto (therapistIdResolved === true), se envía el
    // therapist_id si está disponible; si el token no lo trae, se carga sin
    // filtro y el backend usará el Bearer token para identificar al usuario.
    if (role === 'fisioterapeuta' && !therapistIdResolved) return;

    loadSessions();
  }, [loadSessions, role, therapistIdResolved, therapistId]);

  const filteredSessions = useMemo(() => {
    let result = sessions;

    if (activeFilter === 'Activas') {
      result = result.filter(s => s.status === 'Activa');
    } else if (activeFilter === 'Completadas') {
      result = result.filter(s => s.status === 'Completada');
    } else if (activeFilter === 'Borradores') {
      result = result.filter(s => s.status === 'Borrador');
    }

    if (search.trim()) {
      const query = search.toLowerCase();
      result = result.filter(
        s =>
          s.title.toLowerCase().includes(query) ||
          s.patientName.toLowerCase().includes(query),
      );
    }

    if (filters.statuses.length > 0) {
      result = result.filter(s => filters.statuses.includes(s.status));
    }

    if (filters.duration) {
      result = result.filter(s => {
        const minutes = s.durationMinutes;
        if (filters.duration === 'short') return minutes < 30;
        if (filters.duration === 'long') return minutes > 45;
        return minutes >= 30 && minutes <= 45;
      });
    }

    if (filters.patients.length > 0) {
      result = result.filter(s => filters.patients.includes(s.patientName));
    }

    return result;
  }, [activeFilter, search, filters, sessions]);

  const renderItem = useCallback(
    ({ item }: { item: Session }) => (
      <SessionCard session={item} onPress={handleOpenSessionDetail} />
    ),
    [handleOpenSessionDetail],
  );

  const keyExtractor = useCallback((item: Session) => item.id, []);

  const listHeader = (
    <View>
      <ScreenHeader
        title="Sesiones"
        onMenuPress={open}
        onNotificationsPress={() => navigate('notifications')}
      />

      <SearchBar
        value={search}
        onChangeText={setSearch}
        placeholder="Buscar sesiones..."
        onFilterPress={() => setFiltersVisible(true)}
        filterActive={activeFilterCount > 0}
      />

      <SessionFilterChips
        activeFilter={activeFilter}
        counts={counts}
        onFilterChange={setActiveFilter}
      />
    </View>
  );


  if (error) {
    return (
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <FabButton onPress={loadSessions} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      {listHeader}

      {loading ? (
        <View style={styles.loadingWrapper}>
          <AppLoader />

          <View style={styles.loadingContent}>
            <Text style={styles.loadingTitle}>
              Cargando tus sesiones
            </Text>
            <Text style={styles.loadingSubtitle}>
              Un momento mientras traemos tu historial
            </Text>
          </View>
        </View>
      ) : (
        <FlatList
          data={filteredSessions}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            hasActiveFilter ? (
              <EmptyState
                title="No se encontraron resultados"
                message="Ajusta la búsqueda o los filtros para encontrar lo que buscas."
              />
            ) : (
              <EmptyState
                illustration="calendar"
                title="No se encontraron sesiones"
                message="Aún no tienes sesiones registradas. Puedes crear una nueva sesión o asignar ejercicios a tus pacientes."
                actionLabel="Crear sesión"
                onAction={onCreateSession}
              />
            )
          }
        />
      )}

      {!loading && sessions.length > 0 ? (
        <FabButton onPress={onCreateSession} />
      ) : null}

      <SessionFiltersModal
        visible={filtersVisible}
        initialFilters={filters}
        patientOptions={patientOptions}
        onClose={() => setFiltersVisible(false)}
        onApply={setFilters}
        onReset={() => setFilters(EMPTY_FILTERS)}
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
  loadingWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.backgroundMuted,
    paddingHorizontal: 24,
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
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  errorText: {
    textAlign: 'center',
    marginBottom: 16,
    fontSize: 14,
    color: COLORS.textSecondary,
  },
});
