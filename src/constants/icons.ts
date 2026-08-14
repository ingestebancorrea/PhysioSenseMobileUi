import {
  Activity,
  ChartColumnBig,
  Check,
  ChevronLeft,
  ChevronRight,
  CircleCheck,
  Clock,
  Hand,
  House,
  Play,
  Repeat,
  User,
  type LucideIcon,
} from 'lucide-react-native';

export const ICONS = {
  activity: Activity,
  chart: ChartColumnBig,
  check: Check,
  chevronLeft: ChevronLeft,
  chevronRight: ChevronRight,
  circleCheck: CircleCheck,
  clock: Clock,
  hand: Hand,
  house: House,
  play: Play,
  repeat: Repeat,
  user: User,
} as const satisfies Record<string, LucideIcon>;

export type IconName = keyof typeof ICONS;
