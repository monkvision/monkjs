import PropTypes from 'prop-types';
import React, { useCallback, useEffect } from 'react';
import { Platform } from 'react-native';

import { useDispatch } from 'react-redux';
import { authSlice } from 'store/slices/auth';

import monk from '@monkvision/corejs';
import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri, useAuthRequest, ResponseType } from 'expo-auth-session';

import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Button, useTheme } from 'react-native-paper';

import discoveries from 'config/discoveries';

import styles from '../styles';

if (Platform.OS === 'web') { WebBrowser.maybeCompleteAuthSession(); }

const useProxy = Platform.select({
  native: true,
  default: false,
});

const redirectUri = makeRedirectUri({
  useProxy,
});

function Icon(props) {
  return <MaterialCommunityIcons name="account-circle" {...props} />;
}

export default function SignIn({ children, onError, onStart, onSuccess, ...props }) {
  const dispatch = useDispatch();
  const { colors } = useTheme();

  const [request, response, promptAsync] = useAuthRequest(
    {
      responseType: ResponseType.Token,
      clientId: monk.config.authConfig.clientId,
      scopes: ['openid', 'email', 'profile', 'read:current_user', 'update:current_user_metadata'],
      redirectUri,
      extraParams: {
        audience: monk.config.authConfig.audience,
      },
    },
    discoveries,
  );

  const handlePress = useCallback(() => {
    onStart();
    promptAsync({ useProxy });
  }, [onStart, promptAsync]);

  useEffect(() => {
    if (response?.type === 'success' && response.authentication?.accessToken) {
      const { accessToken } = response.authentication;
      monk.config.accessToken = accessToken;

      dispatch(authSlice.actions.update({
        ...response.authentication,
        isLoading: false,
        isSignedOut: false,
      }));

      onSuccess(response);
    } else {
      onError(response);
    }
  }, [dispatch, onSuccess, request, response]);

  return (
    <Button
      icon={Icon}
      size="large"
      mode="contained"
      disabled={!request}
      onPress={handlePress}
      style={styles.signIn}
      color={colors.success}
      {...props}
    >
      {children || 'Sign In'}
    </Button>
  );
}

SignIn.propTypes = {
  onStart: PropTypes.func,
  onSuccess: PropTypes.func,
  onError: PropTypes.func,
};

SignIn.defaultProps = {
  onStart: () => {},
  onSuccess: () => {},
  onError: () => {},
};
