import type { ExerciseFlowParamList } from '@/navigation/types/exerciseFlowParams';
import type { GloveConnectionState } from '@/types/preparation';

export type CountdownRoute = Extract<
  keyof ExerciseFlowParamList,
  `${string}Countdown`
>;

export const COUNTDOWN_ROUTES: Record<string, CountdownRoute> = {
  exercise_01: 'CerrarManoCountdown',
  exercise_02: 'AbrirManoCountdown',
  exercise_03: 'PinzaCountdown',
  exercise_04: 'OposicionPulgarCountdown',
};

export const TITLES: Record<GloveConnectionState, string> = {
  connected: 'Guante conectado',
  connecting: 'Conectando guante…',
  disconnected: 'No se detecta el guante',
};

export const DESCRIPTIONS: Record<GloveConnectionState, string> = {
  connected:
    'Tu guante está listo para comenzar la serie. Verifica la conexión y la señal antes de iniciar.',
  connecting:
    'Estamos buscando tu guante por Bluetooth. Mantén el guante encendido y cerca del dispositivo.',
  disconnected:
    'No pudimos conectar el guante. Revisa que esté encendido y cerca, y vuelve a intentarlo.',
};

export const BUTTON_LABELS: Record<GloveConnectionState, string> = {
  connected: 'Iniciar serie',
  connecting: 'Conectando…',
  disconnected: 'Reconectar',
};

export type MetricTone = 'default' | 'success' | 'error';

export interface PreparationMetric {
  label: string;
  value: string;
  tone: MetricTone;
}

export const METRICS: Record<
  GloveConnectionState,
  { device: PreparationMetric; signal: PreparationMetric }
> = {
  connected: {
    device: { label: 'Dispositivo', value: 'Guante Sense', tone: 'default' },
    signal: { label: 'Señal', value: 'Excelente', tone: 'default' },
  },
  connecting: {
    device: { label: 'Dispositivo', value: 'Buscando guante…', tone: 'success' },
    signal: { label: 'Señal', value: 'Conectando…', tone: 'success' },
  },
  disconnected: {
    device: { label: 'Dispositivo', value: 'No encontrado', tone: 'error' },
    signal: { label: 'Señal', value: 'Sin conexión', tone: 'error' },
  },
};
