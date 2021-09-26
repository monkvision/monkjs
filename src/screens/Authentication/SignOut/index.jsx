import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';

import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Button } from 'react-native-paper';

export default function SignOut() {
  const { logout } = useAuth0();

  return (
    <Button
      icon={(props) => <MaterialCommunityIcons name="logout" {...props} />}
      size="large"
      mode="contained"
      onPress={logout}
    >
      Sign Out
    </Button>
  );
}
