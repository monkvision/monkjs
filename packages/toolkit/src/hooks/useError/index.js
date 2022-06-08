/* eslint-disable no-console */
import { useCallback } from 'react';

export default function useError() {
  return useCallback((error) => {
    console.error('Error detected !!!!!!');
    console.error(error);
  }, []);
}
