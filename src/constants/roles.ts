// src/constants/roles.ts
import type { UserAccountRole, UserRoleAlias } from '@/types/auth';
import { UserRoleId } from '@/types/auth';

export const ROLE_ALIAS_BY_ROLE: Record<UserAccountRole, UserRoleAlias> = {
  fisioterapeuta: 'FIS',
  paciente: 'PAC',
};

export const USER_ROLE_BY_ALIAS: Record<UserRoleAlias, UserAccountRole> = {
  FIS: 'fisioterapeuta',
  PAC: 'paciente',
};

/** Human readable role, used for badges and subtitles. */
export const ACCOUNT_ROLE_LABEL: Record<UserAccountRole, string> = {
  fisioterapeuta: 'Fisioterapeuta',
  paciente: 'Paciente',
};

/**
 * Single source of truth for the numeric role the auth service sends.
 *
 * Changing the backend ids is a one-line edit here, and nothing else in the app
 * compares raw numbers.
 */
export const ACCOUNT_ROLE_BY_ROLE_ID: Record<UserRoleId, UserAccountRole> = {
  [UserRoleId.FISIOTERAPEUTA]: 'fisioterapeuta',
  [UserRoleId.PACIENTE]: 'paciente',
};

/**
 * Turns the role of an API payload into the role the app routes on.
 *
 * Returns `null` for a missing or unknown id on purpose: an unrecognized role
 * means the navigator cannot choose a stack, so the caller must fail the sign-in
 * instead of sending the user to a screen that does not belong to them.
 */
export const toAccountRole = (
  roleId: number | null | undefined,
): UserAccountRole | null => {
  if (roleId === null || roleId === undefined) {
    return null;
  }

  return ACCOUNT_ROLE_BY_ROLE_ID[roleId as UserRoleId] ?? null;
};