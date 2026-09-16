import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ChartColumnBig,
  Hand,
  House,
  User,
  type LucideIcon,
} from 'lucide-react-native';

const COLORS = {
  active: '#6C5CE7',
  inactive: '#8E8E93',
  background: '#FFFFFF',
};

interface NavItem {
  key: string;
  label: string;
  icon: LucideIcon;
}

const NAV_ITEMS: NavItem[] = [
  { key: 'home', label: 'Inicio', icon: House },
  { key: 'exercises', label: 'Ejercicios', icon: Hand },
  { key: 'progress', label: 'Progreso', icon: ChartColumnBig },
  { key: 'profile', label: 'Perfil', icon: User },
];

interface PrivateNavigationProps {
  activeTab: string;
  onTabPress: (tab: string) => void;
}

export const PrivateNavigation: React.FC<PrivateNavigationProps> = ({
  activeTab,
  onTabPress,
}) => (
  <SafeAreaView edges={['bottom']} style={styles.safeArea}>
    <View style={styles.container}>
      {NAV_ITEMS.map(({ key, label, icon: Icon }) => {
        const isActive = key === activeTab;
        const color = isActive ? COLORS.active : COLORS.inactive;

        return (
          <TouchableOpacity
            key={key}
            style={styles.item}
            activeOpacity={0.7}
            onPress={() => onTabPress(key)}
          >
            <Icon size={26} color={color} strokeWidth={isActive ? 2.5 : 2} />
            <Text
              style={[
                styles.label,
                { color },
                isActive && styles.labelActive,
              ]}
            >
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  </SafeAreaView>
);

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: COLORS.background,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: COLORS.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 10,
    paddingBottom: 6,
    paddingHorizontal: 8,
  },
  item: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 11,
    marginTop: 4,
    fontWeight: '500',
  },
  labelActive: {
    fontWeight: 'bold',
  },
});
