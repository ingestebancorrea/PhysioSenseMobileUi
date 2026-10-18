import { getAccessToken } from '@/services/auth/tokenStorage';
import { decodeToken } from '@/utils/helpers/decodeToken';
import { useEffect, useState } from 'react';

/**
 * Resultado de `useTherapistId`.
 * - `therapistId`: el ID del fisioterapeuta extraído del JWT, o el `fallbackId` si no se encontró en el token.
 * - `resolved`: `true` una vez que se terminó de intentar leer el token.
 */
export interface UseTherapistIdResult {
  therapistId: number | null;
  resolved: boolean;
}

/**
 * Extrae el ID del fisioterapeuta del access token JWT.
 * Soporta varios nombres de campo porque el backend puede enviar variantes.
 * Si no encuentra ninguno, usa `fallbackId` (por defecto `null`).
 */
export const useTherapistId = (
  fallbackId: number | null = null,
): UseTherapistIdResult => {
  const [therapistId, setTherapistId] = useState<number | null>(null);
  const [resolved, setResolved] = useState(false);

  useEffect(() => {
    let isActive = true;

    const resolve = async () => {
      try {
        const token = await getAccessToken();

        if (!token) {
          setTherapistId(fallbackId ?? null);
          setResolved(true);
          return;
        }

        const payload = decodeToken<Record<string, unknown>>(token);

        if (!payload) {
          setTherapistId(fallbackId ?? null);
          setResolved(true);
          return;
        }

        const p = payload as Record<string, unknown>;

        // Probamos varios nombres de campo comunes que el backend puede enviar
        const id =
          p?.physiotherapist_id ??
          p?.physioterapist_id ??
          p?.physio_id ??
          p?.physioId ??
          p?.therapist_id ??
          p?.therapistId ??
          p?.fisioterapeuta_id ??
          p?.user_id ??
          null;

        const finalId = typeof id === 'number' ? id : fallbackId ?? null;
        setTherapistId(finalId);
      } catch {
        setTherapistId(fallbackId ?? null);
      } finally {
        if (isActive) setResolved(true);
      }
    };

    resolve();

    return () => {
      isActive = false;
    };
  }, [fallbackId]);

  return { therapistId, resolved };
};
