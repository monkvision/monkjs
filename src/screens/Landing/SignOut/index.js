import { utils } from '@monkvision/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ASYNC_STORAGE_AUTH_KEY, dispatchSignOut } from 'hooks/useSignIn';
import Proptypes from 'prop-types';
import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, useTheme } from 'react-native-paper';
import { useDispatch } from 'react-redux';
import { MonitoringContext } from '@monkvision/corejs/src/monitoring';

export default function SignOut({ onSuccess }) {
  const { colors } = useTheme();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { errorHandler } = useContext(MonitoringContext);

  const signOut = () => {
    utils.log(['[Click]', 'Sign-out user']);
    // TODO: Add Monitoring code for setUser in MN-182
    AsyncStorage.removeItem(ASYNC_STORAGE_AUTH_KEY)
      .catch((err) => {
        errorHandler(err);
      });
    dispatchSignOut(dispatch);

    onSuccess();
  };

  return (
    <Button color={colors.text} onPress={signOut}>{t('landing.signOut')}</Button>
  );
}

SignOut.propTypes = {
  onSuccess: Proptypes.func,
};

SignOut.defaultProps = {
  onSuccess: () => {},
};
