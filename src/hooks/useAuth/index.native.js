import { useMemo } from 'react';
import { useSelector } from 'react-redux';

export default function useAuth() {
  const auth = useSelector((state) => state.auth);

  const isAuthenticated = useMemo(
    () => Boolean(auth.accessToken),
    [auth],
  );

  return { ...auth, isAuthenticated };
}
