import { useAuth } from '@/context/AuthContext';
import { getInitials } from '@/utils/helpers/nameInitials';
import type { UserAccountRole } from '@/types/auth';

/**
 * Identity of the signed-in user, ready to render.
 *
 * Every field comes from `UserToReturnDto`, so a screen never keeps its own copy
 * of the name, the email or the avatar. Empty strings are intentional: while the
 * session is being restored there is nothing to show yet, and a placeholder name
 * would be a lie. Screens that must say something anyway can fall back to a
 * generic label.
 */
export interface CurrentUser {
  id: number | null;
  displayName: string;
  /** First word of `displayName`, for greetings ("Hola, Laura"). */
  firstName: string;
  email: string;
  photoURL: string;
  initials: string;
  role: UserAccountRole | null;
}

const firstNameOf = (displayName: string): string =>
  displayName.trim().split(' ')[0] ?? '';

export const useCurrentUser = (): CurrentUser => {
  const { user, role } = useAuth();

  const displayName = user?.displayName ?? '';

  return {
    id: user?.id ?? null,
    displayName,
    firstName: firstNameOf(displayName),
    email: user?.email ?? '',
    photoURL: user?.photoURL ?? '',
    initials: displayName.length > 0 ? getInitials(displayName) : '',
    role,
  };
};