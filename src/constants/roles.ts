// src/constants/roles.ts
import type { UserAccountRole, UserRoleAlias } from '@/types/auth';

export const ROLE_ALIAS_BY_ROLE: Record<UserAccountRole, UserRoleAlias> = {
  fisioterapeuta: 'FIS',
  paciente: 'PAC',
};

export const USER_ROLE_BY_ALIAS: Record<UserRoleAlias, UserAccountRole> = {
  FIS: 'fisioterapeuta',
  PAC: 'paciente',
};
