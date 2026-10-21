/**
 * Decodifica el payload de un JWT (access token) sin verificar la firma.
 * Solo se usa para leer claims del usuario ya autenticado (rol, therapist_id, etc.).
 * Devuelve `null` si el token no tiene formato JWT válido.
 */
export const decodeToken = <T = Record<string, unknown>>(
  token: string,
): T | null => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    // JWT usa base64url: reemplaza '-' por '+', '_' por '/' y rellena con '='
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64.padEnd(
      base64.length + ((4 - (base64.length % 4)) % 4),
      '=',
    );

    // `atob` está disponible globalmente en React Native (Hermes/JSC)
    const atob = (globalThis as unknown as { atob?: (s: string) => string }).atob;
    if (!atob) return null;

    const decoded = atob(padded);
    return JSON.parse(decoded) as T;
  } catch {
    return null;
  }
};
