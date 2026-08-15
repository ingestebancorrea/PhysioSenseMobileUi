export const COLORS = {
  primary: '#5A4FCF',
  primaryDark: '#4538B0',
  primarySoft: '#ECEBFA',
  success: '#2ECC71',
  successSoft: '#E8F8F0',
  warning: '#F5A623',
  danger: '#E5484D',
  dangerSoft: '#FDEBEC',
  background: '#FFFFFF',
  surface: '#FFFFFF',
  cardBackground: '#FFFFFF',
  white: '#FFFFFF',
  textPrimary: '#333333',
  textSecondary: '#666666',
  textMuted: '#8E8E93',
  border: '#E2E8F0',
  divider: '#EFEFEF',
  progressTrack: '#EEEEF3',
  shadow: '#000000',
  whiteSoft: 'rgba(255, 255, 255, 0.8)',
  whiteOverlay: 'rgba(255, 255, 255, 0.25)',
  blackOverlay: 'rgba(0, 0, 0, 0.6)',
} as const;

export const CARD = {
  backgroundColor: COLORS.surface,
  borderRadius: 16,
  padding: 16,
  shadowColor: COLORS.shadow,
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.05,
  shadowRadius: 6,
  elevation: 2,
} as const;

export type ColorToken = keyof typeof COLORS;
