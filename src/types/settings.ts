export interface SettingOption {
  id: string;
  title: string;
  subtitle: string;
  iconName: string;
  route: string;
  isDestructive?: boolean;
}

export interface PreferenceOption {
  id: string;
  title: string;
  value: string;
  iconName: string;
}

export interface TherapistProfile {
  name: string;
  role: string;
  avatarUrl: string;
}