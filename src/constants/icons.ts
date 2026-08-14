import {
  Activity,
  ChartColumnBig,
  ChevronLeft,
  ChevronRight,
  CircleCheck,
  Clock,
  Hand,
  House,
  User,
  type LucideIcon,
} from 'lucide-react-native';

export const ICONS = {
  activity: Activity,
  chart: ChartColumnBig,
  chevronLeft: ChevronLeft,
  chevronRight: ChevronRight,
  circleCheck: CircleCheck,
  clock: Clock,
  hand: Hand,
  house: House,
  user: User,
} as const satisfies Record<string, LucideIcon>;

export type IconName = keyof typeof ICONS;
