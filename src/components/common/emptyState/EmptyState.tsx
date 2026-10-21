import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Svg, { Circle, G, Line, Path, Rect } from 'react-native-svg';
import { Plus } from 'lucide-react-native';
import { COLORS } from '@/constants/theme';

export type EmptyStateIllustration = 'calendar' | 'people';

export interface EmptyStateProps {
  illustration?: EmptyStateIllustration;
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}

/**
 * Nube simétrica formada por arcos (protuberancias izquierda, central y derecha),
 * escalada y centrada para el viewBox 168x160.
 */
const CLOUD_PATH =
  'M46 126A16 16 0 0 1 40 95.2A18 18 0 0 1 60 78.1A26 26 0 0 1 108 78.1A18 18 0 0 1 128 95.2A16 16 0 0 1 122 126C104 133 74 133 46 126Z';

/** Insignia circular con "X" (sin registros). */
const XBadge: React.FC<{ cx: number; cy: number }> = ({ cx, cy }) => (
  <>
    <Circle cx={cx} cy={cy} r={12} fill={COLORS.primary} />
    <Path
      d={`M${cx - 4.5} ${cy - 4.5}l9 9M${cx + 4.5} ${cy - 4.5}l-9 9`}
      stroke={COLORS.white}
      strokeWidth={3}
      strokeLinecap="round"
    />
  </>
);

/** Icono de calendario con insignia "X" (estilo del diseño original). */
const CalendarIcon: React.FC = () => (
  <>
    <Rect
      x={60}
      y={78}
      width={48}
      height={44}
      rx={9}
      stroke={COLORS.primaryViolet}
      strokeWidth={3.5}
      fill={COLORS.white}
    />
    <Line
      x1={60}
      y1={96}
      x2={108}
      y2={96}
      stroke={COLORS.primaryViolet}
      strokeWidth={3.5}
    />
    <Rect
      x={70}
      y={70}
      width={8}
      height={11}
      rx={2.5}
      stroke={COLORS.primaryViolet}
      strokeWidth={3}
      fill={COLORS.white}
    />
    <Rect
      x={90}
      y={70}
      width={8}
      height={11}
      rx={2.5}
      stroke={COLORS.primaryViolet}
      strokeWidth={3}
      fill={COLORS.white}
    />
    <Line
      x1={68}
      y1={106}
      x2={78}
      y2={106}
      stroke={COLORS.primaryVioletDeep}
      strokeWidth={3}
      strokeLinecap="round"
    />
    <Line
      x1={86}
      y1={106}
      x2={96}
      y2={106}
      stroke={COLORS.primaryVioletDeep}
      strokeWidth={3}
      strokeLinecap="round"
    />
    <Line
      x1={68}
      y1={114}
      x2={78}
      y2={114}
      stroke={COLORS.primaryVioletDeep}
      strokeWidth={3}
      strokeLinecap="round"
    />
    <XBadge cx={104} cy={118} />
  </>
);

/** Icono de personas con insignia "X" (estilo del diseño original). */
const PeopleIcon: React.FC = () => (
  <>
    <Circle cx={96} cy={80} r={11} fill={COLORS.primaryVioletDeep} />
    <Path
      d="M78 114c0-12 8.5-20 18-20s18 8 18 20"
      stroke={COLORS.primaryVioletDeep}
      strokeWidth={3.5}
      strokeLinecap="round"
    />
    <Circle
      cx={70}
      cy={88}
      r={14}
      fill={COLORS.white}
      stroke={COLORS.primaryViolet}
      strokeWidth={3.5}
    />
    <Path
      d="M46 122c2-14 11-22 24-22s22 8 24 22"
      stroke={COLORS.primaryViolet}
      strokeWidth={3.5}
      strokeLinecap="round"
    />
    <XBadge cx={106} cy={120} />
  </>
);

/** Nube simétrica con el icono dentro, insignia "X" y destellos, estilo neón. */
const CloudUploadIllustration: React.FC<{
  illustration: EmptyStateIllustration;
}> = ({ illustration }) => (
  <Svg width={240} height={228} viewBox="0 0 168 160" fill="none">
    {/* Nube escalada 1.25x desde su centro (el icono no se escala) */}
    <G transform="translate(84 96.5) scale(1.25) translate(-84 -96.5)">
      {/* Halos de la nube (efecto neón) */}
      <Path
        d={CLOUD_PATH}
        stroke={COLORS.primaryViolet}
        strokeWidth={18}
        strokeLinejoin="round"
        opacity={0.12}
      />
      <Path
        d={CLOUD_PATH}
        stroke={COLORS.primaryViolet}
        strokeWidth={11}
        strokeLinejoin="round"
        opacity={0.2}
      />

      {/* Cuerpo de la nube */}
      <Path
        d={CLOUD_PATH}
        stroke={COLORS.primaryViolet}
        strokeWidth={4.5}
        strokeLinejoin="round"
        fill={COLORS.white}
      />
    </G>

    {/* Icono contextual */}
    {illustration === 'calendar' ? <CalendarIcon /> : <PeopleIcon />}

    {/* Destellos */}
    <Path
      d="M17 66H27M22 61V71"
      stroke={COLORS.primaryViolet}
      strokeWidth={3}
      strokeLinecap="round"
    />
    <Path
      d="M141 72H151M146 67V77"
      stroke={COLORS.primaryViolet}
      strokeWidth={3}
      strokeLinecap="round"
    />
    <Path
      d="M145 128H155M150 123V133"
      stroke={COLORS.primaryViolet}
      strokeWidth={3}
      strokeLinecap="round"
    />
    <Circle cx={16} cy={102} r={3} fill={COLORS.primaryVioletDeep} />
    <Circle cx={138} cy={152} r={3} fill={COLORS.primaryVioletDeep} />
  </Svg>
);

export const EmptyState: React.FC<EmptyStateProps> = ({
  illustration = 'calendar',
  title,
  message,
  actionLabel,
  onAction,
}) => (
  <View style={styles.container}>
    <CloudUploadIllustration illustration={illustration} />

    <Text style={styles.title}>{title}</Text>
    <Text style={styles.message}>{message}</Text>

    {actionLabel ? (
      <TouchableOpacity style={styles.action} onPress={onAction} activeOpacity={0.85}>
        <Plus size={18} color={COLORS.white} strokeWidth={2.75} />
        <Text style={styles.actionText}>{actionLabel}</Text>
      </TouchableOpacity>
    ) : null}
  </View>
);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 72,
    paddingBottom: 48,
  },
  title: {
    marginTop: 26,
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.textStrong,
    textAlign: 'center',
  },
  message: {
    marginTop: 8,
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.textMuted,
    textAlign: 'center',
    maxWidth: 320,
  },
  action: {
    marginTop: 30,
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 15,
    borderRadius: 26,
    backgroundColor: COLORS.primary,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
  },
  actionText: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.white,
  },
});
