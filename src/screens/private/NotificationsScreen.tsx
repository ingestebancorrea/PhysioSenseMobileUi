import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  SectionList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Bell,
  BellOff,
  Bluetooth,
  CheckCheck,
  ChevronLeft,
  Flag,
  Hand,
  Info,
  MessageSquare,
  Settings,
  TrendingUp,
  Trophy,
  type LucideIcon,
} from 'lucide-react-native';

import { COLORS, CARD } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';
import { useAppToast } from '@/context/ToastContext';
import { useAppAlert } from '@/hooks/useAppAlert';
import {
  fetchNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from '@/services/notifications/notificationsApi';
import type {
  NotificationCategory,
  NotificationItem,
} from '@/types/notification';
import { describeError } from '@/utils/describeError';

// Se reexportan para quien ya importaba los tipos desde esta pantalla.
export type { NotificationCategory, NotificationItem } from '@/types/notification';

type FilterKey = 'all' | 'unread' | 'important';

interface FilterPill {
  key: FilterKey;
  label: string;
  count: number;
}

// ---------------------------------------------------------------------------
// Category → icon + pastel background
// ---------------------------------------------------------------------------

interface CategoryStyle {
  icon: LucideIcon;
  color: string;
  bgColor: string;
}

const CATEGORY_STYLES: Record<NotificationCategory, CategoryStyle> = {
  Progreso:    { icon: Trophy,       color: '#7C3AED', bgColor: '#EDE9FE' },
  Logro:       { icon: TrendingUp,   color: '#16A34A', bgColor: '#DCFCE7' },
  Ejercicio:   { icon: Hand,         color: '#4F46E5', bgColor: '#E0E7FF' },
  Recordatorio:{ icon: Bell,         color: '#EA580C', bgColor: '#FFF7ED' },
  Dispositivo: { icon: Bluetooth,    color: '#2563EB', bgColor: '#DBEAFE' },
  Meta:        { icon: Flag,         color: '#DC2626', bgColor: '#FEE2E2' },
  Mensaje:     { icon: MessageSquare,color: '#0D9488', bgColor: '#CCFBF1' },
  General:     { icon: Info,         color: '#6B7280', bgColor: '#F3F4F6' },
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

interface NotificationsScreenProps {
  onBack?: () => void;
  onOpenSettings?: () => void;
}

export const NotificationsScreen: React.FC<NotificationsScreenProps> = ({
  onBack,
  onOpenSettings,
}) => {
  const { user } = useAuth();
  const userId = user?.id ?? null;
  const { showToast } = useAppToast();
  const { alertModal, showAlert } = useAppAlert();

  const [activeFilter, setActiveFilter] = useState<FilterKey>('all');
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isMarkingAll, setIsMarkingAll] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadNotifications = useCallback(async () => {
    if (userId === null) {
      setNotifications([]);
      setError(null);
      setIsLoading(false);
      return;
    }

    try {
      const result = await fetchNotifications(userId);
      setNotifications(result.items);
      setError(null);
    } catch (err) {
      setNotifications([]);
      setError(
        err instanceof Error
          ? err.message
          : 'No se pudieron cargar las notificaciones.',
      );
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    setIsLoading(true);
    loadNotifications();
  }, [loadNotifications]);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await loadNotifications();
    setIsRefreshing(false);
  }, [loadNotifications]);

  const filters = useMemo<FilterPill[]>(() => {
    const unreadCount = notifications.filter(n => !n.isRead).length;
    const importantCount = notifications.filter(n => n.isImportant).length;
    return [
      { key: 'all', label: 'Todas', count: notifications.length },
      { key: 'unread', label: 'No leídas', count: unreadCount },
      { key: 'important', label: 'Importantes', count: importantCount },
    ];
  }, [notifications]);

  const filteredNotifications = useMemo(() => {
    switch (activeFilter) {
      case 'unread':
        return notifications.filter(n => !n.isRead);
      case 'important':
        return notifications.filter(n => n.isImportant);
      default:
        return notifications;
    }
  }, [notifications, activeFilter]);

  const sections = useMemo(() => {
    const sectionOrder: NotificationItem['section'][] = [
      'Hoy',
      'Ayer',
      'Esta semana',
      'Anterior',
    ];

    return sectionOrder
      .map(title => ({
        title,
        data: filteredNotifications.filter(n => n.section === title),
      }))
      .filter(s => s.data.length > 0);
  }, [filteredNotifications]);

  const handleMarkAllRead = async () => {
    if (isMarkingAll || !notifications.some(n => !n.isRead)) {
      return;
    }

    if (userId === null) {
      showAlert({
        title: 'Sesión no disponible',
        message: 'Vuelve a iniciar sesión para marcar las notificaciones.',
        variant: 'error',
      });
      return;
    }

    const previous = notifications;
    setIsMarkingAll(true);
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));

    try {
      await markAllNotificationsAsRead(userId);
      showToast({
        title: 'Listo',
        message: 'Marcaste todas las notificaciones como leídas.',
        variant: 'success',
      });
    } catch (err) {
      setNotifications(previous);
      showAlert({
        title: 'No se pudieron marcar como leídas',
        message: describeError(err),
        variant: 'error',
      });
    } finally {
      setIsMarkingAll(false);
    }
  };

  const handlePressNotification = async (item: NotificationItem) => {
    if (item.isRead) {
      return;
    }

    const previous = notifications;
    setNotifications(prev =>
      prev.map(n => (n.id === item.id ? { ...n, isRead: true } : n)),
    );

    if (userId === null) {
      return;
    }

    try {
      await markNotificationAsRead(item.id, userId);
    } catch (err) {
      setNotifications(previous);
      showAlert({
        title: 'No se pudo marcar como leída',
        message: describeError(err),
        variant: 'error',
      });
    }
  };

  // ---- render helpers ----

  const renderFilterPill = ({ key, label, count }: FilterPill) => {
    const isActive = key === activeFilter;
    return (
      <TouchableOpacity
        key={key}
        style={[styles.pill, isActive && styles.pillActive]}
        activeOpacity={0.7}
        onPress={() => setActiveFilter(key)}
      >
        <Text style={[styles.pillText, isActive && styles.pillTextActive]}>
          {label}
        </Text>
        <View style={[styles.pillBadge, isActive && styles.pillBadgeActive]}>
          <Text style={[styles.pillBadgeText, isActive && styles.pillBadgeTextActive]}>
            {count}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderNotificationCard = ({ item }: { item: NotificationItem }) => {
    const cat = CATEGORY_STYLES[item.category];
    const CatIcon = cat.icon;

    return (
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel={`${item.title}. ${item.description}`}
        onPress={() => handlePressNotification(item)}
      >
        {/* Unread dot */}
        <View style={styles.cardLeft}>
          <View
            style={[
              styles.unreadDot,
              { backgroundColor: item.isRead ? COLORS.divider : COLORS.primary },
            ]}
          />
        </View>

        {/* Category icon */}
        <View style={[styles.iconCircle, { backgroundColor: cat.bgColor }]}>
          <CatIcon size={18} color={cat.color} />
        </View>

        {/* Content */}
        <View style={styles.cardContent}>
          <View style={styles.cardTopRow}>
            <Text style={styles.cardTitle} numberOfLines={1}>
              {item.title}
            </Text>
            <Text style={styles.cardTime}>{item.timestamp}</Text>
          </View>

          <Text style={styles.cardDescription} numberOfLines={2}>
            {item.description}
          </Text>

          <View style={styles.cardFooter}>
            <View style={[styles.categoryBadge, { backgroundColor: cat.bgColor }]}>
              <Text style={[styles.categoryBadgeText, { color: cat.color }]}>
                {item.category}
              </Text>
            </View>
            {item.isImportant && (
              <View style={styles.importantBadge}>
                <Text style={styles.importantBadgeText}>Importante</Text>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderSectionHeader = ({
    section,
  }: {
    section: { title: string };
  }) => (
    <Text style={styles.sectionTitle}>{section.title}</Text>
  );

  const renderEmpty = () => {
    if (isLoading) {
      return (
        <View style={styles.feedbackContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.feedbackTitle}>Cargando notificaciones…</Text>
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.feedbackContainer}>
          <View style={styles.emptyIconCircle}>
            <BellOff size={32} color={COLORS.primary} />
          </View>
          <Text style={styles.feedbackTitle}>
            No pudimos cargar tus notificaciones
          </Text>
          <Text style={styles.feedbackMessage}>{error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            activeOpacity={0.8}
            onPress={loadNotifications}
          >
            <Text style={styles.retryText}>Reintentar</Text>
          </TouchableOpacity>
        </View>
      );
    }

    const emptyCopy: Record<FilterKey, { title: string; message: string }> = {
      all: {
        title: 'No tienes notificaciones',
        message: 'Cuando recibas novedades aparecerán aquí.',
      },
      unread: {
        title: 'No tienes notificaciones sin leer',
        message: 'Estás al día con todas tus notificaciones.',
      },
      important: {
        title: 'No tienes notificaciones importantes',
        message: 'Aquí aparecerán las notificaciones que requieran tu atención.',
      },
    };
    const copy = emptyCopy[activeFilter];

    return (
      <View style={styles.feedbackContainer}>
        <View style={styles.emptyIconCircle}>
          <BellOff size={32} color={COLORS.primary} />
        </View>
        <Text style={styles.feedbackTitle}>{copy.title}</Text>
        <Text style={styles.feedbackMessage}>{copy.message}</Text>
      </View>
    );
  };

  // ---- main render ----

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerButton}
          activeOpacity={0.8}
          onPress={onBack}
          accessibilityRole="button"
          accessibilityLabel="Volver"
        >
          <ChevronLeft size={22} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notificaciones</Text>
        <TouchableOpacity
          style={styles.headerButton}
          activeOpacity={0.8}
          onPress={onOpenSettings}
          accessibilityRole="button"
          accessibilityLabel="Configuración de notificaciones"
        >
          <Settings size={22} color={COLORS.textPrimary} />
        </TouchableOpacity>
      </View>

      {/* Filter pills */}
      <View style={styles.pillsRow}>
        {filters.map(renderFilterPill)}
      </View>

      {/* Notification list */}
      <SectionList
        sections={sections}
        keyExtractor={item => item.id}
        renderItem={renderNotificationCard}
        renderSectionHeader={renderSectionHeader}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        stickySectionHeadersEnabled={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            colors={[COLORS.primary]}
            tintColor={COLORS.primary}
          />
        }
      />

      {/* Mark all as read */}
      {notifications.some(n => !n.isRead) && (
        <View style={styles.markAllContainer}>
          <TouchableOpacity
            style={[
              styles.markAllButton,
              isMarkingAll && styles.markAllButtonDisabled,
            ]}
            activeOpacity={0.7}
            disabled={isMarkingAll}
            onPress={handleMarkAllRead}
          >
            {isMarkingAll ? (
              <ActivityIndicator size="small" color={COLORS.primary} />
            ) : (
              <CheckCheck size={18} color={COLORS.primary} />
            )}
            <Text style={styles.markAllText}>
              {isMarkingAll
                ? 'Marcando como leídas…'
                : 'Marcar todas como leídas'}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {alertModal}
    </SafeAreaView>
  );
};

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FAF9FE',
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.progressTrack,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },

  // Filter pills
  pillsRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    columnGap: 8,
    marginBottom: 16,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: COLORS.progressTrack,
  },
  pillActive: {
    backgroundColor: COLORS.primary,
  },
  pillText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  pillTextActive: {
    color: COLORS.white,
  },
  pillBadge: {
    marginLeft: 6,
    backgroundColor: COLORS.white,
    borderRadius: 10,
    minWidth: 22,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  pillBadgeActive: {
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  pillBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  pillBadgeTextActive: {
    color: COLORS.white,
  },

  // Section headers
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textMuted,
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 6,
  },

  // List
  listContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 8,
  },

  // Notification card
  card: {
    ...CARD,
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
    paddingVertical: 14,
    paddingHorizontal: 14,
  },
  cardLeft: {
    justifyContent: 'center',
    paddingTop: 6,
    marginRight: 10,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  cardContent: {
    flex: 1,
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  cardTitle: {
    flex: 1,
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginRight: 8,
  },
  cardTime: {
    fontSize: 11,
    color: COLORS.textMuted,
  },
  cardDescription: {
    fontSize: 13,
    lineHeight: 18,
    color: COLORS.textSecondary,
    marginBottom: 8,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 6,
  },
  categoryBadge: {
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 10,
  },
  categoryBadgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  importantBadge: {
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 10,
    backgroundColor: COLORS.dangerSoft,
  },
  importantBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.danger,
  },

  // Empty / loading / error
  feedbackContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 48,
  },
  emptyIconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primarySoft,
    marginBottom: 18,
  },
  feedbackTitle: {
    marginTop: 16,
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.textPrimary,
    textAlign: 'center',
  },
  feedbackMessage: {
    marginTop: 8,
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.textMuted,
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 20,
    backgroundColor: COLORS.primarySoft,
  },
  retryText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary,
  },

  // Mark all as read
  markAllContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#FAF9FE',
  },
  markAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    columnGap: 8,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: COLORS.primarySoft,
  },
  markAllButtonDisabled: {
    opacity: 0.7,
  },
  markAllText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary,
  },
});
