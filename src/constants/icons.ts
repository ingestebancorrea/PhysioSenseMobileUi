import {
  Activity,
  ChartColumnBig,
  CircleCheck,
  Clock,
  Hand,
  type LucideIcon,
} from 'lucide-react-native';

export const ICONS = {
  activity: Activity,
  chart: ChartColumnBig,
  circleCheck: CircleCheck,
  clock: Clock,
  hand: Hand,
} as const satisfies Record<string, LucideIcon>;

export type IconName = keyof typeof ICONS;
