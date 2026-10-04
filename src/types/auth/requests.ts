import type { SocialLoginProvider, UserRoleAlias, UserRoleId } from './enums';

export interface LoginPasswordRequest {
  username: string;
  password: string;
}

export interface ForgotPasswordRequest {
  username: string;
}

export interface RegisterPasswordRequest {
  username: string;
  password: string;
  full_name: string;
  role: UserRoleId;
  image_url?: string;
}

export interface SocialRegisterRequest {
  token: string;
  loginprovider: SocialLoginProvider;
  alias_role: UserRoleAlias;
}

export interface SocialLoginRequest {
  token: string;
  loginprovider: SocialLoginProvider;
}
