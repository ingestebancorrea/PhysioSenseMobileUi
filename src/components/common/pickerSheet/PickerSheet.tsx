import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Keyboard,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { X } from 'lucide-react-native';
import { COLORS } from '@/constants/theme';
import { SearchBar } from '@/components/common/searchBar/SearchBar';

export interface PickerSheetProps<T> {
  visible: boolean;
  title: string;
  subtitle?: string;
  search: string;
  onSearchChange: (text: string) => void;
  searchPlaceholder?: string;
  loading: boolean;
  error: string | null;
  onRetry: () => void;
  items: T[];
  keyExtractor: (item: T) => string;
  renderItem: (item: T) => React.ReactElement | null;
  emptyTitle: string;
  emptyMessage: string;
  onClose: () => void;
}

/**
 * Bottom sheet con buscador para elegir un elemento de una lista.
 * Reutiliza las tarjetas que ya existen en la app (PatientCard, SessionCard).
 */
export const PickerSheet = <T,>({
  visible,
  title,
  subtitle,
  search,
  onSearchChange,
  searchPlaceholder = 'Buscar...',
  loading,
  error,
  onRetry,
  items,
  keyExtractor,
  renderItem,
  emptyTitle,
  emptyMessage,
  onClose,
}: PickerSheetProps<T>) => {
  // El `Modal` de RN crea otra ventana, y en Android `adjustResize` no
  // aplica a las ventanas modales. Medimos el teclado con la API nativa
  // `Keyboard` y reservamos ese espacio para que no tape el buscador.
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    const show = Keyboard.addListener('keyboardDidShow', event =>
      setKeyboardHeight(event.endCoordinates.height),
    );
    const hide = Keyboard.addListener('keyboardDidHide', () =>
      setKeyboardHeight(0),
    );

    return () => {
      show.remove();
      hide.remove();
    };
  }, []);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <Pressable
        style={[styles.backdrop, { paddingBottom: keyboardHeight }]}
        onPress={onClose}
      >
        <Pressable
          style={styles.sheet}
          onPress={event => event.stopPropagation()}
        >
          <View style={styles.handleContainer}>
            <View style={styles.handleBar} />
          </View>

          <View style={styles.header}>
            <View style={styles.headerText}>
              <Text style={styles.headerTitle}>{title}</Text>
              {subtitle ? (
                <Text style={styles.headerSubtitle} numberOfLines={1}>
                  {subtitle}
                </Text>
              ) : null}
            </View>
            <TouchableOpacity
              style={styles.closeButton}
              activeOpacity={0.7}
              onPress={onClose}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <X size={20} color={COLORS.textSecondary} />
            </TouchableOpacity>
          </View>

          <SearchBar
            value={search}
            onChangeText={onSearchChange}
            placeholder={searchPlaceholder}
            showFilterButton={false}
          />

          {loading ? (
            <View style={styles.loadingWrapper}>
              <ActivityIndicator color={COLORS.primary} />
              <Text style={styles.loadingText}>Cargando...</Text>
            </View>
          ) : error ? (
            <View style={styles.emptyWrapper}>
              <Text style={styles.errorText}>{error}</Text>
              <TouchableOpacity
                style={styles.retryButton}
                activeOpacity={0.8}
                onPress={onRetry}
              >
                <Text style={styles.retryText}>Reintentar</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <FlatList
              data={items}
              renderItem={({ item }) => renderItem(item)}
              keyExtractor={keyExtractor}
              style={styles.list}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              ListEmptyComponent={
                <View style={styles.emptyWrapper}>
                  <Text style={styles.emptyTitle}>{emptyTitle}</Text>
                  <Text style={styles.emptyMessage}>{emptyMessage}</Text>
                </View>
              }
            />
          )}
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: COLORS.cardSoft,
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    height: '85%',
    paddingBottom: 12,
  },
  handleContainer: {
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 4,
  },
  handleBar: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.progressTrack,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  headerText: {
    flex: 1,
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  headerSubtitle: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  closeButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.surface,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 12,
    flexGrow: 1,
  },
  loadingWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  loadingText: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  emptyWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    gap: 8,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textPrimary,
    textAlign: 'center',
  },
  emptyMessage: {
    fontSize: 13,
    lineHeight: 19,
    color: COLORS.textMuted,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 14,
    color: COLORS.danger,
    textAlign: 'center',
  },
  retryButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
  },
  retryText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '700',
  },
});
