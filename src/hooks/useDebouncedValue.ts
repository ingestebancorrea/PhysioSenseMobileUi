import { useEffect, useState } from 'react';

/**
 * Retrasa la propagación de `value` para no disparar una petición al backend
 * por cada tecla que el usuario escribe en el buscador.
 *
 * @param value Valor a propagar.
 * @param delayMs Espera en milisegundos antes de propagar el nuevo valor.
 */
export const useDebouncedValue = <T>(value: T, delayMs = 350): T => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delayMs);

    return () => clearTimeout(timer);
  }, [value, delayMs]);

  return debouncedValue;
};
