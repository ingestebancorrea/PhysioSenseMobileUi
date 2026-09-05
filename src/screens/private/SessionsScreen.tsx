import React, { useCallback, useMemo, useState } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Bell, Menu, Search, SlidersHorizontal } from 'lucide-react-native';
import { COLORS } from '@/constants/theme';
import { useDrawer } from '@/context/DrawerContext';
import { useNavigate } from '@/context/PrivateNavigationContext';
import { SESSIONS } from '@/mock/sessionData';
import type { Session } from '@/types/session';
import { SessionCard } from '@/components/sessions/SessionCard';
import { SessionFilterChips } from '@/components/sessions/SessionFilterChips';

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
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.menuButton}
          activeOpacity={0.8}
          onPress={open}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Menu size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.title}>Sesiones</Text>
        <TouchableOpacity
          style={styles.headerRight}
          activeOpacity={0.7}
          onPress={() => navigate('notifications')}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Bell size={22} color={COLORS.textPrimary} />
          <View style={styles.notificationDot} />
        </TouchableOpacity>
      </View>

      <View style={styles.searchRow}>
        <View style={styles.searchInput}>
          <Search size={18} color={COLORS.textMuted} />
          <TextInput
            style={styles.searchText}
            placeholder="Buscar sesiones..."
            placeholderTextColor={COLORS.textMuted}
            value={search}
            onChangeText={setSearch}
          />
        </View>
        <TouchableOpacity style={styles.filterButton} activeOpacity={0.7}>
          <SlidersHorizontal size={20} color={COLORS.textPrimary} />
        </TouchableOpacity>
      </View>

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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.backgroundMuted,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
    gap: 12,
  },
  menuButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
  },
  title: {
    flex: 1,
    fontSize: 26,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  headerRight: {
    position: 'relative',
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
  },
  notificationDot: {
    position: 'absolute',
    top: 10,
    right: 12,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.danger,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    gap: 8,
  },
  searchText: {
    flex: 1,
    fontSize: 14,
    color: COLORS.textPrimary,
    padding: 0,
  },
  filterButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
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
