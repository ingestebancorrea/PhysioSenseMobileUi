import type { PreferenceOption, SettingOption, TherapistProfile } from '@/types/settings';

export const THERAPIST_SETTINGS_PROFILE: TherapistProfile = {
  name: 'María López',
  role: 'Fisioterapeuta',
  avatarUrl: '',
};

export const THERAPIST_SETTING_OPTIONS: SettingOption[] = [
  {
    id: 'settings_perfil',
    title: 'Perfil personal',
    subtitle: 'Información básica y profesional',
    iconName: 'user',
    route: 'PersonalProfile',
  },
  {
    id: 'settings_notificaciones',
    title: 'Notificaciones',
    subtitle: 'Gestiona tus notificaciones',
    iconName: 'bell',
    route: 'Notifications',
  },
  {
    id: 'settings_preferencias',
    title: 'Preferencias',
    subtitle: 'Idioma, región y apariencia',
    iconName: 'settings',
    route: 'Preferences',
  },
  {
    id: 'settings_seguridad',
    title: 'Seguridad',
    subtitle: 'Contraseña y autenticación',
    iconName: 'shieldCheck',
    route: 'Security',
  },
  {
    id: 'settings_sesiones',
    title: 'Sesión y dispositivos',
    subtitle: 'Gestiona tus dispositivos activos',
    iconName: 'monitor',
    route: 'Devices',
  },
  {
    id: 'settings_privacidad',
    title: 'Privacidad',
    subtitle: 'Manejo de datos y permisos',
    iconName: 'lock',
    route: 'Privacy',
  },
];

export const PREFERENCE_OPTIONS: PreferenceOption[] = [
  {
    id: 'pref_idioma',
    title: 'Idioma',
    value: 'Español (Colombia)',
    iconName: 'globe',
  },
  {
    id: 'pref_region',
    title: 'Región',
    value: 'Colombia',
    iconName: 'mapPin',
  },
  {
    id: 'pref_tema',
    title: 'Tema de la aplicación',
    value: 'Claro',
    iconName: 'sun',
  },
  {
    id: 'pref_tamano_texto',
    title: 'Tamaño de texto',
    value: 'Normal',
    iconName: 'type',
  },
  {
    id: 'pref_notificaciones',
    title: 'Notificaciones',
    value: 'Gestiona tus preferencias de notificaciones.',
    iconName: 'bell',
  },
  {
    id: 'pref_accesibilidad',
    title: 'Accesibilidad',
    value: 'Mejora tu experiencia de uso.',
    iconName: 'personStanding',
  },
];