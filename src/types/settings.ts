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

export type SettingRowAccessory = 'chevron' | 'switch';

export interface SecurityOption {
  id: string;
  title: string;
  subtitle: string;
  iconName: string;
  accessory: SettingRowAccessory;
  switchValue?: boolean;
}

export interface TherapistProfile {
  name: string;
  role: string;
  avatarUrl: string;
}