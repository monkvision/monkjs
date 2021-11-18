import React from 'react';
import { useFakeActivity } from '@monkvision/react-native-views';
import useAuth from 'hooks/useAuth';
import { Button } from 'react-native-paper';

export default function SignOut(props) {
  const { signOut, isLoggingOut } = useAuth();
  const [isLoading] = useFakeActivity(isLoggingOut);

  return (
    <Button onPress={signOut} loading={isLoading} {...props}>
      Sign out
    </Button>
  );
}
