import React from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ICONS } from '@/constants/icons';
import { COLORS } from '@/constants/theme';
import { SessionHistoryCard } from '@/components/progress/SessionHistoryCard';
import { MOCK_SESSION_HISTORY } from '@/mock/sessionHistoryData';
import type { ProgressFlowParamList } from '@/navigation/types/progressFlowParams';
import type { SessionRecord } from '@/types/progress';

type SessionHistoryScreenProps = NativeStackScreenProps<
  ProgressFlowParamList,
  'SessionHistory'
>;

const ItemSeparator = () => <View style={styles.separator} />;

export const SessionHistoryScreen: React.FC<SessionHistoryScreenProps> = ({
  navigation,
}) => {
  const ChevronLeftIcon = ICONS.chevronLeft;

  const renderSession = ({ item }: { item: SessionRecord }) => (
    <SessionHistoryCard
      session={item}
      onPress={() =>
        navigation.navigate('SessionDetail', { sessionId: item.id })
      }
    />
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          activeOpacity={0.8}
          onPress={() => navigation.goBack()}
        >
          <ChevronLeftIcon size={22} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text
          style={styles.headerTitle}
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={0.8}
        >
          Historial de sesiones
        </Text>
      </View>

      <FlatList
        data={MOCK_SESSION_HISTORY}
        keyExtractor={item => item.id}
        renderItem={renderSession}
        ItemSeparatorComponent={ItemSeparator}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.progressTrack,
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textPrimary,
    textAlign: 'center',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
  },
  separator: {
    height: 12,
  },
});
