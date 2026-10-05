export * from './enums';
export * from './requests';
export * from './responses';
export * from './user';

/**
 * `POST /auth/register-password` keeps its own DTOs, one per file, and is NOT
 * re-exported here on purpose: `requests.ts` already declares a
 * `RegisterPasswordRequest` for the older shape, and two members with the same
 * name in one barrel are ambiguous (TS2308). Import those types from
 * `@/types/auth/register-password`.
 */
