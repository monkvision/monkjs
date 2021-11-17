import { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { set } from 'store';

const authIntialState = {
  accessToken: null,
  isAuthenticated: false,
  isLoading: false,
  isSignedOut: true,
};
export default function useAuth() {
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const isAuthenticated = useMemo(() => Boolean(auth.accessToken), [auth]);
  const signout = () => dispatch(set(authIntialState));

  return { ...auth, signout, isAuthenticated };
}
