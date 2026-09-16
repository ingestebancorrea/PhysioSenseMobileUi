import type {
  ActiveDevice,
  PreferenceOption,
  PrivacyOption,
  SecurityOption,
  SettingOption,
  TherapistProfile,
} from '@/types/settings';

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

export const SECURITY_OPTIONS: SecurityOption[] = [
  {
    id: 'sec_biometria',
    title: 'Biometría',
    subtitle:
      'Inicia sesión con tu huella dactilar o reconocimiento facial.',
    iconName: 'fingerprint',
    accessory: 'switch',
    switchValue: true,
  },
  {
    id: 'sec_contrasena',
    title: 'Cambiar contraseña',
    subtitle:
      'Actualiza tu contraseña regularmente para mayor seguridad.',
    iconName: 'lock',
    accessory: 'chevron',
  },
  {
    id: 'sec_verificacion',
    title: 'Verificación en dos pasos',
    subtitle: 'Añade una capa extra de seguridad a tu cuenta.',
    iconName: 'shieldCheck',
    accessory: 'chevron',
  },
  {
    id: 'sec_actividad',
    title: 'Actividad de seguridad',
    subtitle: 'Revisa los últimos accesos a tu cuenta.',
    iconName: 'history',
    accessory: 'chevron',
  },
];

export const CURRENT_SESSION = {
  deviceName: 'iPhone 16',
  os: 'iOS 26.5',
  location: 'Bogotá, Colombia',
  lastActive: '10 jul 2025, 9:41 a. m.',
};

export const ACTIVE_DEVICES: ActiveDevice[] = [
  {
    id: 'device_macbook',
    deviceType: 'laptop',
    deviceName: 'MacBook Pro',
    os: 'macOS 14.6',
    browser: 'Chrome',
    location: 'Bogotá, Colombia',
    lastActive: '8 jul 2025, 4:12 p. m.',
  },
  {
    id: 'device_ipad',
    deviceType: 'tablet',
    deviceName: 'iPad Air',
    os: 'iPadOS 17.5',
    browser: 'Safari',
    location: 'Bogotá, Colombia',
    lastActive: '5 jul 2025, 11:03 a. m.',
  },
];

export const PRIVACY_OPTIONS: PrivacyOption[] = [
  {
    id: 'privacy_datos',
    title: 'Uso de datos',
    subtitle: 'Administra el uso de tus datos para mejorar la aplicación.',
    iconName: 'database',
    route: 'DataUsage',
  },
  {
    id: 'privacy_personales',
    title: 'Datos personales',
    subtitle: 'Consulta y edita la información que compartes.',
    iconName: 'user',
    route: 'PersonalData',
  },
  {
    id: 'privacy_compartir',
    title: 'Compartir información',
    subtitle: 'Configura qué información puedes compartir con otros.',
    iconName: 'share2',
    route: 'ShareInfo',
  },
  {
    id: 'privacy_cookies',
    title: 'Cookies y tecnologías',
    subtitle: 'Gestiona las cookies y tecnologías de seguimiento.',
    iconName: 'cookie',
    route: 'Cookies',
  },
  {
    id: 'privacy_consentimientos',
    title: 'Consentimientos',
    subtitle: 'Revisa y administra tus consentimientos de uso de datos.',
    iconName: 'fileCheck',
    route: 'Consents',
  },
];