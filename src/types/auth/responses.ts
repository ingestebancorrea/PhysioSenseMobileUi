import type { UserRoleId } from './enums';

/**
 * `UserToReturnDto` of the auth service: the profile every entry point returns
 * once the credentials are accepted.
 *
 * `role` travels as its numeric id (`UserRoleId`), never as a display string,
 * so the frontend maps it in one place (`toAccountRole`) instead of trusting a
 * label that the backend is free to change.
 */
export interface UserToReturnDto {
  id: number;
  role: UserRoleId;
  email: string;
  displayName: string;
  photoURL: string;
}

/** `POST /auth/login-password`: the DTO plus the token used on every request. */
export interface LoginResponse extends UserToReturnDto {
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

/**
 * `POST /auth/register` (social sign-up): the user plus the token. It carries no
 * `profile` because a social registration does not go through `createProfile`.
 *
 * The password flow has its own answer, `RegisterPasswordResponse`, kept in
 * `register-password/` because each endpoint gets its own DTO.
 */
export interface SocialRegisterResponse extends AuthUserRecord {
  access_token: string;
}

export interface ForgotPasswordResponse {
  message: string;
}

export interface ApiErrorResponse {
  statusCode: number;
  message: string | string[];
  error: string;
}
