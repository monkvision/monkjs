import { useState } from 'react';

export default function useSignIn() {
  const [isLoading, setIsLoading] = useState(false);
  const start = () => setIsLoading(true);
  const stop = () => setIsLoading(false);

  return { isLoading, start, stop };
}
