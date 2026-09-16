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

export type DeviceKind = 'smartphone' | 'laptop' | 'tablet';

export interface ActiveDevice {
  id: string;
  deviceType: DeviceKind;
  deviceName: string;
  os: string;
  browser?: string;
  location: string;
  lastActive: string;
}

export interface PrivacyOption {
  id: string;
  title: string;
  subtitle: string;
  iconName: string;
  route: string;
}

export interface TherapistProfile {
  name: string;
  role: string;
  avatarUrl: string;
}