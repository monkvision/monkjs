import { useMemo } from 'react';

export default function useInnerHTML({ element }) {
  return useMemo(() => {
    if (element.tagName === 'style' && !!element.innerHTML) {
      return element.innerHTML;
    }

    return null;
  }, [element]);
}
