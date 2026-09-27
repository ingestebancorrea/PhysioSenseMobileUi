import type { UserRoleId } from './enums';

export interface LoginResponse {
  id: number;
  email: string;
  displayName: string;
  photoURL: string;
  access_token: string;
}

export interface AuthUserRecord {
  id: number;
  username: string;
  full_name: string;
  sub: string | null;
  image_url: string;
  is_active: boolean;
  role: UserRoleId;
}

export interface RegisterPasswordResponse extends AuthUserRecord {
  access_token: string;
}

export interface ApiErrorResponse {
  statusCode: number;
  message: string | string[];
  error: string;
}
