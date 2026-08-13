export const COLORS = {
  primary: '#5A4FCF',
  primaryDark: '#4538B0',
  primarySoft: '#ECEBFA',
  success: '#2ECC71',
  successSoft: '#E8F8F0',
  warning: '#F5A623',
  background: '#FFFFFF',
  surface: '#FFFFFF',
  white: '#FFFFFF',
  textPrimary: '#333333',
  textSecondary: '#666666',
  textMuted: '#8E8E93',
  border: '#E2E8F0',
  progressTrack: '#EEEEF3',
  shadow: '#000000',
  whiteSoft: 'rgba(255, 255, 255, 0.8)',
  whiteOverlay: 'rgba(255, 255, 255, 0.25)',
} as const;

export type ColorToken = keyof typeof COLORS;
