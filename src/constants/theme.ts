export const COLORS = {
  primary: '#6C5CE7',
  primaryDark: '#50399C',
  primarySoft: '#EFEBFB',
  success: '#2ECC71',
  successSoft: '#E8F8F0',
  background: '#F8F9FA',
  surface: '#FFFFFF',
  white: '#FFFFFF',
  textPrimary: '#1A1C20',
  textSecondary: '#6C757D',
  textMuted: '#8E8E93',
  progressTrack: '#EEEEF3',
  shadow: '#000000',
  whiteSoft: 'rgba(255, 255, 255, 0.8)',
  whiteOverlay: 'rgba(255, 255, 255, 0.25)',
} as const;

export type ColorToken = keyof typeof COLORS;
