import { useError } from '@monkvision/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Sentry from 'config/sentry';
import { ASYNC_STORAGE_AUTH_KEY, dispatchSignOut } from 'hooks/useSignIn';
import React from 'react';
import { StyleSheet } from 'react-native';
import { IconButton, List, Menu } from 'react-native-paper';
import { useDispatch } from 'react-redux';

const styles = StyleSheet.create({
  subheader: {
    borderBottomWidth: 2,
    borderBottomColor: '#444451',
    paddingTop: 0,
    paddingHorizontal: 2,
    paddingBottom: 8,
    display: 'flex',
    alignItems: 'center',
  },
});

export default function SignOut() {
  const [visible, setVisible] = React.useState(false);
  const dispatch = useDispatch();
  const { errorHandler, Constants } = useError(Sentry);

  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);
  const signout = () => {
    closeMenu();
    AsyncStorage.removeItem(ASYNC_STORAGE_AUTH_KEY)
      .catch((err) => errorHandler(err, Constants.type.APP));
    dispatchSignOut(dispatch);
  };

  return (
    <Menu
      visible={visible}
      onDismiss={closeMenu}
      anchor={(
        <List.Subheader style={styles.subheader}>
          <IconButton icon="account-circle" onPress={openMenu} size={32} />
          You are connected
        </List.Subheader>
      )}
    >
      <Menu.Item icon="logout" title="Sign Out" onPress={signout} />
    </Menu>
  );
}
