import { useCallback, useEffect, useState } from 'react';

import { ApiClientError } from '@/services/api/client';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';

const GENERIC_ERROR = 'No se pudo cargar la información.';

export interface UseRemoteListResult<T> {
  items: T[];
  loading: boolean;
  error: string | null;
  search: string;
  setSearch: (text: string) => void;
  reload: () => void;
}

/**
 * Carga una lista del backend y la filtra con un buscador.
 *
 * @param loader Petición al backend. Recibe el texto de búsqueda ya recortado.
 *   Si su identidad cambia (por ejemplo, al cambiar de paciente) la lista se
 *   vuelve a cargar.
 */
export const useRemoteList = <T>(
  loader: (search: string) => Promise<T[]>,
): UseRemoteListResult<T> => {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [reloadKey, setReloadKey] = useState(0);

  const debouncedSearch = useDebouncedValue(search, 350);

  useEffect(() => {
    // Espera a que el debounce se resuelva para no pedir en cada tecla.
    if (debouncedSearch !== search) {
      return;
    }

    let active = true;
    setLoading(true);
    setError(null);

    loader(debouncedSearch.trim())
      .then(data => {
        if (active) setItems(data);
      })
      .catch(loadError => {
        if (active) {
          setError(
            loadError instanceof ApiClientError
              ? loadError.message
              : GENERIC_ERROR,
          );
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [loader, search, debouncedSearch, reloadKey]);

  const reload = useCallback(() => setReloadKey(key => key + 1), []);

  return { items, loading, error, search, setSearch, reload };
};
