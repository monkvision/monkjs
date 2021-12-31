import React from 'react';
import { Platform } from 'react-native';
import { Button } from 'react-native-paper';
import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri } from 'expo-auth-session';

import { config } from '@monkvision/corejs';
import discoveries from 'config/discoveries';
import useAuth from 'hooks/useAuth';

const useProxy = Platform.select({
  native: true,
  default: false,
});

const returnTo = makeRedirectUri({
  useProxy,
});

export default function SignOut(props) {
  const params = `?client_id=${config.authConfig.clientId}&returnTo=${returnTo}`;
  const { signOut } = useAuth();

  const handleOpenWithWebBrowser = () => {
    WebBrowser.openAuthSessionAsync(`${discoveries.endSessionEndpoint}${params}`);
    signOut();
  };

  return (
    <Button onPress={handleOpenWithWebBrowser} {...props}>
      Sign out
    </Button>
  );
}
