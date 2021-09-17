import { useAuth0 } from '@auth0/auth0-react';
import React from 'react';

import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Button } from 'react-native-paper';

import styles from 'components/Authentication/styles';

export default function LoginButton() {
  const { loginWithRedirect } = useAuth0();

  return (
    <Button
      icon={(props) => <MaterialCommunityIcons name="account-circle" {...props} />}
      size="large"
      mode="contained"
      onPress={loginWithRedirect}
      style={styles.signIn}
    >
      Sign In
    </Button>
  );
}
