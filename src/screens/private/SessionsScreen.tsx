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
import { SESSIONS } from '@/mock/sessionData';
import type { Session } from '@/types/session';
import { SessionCard } from '@/components/sessions/SessionCard';
import { SessionFilterChips } from '@/components/sessions/SessionFilterChips';
import { ScreenHeader } from '@/components/common/screenHeader/ScreenHeader';
import { SearchBar } from '@/components/common/searchBar/SearchBar';
import { FabButton } from '@/components/common/fabButton/FabButton';

type FilterTab = 'Todas' | 'Activas' | 'Completadas' | 'Borradores';

interface SessionsScreenProps {}

export const SessionsScreen: React.FC<SessionsScreenProps> = () => {
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterTab>('Todas');
  const { open } = useDrawer();
  const navigate = useNavigate();

  const counts = useMemo(
    () => ({
      Todas: SESSIONS.length,
      Activas: SESSIONS.filter(s => s.status === 'Activa').length,
      Completadas: SESSIONS.filter(s => s.status === 'Completada').length,
      Borradores: SESSIONS.filter(s => s.status === 'Borrador').length,
    }),
    [],
  );

  const filteredSessions = useMemo(() => {
    let result = SESSIONS;

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

    return result;
  }, [activeFilter, search]);

  const renderItem = useCallback(
    ({ item }: { item: Session }) => (
      <SessionCard session={item} onPress={() => {}} />
    ),
    [],
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
      />

      <SessionFilterChips
        activeFilter={activeFilter}
        counts={counts}
        onFilterChange={setActiveFilter}
      />
    </View>
  );

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <FlatList
        data={filteredSessions}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        ListHeaderComponent={listHeader}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No se encontraron sesiones</Text>
          </View>
        }
      />

      <FabButton onPress={() => {}} />
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
