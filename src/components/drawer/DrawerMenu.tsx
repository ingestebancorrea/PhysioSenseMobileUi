import React, { useEffect, useRef } from 'react';
import {
  Animated,
  BackHandler,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';
import { useDrawer } from '@/context/DrawerContext';
import { PATIENT_PROFILE } from '@/mock/patientProfileData';
import { THERAPIST_DASHBOARD_DATA } from '@/mock/therapistDashboardData';
import { getInitials } from '@/utils/helpers/nameInitials';

type IconName = React.ComponentProps<typeof MaterialCommunityIcons>['name'];

interface DrawerItem {
  key: string;
  label: string;
  icon: IconName;
}

const PATIENT_MAIN_ITEMS: DrawerItem[] = [
  { key: 'home', label: 'Inicio', icon: 'home-outline' },
  { key: 'exercises', label: 'Ejercicios', icon: 'hand-pointing-up' },
  { key: 'progress', label: 'Mi progreso', icon: 'chart-bar' },
  { key: 'history', label: 'Historial', icon: 'calendar' },
  { key: 'devices', label: 'Dispositivos', icon: 'watch' },
  { key: 'profile', label: 'Perfil', icon: 'account-outline' },
];

const THERAPIST_MAIN_ITEMS: DrawerItem[] = [
  { key: 'inicio', label: 'Inicio', icon: 'view-dashboard-outline' },
  { key: 'pacientes', label: 'Pacientes', icon: 'account-group-outline' },
  { key: 'sesiones', label: 'Sesiones', icon: 'calendar-check' },
  { key: 'ejercicios', label: 'Ejercicios', icon: 'dumbbell' },
];

const SECONDARY_ITEMS: DrawerItem[] = [
  { key: 'settings', label: 'Configuración', icon: 'cog-outline' },
  { key: 'help', label: 'Ayuda y soporte', icon: 'help-circle-outline' },
];

const DRAWER_WIDTH_RATIO = 0.82;
const DRAWER_MAX_WIDTH = 340;
const ANIMATION_DURATION = 260;

interface DrawerMenuProps {
  activeItem: string;
  onSelect: (key: string) => void;
}

export const DrawerMenu: React.FC<DrawerMenuProps> = ({
  activeItem,
  onSelect,
}) => {
  const { isOpen, close } = useDrawer();
  const { logout, role } = useAuth();
  const { width: screenWidth } = useWindowDimensions();

  const isTherapist = role === 'fisioterapeuta';
  const mainItems = isTherapist ? THERAPIST_MAIN_ITEMS : PATIENT_MAIN_ITEMS;
  const userName = isTherapist
    ? THERAPIST_DASHBOARD_DATA.therapist.name
    : PATIENT_PROFILE.name;
  const avatarUrl = isTherapist ? null : PATIENT_PROFILE.avatarUrl;
  const roleBadgeLabel = isTherapist ? 'Fisioterapeuta' : 'Paciente';

  const drawerWidth = Math.min(
    screenWidth * DRAWER_WIDTH_RATIO,
    DRAWER_MAX_WIDTH,
  );
  const translateX = useRef(new Animated.Value(-drawerWidth)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(translateX, {
        toValue: isOpen ? 0 : -drawerWidth,
        duration: ANIMATION_DURATION,
        useNativeDriver: true,
      }),
      Animated.timing(backdropOpacity, {
        toValue: isOpen ? 1 : 0,
        duration: ANIMATION_DURATION,
        useNativeDriver: true,
      }),
    ]).start();
  }, [isOpen, drawerWidth, translateX, backdropOpacity]);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const subscription = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        close();
        return true;
      },
    );

    return () => subscription.remove();
  }, [isOpen, close]);

  const handleSelect = (item: DrawerItem) => {
    onSelect(item.key);
    close();
  };

  return (
    <View
      style={StyleSheet.absoluteFill}
      pointerEvents={isOpen ? 'auto' : 'none'}
    >
      <Animated.View style={[styles.backdrop, { opacity: backdropOpacity }]}>
        <TouchableOpacity
          style={styles.backdropTouchable}
          activeOpacity={1}
          onPress={close}
          accessibilityRole="button"
          accessibilityLabel="Cerrar menú"
        />
      </Animated.View>

      <Animated.View
        style={[styles.panel, { width: drawerWidth, transform: [{ translateX }] }]}
        accessibilityViewIsModal={isOpen}
      >
        <View style={styles.header}>
          {avatarUrl ? (
            <Image source={{ uri: avatarUrl }} style={styles.profileImage} />
          ) : (
            <View style={[styles.profileImage, styles.profileInitials]}>
              <Text style={styles.initials}>{getInitials(userName)}</Text>
            </View>
          )}
          <View style={styles.headerInfo}>
            <Text style={styles.userName}>{userName}</Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{roleBadgeLabel}</Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.closeButton}
            activeOpacity={0.7}
            onPress={close}
            accessibilityRole="button"
            accessibilityLabel="Cerrar menú"
          >
            <MaterialCommunityIcons
              name="close"
              size={24}
              color={COLORS.textPrimary}
            />
          </TouchableOpacity>
        </View>

        <ScrollView
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        >
          {mainItems.map(item => {
            const isActive = item.key === activeItem;

            return (
              <TouchableOpacity
                key={item.key}
                style={[styles.item, isActive && styles.itemActive]}
                activeOpacity={0.7}
                onPress={() => handleSelect(item)}
                accessibilityRole="button"
                accessibilityState={{ selected: isActive }}
              >
                <MaterialCommunityIcons
                  name={item.icon}
                  size={22}
                  color={isActive ? COLORS.primary : COLORS.textMuted}
                />
                <Text
                  style={[
                    styles.itemLabel,
                    isActive && styles.itemLabelActive,
                  ]}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          })}

          <View style={styles.separator} />

          {SECONDARY_ITEMS.map(item => (
            <TouchableOpacity
              key={item.key}
              style={styles.item}
              activeOpacity={0.7}
              onPress={() => handleSelect(item)}
              accessibilityRole="button"
            >
              <MaterialCommunityIcons
                name={item.icon}
                size={22}
                color={COLORS.textMuted}
              />
              <Text style={styles.itemLabel}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.logoutButton}
            activeOpacity={0.7}
            onPress={logout}
            accessibilityRole="button"
          >
            <MaterialCommunityIcons
              name="logout"
              size={22}
              color={COLORS.danger}
            />
            <Text style={styles.logoutText}>Cerrar sesión</Text>
          </TouchableOpacity>

          <View style={styles.brandContainer}>
            <Image
              source={require('../../assets/images/drawer_logo.png')}
              style={styles.brandLogo}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.versionText}>Versión 1.0.0</Text>
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: COLORS.blackOverlay,
  },
  backdropTouchable: {
    flex: 1,
  },
  panel: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    backgroundColor: COLORS.white,
    paddingTop: 56,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: COLORS.border,
  },
  profileInitials: {
    backgroundColor: COLORS.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.primary,
  },
  headerInfo: {
    flex: 1,
    marginLeft: 14,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.primarySoft,
    paddingVertical: 3,
    paddingHorizontal: 10,
    borderRadius: 12,
    marginTop: 6,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.primary,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listContent: {
    paddingVertical: 12,
    paddingHorizontal: 12,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 13,
    marginVertical: 2,
  },
  itemActive: {
    backgroundColor: COLORS.primarySoft,
  },
  itemLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginLeft: 16,
  },
  itemLabelActive: {
    color: COLORS.primary,
  },
  separator: {
    height: 1,
    backgroundColor: COLORS.divider,
    marginVertical: 12,
    marginHorizontal: 12,
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
    borderTopWidth: 1,
    borderTopColor: COLORS.divider,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.danger,
    marginLeft: 12,
  },
  brandContainer: {
    alignItems: 'center',
    marginTop: 24,
  },
  brandLogo: {
    width: 160,
    height: 52,
  },
  versionText: {
    textAlign: 'center',
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 4,
  },
});
