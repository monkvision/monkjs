import { useMemo } from 'react';

export function useSearchParams() {
  return useMemo(() => new URL(window.location.toString()).searchParams, []);
}
