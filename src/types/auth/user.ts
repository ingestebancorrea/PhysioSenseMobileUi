import type { UserToReturnDto } from '@/types/auth';

export type AppUser = Omit<UserToReturnDto, 'role'>;