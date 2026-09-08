import React, { useMemo, useState } from 'react';
import {
  SectionList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Bell,
  Bluetooth,
  Check,
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

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type NotificationCategory =
  | 'Progreso'
  | 'Logro'
  | 'Ejercicio'
  | 'Recordatorio'
  | 'Dispositivo'
  | 'Meta'
  | 'Mensaje'
  | 'General';

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  isRead: boolean;
  category: NotificationCategory;
  section: 'Hoy' | 'Ayer' | 'Esta semana';
  isImportant?: boolean;
}

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
// Mock data
// ---------------------------------------------------------------------------

const MOCK_NOTIFICATIONS: NotificationItem[] = [
  {
    id: '1',
    title: '¡Sesión completada!',
    description: 'Terminaste tu sesión de ejercicios de mano. Excelente progreso hoy.',
    timestamp: '10:30 a. m.',
    isRead: false,
    category: 'Progreso',
    section: 'Hoy',
  },
  {
    id: '2',
    title: 'Nuevo récord personal',
    description: 'Superaste tu mejor marca en apertura de mano: 42 repeticiones.',
    timestamp: '9:15 a. m.',
    isRead: false,
    category: 'Logro',
    section: 'Hoy',
  },
  {
    id: '3',
    title: 'Ejercicio programado',
    description: 'Es hora de tu sesión de pinza. No olvides realizar el calentamiento.',
    timestamp: '8:00 a. m.',
    isRead: false,
    category: 'Ejercicio',
    section: 'Hoy',
    isImportant: true,
  },
  {
    id: '4',
    title: 'Smart Glove conectado',
    description: 'Tu guante inteligente se ha conectado exitosamente vía Bluetooth.',
    timestamp: '7:45 a. m.',
    isRead: true,
    category: 'Dispositivo',
    section: 'Hoy',
  },
  {
    id: '5',
    title: 'Meta semanal alcanzada',
    description: 'Completaste 5 de 5 sesiones esta semana. ¡Sigue así!',
    timestamp: 'Ayer, 6:00 p. m.',
    isRead: false,
    category: 'Meta',
    section: 'Ayer',
    isImportant: true,
  },
  {
    id: '6',
    title: 'Mensaje de tu terapeuta',
    description: 'Dra. García: "Buen trabajo esta semana. Aumenta las repeticiones a 15."',
    timestamp: 'Ayer, 2:30 p. m.',
    isRead: false,
    category: 'Mensaje',
    section: 'Ayer',
  },
  {
    id: '7',
    title: 'Recordatorio de sesión',
    description: 'Tienes una sesión pendiente de oposición del pulgar.',
    timestamp: 'Ayer, 9:00 a. m.',
    isRead: true,
    category: 'Recordatorio',
    section: 'Ayer',
  },
  {
    id: '8',
    title: 'Actualización disponible',
    description: 'Hay una nueva versión del firmware para tu Smart Glove (v2.3.1).',
    timestamp: 'Mié, 14 Mayo',
    isRead: true,
    category: 'Dispositivo',
    section: 'Esta semana',
  },
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

interface NotificationsScreenProps {
  onBack?: () => void;
  notifications?: NotificationItem[];
}

export const NotificationsScreen: React.FC<NotificationsScreenProps> = ({
  onBack,
  notifications: notificationsProp = MOCK_NOTIFICATIONS,
}) => {
  const [activeFilter, setActiveFilter] = useState<FilterKey>('all');
  const [notifications, setNotifications] = useState(notificationsProp);

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
    ];

    return sectionOrder
      .map(title => ({
        title,
        data: filteredNotifications.filter(n => n.section === title),
      }))
      .filter(s => s.data.length > 0);
  }, [filteredNotifications]);

  const handleMarkAllRead = () => {
    setNotifications(prev =>
      prev.map(n => ({ ...n, isRead: true })),
    );
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

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>No hay notificaciones</Text>
    </View>
  );

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
      />

      {/* Mark all as read */}
      <View style={styles.markAllContainer}>
        <TouchableOpacity
          style={styles.markAllButton}
          activeOpacity={0.7}
          onPress={handleMarkAllRead}
        >
          <CheckCheck size={18} color={COLORS.primary} />
          <Text style={styles.markAllText}>Marcar todas como leídas</Text>
        </TouchableOpacity>
      </View>
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

  // Empty state
  emptyContainer: {
    alignItems: 'center',
    paddingTop: 48,
  },
  emptyText: {
    fontSize: 15,
    color: COLORS.textMuted,
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
  markAllText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary,
  },
});
